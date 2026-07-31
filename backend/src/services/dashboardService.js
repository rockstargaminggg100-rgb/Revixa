/**
 * REVIXA BACKEND — DASHBOARD SERVICE LAYER
 * backend/src/services/dashboardService.js
 * 
 * Assembles dynamic executive dashboard telemetry by orchestrating Analytics Services.
 */

import { RevenueAnalyticsService } from './analytics/revenueAnalyticsService.js';
import { InventoryAnalyticsService } from './analytics/inventoryAnalyticsService.js';
import { HealthScoreService } from './analytics/healthScoreService.js';
import { ExecutiveSummaryService } from './analytics/executiveSummaryService.js';
import { RecommendationEngine } from './analytics/recommendationEngine.js';

export class DashboardService {
  static async getDashboardData(storyId = 'story_001', orgId = 'org_default') {
    const rev = await RevenueAnalyticsService.calculateRevenueMetrics(orgId);
    const inv = await InventoryAnalyticsService.calculateInventoryMetrics(orgId);
    const health = await HealthScoreService.calculateExecutiveHealthScore(orgId);
    const summary = await ExecutiveSummaryService.generateExecutiveBriefing(orgId);
    const recommendations = await RecommendationEngine.generateRecommendations(orgId);

    return {
      kpis: [
        { title: 'Gross Revenue', value: `$${rev.grossRevenue.toLocaleString()}`, change: `+${rev.growthPercent}%`, status: 'up' },
        { title: 'Blended CAC', value: '$42.10', change: '-8.4%', status: 'up' },
        { title: 'AOV', value: `$${rev.averageOrderValue}`, change: '+3.2%', status: 'up' },
        { title: 'Inventory Health Score', value: `${health.components.inventoryScore}/100`, change: inv.highRiskCount > 0 ? 'Stockout Risk' : 'Optimal', status: inv.highRiskCount > 0 ? 'down' : 'up' },
        { title: 'Executive Health Score', value: `${health.score}/100`, change: health.status, status: 'up' }
      ],
      ai_insight: {
        headline: summary.headline,
        summary: `${summary.sections.whatHappened} ${summary.sections.requiresAttention}`,
        expected_impact: summary.sections.estimatedImpact,
        confidence_score: 94.8
      },
      priorities: recommendations,
      products: inv.products
    };
  }
}
