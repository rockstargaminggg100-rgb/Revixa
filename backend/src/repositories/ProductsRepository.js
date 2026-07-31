/**
 * REVIXA BACKEND — PRODUCTS REPOSITORY
 * backend/src/repositories/ProductsRepository.js
 */

import prisma from '../database/prisma.js';

export class ProductsRepository {
  static async findProducts(storyId = 'story_001') {
    if (prisma) {
      try {
        const products = await prisma.product.findMany();
        if (products && products.length > 0) {
          return products.map(p => ({
            name: p.title,
            sku: p.sku,
            revenue: p.price * p.dailyRunRate * 30,
            margin: p.margin,
            days_left: p.daysRemaining,
            status: p.status,
            run_rate: `${p.dailyRunRate} units/day`
          }));
        }
      } catch (err) {
        console.warn('[ProductsRepository] Query fallback:', err.message);
      }
    }

    return [
      { name: "Silk Executive Blazer", sku: "SKU #881", revenue: 48200, margin: 68.4, days_left: 5.2, status: "risk", run_rate: "8.1 units/day" },
      { name: "Cashmere Crewneck Sweater", sku: "SKU #104", revenue: 32400, margin: 74.2, days_left: 42.8, status: "healthy", run_rate: "2.4 units/day" },
      { name: "Slim Linen Trouser", sku: "SKU #410", revenue: 18900, margin: 61.0, days_left: 30.6, status: "monitor", run_rate: "4.0 units/day" }
    ];
  }
}
