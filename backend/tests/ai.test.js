/**
 * REVIXA BACKEND — AI DECISION ENGINE & COPILOT TEST SUITE (JEST + SUPERTEST)
 * backend/tests/ai.test.js
 */

import request from 'supertest';
import app from '../src/server.js';
import { AIContextBuilder } from '../src/services/ai/AIContextBuilder.js';
import { RecommendationValidator } from '../src/services/ai/RecommendationValidator.js';
import { DecisionEngine } from '../src/services/ai/DecisionEngine.js';

describe('Phase 2.6 — AI Decision Engine & Executive Copilot Test Suite', () => {
  // 1. AI Context Builder Test
  describe('AIContextBuilder', () => {
    it('should aggregate deterministic analytics into a single structured context object without raw database rows', async () => {
      const context = await AIContextBuilder.buildContext('org_test');

      expect(context).toBeDefined();
      expect(context.companyHealth).toBeDefined();
      expect(context.companyHealth.score).toBeGreaterThan(0);
      expect(context.revenue.grossRevenue).toBeGreaterThan(0);
      expect(context.inventory.riskLevel).toBeDefined();
      expect(context.forecast.next30dRevenue).toBeGreaterThan(0);
    });
  });

  // 2. Recommendation Validator Test
  describe('RecommendationValidator', () => {
    it('should reject invalid or missing fields in recommendation object', () => {
      const invalid = { executiveSummary: {}, recommendations: [{ title: 'Invalid' }] };
      const result = RecommendationValidator.validate(invalid);

      expect(result.valid).toBe(false);
      expect(result.reason).toContain('missing required text fields');
    });

    it('should approve valid recommendation objects', () => {
      const valid = {
        executiveSummary: { headline: 'Test', recommendation: 'Test' },
        recommendations: [
          {
            id: 'rec_1',
            title: 'Reorder SKU #881',
            observation: 'Stockout risk',
            evidence: ['5.2 days left'],
            recommendation: 'Reorder 250 units',
            expected_impact: '+$18,400',
            confidence_score: 95.0,
            priority: 'CRITICAL'
          }
        ]
      };
      const result = RecommendationValidator.validate(valid);
      expect(result.valid).toBe(true);
    });
  });

  // 3. Decision Engine Pipeline Test
  describe('DecisionEngine Pipeline Execution', () => {
    it('should execute context -> prompt -> provider -> parser -> validator -> memory pipeline', async () => {
      const result = await DecisionEngine.executeDecisionPipeline('org_test', 'Analyze inventory stockout risk');

      expect(result).toBeDefined();
      expect(result.executiveSummary).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  // 4. REST API Endpoint Tests
  describe('AI API Endpoints', () => {
    it('GET /api/v1/ai/summary should return JSON executive summary', async () => {
      const res = await request(app).get('/api/v1/ai/summary');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.headline).toBeDefined();
    });

    it('GET /api/v1/ai/recommendations should return JSON decision recommendations', async () => {
      const res = await request(app).get('/api/v1/ai/recommendations');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/ai/copilot should return CEO executive briefing', async () => {
      const res = await request(app).get('/api/v1/ai/copilot');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.ceoSummary).toBeDefined();
    });
  });
});
