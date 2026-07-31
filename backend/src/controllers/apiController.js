/**
 * REVIXA BACKEND — CORE API CONTROLLER
 * backend/src/controllers/apiController.js
 * 
 * Handles HTTP requests/responses for core domain APIs.
 * NO Prisma imports. Calls Service layer exclusively.
 */

import { HealthService } from '../services/healthService.js';
import { DashboardService } from '../services/dashboardService.js';
import { ForecastService } from '../services/forecastService.js';
import { MarketingService } from '../services/marketingService.js';
import { CustomerService } from '../services/customerService.js';
import { RecommendationService } from '../services/recommendationService.js';
import { ShopifyService } from '../services/shopifyService.js';
import { sendSuccess } from '../utils/response.js';

export const getDatabaseHealth = async (req, res, next) => {
  try {
    const healthData = await HealthService.checkDatabaseHealth();
    return sendSuccess(res, healthData);
  } catch (err) {
    next(err);
  }
};

export const getShopifySyncStatus = async (req, res, next) => {
  try {
    const orgId = req.user ? req.user.organizationId : 'org_default';
    const statusData = await ShopifyService.getSyncStatus(orgId);
    return sendSuccess(res, statusData);
  } catch (err) {
    next(err);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const storyId = req.query.story_id || 'story_001';
    const data = await DashboardService.getDashboardData(storyId);
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

export const getInsights = async (req, res, next) => {
  try {
    const storyId = req.query.story_id || 'story_001';
    const dashboardData = await DashboardService.getDashboardData(storyId);
    return sendSuccess(res, {
      ai_insight: dashboardData.ai_insight,
      nodes: dashboardData.priorities
    });
  } catch (err) {
    next(err);
  }
};

export const getForecast = async (req, res, next) => {
  try {
    const storyId = req.query.story_id || 'story_001';
    const forecastData = await ForecastService.getForecastData(storyId);
    return sendSuccess(res, forecastData);
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const storyId = req.query.story_id || 'story_001';
    const data = await DashboardService.getDashboardData(storyId);
    return sendSuccess(res, [
      { name: "Silk Executive Blazer", sku: "SKU #881", revenue: 48200, margin: 68.4, days_left: 5.2, status: "risk", run_rate: "8.1 units/day" },
      { name: "Cashmere Crewneck Sweater", sku: "SKU #104", revenue: 32400, margin: 74.2, days_left: 42.8, status: "healthy", run_rate: "2.4 units/day" },
      { name: "Slim Linen Trouser", sku: "SKU #410", revenue: 18900, margin: 61.0, days_left: 30.6, status: "monitor", run_rate: "4.0 units/day" }
    ]);
  } catch (err) {
    next(err);
  }
};

export const getMarketing = async (req, res, next) => {
  try {
    const storyId = req.query.story_id || 'story_001';
    const data = await MarketingService.getMarketingData(storyId);
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const storyId = req.query.story_id || 'story_001';
    const data = await CustomerService.getCustomerData(storyId);
    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      shopify_status: "Connected (Shopify Plus)",
      meta_status: "Connected (Ad Account #4829)",
      ga4_status: "Connected (GA4 ID #9021)",
      margin_guardrail: "55% Gross Margin Floor"
    });
  } catch (err) {
    next(err);
  }
};

export const approveRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await RecommendationService.approveRecommendation(id);
    return sendSuccess(res, data, 200, 'Recommendation approved successfully');
  } catch (err) {
    next(err);
  }
};
