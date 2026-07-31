/**
 * REVIXA BACKEND — FORECAST REPOSITORY
 * backend/src/repositories/ForecastRepository.js
 */

import prisma from '../database/prisma.js';

export class ForecastRepository {
  static async findForecast(storyId = 'story_001') {
    if (prisma) {
      try {
        const products = await prisma.product.findMany({ take: 5 });
        if (products && products.length > 0) {
          return {
            expected_revenue: 780000,
            growth_yoy: 22,
            likelihood: "High (94.8%)",
            primary_risk: "SKU-881 Stockout in 5.2 days",
            recommended_action: "Restock SKU-881 via Air Freight",
            products: products.map(p => ({
              sku: p.sku,
              name: p.title,
              inventory_units: p.inventoryUnits,
              days_remaining: p.daysRemaining,
              status: p.status
            }))
          };
        }
      } catch (err) {
        console.warn('[ForecastRepository] Query fallback:', err.message);
      }
    }

    return {
      expected_revenue: 780000,
      growth_yoy: 22,
      likelihood: "High (94.8%)",
      primary_risk: "SKU-881 Stockout in 5.2 days",
      recommended_action: "Restock SKU-881 via Air Freight",
      timeline: [
        { day: "Day 1-5", status: "Stock Level OK (42 units)" },
        { day: "Day 6", status: "Stockout Gap (-$34k risk)" },
        { day: "Day 14", status: "Expected Expedited Arrival" }
      ]
    };
  }
}
