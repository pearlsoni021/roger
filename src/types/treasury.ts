export interface MonteCarloDataPoint {
  month: number;
  monthLabel: string;
  p10WorstCaseINR: number;
  p50ExpectedINR: number;
  p90BestCaseINR: number;
  deterministicINR: number;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  headcountDelta: number; // e.g. +5 engineers
  avgMonthlyCtcPerHeadINR: number; // e.g. 2,00,000 INR
  monthlyRevenueGrowthPercent: number; // e.g. 8%
  cloudSpendReductionPercent: number; // e.g. 15%
  gatewayMdrRatePercent: number; // e.g. 1.85% vs 2.15%
  settlementTermsDays: 0 | 1 | 2; // T+0, T+1, T+2
  fundraiseAmountINR: number; // e.g. 5,00,00,000 INR
  fundraiseExpectedMonth: number; // e.g. month 4
}

export interface StressTestScenario {
  id: string;
  title: string;
  category: 'MACRO' | 'PAYMENTS' | 'CHURN' | 'REGULATORY';
  impactDescription: string;
  runwayReductionMonths: number;
  cashDrainINR: number;
  mitigationStrategy: string;
}

export interface MonthlyCashflowItem {
  month: string;
  inflowINR: number;
  outflowPayrollINR: number;
  outflowCloudINR: number;
  outflowVendorsINR: number;
  outflowMarketingINR: number;
  outflowGatewayFeesINR: number;
  netCashflowINR: number;
  closingBalanceINR: number;
}
