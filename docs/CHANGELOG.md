# REVIXA CHANGELOG

## [v2.4.0] - 2026-07-31
### Added
- Created 10/10 Enterprise Engineering Architecture.
- Created `docs/` governance suite (`PRODUCT_RULES.md`, `SYSTEM_ARCHITECTURE.md`, `API_CONTRACT.md`, `DESIGN_SYSTEM.md`, `COMPONENT_GUIDELINES.md`, `ROADMAP.md`, `CHANGELOG.md`).
- Implemented `src/data/mock-db.js` raw datasets for 4 versioned scenario stories (`story_001` - `story_004`).
- Implemented `src/data/mock-api.js` async service abstraction layer with simulated latency (300ms-700ms).
- Implemented `src/store/app-store.js` unidirectional state store & role permissions (`Owner`, `Manager`, `Analyst`, `Viewer`).
- Added Fake AI Progressive Thinking Step (1s) to Decision Review Modal.
- Added 15-second Realtime Sync Ticker and Audit Log.
