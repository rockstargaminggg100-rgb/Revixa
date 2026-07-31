/**
 * REVIXA BACKEND — USER REPOSITORY
 * backend/src/repositories/UserRepository.js
 * 
 * Only layer allowed to perform Prisma queries for User model.
 * Provides fallback in-memory store when DB connection is offline.
 */

import prisma from '../database/prisma.js';

// In-memory fallback user database
const fallbackUsers = [];

export class UserRepository {
  static async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (prisma) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { organization: true }
        });
        if (user) return user;
      } catch (err) {
        console.warn('[UserRepository] findByEmail query fallback:', err.message);
      }
    }
    return fallbackUsers.find(u => u.email === normalizedEmail) || null;
  }

  static async findById(id) {
    if (prisma) {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          include: { organization: true }
        });
        if (user) return user;
      } catch (err) {
        console.warn('[UserRepository] findById query fallback:', err.message);
      }
    }
    return fallbackUsers.find(u => u.id === id) || null;
  }

  static async create(userData) {
    if (prisma) {
      try {
        const user = await prisma.user.create({
          data: userData,
          include: { organization: true }
        });
        if (user) return user;
      } catch (err) {
        console.warn('[UserRepository] create query fallback:', err.message);
      }
    }
    
    // In-memory fallback representation
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      role: userData.role || 'Owner',
      organizationId: userData.organizationId,
      createdAt: new Date()
    };

    fallbackUsers.push(newUser);
    return newUser;
  }

  static async updateLastLogin(id) {
    if (prisma) {
      try {
        await prisma.user.update({
          where: { id },
          data: { updatedAt: new Date() }
        });
      } catch (err) {
        console.warn('[UserRepository] updateLastLogin query fallback:', err.message);
      }
    }
    const user = fallbackUsers.find(u => u.id === id);
    if (user) user.updatedAt = new Date();
    return user;
  }

  static async updateRole(id, role) {
    if (prisma) {
      try {
        return await prisma.user.update({
          where: { id },
          data: { role }
        });
      } catch (err) {
        console.warn('[UserRepository] updateRole query fallback:', err.message);
      }
    }
    const user = fallbackUsers.find(u => u.id === id);
    if (user) user.role = role;
    return user;
  }
}
