# Architecture

UPI Social Proof Ledger uses a split React and Express architecture with a public-safe payment ecosystem simulator that creates a synthetic truth ledger for proof verification demos.

## Components

- React dashboard: RBAC role switcher, KPI cards, command panels, tables, CRUD actions, proof review, and Payment Ecosystem Timeline.
- Express API: health, metrics, CRUD, proof verification, signed demo auth, payment lifecycle, webhooks, refund, dispute, and reconciliation endpoints.
- RBAC middleware: signed local demo bearer tokens and role-to-permission mapping.
- JSON persistence: deterministic synthetic DB file for local demos.
- Domain engine: OCR confidence, QR/VPA match, UTR/RRN validity, tamper score, seller trust, and dispute reason-code simulator.
- Payment ecosystem simulator: PG, PA, TPAP, PSP/bank, and NPCI-style rail adapters with truth-ledger comparison hooks.
- AIML/DL artifacts: 10,000-row synthetic training harness with model card, metrics, and feature importance.

## Runtime Ports

- Backend: 4105
- Frontend dev server: 5175
- Frontend preview server: 5105

