/**
 * REVIXA BACKEND — ORGANIZATION REPOSITORY
 * backend/src/repositories/OrganizationRepository.js
 */

import prisma from '../database/prisma.js';

export class OrganizationRepository {
  static async create(name) {
    if (prisma) {
      try {
        return await prisma.organization.create({
          data: { name }
        });
      } catch (err) {
        console.warn('[OrganizationRepository] create query fallback:', err.message);
      }
    }
    return {
      id: `org_${Date.now()}`,
      name: name,
      createdAt: new Date()
    };
  }

  static async findById(id) {
    if (prisma) {
      try {
        return await prisma.organization.findUnique({
          where: { id }
        });
      } catch (err) {
        console.warn('[OrganizationRepository] findById query fallback:', err.message);
      }
    }
    return null;
  }
}
