/**
 * REVIXA BACKEND — RECOMMENDATION SERVICE LAYER
 * backend/src/services/recommendationService.js
 * 
 * Business logic layer. Calls RecommendationRepository ONLY.
 */

import { RecommendationRepository } from '../repositories/RecommendationRepository.js';

export class RecommendationService {
  static async approveRecommendation(id, sku = 'SKU-881') {
    return await RecommendationRepository.updateStatus(id, 'EXECUTED');
  }
}
