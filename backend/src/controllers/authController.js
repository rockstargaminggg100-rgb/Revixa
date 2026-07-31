/**
 * REVIXA BACKEND — AUTHENTICATION CONTROLLER
 * backend/src/controllers/authController.js
 * 
 * Handles HTTP requests/responses for auth routes.
 * NO Prisma imports. Calls AuthService layer exclusively.
 */

import { AuthService } from '../services/authService.js';
import { AuditService } from '../services/auditService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, organizationName } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 422);
    }

    const data = await AuthService.registerUser({ name, email, password, organizationName });
    return sendSuccess(res, data, 201, 'User registered successfully');
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const data = await AuthService.loginUser({ email, password });
    return sendSuccess(res, data, 200, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      await AuditService.recordEvent(req.user.id, 'USER_LOGOUT', `User signed out: ${req.user.email}`, 'setting');
    }
    return sendSuccess(res, null, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, 'Not authenticated', 401);
    }

    const userProfile = await AuthService.getUserProfile(req.user.id);
    return sendSuccess(res, userProfile, 200, 'User profile retrieved');
  } catch (err) {
    next(err);
  }
};

export const getSession = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(200).json({
        status: 'success',
        data: { authenticated: false }
      });
    }

    const userProfile = await AuthService.getUserProfile(req.user.id);
    return res.status(200).json({
      status: 'success',
      data: {
        authenticated: true,
        user: userProfile
      }
    });
  } catch (err) {
    return res.status(200).json({
      status: 'success',
      data: { authenticated: false }
    });
  }
};
