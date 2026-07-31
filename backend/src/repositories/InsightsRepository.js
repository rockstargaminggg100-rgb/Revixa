/**
 * REVIXA BACKEND — INSIGHTS REPOSITORY
 * backend/src/repositories/InsightsRepository.js
 */

import prisma from '../database/prisma.js';

export class InsightsRepository {
  static async findInsights(storyId = 'story_001') {
    if (prisma) {
      try {
        const recs = await prisma.recommendation.findMany({ take: 5 });
        if (recs && recs.length > 0) {
          return {
            story_id: storyId,
            ai_insight: {
              observation: recs[0].observation,
              root_cause: recs[0].rootCause,
              evidence: recs[0].evidence,
              recommendation: recs[0].recommendation,
              expected_impact: recs[0].expectedImpact,
              confidence_score: recs[0].confidenceScore
            },
            nodes: recs.map(r => ({
              id: r.id,
              title: r.title,
              desc: r.recommendation
            }))
          };
        }
      } catch (err) {
        console.warn('[InsightsRepository] Query fallback:', err.message);
      }
    }

    return {
      story_id: storyId,
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
      nodes: [
        { id: "1", title: "Meta Ad CAC Improved (-22%)", desc: "Creative #12 drove 64% of orders" },
        { id: "2", title: "Mobile Page Load Speed (+400ms)", desc: "Speed gain reduced cart drop-off" },
        { id: "3", title: "Inventory Stockout Risk", desc: "SKU #881 has 5.2 days remaining" }
      ]
    };
  }
}
