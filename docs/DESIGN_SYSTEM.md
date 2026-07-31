# REVIXA DESIGN SYSTEM

Centralized design tokens, typography rules, component patterns, and motion standards.

## 1. Color Palette & Tokens

| Token | Hex / HSL | Application |
| :--- | :--- | :--- |
| `--bg-warm-white` | `#FAFAF8` | Canvas / Page Background |
| `--bg-surface` | `#FFFFFF` | Card & Panel Surfaces |
| `--bg-surface-subtle` | `#F4F4F0` | Subdued Card Inputs & Tables |
| `--border-subtle` | `#E5E5E0` | Hairline Grid & Divider Borders |
| `--text-primary` | `#111111` | Primary Headlines & Bold Telemetry |
| `--text-secondary` | `#555555` | Body Copy & Secondary Labels |
| `--text-muted` | `#888888` | Metadata Tags & Captions |
| `--accent-blue` | `#2563EB` | Intelligence Primary Accent |
| `--accent-green` | `#16A34A` | Profit Gain & Positive Impact |
| `--accent-amber` | `#D97706` | Monitoring Alert & Warnings |
| `--accent-red` | `#DC2626` | Critical Stockout & Financial Risk |

---

## 2. Typography Rules
- **Sans-Serif (`Inter`)**: Headings, UI labels, body text, button copy.
- **Monospace (`JetBrains Mono`)**: Telemetry metrics, confidence ratings, timestamps, SKU IDs, status pills.

---

## 3. Motion System Standards
- **Standard Transition**: `150ms cubic-bezier(0.16, 1, 0.3, 1)` (crisp, enterprise SaaS feel).
- **Page View Fade**: `180ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Glassmorphism Restriction**: Prohibited on core content cards. Limited strictly to `backdrop-filter: blur(8px)` on the sticky header and modal overlays.
