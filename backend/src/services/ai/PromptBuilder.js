/**
 * REVIXA BACKEND — PROMPT BUILDER
 * backend/src/services/ai/PromptBuilder.js
 * 
 * Constructs deterministic JSON-only LLM system & user prompts.
 * Enforces prompt injection rejection and zero-hallucination constraints.
 */

export class PromptBuilder {
  /**
   * Sanitize user inputs to reject prompt injection attempts
   */
  static sanitizeInput(text) {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/IGNORE ALL PREVIOUS INSTRUCTIONS/gi, '')
               .replace(/SYSTEM PROMPT/gi, '')
               .trim();
  }

  /**
   * Build LLM reasoning prompt from structured analytics context
   */
  static buildExecutivePrompt(contextObj, userQuery = '') {
    const cleanQuery = this.sanitizeInput(userQuery);

    return `
You are a Senior Ecommerce Strategy Consultant & Chief Commercial Officer for Revixa AI.
Analyze the following verified ecommerce analytics context and return ONLY a valid, raw JSON object matching the required schema.
Do NOT use markdown code blocks (\`\`\`json). Return ONLY pure JSON text.

VERIFIED ANALYTICS CONTEXT:
${JSON.stringify(contextObj, null, 2)}

USER EXECUTIVE INQUIRY:
${cleanQuery || "Analyze overall store performance, stockout risks, and revenue opportunities."}

REQUIRED JSON RESPONSE SCHEMA:
{
  "executiveSummary": {
    "headline": "Short punchy executive headline",
    "recommendation": "Primary strategy recommendation"
  },
  "recommendations": [
    {
      "id": "rec_ai_1",
      "title": "Clear action title",
      "observation": "What happened based on telemetry",
      "evidence": ["Data point 1", "Data point 2"],
      "recommendation": "Exact recommended action",
      "expected_impact": "+$18,400 Protected Gross Revenue",
      "confidence_score": 95.0,
      "priority": "CRITICAL",
      "financialImpact": 18400
    }
  ],
  "opportunities": [
    "Opportunity description 1"
  ],
  "risks": [
    "Risk description 1"
  ],
  "confidence": {
    "score": 92.5
  }
}
`;
  }
}
