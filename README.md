<p align="center">
  <img src="frontend/public/logo.svg" width="96" alt="UPI Social Proof Ledger logo">
</p>

# UPI Social Proof Ledger

AI verification layer for payment claims, fake screenshots, QR trust, and social-commerce proof.

Author: Prashant Jagtap <jprbom@gmail.com>

## Portfolio Positioning

A privacy-preserving proof layer that simulates receipt forensics, QR/VPA matching, duplicate proof detection, seller trust scoring, and dispute-ready GenAI explanations for social commerce.

All payment, receipt, merchant, policy, and behavioral records are synthetic. The app does not connect to NPCI, banks, PSPs, UPI rails, account aggregators, or real user accounts.

## Highlights

- TypeScript Express backend with RBAC, Helmet, CORS controls, rate limiting, Zod validation, and JSON persistence.
- React and Vite frontend with role-aware operations dashboard, animated KPI panels, CRUD controls, and explanation surface.
- Domain endpoint at /api/proof-verification.
- CRUD for Payment Proof Checks and Seller Trust Profiles.
- Mermaid diagrams for architecture, DFD, deployment, integration, API flow, and RBAC.

## Run Locally

~~~bash
npm install
npm run dev:backend
npm run dev:frontend
~~~

Backend: http://127.0.0.1:4105

Frontend: http://127.0.0.1:5175

## Verify

~~~bash
npm run build
npm run test
npm run audit:high
~~~

## Repo Name

upi-social-proof-ledger

