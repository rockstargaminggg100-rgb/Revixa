/**
 * REVIXA BACKEND — AI CONTEXT BUILDER
 * backend/src/services/ai/AIContextBuilder.js
 * 
 * Aggregates intelligence from all Phase 2.5 Analytics Services into ONE structured context object.
 * NEVER exposes raw database rows — only verified business intelligence.
 */

import { RevenueAnalyticsService } from '../analytics/revenueAnalyticsService.js';
import { InventoryAnalyticsService } from '../analytics/inventoryAnalyticsService.js';
import { CustomerAnalyticsService } from '../analytics/customerAnalyticsService.js';
import { MarketingAnalyticsService } from '../analytics/marketingAnalyticsService.js';
import { ForecastAnalyticsService } from '../analytics/forecastAnalyticsService.js';
import { HealthScoreService } from '../analytics/healthScoreService.js';
import { ExecutiveSummaryService } from '../analytics/executiveSummaryService.js';

export class AIContextBuilder {
  /**
   * Assemble unified deterministic analytics context object for LLM consumption
   */
  static async buildContext(orgId = 'org_default') {
    const revenue = await RevenueAnalyticsService.calculateRevenueMetrics(orgId);
    const inventory = await InventoryAnalyticsService.calculateInventoryMetrics(orgId);
    const customer = await CustomerAnalyticsService.calculateCustomerMetrics(orgId);
    const marketing = await MarketingAnalyticsService.calculateMarketingMetrics(orgId);
    const forecast = await ForecastAnalyticsService.calculateForecast(orgId);
    const health = await HealthScoreService.calculateExecutiveHealthScore(orgId);
    const summary = await ExecutiveSummaryService.generateExecutiveBriefing(orgId);

    return {
      companyHealth: {
        score: health.score,
        status: health.status
      },
      revenue: {
        grossRevenue: revenue.grossRevenue,
        netRevenue: revenue.netRevenue,
        growthPercent: revenue.growthPercent,
        aov: revenue.averageOrderValue,
        orderCount: revenue.orderCount
      },
      inventory: {
        healthScore: inventory.inventoryHealthScore,
        riskLevel: inventory.riskLevel,
        highRiskProducts: inventory.products.filter(p => p.status === 'risk')
      },
      customer: {
        ltv60d: customer.ltv60d,
        repeatRate: customer.repeatPurchaseRate,
        returningPercent: customer.returningCustomerPercent
      },
      marketing: {
        adSpend: marketing.totalAdSpend,
        roas: marketing.roas,
        blendedCac: marketing.blendedCac,
        topCreative: marketing.topCreative
      },
      forecast: {
        next30dRevenue: forecast.forecast30d.expectedRevenue,
        next30dOrders: forecast.forecast30d.expectedOrders,
        stockoutRisk: forecast.primaryStockoutRisk
      },
      briefing: summary
    };
  }
}
