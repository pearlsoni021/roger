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
      {/* 1. Slate Hero Metric Card with High-Contrast White Text */}
      <div 
        onClick={() => onNavigateToTab('treasury')}
        className="cursor-pointer group rounded-3xl dark-hero-card p-5 text-white shadow-md hover:shadow-lg transition-all flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white tracking-wide">Total Liquid Reserves</span>
          <ArrowUpRight className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
        </div>
        <div>
          <div className="text-3xl font-black tracking-tight text-white font-mono drop-shadow-sm">
            {formatINR(company.totalCashINR, { compact: true })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
            <span>+4.2% from last month</span>
          </div>
        </div>
      </div>

      {/* 2. White Metric Card: Monthly Net Burn */}
      <div className="rounded-3xl bg-white border border-slate-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 tracking-wide">Monthly Net Burn</span>
        </div>
        <div>
          <div className="text-3xl font-black tracking-tight text-slate-900 font-mono">
            {formatINR(company.monthlyBurnINR, { compact: true })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
            <TrendingDown className="h-3.5 w-3.5 text-emerald-700" />
            <span>-2.9% OpEx efficiency</span>
          </div>
        </div>
      </div>

      {/* 3. White Metric Card: Runway Forecast */}
      <div 
        onClick={() => onNavigateToTab('treasury')}
        className="cursor-pointer group rounded-3xl bg-white border border-slate-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 tracking-wide">Runway Forecast</span>
          <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-slate-950 transition-colors" />
        </div>
        <div>
          <div className="text-3xl font-black tracking-tight text-slate-900 font-mono">
            {company.runwayMonths} <span className="text-base font-bold text-slate-600">Months</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-700" />
            <span>+1.5 months stability</span>
          </div>
        </div>
      </div>

      {/* 4. White Metric Card: Reconciliation Health */}
      <div 
        onClick={() => onNavigateToTab('reconciliation')}
        className="cursor-pointer group rounded-3xl bg-white border border-slate-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 tracking-wide">Reconciliation Health</span>
          <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-slate-950 transition-colors" />
        </div>
        <div>
          <div className="text-3xl font-black tracking-tight text-slate-900 font-mono">
            {reconciliationHealth}%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-700" />
            <span>60-record batch audited</span>
          </div>
        </div>
      </div>
    </div>
  );
};
