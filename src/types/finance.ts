export interface CompanyProfile {
  id: string;
  name: string;
  industry: 'SaaS' | 'D2C E-Commerce' | 'B2B Logistics' | 'Fintech';
  legalEntity: string;
  gstin: string;
  pan: string;
  razorpayMid: string;
  totalCashINR: number;
  monthlyBurnINR: number;
  monthlyRevenueINR: number;
  runwayMonths: number;
  primaryBank: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    currentBalanceINR: number;
  };
  razorpayXBalanceINR: number;
}

export type MatchStatus = 
  | 'MATCHED' 
  | 'DISCREPANCY_MDR' 
  | 'TIMING_LAG' 
  | 'MISSING_BANK_CREDIT' 
  | 'UNRECORDED_REFUND' 
  | 'GHOST_PAYMENT'
  | 'UNRESOLVED_EXCEPTION';

export interface GatewaySettlement {
  id: string;
  settlementBatchId: string;
  paymentId: string;
  orderId: string;
  customerName: string;
  grossAmountINR: number;
  mdrFeeINR: number;
  gstOnFeeINR: number;
  netSettlementINR: number;
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Netbanking' | 'Razorpay Mandate';
  capturedAt: string;
  settledAt: string;
  status: 'SETTLED' | 'PENDING' | 'REFUNDED' | 'DISPUTED';
}

export interface BankStatementLine {
  id: string;
  utrNumber: string;
  transactionDate: string;
  valueDate: string;
  description: string;
  creditINR: number;
  debitINR: number;
  balanceAfterINR: number;
  matchedBatchId?: string;
}

export interface ErpInvoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerName: string;
  customerGstin?: string;
  invoiceAmountINR: number;
  taxAmountINR: number;
  issuedAt: string;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
}

export interface ReconciliationRecord {
  id: string;
  reconciliationDate: string;
  orderId: string;
  paymentId?: string;
  invoiceNumber?: string;
  gatewayGrossINR: number;
  gatewayMdrINR: number;
  gatewayNetINR: number;
  bankCreditINR: number;
  erpAmountINR: number;
  varianceINR: number;
  status: MatchStatus;
  aiExplanation: string;
  suggestedAction: 'POST_ADJUSTMENT_JOURNAL' | 'RAISE_RAZORPAY_TICKET' | 'WAIT_T2_FLOAT' | 'INITIATE_REFUND_MATCH' | 'FLAG_HUMAN_REVIEW' | 'NONE';
  resolutionStatus: 'PENDING' | 'RESOLVED' | 'AUTO_BALANCED' | 'FLAGGED_UNRESOLVED';
  journalEntry?: {
    debitAccount: string;
    creditAccount: string;
    amountINR: number;
    narration: string;
  };
}

export interface FinancialHealthMetrics {
  reconciliationScore: number; // 0-100
  unreconciledAmountINR: number;
  mdrDiscrepancyAmountINR: number;
  timingFloatAmountINR: number;
  activeDisputesCount: number;
  cashRunwayMonths: number;
  taxComplianceRate: number;
  monthlyNetBurnINR: number;
  quickRatio: number;
}
