/**
 * REVIXA — ASYNC MOCK SERVICE LAYER
 * d:/f/src/data/mock-api.js
 * 
 * Exposes async service functions with simulated latency (300ms-700ms)
 * and robust try/catch error handling.
 * ONLY imports mock-db.js.
 */

import { MOCK_STORIES, INITIAL_AUDIT_LOG } from './mock-db.js';

// Helper to simulate realistic network latency
const simulateLatency = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  /**
   * GET /api/v1/dashboard
   */
  async getDashboard(storyId = 'story_001') {
    try {
      await simulateLatency(450);
      const story = MOCK_STORIES[storyId] || MOCK_STORIES.story_001;
      return {
        status: 'success',
        data: story
      };
    } catch (err) {
      console.error('[mockApi] Error fetching dashboard data:', err);
      return {
        status: 'error',
        message: err.message || 'Failed to fetch dashboard data'
      };
    }
  },

  /**
   * GET /api/v1/insights
   */
  async getInsights(storyId = 'story_001') {
    try {
      await simulateLatency(300);
      const story = MOCK_STORIES[storyId] || MOCK_STORIES.story_001;
      return {
        status: 'success',
        data: {
          story_id: story.id,
          title: story.title,
          ai_insight: story.ai_insight,
          nodes: story.priorities
        }
      };
    } catch (err) {
      console.error('[mockApi] Error fetching insights data:', err);
      return {
        status: 'error',
        message: err.message || 'Failed to fetch insights data'
      };
    }
  },

  /**
   * GET /api/v1/forecast
   */
  async getForecast(storyId = 'story_001') {
    try {
      await simulateLatency(700);
      const story = MOCK_STORIES[storyId] || MOCK_STORIES.story_001;
      return {
        status: 'success',
        data: {
          story_id: story.id,
          forecast: story.forecast,
          products: story.products
        }
      };
    } catch (err) {
      console.error('[mockApi] Error fetching forecast data:', err);
      return {
        status: 'error',
        message: err.message || 'Failed to fetch forecast data'
      };
    }
  },

  /**
   * GET /api/v1/products
   */
  async getProducts(storyId = 'story_001') {
    try {
      await simulateLatency(350);
      const story = MOCK_STORIES[storyId] || MOCK_STORIES.story_001;
      return {
        status: 'success',
        data: story.products
      };
    } catch (err) {
      console.error('[mockApi] Error fetching products data:', err);
      return {
        status: 'error',
        message: err.message || 'Failed to fetch products data'
      };
    }
  },

  /**
   * GET /api/v1/marketing
   */
  async getMarketing(storyId = 'story_001') {
    try {
      await simulateLatency(400);
      const story = MOCK_STORIES[storyId] || MOCK_STORIES.story_001;
      return {
        status: 'success',
        data: story.marketing
      };
    } catch (err) {
      console.error('[mockApi] Error fetching marketing data:', err);
      return {
        status: 'error',
        message: err.message || 'Failed to fetch marketing data'
      };
    }
  },

  /**
   * GET /api/v1/customers
   */
  async getCustomers(storyId = 'story_001') {
    try {
      await simulateLatency(380);
      const story = MOCK_STORIES[storyId] || MOCK_STORIES.story_001;
      return {
        status: 'success',
        data: story.customers
      };
    } catch (err) {
      console.error('[mockApi] Error fetching customers data:', err);
      return {
        status: 'error',
        message: err.message || 'Failed to fetch customers data'
      };
    }
  },

  /**
   * GET /api/v1/settings
   */
  async getSettings(storyId = 'story_001') {
    try {
      await simulateLatency(250);
      const story = MOCK_STORIES[storyId] || MOCK_STORIES.story_001;
      return {
        status: 'success',
        data: story.settings
      };
    } catch (err) {
      console.error('[mockApi] Error fetching settings data:', err);
      return {
        status: 'error',
        message: err.message || 'Failed to fetch settings data'
      };
    }
  },

  /**
   * POST /api/v1/actions/execute
   */
  async executeAction(actionId, sku = 'SKU-881') {
    try {
      await simulateLatency(500);
      return {
        status: 'executed',
        action_id: actionId,
        po_number: 'PO #881-A',
        executed_at: new Date().toISOString()
      };
    } catch (err) {
      console.error('[mockApi] Error executing action:', err);
      return {
        status: 'error',
        message: err.message || 'Failed to execute action'
      };
    }
  },

  /**
   * GET /api/v1/audit-log
   */
  async getAuditLog() {
    try {
      await simulateLatency(250);
      return {
        status: 'success',
        data: INITIAL_AUDIT_LOG
      };
    } catch (err) {
      console.error('[mockApi] Error fetching audit log:', err);
      return {
        status: 'error',
        message: err.message || 'Failed to fetch audit log'
      };
    }
  }
};
