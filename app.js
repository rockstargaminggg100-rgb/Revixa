/**
 * REVIXA — AI COMMERCE INTELLIGENCE OS
 * Dynamic Interaction & Physics Engine (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initDataFlowCanvas();
  initDashboardHeroInteractions();
  initProbeStorytelling();
  initComparisonToggle();
  initScenarioPlayground();
  initRoiCalculator();
  initCommandPalette();
  initWaitlistForm();
});

/* ==========================================================================
   1. BACKGROUND ANIMATED DATA FLOW CANVAS (SVG)
   ========================================================================== */
function initDataFlowCanvas() {
  const canvas = document.getElementById('dataFlowCanvas');
  if (!canvas) return;

  function resizeCanvas() {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Render low-opacity subtle vector connecting lines
  const paths = [
    { start: [100, 150], end: [window.innerWidth / 2, 400] },
    { start: [window.innerWidth - 100, 200], end: [window.innerWidth / 2, 400] },
  ];

  let svgContent = '';
  paths.forEach((p, idx) => {
    const cp1x = (p.start[0] + p.end[0]) / 2;
    const cp1y = p.start[1];
    const pathD = `M ${p.start[0]} ${p.start[1]} C ${cp1x} ${cp1y}, ${cp1x} ${p.end[1]}, ${p.end[0]} ${p.end[1]}`;
    svgContent += `
      <path d="${pathD}" fill="none" stroke="rgba(37, 99, 235, 0.12)" stroke-width="1.5" stroke-dasharray="6,6" />
      <circle cx="${p.start[0]}" cy="${p.start[1]}" r="3" fill="rgba(37, 99, 235, 0.4)" />
    `;
  });
  canvas.innerHTML = svgContent;
}

/* ==========================================================================
   2. HERO DASHBOARD COPILOT INTERACTION ENGINE
   ========================================================================== */
function initDashboardHeroInteractions() {
  // Causal node details database
  const causeDetails = {
    meta: {
      title: 'Signal Detail: Meta Ad CAC Drop (-22%)',
      confidence: 'CONFIDENCE: 98.4%',
      body: "Algorithmic audit indicates Meta's Andromeda targeting model shifted budget towards high-LTV female demographic (Ages 28-44) with an average order value of $210 vs store average of $165."
    },
    checkout: {
      title: 'Signal Detail: Mobile Checkout Speed Gain',
      confidence: 'CONFIDENCE: 96.1%',
      body: 'Shopify image compression update deployed Monday reduced DOM interactive latency from 1.4s to 1.0s. Conversion rate on Safari Mobile improved from 2.8% to 3.42%.'
    },
    stockout: {
      title: 'Signal Detail: Inventory Constraint Risk',
      confidence: 'CONFIDENCE: 99.8%',
      body: 'Current sales velocity of Silk Executive Blazer SKU #881 is 8.1 units/day with 42 units remaining in warehouse. Stockout guaranteed in 5.2 days without expedited supplier PO.'
    }
  };

  const causalNodes = document.querySelectorAll('.causal-node-item');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerBody = document.getElementById('drawerBody');

  causalNodes.forEach(node => {
    node.addEventListener('click', () => {
      causalNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const causeKey = node.getAttribute('data-cause');
      if (causeDetails[causeKey]) {
        drawerTitle.textContent = causeDetails[causeKey].title;
        drawerBody.textContent = causeDetails[causeKey].body;
      }
    });
  });

  // Action Buttons
  const actionBtns = document.querySelectorAll('.action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.getAttribute('data-action');
      if (action === 'po') {
        btn.textContent = '✓ PO Sent to Supplier';
        btn.classList.replace('btn-primary', 'btn-secondary');
        btn.disabled = true;
        document.getElementById('poStatus').textContent = 'Executed (PO #881-A)';
        document.getElementById('poStatus').style.color = 'var(--accent-green)';
      } else if (action === 'budget') {
        btn.textContent = '✓ Budget Scaled +$750';
        btn.disabled = true;
        document.getElementById('budgetStatus').textContent = 'Live in Meta Manager';
        document.getElementById('budgetStatus').style.color = 'var(--accent-green)';
      }
    });
  });

  // Copilot Console Query Input & Typewriter Effect
  const copilotInput = document.getElementById('copilotInput');
  const copilotSubmitBtn = document.getElementById('copilotSubmitBtn');
  const consoleResponseText = document.getElementById('consoleResponseText');
  const quickPromptChips = document.querySelectorAll('.quick-prompt-chip');

  const queryAnswers = {
    "Explain yesterday's refund spike": "Refunds increased by +4 units ($840) on Wednesday because 3 customers reported sizing discrepancies on SKU #410 (Slim Linen Trouser). Recommended action: Update sizing guide note on product detail page.",
    "Forecast inventory needs for next 30 days": "Based on 30-day velocity models, you will require 450 units of Silk Blazer (#881) and 300 units of Cashmere Crewneck (#104) to avoid $62,000 in lost stockout revenue.",
    "Which ad channel has lowest ROAS?": "Google Display Network generated 0.6x ROAS ($2,400 spend for $1,440 revenue). Reallocating this $2,400 to Meta Retargeting #02 is projected to yield 3.8x ROAS (+$6,720 profit).",
    "default": "Net margin decreased by 3.2% on Tuesday because spend on Google Search Ads increased by +$4,200 without proportional conversion gain (CPA rose from $38 to $84 due to competitor bid inflation on keyword 'luxury blazer')."
  };

  function executeQuery(queryText) {
    copilotInput.value = queryText;
    consoleResponseText.innerHTML = `<span style="color: var(--text-muted);">Analyzing 4.2M commerce data points...</span>`;
    
    setTimeout(() => {
      const answer = queryAnswers[queryText] || queryAnswers["default"];
      consoleResponseText.textContent = answer;
    }, 350);
  }

  copilotSubmitBtn.addEventListener('click', () => {
    if (copilotInput.value.trim()) {
      executeQuery(copilotInput.value.trim());
    }
  });

  copilotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && copilotInput.value.trim()) {
      executeQuery(copilotInput.value.trim());
    }
  });

  quickPromptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      executeQuery(q);
    });
  });
}

/* ==========================================================================
   3. PROBE-STYLE INTERACTIVE STORYTELLING
   ========================================================================== */
function initProbeStorytelling() {
  const stepItems = document.querySelectorAll('.story-step-item');
  const canvasStates = document.querySelectorAll('.canvas-state');

  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const step = item.getAttribute('data-step');

      stepItems.forEach(s => s.classList.remove('active'));
      canvasStates.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      const targetState = document.querySelector(`.canvas-state.state-${step}`);
      if (targetState) {
        targetState.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. DASHBOARD COMPARISON TOGGLE
   ========================================================================== */
function initComparisonToggle() {
  const btnRevixa = document.getElementById('btnShowRevixa');
  const btnLegacy = document.getElementById('btnShowLegacy');
  const compRevixa = document.getElementById('compRevixa');
  const compLegacy = document.getElementById('compLegacy');

  if (!btnRevixa || !btnLegacy) return;

  btnRevixa.addEventListener('click', () => {
    btnRevixa.classList.add('active');
    btnLegacy.classList.remove('active');
    compRevixa.classList.add('active');
    compLegacy.classList.remove('active');
  });

  btnLegacy.addEventListener('click', () => {
    btnLegacy.classList.add('active');
    btnRevixa.classList.remove('active');
    compLegacy.classList.add('active');
    compRevixa.classList.remove('active');
  });
}

/* ==========================================================================
   5. SCENARIO PLAYGROUND
   ========================================================================== */
function initScenarioPlayground() {
  const scenarioData = {
    'ad-fatigue': {
      badge: 'SCENARIO: META CREATIVE FATIGUE',
      severity: 'SEVERITY: HIGH',
      diagnosis: 'Frequency on Top Creative #04 reached 4.8x. Click-through rate dropped from 2.4% to 1.1% over 48 hours, causing CAC to surge from $32 to $68.',
      metric: 'CAC SURGE: +112.5% | WASTED DAILY SPEND: $1,420',
      action: 'Revixa auto-generated a budget shift recommendation: Pause Creative #04 and allocate $1,200/day to Back-up Creative #09 ("Customer Review Montage").'
    },
    'stockout': {
      badge: 'SCENARIO: HERO PRODUCT STOCKOUT',
      severity: 'SEVERITY: CRITICAL',
      diagnosis: 'Silk Executive Blazer stock is at 42 units. Sales velocity increased +40% due to influencer feature. Stockout projected in 5 days.',
      metric: 'PROJECTED REVENUE AT RISK: $34,000 | RUN RATE: 8.4 UNITS/DAY',
      action: 'Revixa issues an automated purchase order draft to your Milan manufacturer for 250 units via air freight, preventing stockout.'
    },
    'checkout-drop': {
      badge: 'SCENARIO: CHECKOUT CONVERSION DROP',
      severity: 'SEVERITY: MEDIUM',
      diagnosis: 'Cart-to-checkout conversion dropped 3.8% following third-party review app script update that added 850ms script execution blocking on mobile.',
      metric: 'CONVERSION LOSS: -3.8% | CART ABANDONMENT SURGE: +14.2%',
      action: 'Revixa pinpoints the exact script tag ID and recommends deferring non-essential script execution until post-checkout.'
    },
    'klaviyo-decay': {
      badge: 'SCENARIO: EMAIL DELIVERABILITY DIP',
      severity: 'SEVERITY: MODERATE',
      diagnosis: 'Klaviyo VIP Welcome flow open rate dropped from 48% to 22% after Gmail spam filter update flagged subject line formatting.',
      metric: 'OPEN RATE DECAY: -54% | ATTRIBUTED REV DROP: -$4,800/WK',
      action: 'Revixa suggests subject line optimization and automated domain warmup schedule.'
    }
  };

  const tabs = document.querySelectorAll('.scenario-tab');
  const scenBadge = document.getElementById('scenBadge');
  const scenSeverity = document.getElementById('scenSeverity');
  const scenDiagnosis = document.getElementById('scenDiagnosis');
  const scenMetric = document.getElementById('scenMetric');
  const scenAction = document.getElementById('scenAction');
  const scenSimulateBtn = document.getElementById('scenSimulateBtn');
  const simFeedback = document.getElementById('simFeedback');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const scenKey = tab.getAttribute('data-scenario');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const data = scenarioData[scenKey];
      if (data) {
        scenBadge.textContent = data.badge;
        scenSeverity.textContent = data.severity;
        scenDiagnosis.textContent = data.diagnosis;
        scenMetric.textContent = data.metric;
        scenAction.textContent = data.action;
        simFeedback.textContent = 'Click to test instant resolution';
        scenSimulateBtn.disabled = false;
        scenSimulateBtn.textContent = 'Simulate Auto-Fix';
      }
    });
  });

  if (scenSimulateBtn) {
    scenSimulateBtn.addEventListener('click', () => {
      scenSimulateBtn.textContent = '✓ Executing Revixa Rule...';
      setTimeout(() => {
        scenSimulateBtn.textContent = '✓ Resolution Active';
        scenSimulateBtn.disabled = true;
        simFeedback.textContent = 'Fix applied in 120ms. Telemetry updated.';
        simFeedback.style.color = 'var(--accent-green)';
      }, 400);
    });
  }
}

/* ==========================================================================
   6. ROI CALCULATOR LOGIC
   ========================================================================== */
function initRoiCalculator() {
  const revSlider = document.getElementById('monthlyRevSlider');
  const adSpendSlider = document.getElementById('monthlyAdSpendSlider');
  const teamSlider = document.getElementById('teamSizeSlider');

  const revDisplay = document.getElementById('revDisplay');
  const adSpendDisplay = document.getElementById('adSpendDisplay');
  const teamDisplay = document.getElementById('teamDisplay');

  const resHours = document.getElementById('resHours');
  const resRevProtected = document.getElementById('resRevProtected');
  const resAdEfficiency = document.getElementById('resAdEfficiency');

  if (!revSlider) return;

  function updateCalculator() {
    const revVal = parseInt(revSlider.value);
    const adSpendVal = parseInt(adSpendSlider.value);
    const teamVal = parseInt(teamSlider.value);

    revDisplay.textContent = `$${revVal.toLocaleString()}`;
    adSpendDisplay.textContent = `$${adSpendVal.toLocaleString()}`;
    teamDisplay.textContent = `${teamVal} Team Member${teamVal > 1 ? 's' : ''}`;

    // Calculations based on Revixa efficiency metrics
    const hoursSaved = teamVal * 104; // 2 hours/week per operator saved
    const revProtected = Math.round(revVal * 0.17); // 17% stockout & conversion loss prevention
    const adWasteEliminated = Math.round(adSpendVal * 0.15 * 12); // 15% ad waste reduction per year

    resHours.textContent = `${hoursSaved} Hours`;
    resRevProtected.textContent = `$${revProtected.toLocaleString()}`;
    resAdEfficiency.textContent = `+$${adWasteEliminated.toLocaleString()}`;
  }

  revSlider.addEventListener('input', updateCalculator);
  adSpendSlider.addEventListener('input', updateCalculator);
  teamSlider.addEventListener('input', updateCalculator);

  updateCalculator();
}

/* ==========================================================================
   7. COMMAND PALETTE (⌘K)
   ========================================================================== */
function initCommandPalette() {
  const cmdTrigger = document.getElementById('cmdTrigger');
  const cmdModal = document.getElementById('cmdModal');
  const cmdInput = document.getElementById('cmdInput');
  const cmdItems = document.querySelectorAll('.cmd-item');

  if (!cmdModal) return;

  function openPalette() {
    cmdModal.classList.add('active');
    cmdModal.setAttribute('aria-hidden', 'false');
    cmdInput.focus();
  }

  function closePalette() {
    cmdModal.classList.remove('active');
    cmdModal.setAttribute('aria-hidden', 'true');
  }

  cmdTrigger.addEventListener('click', openPalette);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      cmdModal.classList.contains('active') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape' && cmdModal.classList.contains('active')) {
      closePalette();
    }
  });

  cmdModal.addEventListener('click', (e) => {
    if (e.target === cmdModal) closePalette();
  });

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closePalette();
      if (action === 'brief') {
        document.getElementById('dashboardHero').scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'calc') {
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   8. WAITLIST FORM HANDLING
   ========================================================================== */
function initWaitlistForm() {
  const waitlistForm = document.getElementById('waitlistForm');
  const submitBtn = document.getElementById('submitWaitlistBtn');
  const successMsg = document.getElementById('formSuccessMsg');

  if (!waitlistForm) return;

  submitBtn.addEventListener('click', () => {
    const emailInput = document.getElementById('userEmail');
    if (emailInput && emailInput.value.includes('@')) {
      submitBtn.textContent = 'Processing...';
      setTimeout(() => {
        waitlistForm.style.display = 'none';
        successMsg.classList.add('active');
      }, 500);
    }
  });
}
