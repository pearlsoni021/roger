export type TdsSection = '194C' | '194J_TECH' | '194J_PROF' | '194Q' | '194I_RENT' | 'EXEMPT';

export interface Vendor {
  id: string;
  name: string;
  category: 'Cloud & SaaS' | 'Marketing Agency' | 'Legal & Audit' | 'Logistics & Warehousing' | 'Office & Hardware';
  pan: string;
  gstin: string;
  bankAccount: {
    accountNumber: string;
    ifsc: string;
    beneficiaryName: string;
    pennyDropStatus: 'VERIFIED' | 'FAILED' | 'PENDING';
    registeredPanMatch: boolean;
  };
  applicableTdsSection: TdsSection;
  tdsRatePercent: number;
  ytdBilledINR: number;
  ytdTdsDeductedINR: number;
  paymentTermsDays: number;
}

export interface VendorInvoice {
  id: string;
  vendorId: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  baseAmountINR: number;
  gstRatePercent: number;
  gstAmountINR: number;
  grossAmountINR: number;
  tdsSection: TdsSection;
  tdsRatePercent: number;
  tdsAmountINR: number;
  netPayableINR: number;
  status: 'PENDING_APPROVAL' | 'TAX_VERIFIED' | 'SCHEDULED_PAYOUT' | 'PAID' | 'FLAGGED_ANOMALY';
  flags?: {
    isDuplicateInvoice: boolean;
    isInvalidGstin: boolean;
    isTdsThresholdBreached: boolean;
    isBankNameMismatch: boolean;
    anomalyNote?: string;
  };
  payoutDetails?: {
    payoutId: string;
    utrNumber: string;
    executedAt: string;
    mode: 'NEFT' | 'RTGS' | 'IMPS' | 'UPI';
  };
}

export interface Form26QSummary {
  quarter: string; // e.g. "Q3 FY 2025-26"
  tan: string;
  totalDeductionsINR: number;
  totalTdsDepositedINR: number;
  challanNumber: string;
  deducteesCount: number;
  sectionBreakdown: {
    section: TdsSection;
    sectionName: string;
    count: number;
    baseAmountINR: number;
    tdsDeductedINR: number;
  }[];
}
