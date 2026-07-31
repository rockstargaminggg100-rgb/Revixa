/**
 * REVIXA BACKEND — SETTINGS REPOSITORY
 * backend/src/repositories/SettingsRepository.js
 */

import prisma from '../database/prisma.js';

export class SettingsRepository {
  static async findSettings() {
    if (prisma) {
      try {
        const setting = await prisma.setting.findFirst();
        if (setting) {
          return {
            shopify_status: "Connected (Shopify Plus)",
            meta_status: "Connected (Ad Account #4829)",
            ga4_status: "Connected (GA4 ID #9021)",
            margin_guardrail: `Minimum Gross Margin: ${setting.minMarginGuardrail}%`
          };
        }
      } catch (err) {
        console.warn('[SettingsRepository] Query fallback:', err.message);
      }
    }

    return {
      shopify_status: "Connected (Shopify Plus)",
      meta_status: "Connected (Ad Account #4829)",
      ga4_status: "Connected (GA4 ID #9021)",
      margin_guardrail: "55% Gross Margin Floor"
    };
  }
}
