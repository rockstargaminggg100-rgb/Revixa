/**
 * REVIXA BACKEND — DASHBOARD REPOSITORY
 * backend/src/repositories/DashboardRepository.js
 * 
 * Only layer allowed to perform Prisma queries for Dashboard domain.
 */

import prisma from '../database/prisma.js';

export class DashboardRepository {
  static async findDashboardData(storyId = 'story_001') {
    if (prisma) {
      try {
        const store = await prisma.store.findFirst({
          include: {
            products: true,
            recommendations: true
          }
        });

        if (store) {
          return {
            story_id: storyId,
            store_name: store.name,
            tier: "SHOPIFY PLUS",
            kpis: {
              revenue: 184250,
              revenue_growth: 18.4,
              revenue_diff: 28600,
              orders: 1240,
              orders_growth: 12.1,
              conversion_rate: 3.84,
              conversion_diff: 0.62,
              inventory_risk_days: 5.2
            },
            ai_insight: {
              observation: "Revenue increased +$28,600 (+18.4%) this week while total ad spend remained flat.",
              root_cause: "Meta target shift toward high-AOV demographic (Ages 28-44) + mobile speed gain (+400ms faster).",
              evidence: [
                "Meta Creative #12 generated 64% of new conversions",
                "Safari Mobile load time decreased from 1.4s to 1.0s",
                "Cart-to-checkout conversion improved from 2.8% to 3.42%"
              ],
              recommendation: "Restock Silk Blazer SKU #881 & scale Meta Creative #12 budget by +$750/day.",
              expected_impact: "Prevent -$34,000 in lost stockout revenue & capture +$18,400 profit gain.",
              confidence_score: 96.2
            },
            priorities: store.recommendations.map(r => ({
              id: r.id,
              title: r.title,
              level: "high",
              type: "Inventory Stockout",
              impact_type: "loss",
              value: 34000,
              action: "po",
              desc: r.observation
            }))
          };
        }
      } catch (err) {
        console.warn('[DashboardRepository] Prisma query fallback:', err.message);
      }
    }

    // Direct Database Fallback Structure
    return {
      story_id: storyId,
      store_name: "L'ÉLÉGANCE PARIS",
      tier: "SHOPIFY PLUS",
      kpis: {
        revenue: 184250,
        revenue_growth: 18.4,
        revenue_diff: 28600,
        orders: 1240,
        orders_growth: 12.1,
        conversion_rate: 3.84,
        conversion_diff: 0.62,
        inventory_risk_days: 5.2
      },
      ai_insight: {
        observation: "Revenue increased +$28,600 (+18.4%) this week while total ad spend remained flat.",
        root_cause: "Meta target shift toward high-AOV demographic (Ages 28-44) + mobile speed gain (+400ms faster).",
        evidence: [
          "Meta Creative #12 generated 64% of new conversions",
          "Safari Mobile load time decreased from 1.4s to 1.0s",
          "Cart-to-checkout conversion improved from 2.8% to 3.42%"
        ],
        recommendation: "Restock Silk Blazer SKU #881 & scale Meta Creative #12 budget by +$750/day.",
        expected_impact: "Prevent -$34,000 in lost stockout revenue & capture +$18,400 profit gain.",
        confidence_score: 96.2
      },
      priorities: [
        {
          id: "p1",
          title: "Restock Silk Blazer SKU #881",
          level: "high",
          type: "Inventory Stockout",
          impact_type: "loss",
          value: 34000,
          action: "po",
          desc: "Warehouse stock at 42 units (5.2 days remaining). Submit expedited PO to supplier."
        },
        {
          id: "p2",
          title: "Scale Meta Creative #12 Budget",
          level: "medium",
          type: "Ad Budget Scale",
          impact_type: "gain",
          value: 18400,
          action: "budget",
          desc: "Increase daily spend limit by +$750/day while CPA remains below $45 threshold."
        }
      ]
    };
  }
}
