# UPI Social Proof Ledger Concept-Specific Diagrams

<p align="center">
  <img src="assets/hero.svg" width="100%" alt="UPI Social Proof Ledger hero diagram">
</p>

<p align="center">
  <img src="assets/system-map.svg" width="100%" alt="UPI Social Proof Ledger system map">
</p>

## Latest Enhancement Map

~~~mermaid
flowchart LR
  UI["Proof Timeline CTA"] --> AUTH["Signed Demo Token"]
  AUTH --> API["Express API"]
  API --> SIM["Payment Ecosystem Simulator"]
  SIM --> TRUTH["Synthetic Truth Ledger"]
  TRUTH --> VERIFY["Receipt / QR / RRN / Amount Checks"]
  VERIFY --> SUMMARY["Dispute-ready Summary"]
  SUMMARY --> UI
~~~

## Product Decision Flow

~~~mermaid
flowchart LR
  A["Proof Ledger"]:::start --> B["Proof Checks"]:::signal
  B --> C["Seller Trust"]:::model
  C --> D["Receipt Forensics"]:::decision
  D --> E["QR Trust"]:::output
  E --> F["Mock NPCI/UPI response + audit trail"]:::audit

  classDef start fill:#f8fafc,stroke:#334155,stroke-width:2px,color:#0f172a
  classDef signal fill:#ecfeff,stroke:#06b6d4,stroke-width:2px,color:#083344
  classDef model fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e1b4b
  classDef decision fill:#fff7ed,stroke:#0f766e,stroke-width:2px,color:#431407
  classDef output fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#052e16
  classDef audit fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#422006
~~~

## End-to-End API Flow

~~~mermaid
sequenceDiagram
  participant User as RBAC User
  participant UI as React Command Center
  participant API as Express API
  participant Model as Domain AI Engine
  participant Mock as Mock NPCI/UPI Rail
  participant DB as JSON Test DB
  User->>UI: Click tab, CTA, or row drill-down
  UI->>API: Request with signed demo bearer token
  API->>DB: Read/write synthetic records
  API->>Model: Score domain-specific risk or recommendation
  API->>Mock: Generate UPI-like response code, RRN, callback
  Mock-->>API: Sandbox response, no real money movement
  API-->>UI: Render decision, reason codes, and drill-down
~~~

## Payment Proof Verification Lifecycle

~~~mermaid
stateDiagram-v2
  [*] --> SIMULATED_PAYMENT_TRUTH
  SIMULATED_PAYMENT_TRUTH --> CLAIMED_PROOF
  CLAIMED_PROOF --> QR_VPA_CHECK
  QR_VPA_CHECK --> RRN_AMOUNT_CHECK
  RRN_AMOUNT_CHECK --> DUPLICATE_TAMPER_CHECK
  DUPLICATE_TAMPER_CHECK --> VERIFIED
  DUPLICATE_TAMPER_CHECK --> NEEDS_BANK_CONFIRMATION
  DUPLICATE_TAMPER_CHECK --> TAMPERED
~~~

## Deployment and SDLC View

~~~mermaid
flowchart TB
  Repo["Private GitHub repo"] --> CI["GitHub Actions: npm run verify"]
  CI --> Tests["Backend + frontend tests"]
  CI --> Audit["npm audit --audit-level=high"]
  Tests --> Runtime["Node 22 runtime"]
  Runtime --> Backend["Express API :4105"]
  Runtime --> Frontend["Vite preview :5105"]
  Backend --> Mock["/api/mock-upi NPCI sandbox"]
  Backend --> DB[("Synthetic JSON database")]
~~~
