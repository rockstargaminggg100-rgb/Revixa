/**
 * REVIXA BACKEND — AI MEMORY SERVICE
 * backend/src/services/ai/AIMemoryService.js
 * 
 * Stores decision reasoning history, executed actions, and outcome history to improve AI recommendations over time.
 */

import { AuditService } from '../auditService.js';

const recommendationHistory = [];

export class AIMemoryService {
  /**
   * Save generated recommendation to memory
   */
  static async recordRecommendation(recommendation) {
    const entry = {
      ...recommendation,
      recordedAt: new Date(),
      status: recommendation.status || 'PENDING'
    };
    recommendationHistory.push(entry);
    return entry;
  }

  /**
   * Record recommendation action execution
   */
  static async recordActionExecution(recId, actionType = 'APPROVED', user = 'Owner') {
    const item = recommendationHistory.find(r => r.id === recId);
    if (item) {
      item.status = actionType;
      item.executedAt = new Date();
      item.executedBy = user;
    }

    await AuditService.recordEvent(null, `AI_REC_${actionType}`, `Recommendation ${recId} mark as ${actionType} by ${user}`, 'setting');
    return item || { id: recId, status: actionType };
  }

  /**
   * Fetch recommendation history & reasoning log
   */
  static getHistory() {
    return recommendationHistory;
  }
}
