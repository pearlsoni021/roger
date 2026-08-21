import React from 'react';
import { CompanyProfile } from '../../types/finance';
import { formatINR } from '../../utils/formatters';
import { Wallet, Flame, Hourglass, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface MetricCardsProps {
  company: CompanyProfile;
  reconciliationHealth: number;
  openAnomaliesCount: number;
  onNavigateToTab: (tab: any) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  company,
  reconciliationHealth,
  openAnomaliesCount,
  onNavigateToTab,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Liquidity / Cash Balance */}
      <div className="rounded-xl border border-slate-800 bg-[#111726] p-4 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">Total Liquid Reserves</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800/80 text-slate-300">
            <Wallet className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-xl font-bold tracking-tight text-slate-100 font-mono">
            {formatINR(company.totalCashINR, { compact: true })}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bank: {formatINR(company.primaryBank.currentBalanceINR, { compact: true })}</span>
            <span>Escrow: {formatINR(company.razorpayXBalanceINR, { compact: true })}</span>
          </div>
        </div>
      </div>

      {/* Monthly Net Burn */}
      <div className="rounded-xl border border-slate-800 bg-[#111726] p-4 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">Monthly Net Burn</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800/80 text-slate-300">
            <Flame className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-xl font-bold tracking-tight text-slate-100 font-mono">
            {formatINR(company.monthlyBurnINR, { compact: true })}
            <span className="text-xs font-normal text-slate-400"> /mo</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Revenue: {formatINR(company.monthlyRevenueINR, { compact: true })} /mo</span>
            <span className="text-slate-300 font-medium">Net OpEx</span>
          </div>
        </div>
      </div>

      {/* Projected Cash Runway */}
      <div 
        onClick={() => onNavigateToTab('treasury')}
        className="cursor-pointer group rounded-xl border border-slate-800 bg-[#111726] p-4 hover:border-slate-700 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200">Runway Forecast</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800/80 text-slate-300">
            <Hourglass className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-xl font-bold tracking-tight text-slate-100 font-mono flex items-baseline gap-1.5">
            <span>{company.runwayMonths}</span>
            <span className="text-xs font-normal text-slate-400">Months</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>P50 Expected Median</span>
            <span className="text-blue-400 flex items-center gap-0.5 group-hover:underline">Simulate <ArrowUpRight className="h-3 w-3" /></span>
          </div>
        </div>
      </div>

      {/* Reconciliation Health Score */}
      <div 
        onClick={() => onNavigateToTab('reconciliation')}
        className="cursor-pointer group rounded-xl border border-slate-800 bg-[#111726] p-4 hover:border-slate-700 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200">Reconciliation Health</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800/80 text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-xl font-bold tracking-tight text-slate-100 font-mono flex items-center gap-2">
            <span>{reconciliationHealth}%</span>
            {openAnomaliesCount > 0 && (
              <span className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[10px] font-normal text-slate-300">
                {openAnomaliesCount} alerts
              </span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Gateway ↔ Bank ↔ ERP</span>
            <span className="text-blue-400 flex items-center gap-0.5 group-hover:underline">Audit <ArrowUpRight className="h-3 w-3" /></span>
          </div>
        </div>
      </div>
    </div>
  );
};
