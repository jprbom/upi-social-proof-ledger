import { z } from 'zod';

export const proofCheckInputSchema = z.object({
  claimantName: z.string().min(3),
  sellerVpa: z.string().min(3),
  amount: z.number().positive().max(500000),
  status: z.enum(['VERIFIED', 'LIKELY_GENUINE', 'TAMPERED', 'REUSED', 'QR_MISMATCH', 'NEEDS_BANK_CONFIRMATION']),
  riskScore: z.number().min(0).max(100)
});

export const sellerProfileInputSchema = z.object({
  sellerName: z.string().min(3),
  vpa: z.string().min(3),
  trustScore: z.number().min(0).max(100),
  verifiedClaims: z.number().int().nonnegative(),
  disputes: z.number().int().nonnegative()
});

export const proofVerificationInputSchema = z.object({
  templateConfidence: z.number().min(0).max(1),
  qrVpaMatches: z.boolean(),
  utrFormatValid: z.boolean(),
  imageTamperScore: z.number().min(0).max(1),
  duplicateScore: z.number().min(0).max(1),
  sellerTrustScore: z.number().min(0).max(1),
  bankConfirmationPresent: z.boolean()
});

export type ProofVerificationInput = z.infer<typeof proofVerificationInputSchema>;

