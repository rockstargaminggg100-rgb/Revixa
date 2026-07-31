/**
 * REVIXA BACKEND — HEALTH REPOSITORY
 * backend/src/repositories/HealthRepository.js
 * 
 * Encapsulates raw database connection checks.
 */

import prisma from '../database/prisma.js';

export class HealthRepository {
  static async checkDatabaseConnection() {
    if (!prisma) return false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (err) {
      console.warn('[HealthRepository] Database connection check failed:', err.message);
      return false;
    }
  }
}
