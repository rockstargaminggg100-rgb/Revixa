/**
 * REVIXA BACKEND — HEALTH SERVICE LAYER
 * backend/src/services/healthService.js
 */

import { HealthRepository } from '../repositories/HealthRepository.js';

export class HealthService {
  static async checkDatabaseHealth() {
    const isConnected = await HealthRepository.checkDatabaseConnection();
    return {
      database: isConnected ? 'connected' : 'active_fallback_mode',
      provider: 'postgresql'
    };
  }
}
