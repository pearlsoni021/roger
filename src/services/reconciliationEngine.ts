import { ReconciliationRecord, MatchStatus } from '../types/finance';
import { AgentThoughtStep } from '../types/agent';

export interface ReconciliationSummary {
  totalRecords: number;
  matchedCount: number;
  discrepanciesCount: number;
  timingLagCount: number;
  totalGrossProcessedINR: number;
  totalBankSettledINR: number;
  totalMdrFeeDeductedINR: number;
  netVarianceINR: number;
  reconciliationHealthScore: number; // 0-100%
}

export function calculateReconciliationMetrics(records: ReconciliationRecord[]): ReconciliationSummary {
  const totalRecords = records.length;
  if (totalRecords === 0) {
    return {
      totalRecords: 0,
      matchedCount: 0,
      discrepanciesCount: 0,
      timingLagCount: 0,
      totalGrossProcessedINR: 0,
      totalBankSettledINR: 0,
      totalMdrFeeDeductedINR: 0,
      netVarianceINR: 0,
      reconciliationHealthScore: 100,
    };
  }

  const matchedCount = records.filter(r => r.status === 'MATCHED' || r.resolutionStatus === 'RESOLVED').length;
  const discrepanciesCount = records.filter(r => r.status !== 'MATCHED' && r.status !== 'TIMING_LAG' && r.resolutionStatus === 'PENDING').length;
  const timingLagCount = records.filter(r => r.status === 'TIMING_LAG').length;

  const totalGrossProcessedINR = records.reduce((acc, r) => acc + r.gatewayGrossINR, 0);
  const totalBankSettledINR = records.reduce((acc, r) => acc + r.bankCreditINR, 0);
  const totalMdrFeeDeductedINR = records.reduce((acc, r) => acc + r.gatewayMdrINR, 0);
  const netVarianceINR = records.reduce((acc, r) => acc + (r.varianceINR || 0), 0);

  const healthScore = Math.max(0, Math.min(100, Math.round(((matchedCount + (timingLagCount * 0.9)) / totalRecords) * 100)));

  return {
    totalRecords,
    matchedCount,
    discrepanciesCount,
    timingLagCount,
    totalGrossProcessedINR,
    totalBankSettledINR,
    totalMdrFeeDeductedINR,
    netVarianceINR,
    reconciliationHealthScore: healthScore,
  };
}

export function generateReconciliationAgentThoughts(records: ReconciliationRecord[]): AgentThoughtStep[] {
  const timestamp = new Date().toLocaleTimeString('en-IN');
  return [
    {
      id: 'thought_rec_1',
      timestamp,
      agentRole: 'RECONCILIATION_AGENT',
      thought: 'Ingesting live Razorpay Gateway settlement batch files and ICICI/HDFC Bank MT940 statement feeds...',
      toolCall: {
        toolName: 'razorpay_settlements.fetch',
        input: { date_range: 'last_7_days', mid: 'rzp_live_hyperscale_ai' },
        output: { ingested_batches: 7, total_captures: records.length, status: 'SUCCESS' },
      },
      confidence: 0.99,
      status: 'COMPLETED',
    },
    {
      id: 'thought_rec_2',
      timestamp,
      agentRole: 'RECONCILIATION_AGENT',
      thought: 'Executing 3-Way Fuzzy & Exact Matching across Gateway Gross, Merchant Discount Rate (MDR + GST), Bank Credits, and ERP Invoices...',
      toolCall: {
        toolName: 'three_way_matcher.execute',
        input: { tolerance_threshold_inr: 1.0, timestamp_window_hours: 48 },
        output: { exact_matches: 4, mdr_discrepancies: 1, float_lags: 1, unrecorded_refunds: 1 },
      },
      confidence: 0.96,
      status: 'COMPLETED',
    },
    {
      id: 'thought_rec_3',
      timestamp,
      agentRole: 'RECONCILIATION_AGENT',
      thought: 'Detected ₹6,670 MDR overcharge on Batch #B-8813 (Corporate Card SLA 1.85% vs Billed 3.00%). Auto-synthesizing Razorpay Dispute Claim dossier.',
      toolCall: {
        toolName: 'dispute_dossier.generate',
        input: { orderId: 'order_KZ89104mQw', excess_charge_inr: 6670 },
        output: { dispute_id: 'DSP-2026-9921', status: 'READY_TO_SUBMIT' },
      },
      confidence: 0.98,
      status: 'COMPLETED',
    },
    {
      id: 'thought_rec_4',
      timestamp,
      agentRole: 'RECONCILIATION_AGENT',
      thought: 'Synthesizing double-entry balancing journal adjustments for ERP ledger synchronization.',
      toolCall: {
        toolName: 'ledger_journal.post_draft',
        input: { auto_balance_count: 2, total_adjustment_inr: 142830 },
        output: { journal_batch_id: 'JRN-2026-0819', status: 'POSTED' },
      },
      confidence: 0.97,
      status: 'COMPLETED',
    },
  ];
}
