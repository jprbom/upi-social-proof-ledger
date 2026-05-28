import type { Express } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { requirePermission } from './auth.js';
import type { JsonDatabase } from './db.js';
import { verifySocialProof } from './engine.js';
import { proofCheckInputSchema, sellerProfileInputSchema, proofVerificationInputSchema } from './schemas.js';
import { buildMockUpiResponse, mockUpiRailRequestSchema } from './mockUpi.js';

const collections = [
  { route: 'proof-checks', key: 'proofChecks', schema: proofCheckInputSchema, prefix: 'proof_' },
  { route: 'seller-profiles', key: 'sellerProfiles', schema: sellerProfileInputSchema, prefix: 'selle_' }
] as const;

const nonEmptyPatch = (schema: z.ZodObject<any>) =>
  schema.partial().refine((value) => Object.keys(value).length > 0, 'Patch must contain at least one field.');

export function registerRoutes(app: Express, db: JsonDatabase) {
  app.get('/api/metrics', requirePermission('read'), async (_req, res, next) => {
    try {
      const primary = await db.list('proofChecks');
      const secondary = await db.list('sellerProfiles');
      const totalAmount = primary.reduce((sum, item) => sum + Number(item.amount || item.maxAmount || item.thresholdAmount || 0), 0);
      const averageRisk = Math.round(primary.reduce((sum, item) => sum + Number(item.riskScore || item.impulseScore || 0), 0) / Math.max(primary.length, 1));
      res.json({
        kpis: {
          primaryRecords: primary.length,
          secondaryRecords: secondary.length,
          totalAmount,
          averageRisk
        },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  });

  for (const collection of collections) {
    app.get('/api/' + collection.route, requirePermission('read'), async (_req, res, next) => {
      try { res.json(await db.list(collection.key)); } catch (error) { next(error); }
    });

    app.post('/api/' + collection.route, requirePermission('write'), async (req, res, next) => {
      try {
        const body = collection.schema.parse(req.body);
        const item = { id: collection.prefix + randomUUID(), createdAt: new Date().toISOString(), ...body };
        res.status(201).json(await db.create(collection.key, item));
      } catch (error) { next(error); }
    });

    app.patch('/api/' + collection.route + '/:id', requirePermission('write'), async (req, res, next) => {
      try {
        const patch = nonEmptyPatch(collection.schema).parse(req.body);
        res.json(await db.update(collection.key, String(req.params.id), patch));
      } catch (error) { next(error); }
    });

    app.delete('/api/' + collection.route + '/:id', requirePermission('admin'), async (req, res, next) => {
      try {
        await db.delete(collection.key, String(req.params.id));
        res.status(204).send();
      } catch (error) { next(error); }
    });
  }

  app.post('/api/proof-verification', requirePermission('read'), (req, res, next) => {
    try {
      res.json(verifySocialProof(proofVerificationInputSchema.parse(req.body)));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mock-upi', requirePermission('read'), (req, res, next) => {
    try {
      const body = mockUpiRailRequestSchema.parse(req.body);
      res.json(buildMockUpiResponse(body));
    } catch (error) {
      next(error);
    }
  });

}
