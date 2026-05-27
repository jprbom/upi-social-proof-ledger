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
});

