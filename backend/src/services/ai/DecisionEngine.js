/**
 * REVIXA BACKEND — AI DECISION ENGINE
 * backend/src/services/ai/DecisionEngine.js
 * 
 * Pipeline orchestrator:
 * Context Builder → Prompt Builder → LLM Provider → Response Parser → Recommendation Validator → Output
 */

import { AIContextBuilder } from './AIContextBuilder.js';
import { PromptBuilder } from './PromptBuilder.js';
import { LLMProvider } from './LLMProvider.js';
import { AIResponseParser } from './AIResponseParser.js';
import { RecommendationValidator } from './RecommendationValidator.js';
import { AIMemoryService } from './AIMemoryService.js';

export class DecisionEngine {
  /**
   * Process decision query through complete AI pipeline
   */
  static async executeDecisionPipeline(orgId = 'org_default', query = '') {
    // 1. Context Builder: Collect deterministic analytics telemetry
    const contextObj = await AIContextBuilder.buildContext(orgId);

    // 2. Prompt Builder: Construct structured JSON prompt
    const prompt = PromptBuilder.buildExecutivePrompt(contextObj, query);

    // 3. LLM Provider: Execute LLM call with caching & cost protection
    const rawLLMOutput = await LLMProvider.completePrompt(prompt);

    // 4. Response Parser: Clean & parse output string into JSON
    const parsedJSON = AIResponseParser.parseResponse(rawLLMOutput);

    // 5. Recommendation Validator: Ground check against rules & schema
    const validation = RecommendationValidator.validate(parsedJSON);

    let finalResult = parsedJSON;

    if (!validation.valid) {
      console.warn('[DecisionEngine] Validation failed, resorting to grounded fallback:', validation.reason);
      finalResult = JSON.parse(LLMProvider.callLocalFallback(prompt));
    }

    // 6. Record to AI Memory
    if (finalResult.recommendations) {
      for (const rec of finalResult.recommendations) {
        await AIMemoryService.recordRecommendation(rec);
      }
    }

    return finalResult;
  }
}
