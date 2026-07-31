# REVIXA SYSTEM ARCHITECTURE

Technical architecture, data flow, state management, OAuth sequence, and component hierarchy.

## 1. Directory & Layer Hierarchy

```
d:/f/
├── docs/                         # Architecture & Product Governance
├── index.html                    # Single Page Application Entrypoint Shell
├── style.css                     # Centralized Design System CSS Variables
├── app-shell.css                 # Application Shell & Component Layouts
└── src/
    ├── data/
    │   ├── mock-db.js            # Raw JSON Datasets (story_001 - story_004)
    │   └── mock-api.js           # Async API Service Layer (Simulated Latency)
    ├── store/
    │   └── app-store.js          # Unidirectional App State Store & Roles
    ├── services/
    │   ├── router.js             # Client-side SPA Router
    │   ├── event-bus.js          # Audit Trail & Realtime Ticker
    │   └── feature-flags.js      # Feature Flag Configuration
    └── app.js                    # Main Application Bootstrap
```

---

## 2. Unidirectional Data Flow

```
+------------------+     Async Call     +------------------+
|   mock-db.js     | -----------------> |   mock-api.js    |
| (Raw Story Data) |                    | (300-700ms Delay)|
+------------------+                    +------------------+
                                                 |
                                                 v
+------------------+   State Update     +------------------+
|  UI Components   | <----------------- |   app-store.js   |
| (View Rendering) |                    |   (App Store)    |
+------------------+                    +------------------+
```

---

## 3. Client-Side SPA Routing Specification
- `/` — Light Editorial Landing Page
- `/signup` & `/login` — Frictionless Sign Up / Sign In
- `/onboarding` — 4-Step Connect & Progressive Sync
- `/oauth` — Authentic Shopify OAuth Consent
- `/dashboard` — Executive Morning Brief & AI Hero
- `/insights` — Causal Attribution Feed
- `/forecast` — 30-Day Trajectory & Stockout Model
- `/products` — SKU Run-Rates & Margins
- `/marketing` — Channel Attribution Matrix
- `/customers` — Cohort Retention & LTV Curves
- `/settings` — Signal Connections & Profit Guardrails

---

## 4. Shopify OAuth Sequence

```
[Onboarding] -> [Click Connect] -> [1.5s Redirection State] -> [shopify-oauth.html] -> [Authorize] -> [Progressive Import] -> [/dashboard]
```

---

## 5. Enterprise Role Permissions Matrix

| Action | Owner | Manager | Analyst | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| **Approve PO Action** | ✓ | ✓ | ✕ | ✕ |
| **Scale Ad Budget** | ✓ | ✓ | ✕ | ✕ |
| **Export Data Brief** | ✓ | ✓ | ✓ | ✕ |
| **Read Dashboard** | ✓ | ✓ | ✓ | ✓ |
