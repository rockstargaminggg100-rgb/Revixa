/**
 * REVIXA BACKEND — AUDIT LOG SERVICE LAYER
 * backend/src/services/auditService.js
 * 
 * Business logic layer. Calls AuditRepository ONLY.
 */

import { AuditRepository } from '../repositories/AuditRepository.js';

export class AuditService {
  static async recordEvent(userId, action, details, type = 'action') {
    return await AuditRepository.createAuditLog({ userId, action, details, type });
  }

  static async getAuditLog(userId) {
    return await AuditRepository.findAuditLogs();
  }
}
