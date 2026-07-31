/**
 * REVIXA BACKEND — FORECAST SERVICE LAYER
 * backend/src/services/forecastService.js
 */

import { ForecastAnalyticsService } from './analytics/forecastAnalyticsService.js';

export class ForecastService {
  static async getForecastData(storyId = 'story_001', orgId = 'org_default') {
    const forecast = await ForecastAnalyticsService.calculateForecast(orgId);

    return {
      forecast_7d: forecast.forecast7d,
      forecast_30d: forecast.forecast30d,
      forecast_90d: forecast.forecast90d,
      stockout_risk: forecast.primaryStockoutRisk,
      projected_cash_flow_30d: forecast.projectedCashFlow30d,
      overall_confidence_score: forecast.overallConfidenceScore
    };
  }
}
