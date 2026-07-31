/**
 * REVIXA — UNIDIRECTIONAL APP STATE STORE
 * d:/f/src/store/app-store.js
 * 
 * Central state container managing active story, user roles, view datasets, 
 * notifications, and enterprise audit log.
 * ALL business data flows through mock-api into appStore.
 */

import { mockApi } from '../data/mock-api.js';

class AppStore {
  constructor() {
    this.state = {
      activeStoryId: 'story_001',
      activeRole: 'Owner', // Roles: Owner, Manager, Analyst, Viewer
      user: {
        name: 'Julian Vance',
        email: 'julian@leganceparis.com',
        avatar: 'JV'
      },
      currentViewData: null,
      activeView: 'dashboard',
      isLoading: false,
      notifications: [
        { id: 1, type: 'alert', text: 'Stockout Risk on Silk Blazer SKU #881 (5.2 days left)', time: '2m ago' },
        { id: 2, type: 'insight', text: 'Meta Creative #12 CPA dropped 22%', time: '14m ago' }
      ],
      auditLog: [],
      executedActions: new Set(),
      featureFlags: {
        forecast: true,
        customerAi: true,
        autoActions: false,
        voiceCopilot: false
      }
    };

    this.listeners = [];
  }

  // Subscribe to state updates
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of state change
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Set active role
  setRole(role) {
    this.state.activeRole = role;
    this.addAuditEntry(`User role updated to ${role}`, 'setting');
    this.notify();
  }

  // Set active scenario story & update dependent views
  async setStory(storyId) {
    this.state.activeStoryId = storyId;
    this.addAuditEntry(`Switched active business scenario to ${storyId}`, 'sync');
    this.addNotification('insight', `Business scenario switched to ${storyId}`);
    await this.fetchViewData(this.state.activeView, storyId);
  }

  // Fetch view data via mock-api into appStore state
  async fetchViewData(viewName = 'dashboard', storyId = this.state.activeStoryId) {
    this.state.isLoading = true;
    this.state.activeView = viewName;
    this.notify();

    let response;
    switch (viewName) {
      case 'insights':
        response = await mockApi.getInsights(storyId);
        break;
      case 'forecast':
        response = await mockApi.getForecast(storyId);
        break;
      case 'products':
        response = await mockApi.getProducts(storyId);
        break;
      case 'marketing':
        response = await mockApi.getMarketing(storyId);
        break;
      case 'customers':
        response = await mockApi.getCustomers(storyId);
        break;
      case 'settings':
        response = await mockApi.getSettings(storyId);
        break;
      case 'dashboard':
      default:
        response = await mockApi.getDashboard(storyId);
        break;
    }

    if (response && response.status === 'success') {
      this.state.currentViewData = response.data;
    } else {
      console.error('[AppStore] Failed to fetch view data:', response?.message);
    }

    this.state.isLoading = false;
    this.notify();
  }

  // Backwards compatible fetchDashboardData helper
  async fetchDashboardData(storyId = this.state.activeStoryId) {
    await this.fetchViewData('dashboard', storyId);
  }

  // Initialize store audit logs from mock-api
  async initAuditLog() {
    const res = await mockApi.getAuditLog();
    if (res && res.data) {
      this.state.auditLog = res.data;
      this.notify();
    }
  }

  // Add entry to audit log
  addAuditEntry(text, type = 'action') {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
    this.state.auditLog.unshift({
      time: timeStr,
      text: text,
      type: type
    });
  }

  // Add notification
  addNotification(type, text) {
    this.state.notifications.unshift({
      id: Date.now(),
      type: type,
      text: text,
      time: 'Just now'
    });
  }

  // Execute operational action
  async executeAction(actionId) {
    const result = await mockApi.executeAction(actionId);
    
    if (result && result.status === 'executed') {
      this.state.executedActions.add(actionId);
      
      const label = actionId === 'po' ? 'PO #881-A sent to supplier' : 'Meta budget scaled +$750/day';
      this.addAuditEntry(`Action executed: ${label}`, 'action');
      this.addNotification('success', `Action Approved: ${label}`);

      this.notify();
    }
    return result;
  }
}

export const appStore = new AppStore();
