import { MonteCarloDataPoint, WhatIfScenario } from '../types/treasury';

export interface SimulationResult {
  dataPoints: MonteCarloDataPoint[];
  currentRunwayMonths: number;
  projectedRunwayMonths: number;
  runwayDeltaMonths: number;
  cashExhaustionDate: string;
  monthlyBurnINR: number;
  p10WorstCaseRunwayMonths: number;
  p90BestCaseRunwayMonths: number;
  aiStrategicRecommendations: string[];
}

export function runMonteCarloSimulation(
  startingCashINR: number,
  baseMonthlyRevenueINR: number,
  baseMonthlyBurnINR: number,
  scenario: WhatIfScenario,
  monthsToSimulate: number = 24,
  simulationIterations: number = 1000
): SimulationResult {
  const monthLabels = [
    'Current', 'M+1', 'M+2', 'M+3', 'M+4', 'M+5', 'M+6', 'M+7', 'M+8', 'M+9', 'M+10',
    'M+11', 'M+12', 'M+13', 'M+14', 'M+15', 'M+16', 'M+17', 'M+18', 'M+19', 'M+20',
    'M+21', 'M+22', 'M+23', 'M+24'
  ];

  // Adjust monthly burn and revenue according to What-If scenario parameters
  const additionalPayrollINR = scenario.headcountDelta * scenario.avgMonthlyCtcPerHeadINR;
  const cloudSpendSavingsINR = (baseMonthlyBurnINR * 0.18) * (scenario.cloudSpendReductionPercent / 100);
  const mdrRateImprovementINR = baseMonthlyRevenueINR * ((2.0 - scenario.gatewayMdrRatePercent) / 100);

  const effectiveMonthlyBurnINR = Math.max(
    100000,
    baseMonthlyBurnINR + additionalPayrollINR - cloudSpendSavingsINR - mdrRateImprovementINR
  );

  const growthRate = scenario.monthlyRevenueGrowthPercent / 100;
  const volatility = 0.08; // 8% monthly revenue volatility

  // Matrix to store iterations: [iteration][month]
  const simulationMatrix: number[][] = [];

  for (let i = 0; i < simulationIterations; i++) {
    const trajectory: number[] = [startingCashINR];
    let currentCash = startingCashINR;
    let currentRev = baseMonthlyRevenueINR;

    for (let m = 1; m <= monthsToSimulate; m++) {
      // Injected fundraise if applicable
      if (scenario.fundraiseAmountINR > 0 && m === scenario.fundraiseExpectedMonth) {
        currentCash += scenario.fundraiseAmountINR;
      }

      // Stochastic revenue variation (Box-Muller transform for normal distribution)
      const u1 = Math.max(0.0001, Math.random());
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      const monthlyShock = z * volatility;
      currentRev = Math.max(10000, currentRev * (1 + growthRate + monthlyShock));

      const netMonthlyCashflow = currentRev - effectiveMonthlyBurnINR;
      currentCash += netMonthlyCashflow;

      trajectory.push(Math.max(0, currentCash));
    }
    simulationMatrix.push(trajectory);
  }

  // Aggregate percentiles for each month
  const dataPoints: MonteCarloDataPoint[] = [];
  let p10ExhaustionMonth = monthsToSimulate;
  let p50ExhaustionMonth = monthsToSimulate;
  let p90ExhaustionMonth = monthsToSimulate;

  for (let m = 0; m <= monthsToSimulate; m++) {
    const cashValues = simulationMatrix.map(traj => traj[m]).sort((a, b) => a - b);
    const p10 = cashValues[Math.floor(simulationIterations * 0.10)];
    const p50 = cashValues[Math.floor(simulationIterations * 0.50)];
    const p90 = cashValues[Math.floor(simulationIterations * 0.90)];

    // Deterministic base projection
    let deterministicCash = startingCashINR;
    let detRev = baseMonthlyRevenueINR;
    for (let dm = 1; dm <= m; dm++) {
      if (scenario.fundraiseAmountINR > 0 && dm === scenario.fundraiseExpectedMonth) {
        deterministicCash += scenario.fundraiseAmountINR;
      }
      detRev = detRev * (1 + growthRate);
      deterministicCash += (detRev - effectiveMonthlyBurnINR);
    }

    if (p10 <= 0 && p10ExhaustionMonth === monthsToSimulate) p10ExhaustionMonth = m;
    if (p50 <= 0 && p50ExhaustionMonth === monthsToSimulate) p50ExhaustionMonth = m;
    if (p90 <= 0 && p90ExhaustionMonth === monthsToSimulate) p90ExhaustionMonth = m;

    dataPoints.push({
      month: m,
      monthLabel: monthLabels[m] || `M+${m}`,
      p10WorstCaseINR: Math.round(p10),
      p50ExpectedINR: Math.round(p50),
      p90BestCaseINR: Math.round(p90),
      deterministicINR: Math.round(Math.max(0, deterministicCash)),
    });
  }

  const baseNetBurn = effectiveMonthlyBurnINR - baseMonthlyRevenueINR;
  const currentRunwayMonths = baseNetBurn > 0 ? Number((startingCashINR / baseNetBurn).toFixed(1)) : 36.0;
  const projectedRunwayMonths = Number(p50ExhaustionMonth.toFixed(1));
  const runwayDeltaMonths = Number((projectedRunwayMonths - currentRunwayMonths).toFixed(1));

  // Date of cash exhaustion
  const today = new Date();
  const exhaustDate = new Date(today.setMonth(today.getMonth() + Math.min(24, Math.floor(projectedRunwayMonths))));
  const cashExhaustionDate = exhaustDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

  // Strategic AI recommendations
  const aiStrategicRecommendations: string[] = [];
  if (projectedRunwayMonths < 9) {
    aiStrategicRecommendations.push('⚠️ Runway is below 9-month critical threshold. Initiate Series A fundraising or enact hiring pause immediately.');
  }
  if (scenario.headcountDelta > 0) {
    aiStrategicRecommendations.push(`Adding ${scenario.headcountDelta} team members will compress runway by ~${(scenario.headcountDelta * 0.8).toFixed(1)} months without corresponding revenue acceleration.`);
  }
  if (scenario.cloudSpendReductionPercent > 0) {
    aiStrategicRecommendations.push(`Optimizing AWS/GCP cloud commitments recovers ₹${Math.round(cloudSpendSavingsINR).toLocaleString('en-IN')}/mo in gross cashflow.`);
  }
  if (scenario.gatewayMdrRatePercent < 2.0) {
    aiStrategicRecommendations.push(`Razorpay enterprise negotiated MDR rates save ₹${Math.round(mdrRateImprovementINR).toLocaleString('en-IN')}/mo in transaction fees.`);
  }

  return {
    dataPoints,
    currentRunwayMonths,
    projectedRunwayMonths,
    runwayDeltaMonths,
    cashExhaustionDate,
    monthlyBurnINR: effectiveMonthlyBurnINR,
    p10WorstCaseRunwayMonths: p10ExhaustionMonth,
    p90BestCaseRunwayMonths: p90ExhaustionMonth,
    aiStrategicRecommendations,
  };
}
