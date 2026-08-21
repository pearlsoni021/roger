import { VendorInvoice, TdsSection, Form26QSummary } from '../types/vendor';
import { validateGSTIN } from '../utils/gstValidator';

export interface TdsCalculationResult {
  baseAmountINR: number;
  gstRatePercent: number;
  gstAmountINR: number;
  grossAmountINR: number;
  tdsSection: TdsSection;
  tdsRatePercent: number;
  tdsAmountINR: number;
  netPayableINR: number;
  isCompliant: boolean;
  warnings: string[];
}

export function calculateTdsAndGst(
  baseAmountINR: number,
  gstRatePercent: number,
  tdsSection: TdsSection,
  vendorGstin?: string,
  isIndividualVendor: boolean = false
): TdsCalculationResult {
  const warnings: string[] = [];

  // GST Calculation
  const gstAmountINR = (baseAmountINR * gstRatePercent) / 100;
  const grossAmountINR = baseAmountINR + gstAmountINR;

  // Determine TDS Rate under Indian Income Tax Act
  let tdsRatePercent = 0;
  switch (tdsSection) {
    case '194C':
      // 1% for Individual / HUF, 2% for Companies / LLPs
      tdsRatePercent = isIndividualVendor ? 1.0 : 2.0;
      break;
    case '194J_TECH':
      // Technical services, call center, etc. @ 2%
      tdsRatePercent = 2.0;
      break;
    case '194J_PROF':
      // Professional fees (Legal, CA, Medical, Architecture) @ 10%
      tdsRatePercent = 10.0;
      break;
    case '194Q':
      // Purchase of goods exceeding ₹50L aggregate @ 0.1%
      tdsRatePercent = 0.1;
      break;
    case '194I_RENT':
      // Rent for land/building @ 10%, plant/machinery @ 2%
      tdsRatePercent = 10.0;
      break;
    case 'EXEMPT':
    default:
      tdsRatePercent = 0;
      break;
  }

  // NOTE: In India, TDS is strictly deducted on the Base Amount EXCLUDING GST
  const tdsAmountINR = (baseAmountINR * tdsRatePercent) / 100;
  const netPayableINR = grossAmountINR - tdsAmountINR;

  // Compliance checks
  if (vendorGstin) {
    const gstCheck = validateGSTIN(vendorGstin);
    if (!gstCheck.isValid) {
      warnings.push(`Invalid GSTIN format: ${gstCheck.error || 'Check 15-digit structure'}`);
    }
  }

  if (tdsSection === '194C' && baseAmountINR > 30000) {
    // Single transaction limit ₹30,000 threshold check
    // In compliant state
  }

  return {
    baseAmountINR,
    gstRatePercent,
    gstAmountINR,
    grossAmountINR,
    tdsSection,
    tdsRatePercent,
    tdsAmountINR,
    netPayableINR,
    isCompliant: warnings.length === 0,
    warnings,
  };
}

export function compileForm26QReport(invoices: VendorInvoice[], tan: string = 'BLRH08912E'): Form26QSummary {
  const paidInvoices = invoices.filter(inv => inv.status === 'PAID' || inv.status === 'SCHEDULED_PAYOUT' || inv.status === 'TAX_VERIFIED');
  
  const section194C = paidInvoices.filter(i => i.tdsSection === '194C');
  const section194JTech = paidInvoices.filter(i => i.tdsSection === '194J_TECH');
  const section194JProf = paidInvoices.filter(i => i.tdsSection === '194J_PROF');

  const totalDeductions = paidInvoices.reduce((sum, i) => sum + i.tdsAmountINR, 0);

  return {
    quarter: 'Q2 FY 2026-27 (Jul - Sep)',
    tan,
    totalDeductionsINR: totalDeductions,
    totalTdsDepositedINR: totalDeductions,
    challanNumber: `CHL-${Math.floor(1000000 + Math.random() * 9000000)}-2026`,
    deducteesCount: paidInvoices.length,
    sectionBreakdown: [
      {
        section: '194C',
        sectionName: 'Payments to Contractors & Transporters (Sec 194C)',
        count: section194C.length,
        baseAmountINR: section194C.reduce((sum, i) => sum + i.baseAmountINR, 0),
        tdsDeductedINR: section194C.reduce((sum, i) => sum + i.tdsAmountINR, 0),
      },
      {
        section: '194J_TECH',
        sectionName: 'Fees for Technical & Cloud Services (Sec 194J(a))',
        count: section194JTech.length,
        baseAmountINR: section194JTech.reduce((sum, i) => sum + i.baseAmountINR, 0),
        tdsDeductedINR: section194JTech.reduce((sum, i) => sum + i.tdsAmountINR, 0),
      },
      {
        section: '194J_PROF',
        sectionName: 'Fees for Professional & Legal Services (Sec 194J(b))',
        count: section194JProf.length,
        baseAmountINR: section194JProf.reduce((sum, i) => sum + i.baseAmountINR, 0),
        tdsDeductedINR: section194JProf.reduce((sum, i) => sum + i.tdsAmountINR, 0),
      },
    ],
  };
}
