/**
 * REVIXA BACKEND — MARKETING SERVICE LAYER
 * backend/src/services/marketingService.js
 */

import { MarketingAnalyticsService } from './analytics/marketingAnalyticsService.js';

export class MarketingService {
  static async getMarketingData(storyId = 'story_001', orgId = 'org_default') {
    return await MarketingAnalyticsService.calculateMarketingMetrics(orgId);
  }
}
