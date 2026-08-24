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
      {/* 1. Dark Hero Metric Card (Exact Match to Screenshot 'Total Revenue' Card) */}
      <div 
        onClick={() => onNavigateToTab('treasury')}
        className="cursor-pointer group rounded-3xl bg-gradient-to-br from-[#23262C] to-[#141518] p-5 text-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300">Total Liquid Reserves</span>
          <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight font-mono">
            {formatINR(company.totalCashINR, { compact: true })}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+4.2% from last month</span>
          </div>
        </div>
      </div>

      {/* 2. White Metric Card: Monthly Net Burn */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Monthly Net Burn</span>
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            {formatINR(company.monthlyBurnINR, { compact: true })}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>-2.9% OpEx efficiency</span>
          </div>
        </div>
      </div>

      {/* 3. White Metric Card: Runway Forecast */}
      <div 
        onClick={() => onNavigateToTab('treasury')}
        className="cursor-pointer group rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Runway Forecast</span>
          <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            {company.runwayMonths} <span className="text-sm font-normal text-slate-500">Months</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+1.5 months stability</span>
          </div>
        </div>
      </div>

      {/* 4. White Metric Card: Reconciliation Health */}
      <div 
        onClick={() => onNavigateToTab('reconciliation')}
        className="cursor-pointer group rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Reconciliation Health</span>
          <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            {reconciliationHealth}%
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>60-record batch audited</span>
          </div>
        </div>
      </div>
    </div>
  );
};
