/**
 * REVIXA BACKEND — MARKETING REPOSITORY
 * backend/src/repositories/MarketingRepository.js
 */

import prisma from '../database/prisma.js';

export class MarketingRepository {
  static async findMarketing(storyId = 'story_001') {
    return [
      { channel: "META ADS", spend: 32400, roas: "3.4x", cpa: 38.20, note: "Creative #12 driving 64% of orders" },
      { channel: "GOOGLE SEARCH", spend: 14200, roas: "1.8x", cpa: 64.10, note: "Competitor bid inflation on keyword 'luxury blazer'" },
      { channel: "KLAVIYO EMAIL", spend: 28900, roas: "14.2x", cpa: 4.10, note: "VIP Welcome flow open rate at 42.1%" }
    ];
  }
}
