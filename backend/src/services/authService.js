/**
 * REVIXA BACKEND — AUTHENTICATION SERVICE LAYER
 * backend/src/services/authService.js
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { OrganizationRepository } from '../repositories/OrganizationRepository.js';
import { AuditService } from './auditService.js';
import { NotificationRepository } from '../repositories/NotificationRepository.js';

// In-memory / Repository Refresh Token Store for session tracking & invalidation
const activeRefreshTokens = new Set();

export class AuthService {
  /**
   * Validate password complexity requirements:
   * 8+ chars, uppercase, lowercase, number, special character
   */
  static validatePasswordComplexity(password) {
    if (!password || typeof password !== 'string' || password.length < 8) {
      return false;
    }
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    return hasUpper && hasLower && hasNumber && hasSpecial;
  }

  /**
   * Register new user & automatic organization provisioning
   */
  static async registerUser(payload) {
    const { email, password, name = 'Executive User', role = 'Owner', orgName = 'Revixa Enterprise' } = payload;

    // 1. Input validation (422)
    if (!email || !password) {
      const error = new Error('Validation failed: Email and password are required');
      error.statusCode = 422;
      throw error;
    }

    if (!this.validatePasswordComplexity(password)) {
      const error = new Error('Validation failed: Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.');
      error.statusCode = 422;
      throw error;
    }

    // 2. Duplicate email check (409)
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // 3. Password hashing (bcrypt cost factor 10+)
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create Organization & Owner User
    const org = await OrganizationRepository.create({ name: orgName });
    const user = await UserRepository.create({
      organizationId: org.id,
      email,
      name,
      passwordHash,
      role
    });

    // 5. Generate Access Token (15m) and Refresh Token (30d)
    const accessToken = jwt.sign(
      { id: user.id, organizationId: user.organizationId, role: user.role, email: user.email },
      config.jwtSecret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, tokenType: 'refresh' },
      config.jwtSecret,
      { expiresIn: '30d' }
    );
    activeRefreshTokens.add(refreshToken);

    // 6. Audit & Notification log
    await AuditService.recordEvent(user.id, 'USER_REGISTERED', `New account registered for ${user.email}`, 'security');
    await NotificationRepository.createNotification(user.id, 'SECURITY', 'Account successfully created');

    return {
      user: {
        id: user.id,
        organizationId: user.organizationId,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  /**
   * User login with password verification
   */
  static async loginUser(payload) {
    const { email, password } = payload;

    if (!email || !password) {
      const error = new Error('Validation failed: Email and password are required');
      error.statusCode = 422;
      throw error;
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      await AuditService.recordEvent(null, 'FAILED_LOGIN', `Failed login attempt for unknown email: ${email}`, 'alert');
      const error = new Error('Invalid email or password credentials');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await AuditService.recordEvent(user.id, 'FAILED_LOGIN', `Failed login attempt (wrong password) for: ${email}`, 'alert');
      const error = new Error('Invalid email or password credentials');
      error.statusCode = 401;
      throw error;
    }

    // Access Token (15m) & Refresh Token (30d)
    const accessToken = jwt.sign(
      { id: user.id, organizationId: user.organizationId, role: user.role, email: user.email },
      config.jwtSecret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, tokenType: 'refresh' },
      config.jwtSecret,
      { expiresIn: '30d' }
    );
    activeRefreshTokens.add(refreshToken);

    await UserRepository.updateLastLogin(user.id);
    await AuditService.recordEvent(user.id, 'USER_LOGIN', `User logged in: ${user.email}`, 'security');
    await NotificationRepository.createNotification(user.id, 'SECURITY', 'New login detected on your account');

    return {
      user: {
        id: user.id,
        organizationId: user.organizationId,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  /**
   * Refresh Token Endpoint (/auth/refresh)
   */
  static async refreshSession(refreshToken) {
    if (!refreshToken || !activeRefreshTokens.has(refreshToken)) {
      const error = new Error('Authentication required: Invalid or revoked refresh token');
      error.statusCode = 401;
      throw error;
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwtSecret);
      const user = await UserRepository.findById(decoded.id);

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 401;
        throw error;
      }

      // Token Rotation: Invalidate old refresh token, issue new pair
      activeRefreshTokens.delete(refreshToken);

      const newAccessToken = jwt.sign(
        { id: user.id, organizationId: user.organizationId, role: user.role, email: user.email },
        config.jwtSecret,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { id: user.id, tokenType: 'refresh' },
        config.jwtSecret,
        { expiresIn: '30d' }
      );
      activeRefreshTokens.add(newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (err) {
      activeRefreshTokens.delete(refreshToken);
      const error = new Error('Authentication required: Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }
  }

  /**
   * User logout — invalidates refresh token
   */
  static async logoutUser(userId, refreshToken) {
    if (refreshToken) {
      activeRefreshTokens.delete(refreshToken);
    }
    if (userId) {
      await AuditService.recordEvent(userId, 'USER_LOGOUT', `User logged out`, 'security');
    }
    return { success: true };
  }

  /**
   * Get authenticated user profile & organization details (/auth/me)
   */
  static async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error('User profile not found');
      error.statusCode = 404;
      throw error;
    }

    const org = await OrganizationRepository.findById(user.organizationId);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      organization: {
        id: org ? org.id : user.organizationId,
        name: org ? org.name : 'Revixa Enterprise'
      },
      role: user.role
    };
  }
}
