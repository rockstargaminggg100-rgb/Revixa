/**
 * REVIXA BACKEND — CUSTOMER SERVICE LAYER
 * backend/src/services/customerService.js
 */

import { CustomerAnalyticsService } from './analytics/customerAnalyticsService.js';

export class CustomerService {
  static async getCustomerData(storyId = 'story_001', orgId = 'org_default') {
    return await CustomerAnalyticsService.calculateCustomerMetrics(orgId);
  }
}
