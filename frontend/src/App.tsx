import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Activity, BrainCircuit, FileCheck2, Lock, RefreshCw, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';
import { apiRequest } from './api';
import { formatValue, toneForRisk } from './lib/viewModel';

type RecordItem = Record<string, unknown> & { id: string };
type Metrics = { kpis: Record<string, number> };
type DomainResult = Record<string, unknown> & { reasonCodes?: string[]; explanation?: string };

const roles = [
  "ADMIN",
  "TRUST_MODERATOR",
  "SELLER_ANALYST",
  "DISPUTE_AGENT",
  "VIEWER"
];
const primaryColumns = [
  "claimantName",
  "sellerVpa",
  "amount",
  "status",
  "riskScore"
];
const fallbackPrimary = [
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
];
const fallbackSecondary = [
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
];
const domainPayload = {
  "templateConfidence": 0.52,
  "qrVpaMatches": false,
  "utrFormatValid": false,
  "imageTamperScore": 0.73,
  "duplicateScore": 0.68,
  "sellerTrustScore": 0.36,
  "bankConfirmationPresent": false
};
const createPayload = {
  "claimantName": "Instagram Seller Case",
  "sellerVpa": "claim-store@upi",
  "amount": 2199,
  "status": "TAMPERED",
  "riskScore": 84
};

export default function App() {
  const [role, setRole] = useState('TRUST_MODERATOR');
  const [primary, setPrimary] = useState<RecordItem[]>(fallbackPrimary);
  const [secondary, setSecondary] = useState<RecordItem[]>(fallbackSecondary);
  const [metrics, setMetrics] = useState<Metrics>({ kpis: { primaryRecords: fallbackPrimary.length, secondaryRecords: fallbackSecondary.length, totalAmount: 0, averageRisk: 0 } });
  const [result, setResult] = useState<DomainResult | null>(null);
  const [error, setError] = useState('');
  const riskyCount = useMemo(() => primary.filter((item) => Number(item.riskScore || item.impulseScore || 0) >= 70).length, [primary]);

  async function load() {
    try {
      const [nextMetrics, nextPrimary, nextSecondary] = await Promise.all([
        apiRequest<Metrics>('/metrics', role),
        apiRequest<RecordItem[]>('/proof-checks', role),
        apiRequest<RecordItem[]>('/seller-profiles', role)
      ]);
      setMetrics(nextMetrics);
      setPrimary(nextPrimary);
      setSecondary(nextSecondary);
      setError('');
    } catch {
      setError('API offline: showing synthetic portfolio data.');
    }
  }

  useEffect(() => {
    void load();
  }, [role]);

  async function runDecision() {
    const response = await apiRequest<DomainResult>('/proof-verification', role, { method: 'POST', body: JSON.stringify(domainPayload) });
    setResult(response);
  }

  async function createRecord() {
    const created = await apiRequest<RecordItem>('/proof-checks', role, { method: 'POST', body: JSON.stringify(createPayload) });
    setPrimary([created, ...primary]);
  }

  async function removeRecord(id: string) {
    await apiRequest<void>('/proof-checks/' + id, role, { method: 'DELETE' });
    setPrimary(primary.filter((item) => item.id !== id));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><img src="/logo.svg" alt="" /><span>UPI Social Proof Ledger</span></div>
        {['Command Center', 'Payment Proof Checks', 'Seller Trust Profiles', 'Risk Review', 'Audit Trail', 'Reports'].map((item, index) => (
          <button className={index === 0 ? 'nav-item active' : 'nav-item'} key={item}><ShieldCheck size={16} />{item}</button>
        ))}
        <div className="region-card"><span>Mode</span><strong>UPI simulator</strong><small>Synthetic data only</small></div>
      </aside>
      <main>
        <header className="topbar">
          <div>
            <h1>AI verification layer for payment claims, fake screenshots, QR trust, and social-commerce proof.</h1>
            <p>A privacy-preserving proof layer that simulates receipt forensics, QR/VPA matching, duplicate proof detection, seller trust scoring, and dispute-ready GenAI explanations for social commerce.</p>
          </div>
          <div className="top-actions">
            <span className="live-dot">Live</span>
            <select value={role} onChange={(event) => setRole(event.target.value)}>{roles.map((item) => <option key={item}>{item}</option>)}</select>
            <button onClick={load}><RefreshCw size={16} />Refresh</button>
          </div>
        </header>
        {error ? <div className="notice">{error}</div> : null}
        <section className="kpi-grid">
          <Metric title="Payment Proof Checks" value={String(metrics.kpis.primaryRecords ?? primary.length)} detail="operational records" icon={<Activity />} />
          <Metric title="Seller Trust Profiles" value={String(metrics.kpis.secondaryRecords ?? secondary.length)} detail="policy and trust memory" icon={<FileCheck2 />} />
          <Metric title="Risk Watch" value={String(riskyCount)} detail="high-friction cases" icon={<BrainCircuit />} />
          <Metric title="Avg Risk" value={String(metrics.kpis.averageRisk ?? 0)} detail="synthetic model signal" icon={<Lock />} />
        </section>
        <section className="workspace-grid">
          <div className="panel span-two">
            <div className="panel-title"><Sparkles size={18} /> Proof Status</div>
            <div className="simulator-row">
              <button onClick={runDecision}><Sparkles size={16} />Verify Proof</button>
              <button onClick={createRecord}><Activity size={16} />Create Record</button>
            </div>
            <div className="recommendation-card">
              <div><span>Decision</span><strong>{String(result?.decision || result?.status || 'Run simulator')}</strong></div>
              <div><span>Risk</span><strong>{String(result?.riskScore || result?.impulseScore || 0)}</strong></div>
              <p>{String(result?.explanation || 'The model evaluates synthetic signals and returns reason codes for a review-ready decision.')}</p>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title"><ShieldCheck size={18} /> Reason Codes</div>
            {(result?.reasonCodes || ['READY_FOR_SIMULATION', 'RBAC_ENABLED', 'SYNTHETIC_ONLY']).map((code) => <div className="node-row" key={code}><strong>{code}</strong><span>Explainability signal</span></div>)}
          </div>
          <div className="panel span-three">
            <div className="panel-title"><Lock size={18} /> Payment Proof Checks CRUD</div>
            <div className="table">
              <div className="table-row header">{primaryColumns.map((column) => <span key={column}>{column}</span>)}<span>Action</span></div>
              {primary.map((item) => {
                const risk = Number(item.riskScore || item.impulseScore || 0);
                return (
                  <div className="table-row" key={item.id}>
                    {primaryColumns.map((column) => <span className={/risk|impulse/i.test(column) ? 'status ' + toneForRisk(risk) : ''} key={column}>{formatValue(column, item[column])}</span>)}
                    <span><button className="icon-button" onClick={() => void removeRecord(item.id)}><Trash2 size={15} /></button></span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="panel span-three">
            <div className="panel-title"><FileCheck2 size={18} /> Seller Trust Profiles</div>
            <div className="secondary-grid">{secondary.map((item) => <div className="case-card" key={item.id}>{Object.entries(item).filter(([key]) => !['id', 'createdAt'].includes(key)).slice(0, 4).map(([key, value]) => <p key={key}><strong>{key}</strong>: {formatValue(key, value)}</p>)}</div>)}</div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: ReactNode }) {
  return <div className="metric-card"><div>{icon}</div><span>{title}</span><strong>{value}</strong><small>{detail}</small></div>;
}

