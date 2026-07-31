/**
 * REVIXA BACKEND — AI RESPONSE PARSER
 * backend/src/services/ai/AIResponseParser.js
 * 
 * Cleans and parses raw LLM output strings into valid JSON objects.
 */

export class AIResponseParser {
  /**
   * Parse raw text string into verified JSON object
   */
  static parseResponse(rawText) {
    if (!rawText) return null;

    let cleaned = rawText.trim();

    // Strip markdown code fences if present
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }

    cleaned = cleaned.trim();

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn('[AIResponseParser] JSON parse error, attempting extraction:', err.message);
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('[AIResponseParser] Extraction failed:', e.message);
        }
      }
      return null;
    }
  }
}
