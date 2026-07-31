/**
 * REVIXA — RAW MOCK DATABASE (VERSIONED SCENARIO STORIES)
 * d:/f/src/data/mock-db.js
 * 
 * Central mock database containing datasets for story_001 through story_004.
 * ONLY imported by mock-api.js.
 */

export const MOCK_STORIES = {
  story_001: {
    id: "story_001",
    title: "Meta Creative #12 Win & SKU-881 Stockout Risk",
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
      root_cause: "Meta target shift toward high-AOV demographic (Ages 28-44) combined with mobile speed gain (+400ms faster).",
      evidence: [
        "Meta Creative #12 generated 64% of new conversions",
        "Safari Mobile load time decreased from 1.4s to 1.0s",
        "Cart-to-checkout conversion improved from 2.8% to 3.42%"
      ],
      recommendation: "Restock Silk Blazer SKU #881 immediately & scale Meta Creative #12 budget by +$750/day.",
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
        desc: "Warehouse stock at 42 units (5.2 days remaining). Submit expedited PO to Italian supplier."
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
    ],
    forecast: {
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
    },
    products: [
      { name: "Silk Executive Blazer", sku: "SKU #881", revenue: 48200, margin: 68.4, days_left: 5.2, status: "risk", run_rate: "8.1 units/day" },
      { name: "Cashmere Crewneck Sweater", sku: "SKU #104", revenue: 32400, margin: 74.2, days_left: 42.8, status: "healthy", run_rate: "2.4 units/day" },
      { name: "Slim Linen Trouser", sku: "SKU #410", revenue: 18900, margin: 61.0, days_left: 30.6, status: "monitor", run_rate: "4.0 units/day" }
    ],
    marketing: [
      { channel: "META ADS", spend: 32400, roas: "3.4x", cpa: 38.20, note: "Creative #12 driving 64% of orders" },
      { channel: "GOOGLE SEARCH", spend: 14200, roas: "1.8x", cpa: 64.10, note: "Competitor bid inflation on keyword 'luxury blazer'" },
      { channel: "KLAVIYO EMAIL", spend: 28900, roas: "14.2x", cpa: 4.10, note: "VIP Welcome flow open rate at 42.1%" }
    ],
    customers: {
      ltv_60d: 210.40,
      repeat_rate_90d: 34.2,
      top_segment: "Female Ages 28-44 (AOV $185)",
      insight: "60-Day Customer LTV grew +14% to $210.40 driven by female demographic 28-44."
    },
    settings: {
      shopify_status: "Connected (Shopify Plus)",
      meta_status: "Connected (Ad Account #4829)",
      ga4_status: "Connected (GA4 ID #9021)",
      margin_guardrail: "55% Gross Margin Floor"
    }
  },

  story_002: {
    id: "story_002",
    title: "Google Search CPC Spike & CPA Threshold Alert",
    store_name: "L'ÉLÉGANCE PARIS",
    tier: "SHOPIFY PLUS",
    kpis: {
      revenue: 162000,
      revenue_growth: -4.2,
      revenue_diff: -7100,
      orders: 1090,
      orders_growth: -3.1,
      conversion_rate: 3.10,
      conversion_diff: -0.40,
      inventory_risk_days: 18.0
    },
    ai_insight: {
      observation: "Ad spend efficiency dropped 14.8% due to bid inflation on Google Search.",
      root_cause: "Competitor bid surge on keyword 'luxury blazer' raised Google CPA from $38 to $84.10.",
      evidence: [
        "Google Search CPA reached $84.10 (+121%)",
        "Google Search ROAS dropped from 3.1x down to 1.4x",
        "Meta Ads maintaining stable 3.2x ROAS"
      ],
      recommendation: "Reallocate $2,400/day from Google Search into Meta Creative #12.",
      expected_impact: "Save +$12,800 in wasted ad spend and restore overall gross margin to 66%.",
      confidence_score: 94.1
    },
    priorities: [
      {
        id: "p1",
        title: "Pause High-CPA Google Keywords",
        level: "high",
        type: "Ad Spend Waste",
        impact_type: "loss",
        value: 12800,
        action: "google_pause",
        desc: "Pause keyword 'luxury blazer' where CPA exceeded $80 floor threshold."
      }
    ],
    forecast: {
      expected_revenue: 710000,
      growth_yoy: 12,
      likelihood: "Moderate (88.4%)",
      primary_risk: "Google CPA Surge",
      recommended_action: "Reallocate Google Spend to Meta",
      timeline: [
        { day: "Day 1-7", status: "Google CPA at $84.10" },
        { day: "Day 8", status: "Reallocation Execution" }
      ]
    },
    products: [
      { name: "Silk Executive Blazer", sku: "SKU #881", revenue: 42000, margin: 68.4, days_left: 18.0, status: "healthy", run_rate: "4.2 units/day" },
      { name: "Cashmere Crewneck Sweater", sku: "SKU #104", revenue: 28000, margin: 74.2, days_left: 35.0, status: "healthy", run_rate: "1.8 units/day" }
    ],
    marketing: [
      { channel: "META ADS", spend: 34000, roas: "3.2x", cpa: 39.50, note: "Stable efficiency" },
      { channel: "GOOGLE SEARCH", spend: 18500, roas: "1.4x", cpa: 84.10, note: "CPA alert: Exceeded $80 limit" },
      { channel: "KLAVIYO EMAIL", spend: 22000, roas: "12.8x", cpa: 4.50, note: "Consistent revenue" }
    ],
    customers: {
      ltv_60d: 195.20,
      repeat_rate_90d: 31.0,
      top_segment: "Google Search High-Intent (AOV $160)",
      insight: "Google Search buyers exhibit lower 60-day retention compared to Meta buyers."
    },
    settings: {
      shopify_status: "Connected (Shopify Plus)",
      meta_status: "Connected (Ad Account #4829)",
      ga4_status: "Connected (GA4 ID #9021)",
      margin_guardrail: "55% Gross Margin Floor"
    }
  },

  story_003: {
    id: "story_003",
    title: "Mobile Speed Optimization & Conversion Surge",
    store_name: "L'ÉLÉGANCE PARIS",
    tier: "SHOPIFY PLUS",
    kpis: {
      revenue: 210500,
      revenue_growth: 24.2,
      revenue_diff: 41000,
      orders: 1450,
      orders_growth: 18.9,
      conversion_rate: 4.20,
      conversion_diff: 0.98,
      inventory_risk_days: 12.4
    },
    ai_insight: {
      observation: "Mobile checkout completion rate increased +34% following store speed optimization.",
      root_cause: "Safari mobile LCP load time improved from 1.8s to 0.9s across product detail pages.",
      evidence: [
        "Mobile conversion rate reached 4.20% (+0.98%)",
        "Mobile cart abandonment dropped from 68% to 51%",
        "Blended ROAS increased to 4.1x"
      ],
      recommendation: "Increase overall paid social traffic budget by +15% to leverage higher mobile conversion rates.",
      expected_impact: "Capture additional +$28,500 monthly recurring net profit.",
      confidence_score: 97.8
    },
    priorities: [
      {
        id: "p1",
        title: "Scale Top-of-Funnel Social Ads",
        level: "medium",
        type: "Traffic Scale",
        impact_type: "gain",
        value: 28500,
        action: "scale_social",
        desc: "Increase ad spend across top-performing Instagram Video creatives."
      }
    ],
    forecast: {
      expected_revenue: 890000,
      growth_yoy: 31,
      likelihood: "Very High (97.1%)",
      primary_risk: "None",
      recommended_action: "Maintain Ad Scaling",
      timeline: [
        { day: "Day 1-30", status: "Conversion Rate Steady at 4.2%" }
      ]
    },
    products: [
      { name: "Silk Executive Blazer", sku: "SKU #881", revenue: 54000, margin: 68.4, days_left: 12.4, status: "monitor", run_rate: "6.0 units/day" },
      { name: "Cashmere Crewneck Sweater", sku: "SKU #104", revenue: 41000, margin: 74.2, days_left: 28.0, status: "healthy", run_rate: "3.1 units/day" }
    ],
    marketing: [
      { channel: "META ADS", spend: 41000, roas: "4.1x", cpa: 31.00, note: "Mobile conversion surge" },
      { channel: "GOOGLE SEARCH", spend: 12000, roas: "2.9x", cpa: 42.00, note: "Steady performance" },
      { channel: "KLAVIYO EMAIL", spend: 31000, roas: "16.4x", cpa: 3.80, note: "High repeat purchases" }
    ],
    customers: {
      ltv_60d: 235.00,
      repeat_rate_90d: 38.5,
      top_segment: "Mobile Safari Shoppers (AOV $205)",
      insight: "Mobile customer cohorts show 38.5% repeat purchase rate within 90 days."
    },
    settings: {
      shopify_status: "Connected (Shopify Plus)",
      meta_status: "Connected (Ad Account #4829)",
      ga4_status: "Connected (GA4 ID #9021)",
      margin_guardrail: "55% Gross Margin Floor"
    }
  },

  story_004: {
    id: "story_004",
    title: "Email Deliverability Dip & VIP Flow Drop",
    store_name: "L'ÉLÉGANCE PARIS",
    tier: "SHOPIFY PLUS",
    kpis: {
      revenue: 148000,
      revenue_growth: -9.5,
      revenue_diff: -15500,
      orders: 980,
      orders_growth: -7.4,
      conversion_rate: 2.90,
      conversion_diff: -0.50,
      inventory_risk_days: 24.0
    },
    ai_insight: {
      observation: "Email revenue dropped 28% due to a sudden decline in Klaviyo inbox deliverability.",
      root_cause: "SPF/DKIM domain verification failure led to 18% of VIP flow emails landing in Spam folders.",
      evidence: [
        "Klaviyo VIP Welcome Flow open rate dropped from 42% to 19%",
        "Attributed email revenue fell by -$15,500 this week",
        "Direct domain reputation score degraded to 72/100"
      ],
      recommendation: "Re-authenticate DMARC/DKIM DNS records & pause cold email broadcasts immediately.",
      expected_impact: "Recover -$15,500 in weekly email revenue and restore domain reputation to 98/100.",
      confidence_score: 95.4
    },
    priorities: [
      {
        id: "p1",
        title: "Re-authenticate Klaviyo DNS Records",
        level: "high",
        type: "Email Deliverability",
        impact_type: "loss",
        value: 15500,
        action: "fix_dns",
        desc: "Update DKIM & SPF records on DNS provider to resolve Gmail spam filtering."
      }
    ],
    forecast: {
      expected_revenue: 640000,
      growth_yoy: 4,
      likelihood: "Moderate (84.0%)",
      primary_risk: "Domain Reputation Drop",
      recommended_action: "Fix DNS Records",
      timeline: [
        { day: "Day 1-3", status: "DNS Update & Verification" },
        { day: "Day 4-7", status: "Deliverability Recovery" }
      ]
    },
    products: [
      { name: "Silk Executive Blazer", sku: "SKU #881", revenue: 38000, margin: 68.4, days_left: 24.0, status: "healthy", run_rate: "3.0 units/day" },
      { name: "Cashmere Crewneck Sweater", sku: "SKU #104", revenue: 24000, margin: 74.2, days_left: 45.0, status: "healthy", run_rate: "1.2 units/day" }
    ],
    marketing: [
      { channel: "META ADS", spend: 35000, roas: "3.0x", cpa: 42.00, note: "Stable performance" },
      { channel: "GOOGLE SEARCH", spend: 14000, roas: "2.1x", cpa: 58.00, note: "Steady performance" },
      { channel: "KLAVIYO EMAIL", spend: 18000, roas: "7.2x", cpa: 12.10, note: "Deliverability alert: 18% in Spam" }
    ],
    customers: {
      ltv_60d: 178.00,
      repeat_rate_90d: 26.4,
      top_segment: "Email VIP Subscribers (AOV $170)",
      insight: "VIP retention impacted by email spam placements."
    },
    settings: {
      shopify_status: "Connected (Shopify Plus)",
      meta_status: "Connected (Ad Account #4829)",
      ga4_status: "Connected (GA4 ID #9021)",
      margin_guardrail: "55% Gross Margin Floor"
    }
  }
};

export const INITIAL_AUDIT_LOG = [
  { time: "12:43", text: "Forecast model updated (Monte Carlo simulation)", type: "sync" },
  { time: "12:41", text: "PO #881-A approved & sent to supplier", type: "action" },
  { time: "12:37", text: "Shopify inventory levels synced (42 units left)", type: "sync" },
  { time: "12:21", text: "Meta Ads campaign spend limit updated", type: "action" },
  { time: "12:17", text: "Gross margin guardrail set to 55% floor", type: "setting" }
];
