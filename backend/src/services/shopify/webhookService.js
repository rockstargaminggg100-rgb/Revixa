/**
 * REVIXA BACKEND — SHOPIFY WEBHOOK SERVICE
 * backend/src/services/shopify/webhookService.js
 * 
 * Verifies webhook HMAC signatures and routes incoming events.
 * Handles orders/create, orders/updated, products/update, inventory_levels/update, customers/create, app/uninstalled.
 */

import { verifyShopifyHmac } from '../../utils/crypto.js';
import { config } from '../../config/env.js';
import { StoreRepository } from '../../repositories/StoreRepository.js';
import { AuditService } from '../auditService.js';
import { NotificationRepository } from '../../repositories/NotificationRepository.js';

export class WebhookService {
  /**
   * Validate Webhook HMAC Header
   */
  static verifyHeaderHmac(rawHmac, rawBody) {
    if (!rawHmac || !rawBody) return false;
    return verifyShopifyHmac(
      { hmacHeader: rawHmac, rawBody },
      config.shopify.apiSecret,
      true
    );
  }

  /**
   * Process incoming Webhook Payload
   */
  static async processWebhook(topic, shopDomain, rawHmac, rawBody, payloadObj) {
    // 1. Verify HMAC Signature
    const isValid = this.verifyHeaderHmac(rawHmac, rawBody);
    if (!isValid) {
      await AuditService.recordEvent(null, 'WEBHOOK_ERROR', `Invalid HMAC signature on webhook: ${topic} from ${shopDomain}`, 'alert');
      const error = new Error('Invalid webhook HMAC signature');
      error.statusCode = 401;
      throw error;
    }

    const cleanDomain = shopDomain || payloadObj.shop_domain || 'elegance-paris.myshopify.com';

    // 2. Route by Webhook Topic
    switch (topic) {
      case 'app/uninstalled': {
        await StoreRepository.markInactive(cleanDomain);
        await AuditService.recordEvent(null, 'SHOPIFY_DISCONNECTED', `App uninstalled by store: ${cleanDomain}`, 'alert');
        await NotificationRepository.createNotification(null, 'ALERT', `Shopify store disconnected: ${cleanDomain}`);
        return { status: 'disconnected', shop: cleanDomain };
      }

      case 'orders/create':
      case 'orders/updated': {
        const orderNum = payloadObj.order_number || payloadObj.id || '1088';
        await AuditService.recordEvent(null, `SHOPIFY_ORDER_${topic.includes('create') ? 'CREATED' : 'UPDATED'}`, `Order ${topic}: #${orderNum} from ${cleanDomain}`, 'sync');
        return { topic, processed: true, orderNumber: orderNum };
      }

      case 'products/update': {
        const title = payloadObj.title || 'Product';
        await AuditService.recordEvent(null, 'SHOPIFY_PRODUCT_UPDATED', `Product updated: ${title} on ${cleanDomain}`, 'sync');
        return { topic, processed: true, title };
      }

      case 'inventory_levels/update': {
        await AuditService.recordEvent(null, 'SHOPIFY_INVENTORY_UPDATED', `Inventory levels updated on ${cleanDomain}`, 'sync');
        return { topic, processed: true };
      }

      case 'customers/create': {
        await AuditService.recordEvent(null, 'SHOPIFY_CUSTOMER_CREATED', `Customer created on ${cleanDomain}`, 'sync');
        return { topic, processed: true };
      }

      default: {
        await AuditService.recordEvent(null, 'SHOPIFY_WEBHOOK_RECEIVED', `Webhook received (${topic}) from ${cleanDomain}`, 'sync');
        return { topic, processed: true };
      }
    }
  }
}
