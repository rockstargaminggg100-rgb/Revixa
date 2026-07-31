/**
 * REVIXA BACKEND — MARKETING SERVICE LAYER
 * backend/src/services/marketingService.js
 * 
 * Business logic layer. Calls MarketingRepository ONLY.
 */

import { MarketingRepository } from '../repositories/MarketingRepository.js';

export class MarketingService {
  static async getMarketingData(storyId = 'story_001') {
    return await MarketingRepository.findMarketing(storyId);
  }
}
