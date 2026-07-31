/**
 * REVIXA BACKEND — AUTHENTICATION & ROLE MIDDLEWARE
 * backend/src/middleware/auth.js
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { sendError } from '../utils/response.js';

/**
 * Verify JWT token from Authorization header (Bearer token)
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 'Authentication required', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // Contains id, email, role, organizationId
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Authentication required: Token expired', 401);
    }
    return sendError(res, 'Authentication required: Invalid token', 401);
  }
};

export const authenticateUser = authenticateToken;

/**
 * Role-based access control (RBAC) middleware
 * Allowed roles: Owner, Manager, Analyst, Viewer
 */
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    next();
  };
};
