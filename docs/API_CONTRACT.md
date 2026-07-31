# REVIXA API CONTRACTS

Fixed REST/GraphQL endpoints and JSON payloads. UI components consume these contracts via `mock-api.js`.

## 1. `GET /api/v1/dashboard?story_id={id}`
Returns core KPIs, primary AI insight hero brief, and today's priorities queue.

### Response Payload (200 OK)
```json
{
  "status": "success",
  "data": {
    "story_id": "story_001",
    "store_name": "L'ÉLÉGANCE PARIS",
    "kpis": {
      "revenue": 184250,
      "revenue_growth": 18.4,
      "revenue_diff": 28600,
      "orders": 1240,
      "orders_growth": 12.1,
      "conversion_rate": 3.84,
      "inventory_risk_days": 5.2
    },
    "ai_insight": {
      "observation": "Revenue increased +$28,600 (+18.4%) this week while total ad spend remained flat.",
      "root_cause": "Meta target shift toward high-AOV demographic (Ages 28-44) + mobile speed improvement (+400ms faster).",
      "evidence": [
        "Meta Creative #12 generated 64% of new conversions",
        "Safari Mobile load time decreased from 1.4s to 1.0s",
        "Cart-to-checkout conversion improved from 2.8% to 3.42%"
      ],
      "recommendation": "Restock Silk Blazer SKU #881 & scale Meta Creative #12 budget by +$750/day.",
      "expected_impact": "Prevent -$34,000 in lost stockout revenue & capture +$18,400 profit gain.",
      "confidence_score": 96.2
    },
    "priorities": [
      {
        "id": "p1",
        "title": "Restock Silk Blazer SKU #881",
        "level": "high",
        "impact_type": "loss",
        "value": 34000,
        "action": "po"
      },
      {
        "id": "p2",
        "title": "Scale Meta Creative #12 Budget",
        "level": "medium",
        "impact_type": "gain",
        "value": 18400,
        "action": "budget"
      }
    ]
  }
}
```

---

## 2. `POST /api/v1/actions/execute`
Executes an operational action (e.g., emergency PO, budget scale).

### Request Payload
```json
{
  "action_id": "po",
  "sku": "SKU-881",
  "quantity": 250
}
```

### Response Payload (200 OK)
```json
{
  "status": "executed",
  "po_number": "PO #881-A",
  "executed_at": "2026-07-31T12:00:00Z"
}
```

---

## 3. `GET /api/v1/forecast`
Returns 30-day narrative trajectory and SKU run-rate countdown table.

---

## 4. `GET /api/v1/activity-log`
Returns system audit log events.
