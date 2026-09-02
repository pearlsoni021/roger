import React, { useState, useMemo } from 'react';
import { CompanyProfile } from '../../types/finance';
import { WhatIfScenario, StressTestScenario } from '../../types/treasury';
import { runMonteCarloSimulation } from '../../services/monteCarloEngine';
import { 
  TrendingUp, 
  Hourglass, 
  Sparkles, 
  Users, 
  DollarSign, 
  Cloud, 
  RotateCcw,
  ShieldAlert,
  Sliders,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface RunwaySimulatorProps {
  company: CompanyProfile;
}

const DEFAULT_SCENARIO: WhatIfScenario = {
  id: 'base_scenario',
  name: 'Current Trajectory',
  description: 'Baseline financial forecast with default operating costs',
  headcountDelta: 0,
  avgMonthlyCtcPerHeadINR: 200000,
  monthlyRevenueGrowthPercent: 5,
  cloudSpendReductionPercent: 0,
  gatewayMdrRatePercent: 2.0,
  settlementTermsDays: 2,
  fundraiseAmountINR: 0,
  fundraiseExpectedMonth: 4,
};

const STRESS_PRESETS: StressTestScenario[] = [
  {
    id: 'stress_macro',
    title: 'Macro Tech Downturn',
    category: 'MACRO',
    impactDescription: '-20% YoY revenue contraction & elongated enterprise sales cycle',
    runwayReductionMonths: 4.8,
    cashDrainINR: 6400000,
    mitigationStrategy: 'Institute hiring freeze and reduce uncommitted marketing budgets by 30%.',
  },
  {
    id: 'stress_gateway_fee',
    title: 'Payment Gateway Float Squeeze',
    category: 'PAYMENTS',
    impactDescription: 'Higher chargeback reserves & delayed T+3 settlement clearance',
    runwayReductionMonths: 1.5,
    cashDrainINR: 2100000,
    mitigationStrategy: 'Switch to Razorpay Instant Settlement (T+0) to unlock daily working capital.',
  },
  {
    id: 'stress_top_churn',
    title: 'Enterprise Customer Churn',
    category: 'CHURN',
    impactDescription: 'Sudden 25% ARR drop from contract non-renewals',
    runwayReductionMonths: 5.2,
    cashDrainINR: 8800000,
    mitigationStrategy: 'Deploy proactive customer success retention offers and downsell contracts.',
  },
];

export const RunwaySimulator: React.FC<RunwaySimulatorProps> = ({ company }) => {
  const [scenario, setScenario] = useState<WhatIfScenario>(DEFAULT_SCENARIO);

  const simulation = useMemo(() => {
    return runMonteCarloSimulation(
      company.totalCashINR,
      company.monthlyRevenueINR,
      company.monthlyBurnINR,
      scenario,
      24,
      1000
    );
  }, [company, scenario]);

  const resetToDefault = () => setScenario(DEFAULT_SCENARIO);

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[#EAEAEA] bg-[#FFFFFF] p-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#4CAF50]" />
            <h2 className="text-sm font-semibold text-[#2E2E2E]">Monte Carlo Runway & Liquidity Modeler</h2>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-0.5">
            Simulating <strong>1,000 probabilistic financial trajectories</strong> across stochastic revenue volatility, hiring plans, and cloud spend.
          </p>
        </div>

        <button
          onClick={resetToDefault}
          className="flex items-center gap-1.5 rounded-lg border border-[#EAEAEA] bg-[#F5F0E6] px-3 py-1.5 text-xs font-medium text-[#2E2E2E] hover:bg-[#EBE5DE] transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#6B6B6B]" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Runway Scorecards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* P10 Stress Case */}
        <div className="rounded-xl border border-[#EAEAEA] bg-[#F5F0E6] p-4">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B] font-medium">
            <span>P10 Stress Case (Worst 10%)</span>
            <ShieldAlert className="h-3.5 w-3.5 text-[#6B6B6B]" />
          </div>
          <div className="mt-2 text-xl font-bold text-[#2E2E2E] font-mono">
            {simulation.p10WorstCaseRunwayMonths} <span className="text-xs font-normal text-[#6B6B6B]">Months</span>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-1">Severe revenue contraction & market contraction</p>
        </div>

        {/* P50 Expected Median */}
        <div className="rounded-xl border border-[#EAEAEA] bg-[#FFFFFF] p-4">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B] font-medium">
            <span>P50 Expected Median</span>
            <Hourglass className="h-3.5 w-3.5 text-[#6B6B6B]" />
          </div>
          <div className="mt-2 text-xl font-bold text-[#2E2E2E] font-mono">
            {simulation.projectedRunwayMonths} <span className="text-xs font-normal text-[#6B6B6B]">Months</span>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-1">Estimated zero-cash date: <strong className="text-[#2E2E2E] font-medium">{simulation.cashExhaustionDate}</strong></p>
        </div>

        {/* P90 Best Case */}
        <div className="rounded-xl border border-[#EAEAEA] bg-[#F5F0E6] p-4">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B] font-medium">
            <span>P90 Bull Case (Top 10%)</span>
            <Zap className="h-3.5 w-3.5 text-[#6B6B6B]" />
          </div>
          <div className="mt-2 text-xl font-bold text-[#2E2E2E] font-mono">
            {simulation.p90BestCaseRunwayMonths}+ <span className="text-xs font-normal text-[#6B6B6B]">Months</span>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-1">Strong growth & operating leverage</p>
        </div>
      </div>

      {/* Main Grid: Monte Carlo Fan Chart & What-If Sliders */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Monte Carlo Fan Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-[#EAEAEA] bg-[#FFFFFF] p-4">
          <div className="flex items-center justify-between pb-3">
            <div>
              <h3 className="text-xs font-semibold text-[#2E2E2E]">Cash Reserve Fan Curve (₹ Crores)</h3>
              <p className="text-[11px] text-[#6B6B6B]">P90 (Bull) ↔ P50 (Expected) ↔ P10 (Stress) 24-Month Projection</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulation.dataPoints} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="p90Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="p50Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="p10Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="monthLabel" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={10} 
                  tickLine={false} 
                  tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#EAEAEA',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#2E2E2E',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                  }}
                  formatter={(val: any, name: any) => [`₹${(Number(val) / 10000000).toFixed(2)} Cr`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Area type="monotone" dataKey="p90BestCaseINR" name="P90 (Bull Case)" stroke="#3B82F6" strokeWidth={1.5} fill="url(#p90Grad)" />
                <Area type="monotone" dataKey="p50ExpectedINR" name="P50 (Expected)" stroke="#10B981" strokeWidth={2} fill="url(#p50Grad)" />
                <Area type="monotone" dataKey="p10WorstCaseINR" name="P10 (Stress Case)" stroke="#64748B" strokeWidth={1.5} fill="url(#p10Grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI Strategic Insights */}
          <div className="mt-3 rounded-lg border border-[#EAEAEA] bg-[#F5F0E6] p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#6B6B6B]">
              <Sparkles className="h-3.5 w-3.5 text-[#4A6982]" />
              <span>Treasury Agent Observations</span>
            </div>
            {simulation.aiStrategicRecommendations.map((rec, i) => (
              <p key={i} className="text-[11px] text-[#6B6B6B] leading-relaxed">• {rec}</p>
            ))}
          </div>
        </div>

        {/* Right: Interactive What-If Scenario Builder (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-[#EAEAEA] bg-[#FFFFFF] p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2.5">
            <div className="flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-[#6B6B6B]" />
              <h3 className="text-xs font-semibold text-[#2E2E2E]">What-If Scenario Modeler</h3>
            </div>
            <span className="text-[10px] text-[#6B6B6B] font-mono">Dynamic Simulation</span>
          </div>

          {/* Slider 1: Hiring Headcount Delta */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#6B6B6B] flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#6B6B6B]" />
                Team Headcount Change
              </span>
              <span className="font-semibold text-[#2E2E2E] font-mono">
                {scenario.headcountDelta > 0 ? `+${scenario.headcountDelta}` : scenario.headcountDelta} Members
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="20"
              step="1"
              value={scenario.headcountDelta}
              onChange={(e) => setScenario({ ...scenario, headcountDelta: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6B6B6B]">
              <span>-10 Layoff</span>
              <span>0 (Current)</span>
              <span>+20 Hiring</span>
            </div>
          </div>

          {/* Slider 2: Monthly Revenue Growth Rate */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#6B6B6B] flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#6B6B6B]" />
                Monthly Revenue Growth Rate
              </span>
              <span className="font-semibold text-[#2E2E2E] font-mono">{scenario.monthlyRevenueGrowthPercent}% /mo</span>
            </div>
            <input
              type="range"
              min="-10"
              max="25"
              step="1"
              value={scenario.monthlyRevenueGrowthPercent}
              onChange={(e) => setScenario({ ...scenario, monthlyRevenueGrowthPercent: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6B6B6B]">
              <span>-10% Contraction</span>
              <span>+5% Base</span>
              <span>+25% High Growth</span>
            </div>
          </div>

          {/* Slider 3: Cloud & SaaS Spend Cut */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#6B6B6B] flex items-center gap-1.5">
                <Cloud className="h-3.5 w-3.5 text-[#6B6B6B]" />
                Cloud & SaaS Optimization
              </span>
              <span className="font-semibold text-[#2E2E2E] font-mono">-{scenario.cloudSpendReductionPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={scenario.cloudSpendReductionPercent}
              onChange={(e) => setScenario({ ...scenario, cloudSpendReductionPercent: Number(e.target.value) })}
              className="w-full accent-slate-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6B6B6B]">
              <span>0% Current</span>
              <span>20% Moderate</span>
              <span>40% Aggressive Cut</span>
            </div>
          </div>

          {/* Slider 4: Fundraise Round Injection */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#6B6B6B] flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#6B6B6B]" />
                Planned Funding Injection (₹ Cr)
              </span>
              <span className="font-semibold text-[#2E2E2E] font-mono">
                ₹{(scenario.fundraiseAmountINR / 10000000).toFixed(1)} Cr
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200000000"
              step="10000000"
              value={scenario.fundraiseAmountINR}
              onChange={(e) => setScenario({ ...scenario, fundraiseAmountINR: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6B6B6B]">
              <span>₹0 (Bootstrap)</span>
              <span>₹5 Cr (Seed)</span>
              <span>₹20 Cr (Series A)</span>
            </div>
          </div>

          {/* Stress Presets Quick Buttons */}
          <div className="pt-2 border-t border-[#EAEAEA]">
            <span className="text-[10px] font-medium text-[#6B6B6B] uppercase tracking-wide block mb-1.5">
              Preset Stress Scenarios
            </span>
            <div className="space-y-1.5">
              {STRESS_PRESETS.map((stress) => (
                <button
                  key={stress.id}
                  onClick={() => {
                    if (stress.id === 'stress_macro') {
                      setScenario({ ...scenario, monthlyRevenueGrowthPercent: -5, headcountDelta: 0 });
                    } else if (stress.id === 'stress_top_churn') {
                      setScenario({ ...scenario, monthlyRevenueGrowthPercent: -10, cloudSpendReductionPercent: 0 });
                    } else {
                      setScenario({ ...scenario, gatewayMdrRatePercent: 2.5 });
                    }
                  }}
                  className="w-full flex items-center justify-between rounded-md border border-[#EAEAEA] bg-[#F5F0E6] p-2 text-left hover:border-[#EAEAEA] transition-colors"
                >
                  <div>
                    <div className="text-xs font-medium text-[#2E2E2E]">{stress.title}</div>
                    <div className="text-[10px] text-[#6B6B6B]">{stress.impactDescription}</div>
                  </div>
                  <span className="text-xs font-mono font-medium text-[#6B6B6B]">-{stress.runwayReductionMonths}mo</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
