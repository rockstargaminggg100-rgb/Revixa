/**
 * REVIXA — FEATURE FLAGS MANAGEMENT SERVICE
 * d:/f/src/services/feature-flags.js
 */

export const FEATURE_FLAGS = {
  forecast: true,
  customerAi: true,
  autoActions: false,
  voiceCopilot: false
};

export class FeatureFlagService {
  static isEnabled(flagName) {
    return !!FEATURE_FLAGS[flagName];
  }

  static getAllFlags() {
    return { ...FEATURE_FLAGS };
  }
}
