/**
 * REVIXA — MAIN APPLICATION BOOTSTRAP MODULE
 * d:/f/src/app.js
 * 
 * Central entrypoint initializing the SPA router, store subscriptions, 
 * event bus, and feature flags as defined in SYSTEM_ARCHITECTURE.md.
 */

import { appStore } from './store/app-store.js';
import { SpaRouter } from './services/router.js';
import { globalEventBus } from './services/event-bus.js';
import { FeatureFlagService } from './services/feature-flags.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[REVIXA] Initializing Enterprise Application Architecture (Sprint 1 Audit Passed)...');

  // Initialize store audit logs via mockApi
  await appStore.initAuditLog();

  // Initialize client-side SPA router routing all view data through appStore
  const router = new SpaRouter({
    dashboard: () => appStore.fetchViewData('dashboard'),
    insights: () => appStore.fetchViewData('insights'),
    forecast: () => appStore.fetchViewData('forecast'),
    products: () => appStore.fetchViewData('products'),
    marketing: () => appStore.fetchViewData('marketing'),
    customers: () => appStore.fetchViewData('customers'),
    settings: () => appStore.fetchViewData('settings')
  }, 'dashboard');

  router.init();

  // Log active feature flags
  console.log('[REVIXA] Active Feature Flags:', FeatureFlagService.getAllFlags());

  // Listen to global events
  globalEventBus.on('action:executed', (data) => {
    console.log('[REVIXA EVENT] Action Executed:', data);
  });
});
