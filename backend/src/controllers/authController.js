/**
 * REVIXA BACKEND — AUTHENTICATION CONTROLLER
 * backend/src/controllers/authController.js
 * 
 * Handles HTTP requests/responses for auth routes.
 * NO Prisma imports. Calls AuthService layer exclusively.
 */

import { AuthService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, organizationName } = req.body;
    const data = await AuthService.registerUser({ name, email, password, role, orgName: organizationName });
    return sendSuccess(res, data, 201, 'User registered successfully');
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.loginUser({ email, password });
    return sendSuccess(res, data, 200, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = await AuthService.refreshSession(refreshToken);
    return sendSuccess(res, data, 200, 'Session refreshed successfully');
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.body ? req.body.refreshToken : null;
    const userId = req.user ? req.user.id : null;
    await AuthService.logoutUser(userId, refreshToken);
    return sendSuccess(res, null, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, 'Authentication required', 401);
    }

    const sessionData = await AuthService.getProfile(req.user.id);
    return sendSuccess(res, sessionData, 200, 'User session profile retrieved');
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

    const sessionData = await AuthService.getProfile(req.user.id);
    return res.status(200).json({
      status: 'success',
      data: {
        authenticated: true,
        ...sessionData
      }
    });
  } catch (err) {
    return res.status(200).json({
      status: 'success',
      data: { authenticated: false }
    });
  }
};
