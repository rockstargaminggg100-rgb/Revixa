/**
 * REVIXA — AUTHENTICATED APPLICATION CONTROLLER & INTERACTION ENGINE
 * d:/f/app-shell.js
 * 
 * Subscribes to appStore updates and manages UI event listeners.
 */

import { appStore } from './src/store/app-store.js';

document.addEventListener('DOMContentLoaded', () => {
  initStoreModeDetector();
  initSpaRouter();
  initStateSwitcher();
  initActionHandlers();
  initAppCommandPalette();
  initAccordionSteps();
  initDateRangeSwitcher();
  initRealtimeTicker();
  initSearchFilter();
  initStoryAndRoleSelectors();
  
  // Subscribe UI to appStore updates
  appStore.subscribe(renderStateUpdates);
  renderStateUpdates(appStore.state);
});

/* ==========================================================================
   0. DEMO VS REAL STORE MODE DETECTOR
   ========================================================================== */
function initStoreModeDetector() {
  const urlParams = new URLSearchParams(window.location.search);
  const isReal = urlParams.get('real') === 'true';

  const demoStoreBadge = document.getElementById('demoStoreBadge');
  const sampleDataBadge = document.getElementById('sampleDataBadge');
  const storeNameText = document.getElementById('storeNameText');
  const storeAvatar = document.getElementById('storeAvatar');

  if (isReal) {
    if (demoStoreBadge) demoStoreBadge.style.display = 'none';
    if (sampleDataBadge) sampleDataBadge.style.display = 'none';
    if (storeNameText) storeNameText.textContent = 'AURA APPAREL (SHOPIFY PLUS)';
    if (storeAvatar) storeAvatar.textContent = 'A';
  } else {
    if (demoStoreBadge) demoStoreBadge.style.display = 'inline-block';
    if (sampleDataBadge) sampleDataBadge.style.display = 'inline-block';
    if (storeNameText) storeNameText.textContent = "L'ÉLÉGANCE PARIS";
    if (storeAvatar) storeAvatar.textContent = 'L';
  }
}

/* ==========================================================================
   1. STORY ENGINE & ENTERPRISE ROLE SELECTORS
   ========================================================================== */
function initStoryAndRoleSelectors() {
  const storySelector = document.getElementById('storySelector');
  const roleSelector = document.getElementById('roleSelector');

  if (storySelector) {
    storySelector.addEventListener('change', async (e) => {
      showToast(`Loading Business Scenario: ${e.target.value}...`, 'info');
      await appStore.setStory(e.target.value);
    });
  }

  if (roleSelector) {
    roleSelector.addEventListener('change', (e) => {
      appStore.setRole(e.target.value);
      showToast(`Switched access role to ${e.target.value}`, 'info');
    });
  }
}

/* ==========================================================================
   2. APP STORE UNIDIRECTIONAL UI RENDERER
   ========================================================================== */
function renderStateUpdates(state) {
  if (!state) return;

  // Update notification count badge
  const notifCountBadge = document.getElementById('notifCountBadge');
  if (notifCountBadge) {
    notifCountBadge.textContent = state.notifications ? state.notifications.length : 0;
  }

  // Update role selector UI
  const roleSelector = document.getElementById('roleSelector');
  if (roleSelector && roleSelector.value !== state.activeRole) {
    roleSelector.value = state.activeRole;
  }

  // Update story selector UI
  const storySelector = document.getElementById('storySelector');
  if (storySelector && storySelector.value !== state.activeStoryId) {
    storySelector.value = state.activeStoryId;
  }

  // Render view dataset if available
  if (state.currentViewData) {
    const data = state.currentViewData;
    
    // Update Dashboard view if active
    if (data.kpis) {
      const revVal = document.querySelector('.metric-card.positive .metric-value');
      if (revVal && data.kpis.revenue) {
        revVal.innerHTML = `$${data.kpis.revenue.toLocaleString()} <span class="metric-trend">▲ +${data.kpis.revenue_growth}%</span>`;
      }
    }
  }
}

/* ==========================================================================
   3. SPA CLIENT-SIDE ROUTER (#dashboard, #insights, #forecast, etc.)
   ========================================================================== */
function initSpaRouter() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const pageViews = document.querySelectorAll('.page-view');

  function navigateToView(viewId) {
    if (!viewId) viewId = 'dashboard';

    // Hide all view panels
    pageViews.forEach(view => {
      view.classList.remove('active');
    });

    // Remove active state from sidebar links
    sidebarLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      targetView.classList.add('active');
    } else {
      const defaultView = document.getElementById('view-dashboard');
      if (defaultView) defaultView.classList.add('active');
    }

    // Highlight active sidebar link
    const activeLink = document.querySelector(`.sidebar-link[data-view="${viewId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleHashChange() {
    const hash = window.location.hash.replace('#', '');
    navigateToView(hash || 'dashboard');
  }

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      const viewId = link.getAttribute('data-view');
      if (viewId) {
        window.location.hash = `#${viewId}`;
      }
    });
  });
}

/* ==========================================================================
   4. DEMO UI STATE SWITCHER (Loaded / Skeleton / Empty)
   ========================================================================== */
function initStateSwitcher() {
  const stateBtns = document.querySelectorAll('.state-switcher-btn');
  const viewDashboard = document.getElementById('view-dashboard');
  const viewSkeleton = document.getElementById('view-skeleton-container');
  const viewEmpty = document.getElementById('view-empty-container');

  if (!stateBtns.length) return;

  stateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const state = btn.getAttribute('data-state');

      stateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (state === 'loaded') {
        if (viewDashboard) viewDashboard.style.display = 'flex';
        if (viewSkeleton) viewSkeleton.style.display = 'none';
        if (viewEmpty) viewEmpty.style.display = 'none';
      } else if (state === 'skeleton') {
        if (viewDashboard) viewDashboard.style.display = 'none';
        if (viewSkeleton) viewSkeleton.style.display = 'flex';
        if (viewEmpty) viewEmpty.style.display = 'none';
      } else if (state === 'empty') {
        if (viewDashboard) viewDashboard.style.display = 'none';
        if (viewSkeleton) viewSkeleton.style.display = 'none';
        if (viewEmpty) viewEmpty.style.display = 'flex';
      }
    });
  });
}

/* ==========================================================================
   5. DECISION REVIEW MODAL & FAKE AI THINKING SEQUENCE
   ========================================================================== */
let pendingActionType = 'po';

function openReviewModal(actionType) {
  pendingActionType = actionType;
  const reviewModal = document.getElementById('reviewModal');
  const aiThinkingState = document.getElementById('aiThinkingState');
  const aiReviewReadyState = document.getElementById('aiReviewReadyState');
  const aiThinkingSteps = document.getElementById('aiThinkingSteps');
  const reviewModalTitle = document.getElementById('reviewModalTitle');
  const reviewModalBody = document.getElementById('reviewModalBody');
  const reviewModalValue = document.getElementById('reviewModalValue');

  if (!reviewModal) return;

  reviewModal.classList.add('active');
  reviewModal.setAttribute('aria-hidden', 'false');

  // Start 1-second AI thinking sequence
  aiThinkingState.style.display = 'flex';
  aiReviewReadyState.style.display = 'none';

  aiThinkingSteps.innerHTML = '<div>● Analyzing warehouse inventory velocity...</div>';
  
  setTimeout(() => {
    aiThinkingSteps.innerHTML += '<div>● Checking ad attribution signals...</div>';
  }, 350);

  setTimeout(() => {
    aiThinkingSteps.innerHTML += '<div>● Evaluating gross margin impact...</div>';
  }, 700);

  setTimeout(() => {
    // Reveal recommendation review payload
    aiThinkingState.style.display = 'none';
    aiReviewReadyState.style.display = 'block';

    if (actionType === 'po') {
      reviewModalTitle.textContent = 'Review Action: Restock SKU #881';
      reviewModalBody.textContent = 'Submit purchase order for 250 units of Silk Blazer (SKU #881) via air freight to Italian supplier to prevent -$34,000 in lost revenue.';
      reviewModalValue.textContent = '+$34,000 Protected';
      reviewModalValue.style.color = 'var(--accent-green)';
    } else {
      reviewModalTitle.textContent = 'Review Action: Scale Meta Budget';
      reviewModalBody.textContent = 'Increase daily spend limit on Meta Campaign "Q3 Outerwear" by +$750/day while CPA remains under $45 floor.';
      reviewModalValue.textContent = '+$18,400 Profit';
      reviewModalValue.style.color = 'var(--accent-green)';
    }
  }, 1000);
}

function closeReviewModal() {
  const reviewModal = document.getElementById('reviewModal');
  if (reviewModal) {
    reviewModal.classList.remove('active');
    reviewModal.setAttribute('aria-hidden', 'true');
  }
}
window.closeReviewModal = closeReviewModal;

async function approveReviewAction() {
  const approveBtn = document.getElementById('approveActionBtn');
  approveBtn.textContent = 'Executing...';
  approveBtn.disabled = true;

  // Execute action via appStore
  const result = await appStore.executeAction(pendingActionType);

  if (result && result.status === 'executed') {
    approveBtn.textContent = '✓ Action Executed (PO #881-A)';
    
    setTimeout(() => {
      closeReviewModal();
      showToast(`Action Approved: ${pendingActionType === 'po' ? 'PO #881-A' : 'Meta Budget'} Executed`, 'success');
      
      // Update matching action buttons across app
      const actionBtns = document.querySelectorAll('.action-btn');
      actionBtns.forEach(btn => {
        if (btn.getAttribute('data-action') === pendingActionType) {
          btn.textContent = '✓ Executed (PO #881-A)';
          btn.disabled = true;
          btn.classList.replace('btn-primary', 'btn-secondary');
        }
      });
    }, 400);
  }
}
window.approveReviewAction = approveReviewAction;

function initActionHandlers() {
  const actionBtns = document.querySelectorAll('.action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      openReviewModal(action);
    });
  });
}

/* ==========================================================================
   6. NOTIFICATIONS DROPDOWN MODAL
   ========================================================================== */
function openNotifModal() {
  const notifModal = document.getElementById('notifModal');
  const notifList = document.getElementById('notifList');
  if (!notifModal) return;

  notifModal.classList.add('active');

  if (notifList && appStore.state.notifications) {
    notifList.innerHTML = appStore.state.notifications.map(n => `
      <div style="padding: 10px; background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 12px; color: var(--text-primary); display: flex; justify-content: space-between; align-items: center;">
        <span>${n.text}</span>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">${n.time}</span>
      </div>
    `).join('');
  }
}
window.openNotifModal = openNotifModal;

function closeNotifModal() {
  const notifModal = document.getElementById('notifModal');
  if (notifModal) notifModal.classList.remove('active');
}
window.closeNotifModal = closeNotifModal;

/* ==========================================================================
   7. TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: #FFFFFF;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
    padding: 12px 18px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    box-shadow: var(--shadow-lg);
    animation: fadeIn 200ms ease;
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  const icon = type === 'success' ? '✓' : 'ℹ';
  const iconColor = type === 'success' ? 'var(--accent-green)' : 'var(--accent-blue)';
  toast.innerHTML = `<strong style="color: ${iconColor};">${icon}</strong> ${message}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

/* ==========================================================================
   8. ACCORDION EXPAND/COLLAPSE FOR AI INSIGHT STEPS
   ========================================================================== */
function initAccordionSteps() {
  const steps = document.querySelectorAll('.pipeline-step');
  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });
}

/* ==========================================================================
   9. DATE RANGE SWITCHER
   ========================================================================== */
function initDateRangeSwitcher() {
  const timeBtns = document.querySelectorAll('.time-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Updated view metrics for ${btn.textContent}`, 'info');
    });
  });
}

/* ==========================================================================
   10. 15-SECOND REALTIME SYNC TICKER
   ========================================================================== */
function initRealtimeTicker() {
  setInterval(() => {
    const syncText = document.querySelector('.sync-text');
    if (syncText) {
      syncText.style.opacity = '0.5';
      setTimeout(() => {
        syncText.innerHTML = 'Shopify • Meta • GA4 • Klaviyo &nbsp;|&nbsp; <strong>Last Sync: Just now</strong>';
        syncText.style.opacity = '1';
      }, 300);
    }
  }, 15000);
}

/* ==========================================================================
   11. ⌘K LIVE TYPING SEARCH & KEYBOARD NAVIGATION
   ========================================================================== */
let selectedIndex = 0;

function initSearchFilter() {
  const cmdInput = document.getElementById('cmdInput');
  const cmdItems = document.querySelectorAll('.cmd-item');

  if (!cmdInput) return;

  cmdInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    cmdItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
    selectedIndex = 0;
    updateSelectedCmdItem();
  });
}

function updateSelectedCmdItem() {
  const visibleItems = Array.from(document.querySelectorAll('.cmd-item')).filter(el => el.style.display !== 'none');
  visibleItems.forEach((item, index) => {
    if (index === selectedIndex) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
}

/* ==========================================================================
   12. COMMAND PALETTE (⌘K) MODAL & KEYBOARD SHORTCUTS
   ========================================================================== */
function initAppCommandPalette() {
  const cmdTrigger = document.getElementById('cmdTrigger');
  const cmdModal = document.getElementById('cmdModal');
  const cmdInput = document.getElementById('cmdInput');

  if (!cmdModal) return;

  function openPalette() {
    cmdModal.classList.add('active');
    cmdModal.setAttribute('aria-hidden', 'false');
    if (cmdInput) cmdInput.focus();
  }

  function closePalette() {
    cmdModal.classList.remove('active');
    cmdModal.setAttribute('aria-hidden', 'true');
  }

  if (cmdTrigger) cmdTrigger.addEventListener('click', openPalette);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      cmdModal.classList.contains('active') ? closePalette() : openPalette();
    }
    
    if (!cmdModal.classList.contains('active')) return;

    const visibleItems = Array.from(document.querySelectorAll('.cmd-item')).filter(el => el.style.display !== 'none');

    if (e.key === 'Escape') {
      closePalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (visibleItems.length > 0) {
        selectedIndex = (selectedIndex + 1) % visibleItems.length;
        updateSelectedCmdItem();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (visibleItems.length > 0) {
        selectedIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
        updateSelectedCmdItem();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (visibleItems[selectedIndex]) {
        const targetView = visibleItems[selectedIndex].getAttribute('data-view');
        closePalette();
        if (targetView) window.location.hash = `#${targetView}`;
      }
    }
  });

  if (cmdModal) {
    cmdModal.addEventListener('click', (e) => {
      if (e.target === cmdModal) closePalette();
    });
  }
}
