import express, { Request, Response } from 'express';
import cors from 'cors';
import { INITIAL_RECONCILIATION_RECORDS } from '../src/data/mockReconciliation.js';
import { MOCK_COMPANIES } from '../src/data/mockCompanies.js';
import { MOCK_VENDORS, INITIAL_VENDOR_INVOICES } from '../src/data/mockVendors.js';
import { calculateReconciliationMetrics, generateReconciliationAgentThoughts } from '../src/services/reconciliationEngine.js';
import { runMonteCarloSimulation } from '../src/services/monteCarloEngine.js';
import { calculateTdsAndGst, compileForm26QReport } from '../src/services/taxComplianceEngine.js';
import { queryCfoCopilot } from '../src/services/cfoCopilotEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health check & System Meta
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Razorpay LedgerMind AI — Autonomous Finance Controller',
    track: 'Track 4: AI Finance Controller',
    company: 'Razorpay AI Buildathon 2026',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 2. Company & Ledger Profiles
app.get('/api/companies', (_req: Request, res: Response) => {
  res.json({ success: true, companies: MOCK_COMPANIES });
});

// 3. 3-Way Reconciliation Batch API (Evaluates 60-record Synthetic Batch)
app.get('/api/reconciliation/records', (_req: Request, res: Response) => {
  res.json({
    success: true,
    totalRecords: INITIAL_RECONCILIATION_RECORDS.length,
    records: INITIAL_RECONCILIATION_RECORDS,
  });
});

app.post('/api/reconciliation/run-batch', (req: Request, res: Response) => {
  const records = req.body.records || INITIAL_RECONCILIATION_RECORDS;
  const metrics = calculateReconciliationMetrics(records);
  const thoughtSteps = generateReconciliationAgentThoughts(records);

  res.json({
    success: true,
    evaluationBenchmark: {
      totalBatchSize: metrics.totalRecords,
      cleanMatchRatePercent: metrics.batchMatchRatePercent,
      throughputRecordsPerSec: metrics.throughputRecordsPerSec,
      reconciliationHealthScore: metrics.reconciliationHealthScore,
      variancesDetectedCount: metrics.discrepanciesCount,
      timingFloatCount: metrics.timingLagCount,
      honestUnresolvableExceptionsCount: metrics.unresolvableCount,
      honestUnresolvableExceptions: metrics.unresolvableExceptions,
    },
    metrics,
    agentThoughts: thoughtSteps,
    autoBalancingJournalBatch: {
      batchId: `JRN-2026-BATCH-${Date.now()}`,
      status: 'PRE_POSTED',
      totalBalancedEntries: metrics.discrepanciesCount,
    },
  });
});

// 4. Monte Carlo Treasury Simulation Engine
app.post('/api/treasury/simulate-runway', (req: Request, res: Response) => {
  const { totalCashINR, monthlyRevenueINR, monthlyBurnINR, scenario, projectionMonths, simulationRuns } = req.body;

  const result = runMonteCarloSimulation(
    totalCashINR || 42500000,
    monthlyRevenueINR || 12000000,
    monthlyBurnINR || 3200000,
    scenario || {
      id: 'default',
      name: 'Base Case',
      description: 'Default runway projection',
      headcountDelta: 0,
      avgMonthlyCtcPerHeadINR: 200000,
      monthlyRevenueGrowthPercent: 5,
      cloudSpendReductionPercent: 0,
      gatewayMdrRatePercent: 1.85,
      settlementTermsDays: 2,
      fundraiseAmountINR: 0,
      fundraiseExpectedMonth: 0,
    },
    projectionMonths || 24,
    simulationRuns || 1000
  );

  res.json({ success: true, simulation: result });
});

// 5. RazorpayX Vendor Payout & Statutory Tax API
app.get('/api/vendors', (_req: Request, res: Response) => {
  res.json({ success: true, vendors: MOCK_VENDORS, invoices: INITIAL_VENDOR_INVOICES });
});

app.post('/api/tax/calculate', (req: Request, res: Response) => {
  const { baseAmountINR, gstRatePercent, tdsSection, gstin, isIndividualContractor } = req.body;
  const result = calculateTdsAndGst(
    Number(baseAmountINR) || 0,
    Number(gstRatePercent) || 18,
    tdsSection || '194J_TECH',
    gstin,
    isIndividualContractor
  );
  res.json({ success: true, taxBreakdown: result });
});

app.get('/api/compliance/form26q', (_req: Request, res: Response) => {
  const report = compileForm26QReport(INITIAL_VENDOR_INVOICES);
  res.json({ success: true, form26Q: report });
});

// 6. Conversational CFO Intelligence Agent
app.post('/api/copilot/chat', (req: Request, res: Response) => {
  const { query, companyId } = req.body;
  const company = MOCK_COMPANIES.find(c => c.id === companyId) || MOCK_COMPANIES[0];

  const response = queryCfoCopilot(query || 'Summarize financial health', {
    company,
    reconciliationRecords: INITIAL_RECONCILIATION_RECORDS,
    vendorInvoices: INITIAL_VENDOR_INVOICES,
  });

  res.json({ success: true, response });
});

app.listen(PORT, () => {
  console.log(`⚡ Razorpay LedgerMind AI Backend Server listening on http://127.0.0.1:${PORT}`);
});
