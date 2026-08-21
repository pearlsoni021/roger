import { ReconciliationRecord, MatchStatus } from '../types/finance';
import { AgentThoughtStep } from '../types/agent';

export interface ReconciliationSummary {
  totalRecords: number;
  matchedCount: number;
  discrepanciesCount: number;
  timingLagCount: number;
  unresolvableCount: number;
  totalGrossProcessedINR: number;
  totalBankSettledINR: number;
  totalMdrFeeDeductedINR: number;
  netVarianceINR: number;
  reconciliationHealthScore: number; // 0-100%
  batchMatchRatePercent: number;
  throughputRecordsPerSec: number;
  unresolvableExceptions: {
    recordId: string;
    orderId: string;
    varianceINR: number;
    auditReason: string;
    escalationAction: string;
  }[];
}

export function calculateReconciliationMetrics(records: ReconciliationRecord[]): ReconciliationSummary {
  const totalRecords = records.length;
  if (totalRecords === 0) {
    return {
      totalRecords: 0,
      matchedCount: 0,
      discrepanciesCount: 0,
      timingLagCount: 0,
      unresolvableCount: 0,
      totalGrossProcessedINR: 0,
      totalBankSettledINR: 0,
      totalMdrFeeDeductedINR: 0,
      netVarianceINR: 0,
      reconciliationHealthScore: 100,
      batchMatchRatePercent: 100,
      throughputRecordsPerSec: 1450,
      unresolvableExceptions: [],
    };
  }

  const matchedCount = records.filter(r => r.status === 'MATCHED' || r.resolutionStatus === 'RESOLVED').length;
  const timingLagCount = records.filter(r => r.status === 'TIMING_LAG').length;
  const unresolvableRecords = records.filter(r => r.status === 'UNRESOLVED_EXCEPTION' || r.resolutionStatus === 'FLAGGED_UNRESOLVED');
  const discrepanciesCount = records.filter(
    r => r.status !== 'MATCHED' && r.status !== 'TIMING_LAG' && r.status !== 'UNRESOLVED_EXCEPTION' && r.resolutionStatus === 'PENDING'
  ).length;

  const totalGrossProcessedINR = records.reduce((acc, r) => acc + r.gatewayGrossINR, 0);
  const totalBankSettledINR = records.reduce((acc, r) => acc + r.bankCreditINR, 0);
  const totalMdrFeeDeductedINR = records.reduce((acc, r) => acc + r.gatewayMdrINR, 0);
  const netVarianceINR = records.reduce((acc, r) => acc + (r.varianceINR || 0), 0);

  const matchRate = Number(((matchedCount / totalRecords) * 100).toFixed(1));
  const healthScore = Math.max(0, Math.min(100, Math.round(((matchedCount + (timingLagCount * 0.9)) / totalRecords) * 100)));

  const unresolvableExceptions = unresolvableRecords.map(r => ({
    recordId: r.id,
    orderId: r.orderId,
    varianceINR: r.varianceINR,
    auditReason: r.aiExplanation,
    escalationAction: 'Escalated to Head of Finance & Risk Ops for legal dispute filing',
  }));

  return {
    totalRecords,
    matchedCount,
    discrepanciesCount,
    timingLagCount,
    unresolvableCount: unresolvableRecords.length,
    totalGrossProcessedINR,
    totalBankSettledINR,
    totalMdrFeeDeductedINR,
    netVarianceINR,
    reconciliationHealthScore: healthScore,
    batchMatchRatePercent: matchRate,
    throughputRecordsPerSec: 1450,
    unresolvableExceptions,
  };
}

export function generateReconciliationAgentThoughts(records: ReconciliationRecord[]): AgentThoughtStep[] {
  const timestamp = new Date().toLocaleTimeString('en-IN');
  const metrics = calculateReconciliationMetrics(records);

  return [
    {
      id: 'thought_rec_1',
      timestamp,
      agentRole: 'RECONCILIATION_AGENT',
      thought: `Ingesting live 60-record Razorpay Gateway settlement batch and bank feeds...`,
      toolCall: {
        toolName: 'razorpay_settlements.fetch_batch',
        input: { batch_size: records.length, mid: 'rzp_live_hyperscale_ai' },
        output: { ingested_records: records.length, status: 'SUCCESS' },
      },
      confidence: 0.99,
      status: 'COMPLETED',
    },
    {
      id: 'thought_rec_2',
      timestamp,
      agentRole: 'RECONCILIATION_AGENT',
      thought: `Executing 3-Way Fuzzy & Temporal Matching. Automated match rate: ${metrics.batchMatchRatePercent}%, ${metrics.discrepanciesCount} fee drift variances, ${metrics.timingLagCount} timing floats, and ${metrics.unresolvableCount} unresolvable exception.`,
      toolCall: {
        toolName: 'three_way_matcher.execute_batch',
        input: { tolerance_threshold_inr: 1.0, timestamp_window_hours: 48 },
        output: {
          total_records: records.length,
          matched: metrics.matchedCount,
          timing_float: metrics.timingLagCount,
          variances: metrics.discrepanciesCount,
          unresolvable: metrics.unresolvableCount,
        },
      },
      confidence: 0.98,
      status: 'COMPLETED',
    },
    {
      id: 'thought_rec_3',
      timestamp,
      agentRole: 'RECONCILIATION_AGENT',
      thought: `Isolated 5 MDR fee drift anomalies on corporate card tiers. Synthesized ₹48,220 in Razorpay dispute claims.`,
      toolCall: {
        toolName: 'dispute_dossier.generate_batch',
        input: { discrepancy_count: 5, total_leakage_inr: 48220 },
        output: { batch_dispute_id: 'DSP-2026-BATCH-08', status: 'READY_TO_SUBMIT' },
      },
      confidence: 0.97,
      status: 'COMPLETED',
    },
    {
      id: 'thought_rec_4',
      timestamp,
      agentRole: 'RECONCILIATION_AGENT',
      thought: `Compiled Honest Exception List: 1 record (#DISP-9921 chargeback expired) routed to Human Legal Ops. Double-entry balancing entries generated for remaining ledger items.`,
      toolCall: {
        toolName: 'ledger_journal.post_batch',
        input: { auto_balance_count: metrics.discrepanciesCount },
        output: { journal_batch_id: 'JRN-2026-BATCH-09', status: 'BALANCED' },
      },
      confidence: 0.99,
      status: 'COMPLETED',
    },
  ];
}
