/**
 * REVIXA BACKEND — AUTHENTICATION SERVICE LAYER
 * backend/src/services/authService.js
 * 
 * Business logic layer for user registration, authentication, JWT signing, and session management.
 * Calls UserRepository, OrganizationRepository, and AuditService ONLY.
 * NO Prisma imports.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { OrganizationRepository } from '../repositories/OrganizationRepository.js';
import { AuditService } from './auditService.js';

export class AuthService {
  /**
   * Register new user and auto-create Organization
   */
  static async registerUser({ name, email, password, organizationName = "L'ÉLÉGANCE PARIS" }) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check email uniqueness
    const existingUser = await UserRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password securely with bcrypt
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create Organization
    const organization = await OrganizationRepository.create(organizationName);

    // Create Owner user
    const newUser = await UserRepository.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: 'Owner',
      organizationId: organization.id
    });

    // Sign JWT access token
    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, organizationId: newUser.organizationId },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Record audit event
    await AuditService.recordEvent(newUser.id, 'USER_REGISTERED', `New account created: ${newUser.email}`, 'setting');

    // Return token and sanitized user object (no password hash)
    return {
      accessToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organizationId: newUser.organizationId,
        createdAt: newUser.createdAt
      }
    };
  }

  /**
   * Login user & issue JWT
   */
  static async loginUser({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await UserRepository.findByEmail(normalizedEmail);
    if (!user) {
      await AuditService.recordEvent(null, 'LOGIN_FAILED', `Failed login attempt for email: ${normalizedEmail}`, 'alert');
      const error = new Error('Invalid email or password credentials');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      await AuditService.recordEvent(user.id, 'LOGIN_FAILED', `Failed login attempt for user: ${normalizedEmail}`, 'alert');
      const error = new Error('Invalid email or password credentials');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Record audit event
    await AuditService.recordEvent(user.id, 'USER_LOGIN', `User signed in: ${user.email}`, 'setting');

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organization ? user.organization.name : "L'ÉLÉGANCE PARIS",
        createdAt: user.createdAt
      }
    };
  }

  /**
   * Get current authenticated user profile (/auth/me)
   */
  static async getUserProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization ? user.organization.name : "L'ÉLÉGANCE PARIS",
      createdAt: user.createdAt
    };
  }
}
