/**
 * REVIXA BACKEND — SHOPIFY ROUTES
 * backend/src/routes/shopifyRoutes.js
 */

import { Router } from 'express';
import {
  install,
  callback,
  getSyncStatusController,
  startSyncController,
  webhookAppUninstalled,
  webhookOrdersCreate,
  webhookOrdersUpdated,
  webhookProductsUpdate,
  webhookInventoryLevelsUpdate,
  webhookCustomersCreate
} from '../controllers/shopifyController.js';

const router = Router();

// OAuth Endpoints
router.get('/install', install);
router.get('/callback', callback);

// Telemetry Sync Endpoints
router.get('/sync-status', getSyncStatusController);
router.post('/sync/start', startSyncController);

// Webhook Event Listeners
router.post('/webhooks/app/uninstalled', webhookAppUninstalled);
router.post('/webhooks/orders/create', webhookOrdersCreate);
router.post('/webhooks/orders/updated', webhookOrdersUpdated);
router.post('/webhooks/products/update', webhookProductsUpdate);
router.post('/webhooks/inventory_levels/update', webhookInventoryLevelsUpdate);
router.post('/webhooks/customers/create', webhookCustomersCreate);

export default router;
