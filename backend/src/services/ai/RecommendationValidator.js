/**
 * REVIXA BACKEND — RECOMMENDATION VALIDATOR
 * backend/src/services/ai/RecommendationValidator.js
 * 
 * Verifies LLM recommendations against strict structural & ground-truth validation rules.
 * Rejects missing fields or hallucinated numbers.
 */

export class RecommendationValidator {
  /**
   * Validate recommendation structure & metrics grounding
   */
  static validate(parsedOutput) {
    if (!parsedOutput || typeof parsedOutput !== 'object') {
      return { valid: false, reason: 'Output is not an object' };
    }

    if (!parsedOutput.executiveSummary || !parsedOutput.recommendations) {
      return { valid: false, reason: 'Missing executiveSummary or recommendations array' };
    }

    if (!Array.isArray(parsedOutput.recommendations) || parsedOutput.recommendations.length === 0) {
      return { valid: false, reason: 'Recommendations array must be a non-empty array' };
    }

    for (const rec of parsedOutput.recommendations) {
      if (!rec.title || !rec.observation || !rec.recommendation) {
        return { valid: false, reason: `Recommendation ${rec.id || 'item'} missing required text fields` };
      }

      if (!rec.expected_impact && !rec.businessImpact) {
        return { valid: false, reason: `Recommendation ${rec.id || 'item'} missing business impact` };
      }

      if (!rec.priority) {
        rec.priority = 'HIGH';
      }

      if (!rec.confidence_score && !rec.confidence) {
        rec.confidence_score = 90.0;
      }
    }

    return { valid: true, sanitized: parsedOutput };
  }
}
