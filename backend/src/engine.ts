import type { ProofVerificationInput } from './schemas.js';

export function verifySocialProof(input: ProofVerificationInput) {
  let riskScore = 0;
  const reasonCodes: string[] = [];
  riskScore += (1 - input.templateConfidence) * 18;
  riskScore += input.imageTamperScore * 28;
  riskScore += input.duplicateScore * 18;
  riskScore += (1 - input.sellerTrustScore) * 16;
  if (!input.qrVpaMatches) { riskScore += 14; reasonCodes.push('QR_VPA_MISMATCH'); }
  if (!input.utrFormatValid) { riskScore += 12; reasonCodes.push('MALFORMED_UTR'); }
  if (!input.bankConfirmationPresent) { riskScore += 6; reasonCodes.push('NO_BANK_CONFIRMATION'); }
  if (input.imageTamperScore > 0.55) reasonCodes.push('IMAGE_TAMPER_SIGNAL');
  if (input.duplicateScore > 0.5) reasonCodes.push('DUPLICATE_PROOF_PATTERN');
  const finalRiskScore = Math.round(Math.min(100, riskScore));
  const status = finalRiskScore >= 80 ? 'TAMPERED' : finalRiskScore >= 65 ? 'QR_OR_RECEIPT_MISMATCH' : finalRiskScore >= 45 ? 'NEEDS_BANK_CONFIRMATION' : finalRiskScore >= 25 ? 'LIKELY_GENUINE' : 'VERIFIED';
  return {
    status,
    riskScore: finalRiskScore,
    reasonCodes,
    explanation: 'Proof status ' + status + ' based on receipt template confidence, tamper score, duplicate similarity, QR/VPA match, UTR format, and seller trust.'
  };
}
