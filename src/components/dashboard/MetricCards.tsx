import React from 'react';
import { CompanyProfile } from '../../types/finance';
import { formatINR } from '../../utils/formatters';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardsProps {
  company: CompanyProfile;
  reconciliationHealth: number;
  openAnomaliesCount: number;
  onNavigateToTab: (tab: any) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  company,
  reconciliationHealth,
  onNavigateToTab,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Hero Metric Card */}
      <div 
        onClick={() => onNavigateToTab('treasury')}
        className="cursor-pointer group rounded-xl bg-[#0F1629] border border-[#1E293B] border-l-4 border-l-[#C9A84C] p-5 shadow-sm hover:bg-[#131D35] transition-all flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 tracking-wide">Total Liquid Reserves</span>
          <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-[#C9A84C] group-hover:scale-110 transition-all" />
        </div>
        <div>
          <div className="text-3xl font-semibold tracking-tight text-white font-mono drop-shadow-sm">
            {formatINR(company.totalCashINR, { compact: true })}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-normal text-emerald-400 bg-emerald-500/10 rounded-md px-2 py-0.5">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+4.2% from last month</span>
          </div>
        </div>
      </div>

      {/* 2. Metric Card: Monthly Net Burn */}
      <div className="rounded-xl bg-[#0F1629] border border-[#1E293B] p-5 shadow-sm hover:bg-[#131D35] transition-all flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 tracking-wide">Monthly Net Burn</span>
        </div>
        <div>
          <div className="text-3xl font-semibold tracking-tight text-white font-mono">
            {formatINR(company.monthlyBurnINR, { compact: true })}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-normal text-emerald-400 bg-emerald-500/10 rounded-md px-2 py-0.5">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>-2.9% OpEx efficiency</span>
          </div>
        </div>
      </div>

      {/* 3. Metric Card: Runway Forecast */}
      <div 
        onClick={() => onNavigateToTab('treasury')}
        className="cursor-pointer group rounded-xl bg-[#0F1629] border border-[#1E293B] p-5 shadow-sm hover:bg-[#131D35] transition-all flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 tracking-wide">Runway Forecast</span>
          <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-[#C9A84C] transition-colors" />
        </div>
        <div>
          <div className="text-3xl font-semibold tracking-tight text-white font-mono">
            {company.runwayMonths} <span className="text-base font-medium text-slate-500">Months</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-normal text-emerald-400 bg-emerald-500/10 rounded-md px-2 py-0.5">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+1.5 months stability</span>
          </div>
        </div>
      </div>

      {/* 4. Metric Card: Reconciliation Health */}
      <div 
        onClick={() => onNavigateToTab('reconciliation')}
        className="cursor-pointer group rounded-xl bg-[#0F1629] border border-[#1E293B] p-5 shadow-sm hover:bg-[#131D35] transition-all flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 tracking-wide">Reconciliation Health</span>
          <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-[#C9A84C] transition-colors" />
        </div>
        <div>
          <div className="text-3xl font-semibold tracking-tight text-white font-mono">
            {reconciliationHealth}%
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-normal text-emerald-400 bg-emerald-500/10 rounded-md px-2 py-0.5">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>60-record batch audited</span>
          </div>
        </div>
      </div>
    </div>
  );
};
