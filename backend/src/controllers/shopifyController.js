/**
 * REVIXA BACKEND — SHOPIFY CONTROLLER
 * backend/src/controllers/shopifyController.js
 * 
 * Handles HTTP requests/responses for Shopify OAuth & Webhooks.
 * NO Prisma imports. Calls ShopifyService layer exclusively.
 */

import { ShopifyService } from '../services/shopifyService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const install = async (req, res, next) => {
  try {
    const { shop } = req.query;
    const orgId = req.user ? req.user.organizationId : 'org_default';

    if (!shop) {
      return sendError(res, 'Query parameter "shop" is required', 400);
    }

    const { installUrl } = await ShopifyService.generateInstallUrl(shop, orgId);
    return res.redirect(installUrl);
  } catch (err) {
    next(err);
  }
};

export const callback = async (req, res, next) => {
  try {
    const result = await ShopifyService.handleOAuthCallback(req.query);
    return sendSuccess(res, result, 200, 'Shopify store connected successfully');
  } catch (err) {
    next(err);
  }
};

export const webhookAppUninstalled = async (req, res, next) => {
  try {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const shopDomain = req.headers['x-shopify-shop-domain'] || req.body.shop_domain || 'unknown.myshopify.com';
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const result = await ShopifyService.handleAppUninstalled(shopDomain, hmacHeader, rawBody);
    return sendSuccess(res, result, 200, 'App uninstalled processed');
  } catch (err) {
    next(err);
  }
};

export const webhookOrdersCreate = async (req, res, next) => {
  try {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const shopDomain = req.headers['x-shopify-shop-domain'] || 'unknown.myshopify.com';
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const result = await ShopifyService.handleOrderWebhook('orders/create', shopDomain, hmacHeader, rawBody, req.body);
    return sendSuccess(res, result, 200, 'orders/create webhook processed');
  } catch (err) {
    next(err);
  }
};

export const webhookOrdersUpdated = async (req, res, next) => {
  try {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const shopDomain = req.headers['x-shopify-shop-domain'] || 'unknown.myshopify.com';
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const result = await ShopifyService.handleOrderWebhook('orders/updated', shopDomain, hmacHeader, rawBody, req.body);
    return sendSuccess(res, result, 200, 'orders/updated webhook processed');
  } catch (err) {
    next(err);
  }
};
