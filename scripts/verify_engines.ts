/**
 * Verification Test Suite for Razorpay LedgerMind AI Engines
 */

import { calculateReconciliationMetrics } from '../src/services/reconciliationEngine.js';
import { runMonteCarloSimulation } from '../src/services/monteCarloEngine.js';
import { calculateTdsAndGst, compileForm26QReport } from '../src/services/taxComplianceEngine.js';
import { validateGSTIN, validatePAN } from '../src/utils/gstValidator.js';
import { INITIAL_RECONCILIATION_RECORDS } from '../src/data/mockReconciliation.js';
import { INITIAL_VENDOR_INVOICES } from '../src/data/mockVendors.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    failed++;
  }
}

console.log('🧪 Starting Razorpay LedgerMind AI Engine Verification Suite...\n');

// Test 1: 3-Way Reconciliation Metrics
const reconSummary = calculateReconciliationMetrics(INITIAL_RECONCILIATION_RECORDS);
assert(reconSummary.totalRecords === 7, 'Reconciliation should ingest exactly 7 records');
assert(reconSummary.discrepanciesCount === 3, 'Reconciliation should identify exactly 3 actionable discrepancies');
assert(reconSummary.timingLagCount === 1, 'Reconciliation should identify 1 weekend timing float (T+2)');
assert(reconSummary.reconciliationHealthScore > 0 && reconSummary.reconciliationHealthScore <= 100, 'Reconciliation health score is bounded between 0-100%');

// Test 2: Monte Carlo Simulation & Percentile Ordering
const simResult = runMonteCarloSimulation(
  42500000,
  5800000,
  3200000,
  {
    id: 'test',
    name: 'Test',
    description: 'Test',
    headcountDelta: 2,
    avgMonthlyCtcPerHeadINR: 200000,
    monthlyRevenueGrowthPercent: 5,
    cloudSpendReductionPercent: 10,
    gatewayMdrRatePercent: 1.85,
    settlementTermsDays: 1,
    fundraiseAmountINR: 0,
    fundraiseExpectedMonth: 4,
  },
  24,
  500
);

assert(simResult.dataPoints.length === 25, 'Monte Carlo should generate 25 monthly datapoints (M0 to M24)');
const midPoint = simResult.dataPoints[12];
assert(midPoint.p10WorstCaseINR <= midPoint.p50ExpectedINR, 'Monte Carlo P10 <= P50');
assert(midPoint.p50ExpectedINR <= midPoint.p90BestCaseINR, 'Monte Carlo P50 <= P90');
assert(simResult.projectedRunwayMonths > 0, 'Projected runway is positive');

// Test 3: Indian Tax Compliance (TDS Section 194C, 194J)
const tds194JTech = calculateTdsAndGst(450000, 18, '194J_TECH', '07AABCA1234F1Z9');
assert(tds194JTech.gstAmountINR === 81000, 'GST on ₹4.5L @ 18% is ₹81,000');
assert(tds194JTech.tdsAmountINR === 9000, 'TDS on Section 194J Tech @ 2% is ₹9,000');
assert(tds194JTech.netPayableINR === 522000, 'Net payable = Base + GST - TDS = ₹5,22,000');

const tds194JProf = calculateTdsAndGst(250000, 18, '194J_PROF', '29AAAFS9921K1ZF');
assert(tds194JProf.tdsAmountINR === 25000, 'TDS on Section 194J Prof @ 10% is ₹25,000');
assert(tds194JProf.netPayableINR === 270000, 'Net payable for Legal services = ₹2,70,000');

// Test 4: GSTIN and PAN Validator
const validGstin = validateGSTIN('29AABCH9912E1Z8');
assert(validGstin.isValid === true, 'Valid GSTIN syntax test');
assert(validGstin.stateName === 'Karnataka', 'GSTIN state code 29 resolves to Karnataka');

const invalidGstin = validateGSTIN('12345INVALID');
assert(invalidGstin.isValid === false, 'Invalid GSTIN length rejected');

const validPan = validatePAN('AABCH9912E');
assert(validPan === true, 'Valid PAN syntax test');

// Test 5: Form 26Q Summary Generation
const form26Q = compileForm26QReport(INITIAL_VENDOR_INVOICES, 'BLRH08912E');
assert(form26Q.deducteesCount > 0, 'Form 26Q compiles deductees');
assert(form26Q.totalTdsDepositedINR === form26Q.totalDeductionsINR, 'Total TDS deposited matches total deductions');

console.log(`\n📊 Verification Summary: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ENGINES VERIFIED 100% SUCCESFULLY!\n');
}
