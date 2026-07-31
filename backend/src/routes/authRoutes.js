/**
 * REVIXA BACKEND — AUTHENTICATION ROUTES
 * backend/src/routes/authRoutes.js
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refreshSession, logout, getMe, getSession } from '../controllers/authController.js';
import { install, callback } from '../controllers/shopifyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Rate Limiter: 10 requests per 15 minutes per IP
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  statusCode: 429
});

// Rate Limited Auth Endpoints
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);

// Refresh & Logout Endpoints
router.post('/refresh', refreshSession);
router.post('/logout', logout);

router.get('/session', (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticateToken(req, res, () => getSession(req, res, next));
  }
  return getSession(req, res, next);
});

// Protected Profile Endpoint
router.get('/me', authenticateToken, getMe);

// Shopify OAuth Endpoints
router.get('/shopify/install', install);
router.get('/shopify/callback', callback);

export default router;
