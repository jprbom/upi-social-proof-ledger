# Prototype Audit Response

## Latest Audit Closure

The latest implementation adds signed demo-token RBAC, a five-adapter payment ecosystem simulator, HMAC webhook signing, duplicate and out-of-order webhook handling, refund/dispute/reconciliation APIs, a frontend Payment Ecosystem Timeline, 10,000-row synthetic AIML/DL artifacts, and expanded enterprise documentation.

## Honest Status

UPI Social Proof Ledger is a runnable portfolio-grade prototype, not a production receipt-forensics or bank-confirmation system. It demonstrates payment-proof risk decisioning, synthetic CRUD workflows, RBAC simulation, a mocked UPI/NPCI response, tests, CI, Docker packaging, and SDLC documentation.

It should be presented as: **a social-commerce payment-proof verification prototype using synthetic OCR/QR/tamper signals.**

It should not be presented as: **a real OCR, image-forensics, UTR-validation, or bank-confirmed proof platform.**

## What Is Real Today

- React dashboard with working tabs, CTAs, drill-downs, CRUD, and RBAC role selection.
- Express API with Zod validation, Helmet, rate limiting, CORS, and permission middleware.
- Domain endpoint for proof verification with reason codes and dispute-friendly explanation.
- Mock NPCI/UPI rail returning RRN, UPI request id, bank reference, response code, settlement state, risk decision, reason codes, and callback metadata.
- Local JSON persistence for demo review.
- Backend tests, frontend helper tests, local browser E2E smoke script, Docker files, and CI verify workflow.
- Python ML/DL training demonstration that creates a model-card artifact from synthetic data.

## Prototype Boundaries

- RBAC remains a simulator, but it now uses signed local demo bearer tokens and ignores forged `x-user-role`; production would still require OIDC/JWT, signed sessions, tenant isolation, KMS-backed secrets, and immutable audit logs.
- Current proof logic accepts precomputed OCR, QR, tamper, duplicate, and seller-trust signals; it does not yet perform real image processing.
- The ML script now generates 10,000 synthetic rows with train/test metrics, confusion matrix, model card, and feature importance. It remains synthetic and not statistically valid production image-forensics or receipt-fraud training.
- Persistence is JSON file storage, not an evidence vault, case store, or privacy-preserving proof ledger.
- The payment ecosystem simulator is fully mocked and does not connect to banks, PSPs, UTR confirmation APIs, chargeback systems, or dispute networks.

## Serious Upgrade Path

- Add screenshot upload, OCR extraction, QR decoding, and UTR format parsing.
- Add VPA/name mismatch checks, duplicate screenshot perceptual hashing, metadata checks, and compression/template mismatch heuristics.
- Add dispute evidence PDF export with masked fields and privacy-safe redaction.
- Add scenario tests for genuine receipt, edited receipt, reused screenshot, QR/VPA mismatch, and missing bank confirmation.
- Add seller reputation graph and proof-sharing controls for WhatsApp/Instagram commerce workflows.
