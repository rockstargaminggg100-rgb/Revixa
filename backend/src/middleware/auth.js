/**
 * REVIXA BACKEND — AUTHENTICATION & ROLE MIDDLEWARE
 * backend/src/middleware/auth.js
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { sendError } from '../utils/response.js';

/**
 * Verify JWT token from Authorization header
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 'Access denied. No authentication token provided.', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // Contains id, email, role, organizationId
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token.', 403);
  }
};

/**
 * Role-based access control (RBAC) middleware
 * Allowed roles: Owner, Manager, Analyst, Viewer
 */
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'User not authenticated.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, `Permission denied. Requires one of roles: ${allowedRoles.join(', ')}`, 403);
    }

    next();
  };
};
