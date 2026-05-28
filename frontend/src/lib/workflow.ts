export type MockScenario = 'HAPPY_PATH' | 'DEGRADED_BANK' | 'BANK_TIMEOUT' | 'RISK_HOLD' | 'STEP_UP';

export type WorkflowTab = {
  id: string;
  label: string;
  description: string;
  cta: string;
  drillDown: string;
  apiFlow: string;
  mockScenario: MockScenario;
};

export const workflowTabs: WorkflowTab[] = [
  {
    "id": "overview",
    "label": "Proof Ledger",
    "description": "Payment claim truth layer for social commerce.",
    "cta": "Open Trust Ledger",
    "drillDown": "View proof status, disputes, and seller risk.",
    "apiFlow": "GET /metrics -> proof KPIs",
    "mockScenario": "STEP_UP"
  },
  {
    "id": "proofs",
    "label": "Proof Checks",
    "description": "Receipt, QR, SMS, UTR, and screenshot records.",
    "cta": "Create Proof Check",
    "drillDown": "Open proof drill-down and verification action.",
    "apiFlow": "CRUD /proof-checks",
    "mockScenario": "STEP_UP"
  },
  {
    "id": "sellers",
    "label": "Seller Trust",
    "description": "Seller VPA reputation, disputes, and verified claim history.",
    "cta": "Review Seller Profile",
    "drillDown": "Inspect seller graph and trust reasons.",
    "apiFlow": "CRUD /seller-profiles",
    "mockScenario": "HAPPY_PATH"
  },
  {
    "id": "forensics",
    "label": "Receipt Forensics",
    "description": "OCR, tamper score, duplicate hash, and template checks.",
    "cta": "Run Receipt AI",
    "drillDown": "Generate dispute-ready summary.",
    "apiFlow": "POST /proof-verification",
    "mockScenario": "RISK_HOLD"
  },
  {
    "id": "qr",
    "label": "QR Trust",
    "description": "QR VPA mismatch and merchant identity verification.",
    "cta": "Mock QR Callback",
    "drillDown": "View payee VPA, RRN, and risk reason.",
    "apiFlow": "POST /mock-upi",
    "mockScenario": "STEP_UP"
  },
  {
    "id": "disputes",
    "label": "Dispute Reports",
    "description": "Explainable buyer/seller dispute packet.",
    "cta": "Generate Dispute Summary",
    "drillDown": "Trace proof fields into final status.",
    "apiFlow": "Reason codes + report",
    "mockScenario": "RISK_HOLD"
  }
];

export function getWorkflowTab(id: string) {
  return workflowTabs.find((tab) => tab.id === id) ?? workflowTabs[0];
}

export function buildMockUpiRequest(tab: WorkflowTab, amount: number) {
  return {
    txnId: 'TXN-' + tab.id.toUpperCase() + '-' + Date.now().toString(36).toUpperCase(),
    payerVpa: 'demo.payer@oksbi',
    payeeVpa: 'upisocialproofledger@upi',
    amount,
    flow: tab.id.includes('qr') ? 'UPI_QR' : tab.id.includes('lite') ? 'UPI_LITE' : 'UPI_INTENT',
    purpose: 'UPI Social Proof Ledger ' + tab.label + ' sandbox payment',
    riskScore: tab.mockScenario === 'RISK_HOLD' ? 88 : tab.mockScenario === 'STEP_UP' ? 66 : 24,
    scenario: tab.mockScenario
  };
}
