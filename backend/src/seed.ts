export type DatabaseShape = {
  proofChecks: Record<string, unknown>[];
  sellerProfiles: Record<string, unknown>[];
};

export const seed: DatabaseShape = {
  proofChecks: [
  {
    "id": "proof_001",
    "claimantName": "Home baker order",
    "sellerVpa": "sweetlane@upi",
    "amount": 850,
    "status": "VERIFIED",
    "riskScore": 12,
    "createdAt": "2026-05-27T11:30:00.000Z"
  },
  {
    "id": "proof_002",
    "claimantName": "Instagram seller dispute",
    "sellerVpa": "claim-store@upi",
    "amount": 2199,
    "status": "TAMPERED",
    "riskScore": 84,
    "createdAt": "2026-05-27T11:34:00.000Z"
  },
  {
    "id": "proof_003",
    "claimantName": "QR mismatch case",
    "sellerVpa": "eventpass@upi",
    "amount": 1250,
    "status": "QR_MISMATCH",
    "riskScore": 76,
    "createdAt": "2026-05-27T11:38:00.000Z"
  }
],
  sellerProfiles: [
  {
    "id": "seller_001",
    "sellerName": "Sweet Lane Bakery",
    "vpa": "sweetlane@upi",
    "trustScore": 91,
    "verifiedClaims": 141,
    "disputes": 2,
    "createdAt": "2026-05-27T10:10:00.000Z"
  },
  {
    "id": "seller_002",
    "sellerName": "Claim Store",
    "vpa": "claim-store@upi",
    "trustScore": 38,
    "verifiedClaims": 4,
    "disputes": 9,
    "createdAt": "2026-05-27T10:15:00.000Z"
  }
]
};

