import { ReconciliationRecord } from '../types/finance';

// Helper to generate a comprehensive 60-record synthetic benchmark batch
const generateSyntheticBenchmarkBatch = (): ReconciliationRecord[] => {
  const records: ReconciliationRecord[] = [];

  // 1. Base 48 Clean Matched Transactions across UPI, Cards, Netbanking
  for (let i = 1; i <= 48; i++) {
    const day = (i % 28) + 1;
    const dateStr = `2026-08-${day.toString().padStart(2, '0')}`;
    const gross = 25000 + ((i * 13700) % 450000);
    const mdrRate = (i % 3 === 0) ? 0.0 : 0.0185; // 0% UPI or 1.85% Standard Cards
    const mdrFee = Math.round(gross * mdrRate * 100) / 100;
    const net = Math.round((gross - mdrFee) * 100) / 100;

    records.push({
      id: `REC-2026-${(9000 + i).toString()}`,
      reconciliationDate: dateStr,
      orderId: `order_synth_${i.toString().padStart(3, '0')}_${Math.random().toString(36).substring(7)}`,
      paymentId: `pay_synth_${i.toString().padStart(3, '0')}_${Math.random().toString(36).substring(7)}`,
      invoiceNumber: `INV-2026-${(1000 + i).toString()}`,
      gatewayGrossINR: gross,
      gatewayMdrINR: mdrFee,
      gatewayNetINR: net,
      bankCreditINR: net,
      erpAmountINR: gross,
      varianceINR: 0,
      status: 'MATCHED',
      aiExplanation: `Clean 3-way match. Razorpay settlement batch #B-${8000 + i} credited into bank account with verified MDR fee (${(mdrRate * 100).toFixed(2)}%) and ERP invoice.`,
      suggestedAction: 'NONE',
      resolutionStatus: 'AUTO_BALANCED',
    });
  }

  // 2. 5 MDR Fee Leakage / Contract Drift Exceptions
  const mdrAnomalies = [
    { id: 49, gross: 580000, actualMdrPct: 0.035, agreedMdrPct: 0.0185, cardType: 'Corporate Visa Signature' },
    { id: 50, gross: 420000, actualMdrPct: 0.030, agreedMdrPct: 0.0185, cardType: 'Mastercard World Elite' },
    { id: 51, gross: 710000, actualMdrPct: 0.028, agreedMdrPct: 0.0185, cardType: 'Diners Club International' },
    { id: 52, gross: 330000, actualMdrPct: 0.032, agreedMdrPct: 0.0185, cardType: 'Amex Corporate Travel' },
    { id: 53, gross: 640000, actualMdrPct: 0.035, agreedMdrPct: 0.0185, cardType: 'Commercial Fleet Card' },
  ];

  mdrAnomalies.forEach((anom) => {
    const mdrFee = Math.round(anom.gross * anom.actualMdrPct * 100) / 100;
    const agreedFee = Math.round(anom.gross * anom.agreedMdrPct * 100) / 100;
    const leakage = Math.round((mdrFee - agreedFee) * 100) / 100;
    const net = Math.round((anom.gross - mdrFee) * 100) / 100;

    records.push({
      id: `REC-2026-${(9000 + anom.id).toString()}`,
      reconciliationDate: '2026-08-19',
      orderId: `order_MDR_${anom.id}_${Math.random().toString(36).substring(7)}`,
      paymentId: `pay_MDR_${anom.id}_${Math.random().toString(36).substring(7)}`,
      invoiceNumber: `INV-2026-${(1000 + anom.id).toString()}`,
      gatewayGrossINR: anom.gross,
      gatewayMdrINR: mdrFee,
      gatewayNetINR: net,
      bankCreditINR: net,
      erpAmountINR: anom.gross,
      varianceINR: -leakage,
      status: 'DISCREPANCY_MDR',
      aiExplanation: `MDR Fee Leakage: Gateway applied ${(anom.actualMdrPct * 100).toFixed(2)}% fee tier on ${anom.cardType} instead of agreed ${(anom.agreedMdrPct * 100).toFixed(2)}% SLA. Revenue leakage: ₹${leakage.toLocaleString('en-IN')}.`,
      suggestedAction: 'RAISE_RAZORPAY_TICKET',
      resolutionStatus: 'PENDING',
      journalEntry: {
        debitAccount: 'Razorpay Gateway Dispute Receivable A/c',
        creditAccount: 'Gateway Processing Expense A/c',
        amountINR: leakage,
        narration: `Dispute adjustment for excess MDR fee on ${anom.cardType} batch`,
      },
    });
  });

  // 3. 3 Settlement Timing Float Exceptions (Weekend T+2 cutoff)
  const timingFloats = [
    { id: 54, gross: 185000, mdr: 3700, date: '2026-08-18', reason: 'Friday 23:45 IST UPI capture' },
    { id: 55, gross: 290000, mdr: 5365, date: '2026-08-19', reason: 'Saturday Bank holiday NEFT batch queue' },
    { id: 56, gross: 145000, mdr: 2682.5, date: '2026-08-19', reason: 'Sunday midnight subscription renewal' },
  ];

  timingFloats.forEach((item) => {
    const net = item.gross - item.mdr;
    records.push({
      id: `REC-2026-${(9000 + item.id).toString()}`,
      reconciliationDate: item.date,
      orderId: `order_FLT_${item.id}_${Math.random().toString(36).substring(7)}`,
      paymentId: `pay_FLT_${item.id}_${Math.random().toString(36).substring(7)}`,
      invoiceNumber: `INV-2026-${(1000 + item.id).toString()}`,
      gatewayGrossINR: item.gross,
      gatewayMdrINR: item.mdr,
      gatewayNetINR: net,
      bankCreditINR: 0,
      erpAmountINR: item.gross,
      varianceINR: net,
      status: 'TIMING_LAG',
      aiExplanation: `Settlement Timing Float (T+2): ${item.reason}. Settlement pending bank window clearance. No revenue loss.`,
      suggestedAction: 'WAIT_T2_FLOAT',
      resolutionStatus: 'PENDING',
    });
  });

  // 4. 2 Unrecorded Customer Refund Exceptions
  records.push({
    id: 'REC-2026-9057',
    reconciliationDate: '2026-08-16',
    orderId: 'order_REF_57_q8812',
    paymentId: 'pay_REF_57_t1991',
    invoiceNumber: 'INV-2026-1057',
    gatewayGrossINR: 95000,
    gatewayMdrINR: 1900,
    gatewayNetINR: 0,
    bankCreditINR: 0,
    erpAmountINR: 95000,
    varianceINR: -95000,
    status: 'UNRECORDED_REFUND',
    aiExplanation: 'Unrecorded Refund: Instant gateway refund processed on 16 Aug, but ERP webhook failed to mark invoice as Voided.',
    suggestedAction: 'POST_ADJUSTMENT_JOURNAL',
    resolutionStatus: 'PENDING',
    journalEntry: {
      debitAccount: 'Customer Returns & Allowances A/c',
      creditAccount: 'Trade Accounts Receivable A/c',
      amountINR: 95000,
      narration: 'Void invoice INV-2026-1057 for refunded gateway transaction pay_REF_57_t1991',
    },
  });

  records.push({
    id: 'REC-2026-9058',
    reconciliationDate: '2026-08-15',
    orderId: 'order_REF_58_k4401',
    paymentId: 'pay_REF_58_p9920',
    invoiceNumber: 'INV-2026-1058',
    gatewayGrossINR: 135000,
    gatewayMdrINR: 2700,
    gatewayNetINR: 0,
    bankCreditINR: 0,
    erpAmountINR: 135000,
    varianceINR: -135000,
    status: 'UNRECORDED_REFUND',
    aiExplanation: 'Unrecorded Refund: Chargeback reversal executed at payment network; ERP invoice still open.',
    suggestedAction: 'POST_ADJUSTMENT_JOURNAL',
    resolutionStatus: 'PENDING',
    journalEntry: {
      debitAccount: 'Customer Returns & Allowances A/c',
      creditAccount: 'Trade Accounts Receivable A/c',
      amountINR: 135000,
      narration: 'Write-off ERP invoice INV-2026-1058 for chargeback refund pay_REF_58_p9920',
    },
  });

  // 5. 1 Orphan Ghost Capture
  records.push({
    id: 'REC-2026-9059',
    reconciliationDate: '2026-08-14',
    orderId: 'order_GHOST_59_v1002',
    paymentId: 'pay_GHOST_59_w8821',
    invoiceNumber: undefined,
    gatewayGrossINR: 42000,
    gatewayMdrINR: 840,
    gatewayNetINR: 41160,
    bankCreditINR: 41160,
    erpAmountINR: 0,
    varianceINR: 41160,
    status: 'GHOST_PAYMENT',
    aiExplanation: 'Ghost Payment / Orphan Capture: Payment received and settled by Razorpay into bank account, but missing in ERP database due to checkout webhook timeout.',
    suggestedAction: 'POST_ADJUSTMENT_JOURNAL',
    resolutionStatus: 'PENDING',
    journalEntry: {
      debitAccount: 'ICICI Bank Current A/c',
      creditAccount: 'Unearned Revenue / Advance Customer Receipts A/c',
      amountINR: 41160,
      narration: 'Record unallocated gateway collection for pay_GHOST_59_w8821',
    },
  });

  // 6. 1 Honest Unresolvable Exception (Required by Razorpay Track 4 Bar!)
  records.push({
    id: 'REC-2026-9060',
    reconciliationDate: '2026-08-12',
    orderId: 'order_IRRESOLVABLE_60_z99',
    paymentId: 'pay_FRAUD_60_x1122',
    invoiceNumber: 'INV-2026-1060',
    gatewayGrossINR: 500000,
    gatewayMdrINR: 15000,
    gatewayNetINR: -500000, // Debited by bank due to international fraud chargeback
    bankCreditINR: -500000,
    erpAmountINR: 500000,
    varianceINR: -1000000,
    status: 'UNRESOLVED_EXCEPTION',
    aiExplanation: 'HONEST EXCEPTION: Fraudulent international chargeback (#DISP-9921) past 45-day representment window. Bank clawed back ₹5,00,000 without merchant fulfillment proof. Requires Human Legal / Risk Ops escalation.',
    suggestedAction: 'FLAG_HUMAN_REVIEW',
    resolutionStatus: 'FLAGGED_UNRESOLVED',
    journalEntry: {
      debitAccount: 'Provision for Doubtful Debts / Fraud Loss A/c',
      creditAccount: 'Trade Accounts Receivable A/c',
      amountINR: 500000,
      narration: 'Escalate to Legal Ops: Unrecoverable chargeback on pay_FRAUD_60_x1122',
    },
  });

  return records;
};

export const INITIAL_RECONCILIATION_RECORDS: ReconciliationRecord[] = generateSyntheticBenchmarkBatch();
