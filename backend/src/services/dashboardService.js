/**
 * REVIXA BACKEND — DASHBOARD SERVICE LAYER
 * backend/src/services/dashboardService.js
 * 
 * Business logic layer. Calls DashboardRepository ONLY.
 */

import { DashboardRepository } from '../repositories/DashboardRepository.js';

export class DashboardService {
  static async getDashboardData(storyId = 'story_001') {
    return await DashboardRepository.findDashboardData(storyId);
  }
}
