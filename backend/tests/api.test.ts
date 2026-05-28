import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createTestDatabase } from '../src/db.js';

describe('UPI Social Proof Ledger API', () => {
  it('returns an explainable domain decision', async () => {
    const app = createApp(createTestDatabase());
    const response = await request(app)
      .post('/api/proof-verification')
      .set('x-user-role', 'TRUST_MODERATOR')
      .send({
  "templateConfidence": 0.52,
  "qrVpaMatches": false,
  "utrFormatValid": false,
  "imageTamperScore": 0.73,
  "duplicateScore": 0.68,
  "sellerTrustScore": 0.36,
  "bankConfirmationPresent": false
});

    expect(response.status).toBe(200);
    expect(response.body.reasonCodes.length).toBeGreaterThan(0);
    expect(typeof response.body.explanation).toBe('string');
  });

  it('supports CRUD and protects delete through admin RBAC', async () => {
    const app = createApp(createTestDatabase());
    const forgedRole = await request(app)
      .post('/api/proof-checks')
      .set('x-user-role', 'UNKNOWN_ADMIN')
      .send({
  "claimantName": "Forged Role Case",
  "sellerVpa": "forged-seller@upi",
  "amount": 899,
  "status": "NEEDS_BANK_CONFIRMATION",
  "riskScore": 45
});

    expect(forgedRole.status).toBe(403);
    expect(forgedRole.body.role).toBe('VIEWER');

    const created = await request(app)
      .post('/api/proof-checks')
      .set('x-user-role', 'TRUST_MODERATOR')
      .send({
  "claimantName": "Instagram Seller Case",
  "sellerVpa": "claim-store@upi",
  "amount": 2199,
  "status": "TAMPERED",
  "riskScore": 84
});

    expect(created.status).toBe(201);
    expect(created.body.id).toBeTruthy();

    const denied = await request(app)
      .delete('/api/proof-checks/' + created.body.id)
      .set('x-user-role', 'TRUST_MODERATOR');
    expect(denied.status).toBe(403);

    const deleted = await request(app)
      .delete('/api/proof-checks/' + created.body.id)
      .set('x-user-role', 'ADMIN');
    expect(deleted.status).toBe(204);
  });

  it('returns NPCI-style mock UPI rail response for end-to-end demo flows', async () => {
    const app = createApp(createTestDatabase());
    const response = await request(app)
      .post('/api/mock-upi')
      .set('x-user-role', 'OPS_MANAGER')
      .send({
        txnId: 'TXN-DEMO-001',
        payerVpa: 'payer@oksbi',
        payeeVpa: 'merchant@upi',
        amount: 499,
        flow: 'UPI_INTENT',
        purpose: 'portfolio test flow',
        riskScore: 24,
        scenario: 'HAPPY_PATH'
      });

    expect(response.status).toBe(200);
    expect(response.body.gateway).toBe('NPCI_UPI_MOCK');
    expect(response.body.txnId).toBe('TXN-DEMO-001');
    expect(response.body.rrn).toMatch(/^RRN/);
    expect(response.body.risk.reasonCodes).toContain('SYNTHETIC_NPCI_SANDBOX');
    expect(response.body.settlement).toHaveProperty('preSettlementHold');
  });

});
