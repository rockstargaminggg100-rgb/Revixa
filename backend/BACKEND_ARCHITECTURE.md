# REVIXA BACKEND ARCHITECTURE & INTEGRATION SPECIFICATION

Technical architecture, repository pattern, authentication & RBAC flow, audit logging, database design, service layer, and future integrations.

---

## 1. Folder Structure (`backend/`)

```
backend/
├── prisma/
│   ├── schema.prisma             # PostgreSQL Prisma ORM Database Schema
│   └── seed.js                   # Database Seeding Script (Revixa Business Narrative)
├── src/
│   ├── config/
│   │   └── env.js                # Environment Variables Export & Configuration
│   ├── controllers/
│   │   ├── apiController.js      # REST API Controllers (Dashboard, Forecast, etc.)
│   │   └── authController.js     # JWT Registration, Login, Logout, /me Controllers
│   ├── database/
│   │   └── prisma.js             # Singleton Prisma Client Instance
│   ├── middleware/
│   │   ├── auth.js               # JWT Verification & RBAC Middleware
│   │   └── error.js              # Global Error Handling Middleware
│   ├── repositories/             # Repository Pattern Layer (Prisma Queries)
│   │   ├── AuditRepository.js
│   │   ├── CustomersRepository.js
│   │   ├── DashboardRepository.js
│   │   ├── ForecastRepository.js
│   │   ├── HealthRepository.js
│   │   ├── InsightsRepository.js
│   │   ├── MarketingRepository.js
│   │   ├── NotificationRepository.js
│   │   ├── OrganizationRepository.js
│   │   ├── ProductsRepository.js
│   │   ├── RecommendationRepository.js
│   │   ├── SettingsRepository.js
│   │   └── UserRepository.js
│   ├── routes/
│   │   ├── apiRoutes.js          # REST Endpoints matching API_CONTRACT.md
│   │   └── authRoutes.js         # Auth Endpoints (/auth/login, /auth/register, /auth/me, /auth/session)
│   ├── services/                 # Business Logic Service Layer
│   │   ├── auditService.js
│   │   ├── authService.js
│   │   ├── customerService.js
│   │   ├── dashboardService.js
│   │   ├── forecastService.js
│   │   ├── healthService.js
│   │   ├── marketingService.js
│   │   ├── notificationService.js
│   │   └── recommendationService.js
│   ├── utils/
│   │   └── response.js           # Standardized API Response Helpers
│   └── server.js                 # Express Application Server Entrypoint
├── .env.example                  # Environment Configuration Template
└── package.json                  # Node.js Project Dependencies
```

---

## 2. 100% Isolated Repository Pattern Layering

```
[HTTP Request]
     │
     ▼
[Controller Layer (authController.js / apiController.js)]
     │
     ▼
[Service Layer (authService.js / dashboardService.js)] ──► Business Logic (NO Prisma imports)
     │
     ▼
[Repository Layer (UserRepository.js / HealthRepository.js)] ──► Database Queries (ONLY layer using Prisma)
     │
     ▼
[Prisma ORM (prisma.js) & PostgreSQL DB]
```

- **100% Prisma Isolation**: Zero controllers, services, or middlewares import Prisma directly. All database access flows through `src/repositories/`.

---

## 3. Authentication & RBAC Flow (Phase 2.3)
- **POST `/auth/register`**: Validates input via Zod schema, verifies email uniqueness via `UserRepository`, hashes password securely via `bcryptjs`, creates Organization & User (`Owner` role), and issues signed JWT access token (`{ id, email, role, organizationId }`, 7-day expiry). Logs audit event.
- **POST `/auth/login`**: Verifies email, checks bcrypt password match, issues signed JWT token, logs audit event (and failed login attempts).
- **GET `/auth/me`**: Protected endpoint returning sanitized user profile (no password hash).
- **GET `/auth/session`**: Returns `{ authenticated: true, user }` or `{ authenticated: false }`.
- **Role Enforcement (RBAC)**:
  - **`Owner`**: Everything.
  - **`Manager`**: Recommendation approvals, dashboard, reporting.
  - **`Analyst`**: Read-only & exports.
  - **`Viewer`**: Read-only.

---

## 4. Automatic System Audit Logging
Events recorded in `AuditRepository`:
- User Registration (`USER_REGISTERED`)
- User Login (`USER_LOGIN`)
- User Logout (`USER_LOGOUT`)
- Failed Login (`LOGIN_FAILED`)
- Role Changes (`ROLE_UPDATED`)
- Action Approval (`ACTION_EXECUTED`)

---

## 5. Future Integration Roadmap

### Phase 2.4: Shopify OAuth & Sync Integration
- Connect Shopify OAuth 2.0 endpoint (`/api/v1/auth/shopify/callback`).
- Implement webhooks for `orders/create`, `inventory_levels/update`.

### Phase 2.5: OpenAI Neural Inference Pipeline
- Connect OpenAI API service for automated 6-step causal analysis generation.
