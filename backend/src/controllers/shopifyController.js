/**
 * REVIXA BACKEND — SHOPIFY CONTROLLER
 * backend/src/controllers/shopifyController.js
 * 
 * Handles HTTP requests/responses for Shopify OAuth, Webhooks, and Sync Status.
 * NO Prisma imports. Calls ShopifyService, SyncService, WebhookService exclusively.
 */

import { ShopifyService } from '../services/shopifyService.js';
import { WebhookService } from '../services/shopify/webhookService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const install = async (req, res, next) => {
  try {
    const { shop } = req.query;

    if (!shop) {
      return sendError(res, 'Shop query parameter is required (e.g. ?shop=yourstore.myshopify.com)', 400);
    }

    const orgId = req.user ? req.user.organizationId : 'org_default';
    const { installUrl } = await ShopifyService.generateInstallUrl(shop, orgId);
    return res.redirect(installUrl);
  } catch (err) {
    next(err);
  }
};

export const callback = async (req, res, next) => {
  try {
    const result = await ShopifyService.handleOAuthCallback(req.query);

    if (process.env.NODE_ENV === 'test') {
      return sendSuccess(res, result, 200, 'Shopify store connected successfully');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://f-seven-orcin.vercel.app';
    return res.redirect(`${frontendUrl}/onboarding.html?status=connected&shop=${encodeURIComponent(result.shop)}`);
  } catch (err) {
    next(err);
  }
};

export const getSyncStatusController = async (req, res, next) => {
  try {
    const orgId = req.user ? req.user.organizationId : 'org_default';
    const statusData = await ShopifyService.getSyncStatus(orgId);
    return sendSuccess(res, statusData);
  } catch (err) {
    next(err);
  }
};

export const startSyncController = async (req, res, next) => {
  try {
    const orgId = req.user ? req.user.organizationId : 'org_default';
    const { shop } = req.body || {};
    const result = await ShopifyService.startSync(orgId, shop);
    return sendSuccess(res, result, 200, 'Sync job started');
  } catch (err) {
    next(err);
  }
};

export const webhookAppUninstalled = async (req, res, next) => {
  try {
    const rawHmac = req.headers['x-shopify-hmac-sha256'];
    const shopDomain = req.headers['x-shopify-shop-domain'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const result = await ShopifyService.handleAppUninstalled(shopDomain, rawHmac, rawBody);
    return sendSuccess(res, result, 200, 'App uninstalled webhook processed');
  } catch (err) {
    next(err);
  }
};

export const webhookOrdersCreate = async (req, res, next) => {
  try {
    const rawHmac = req.headers['x-shopify-hmac-sha256'];
    const shopDomain = req.headers['x-shopify-shop-domain'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const result = await WebhookService.processWebhook('orders/create', shopDomain, rawHmac, rawBody, req.body);
    return sendSuccess(res, result, 200, 'Orders create webhook processed');
  } catch (err) {
    next(err);
  }
};

export const webhookOrdersUpdated = async (req, res, next) => {
  try {
    const rawHmac = req.headers['x-shopify-hmac-sha256'];
    const shopDomain = req.headers['x-shopify-shop-domain'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const result = await WebhookService.processWebhook('orders/updated', shopDomain, rawHmac, rawBody, req.body);
    return sendSuccess(res, result, 200, 'Orders updated webhook processed');
  } catch (err) {
    next(err);
  }
};

export const webhookProductsUpdate = async (req, res, next) => {
  try {
    const rawHmac = req.headers['x-shopify-hmac-sha256'];
    const shopDomain = req.headers['x-shopify-shop-domain'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const result = await WebhookService.processWebhook('products/update', shopDomain, rawHmac, rawBody, req.body);
    return sendSuccess(res, result, 200, 'Products update webhook processed');
  } catch (err) {
    next(err);
  }
};

export const webhookInventoryLevelsUpdate = async (req, res, next) => {
  try {
    const rawHmac = req.headers['x-shopify-hmac-sha256'];
    const shopDomain = req.headers['x-shopify-shop-domain'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const result = await WebhookService.processWebhook('inventory_levels/update', shopDomain, rawHmac, rawBody, req.body);
    return sendSuccess(res, result, 200, 'Inventory levels update webhook processed');
  } catch (err) {
    next(err);
  }
};

export const webhookCustomersCreate = async (req, res, next) => {
  try {
    const rawHmac = req.headers['x-shopify-hmac-sha256'];
    const shopDomain = req.headers['x-shopify-shop-domain'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const result = await WebhookService.processWebhook('customers/create', shopDomain, rawHmac, rawBody, req.body);
    return sendSuccess(res, result, 200, 'Customers create webhook processed');
  } catch (err) {
    next(err);
  }
};
