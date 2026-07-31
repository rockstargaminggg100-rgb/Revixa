/**
 * REVIXA BACKEND — AI REST API ROUTES
 * backend/src/routes/aiRoutes.js
 */

import { Router } from 'express';
import {
  getAISummary,
  getAIRecommendations,
  getAICopilot,
  getAIHistory
} from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// AI Decision Engine Endpoints (Protected by JWT Authentication)
router.post('/summary', authenticateToken, getAISummary);
router.post('/recommendations', authenticateToken, getAIRecommendations);
router.post('/copilot', authenticateToken, getAICopilot);
router.get('/history', authenticateToken, getAIHistory);

// Public / Dev Endpoints
router.get('/summary', getAISummary);
router.get('/recommendations', getAIRecommendations);
router.get('/copilot', getAICopilot);

export default router;
