/**
 * REVIXA BACKEND — CORE REST API ROUTES
 * backend/src/routes/apiRoutes.js
 */

import { Router } from 'express';
import {
  getDatabaseHealth,
  getShopifySyncStatus,
  getDashboard,
  getInsights,
  getForecast,
  getProducts,
  getMarketing,
  getCustomers,
  getSettings,
  approveRecommendation
} from '../controllers/apiController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Health Check Endpoints
router.get('/health/database', getDatabaseHealth);
router.get('/shopify/sync-status', getShopifySyncStatus);

// REST Endpoints (Compatible with API_CONTRACT.md)
router.get('/dashboard', getDashboard);
router.get('/insights', getInsights);
router.get('/forecast', getForecast);
router.get('/products', getProducts);
router.get('/marketing', getMarketing);
router.get('/customers', getCustomers);
router.get('/settings', getSettings);

// Protected Recommendation Action (Requires Owner or Manager role)
router.post('/recommendations/:id/approve', authenticateToken, requireRole(['Owner', 'Manager']), approveRecommendation);

export default router;
