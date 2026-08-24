import React, { useState } from 'react';
import { CompanyProfile } from '../../types/finance';
import { 
  Search, 
  Bell, 
  Calendar, 
  Sparkles, 
  SlidersHorizontal, 
  Building2, 
  ChevronDown 
} from 'lucide-react';

interface NavbarProps {
  companies: CompanyProfile[];
  selectedCompany: CompanyProfile;
  onSelectCompany: (company: CompanyProfile) => void;
  onOpenDemo: () => void;
  onOpenCopilot: () => void;
  currentTheme?: string;
  onSelectTheme?: (theme: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  companies,
  selectedCompany,
  onSelectCompany,
  onOpenDemo,
  onOpenCopilot,
}) => {
  const [period, setPeriod] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Month');

  return (
    <header className="w-full bg-[#EDEDF0] py-4 px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Page Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#121316]">
            Dashboard
          </h1>
          <div className="relative hidden sm:block">
            <select
              aria-label="Select Company"
              value={selectedCompany.id}
              onChange={(e) => {
                const found = companies.find(c => c.id === e.target.value);
                if (found) onSelectCompany(found);
              }}
              className="appearance-none cursor-pointer rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-7 text-xs font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus:outline-none transition-colors"
            >
              {companies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
            <Building2 className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Center/Right: Period Filter Pills & Search */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
          {/* Timeframe Pill Switcher */}
          <div className="flex items-center gap-1 rounded-full bg-white p-1 border border-slate-200/80 shadow-sm text-xs font-medium">
            {(['Day', 'Week', 'Month', 'Year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3 py-1 transition-all ${
                  period === p
                    ? 'bg-[#1E2024] text-white font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Date Range Pill */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200/80 shadow-sm">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>1 Sep 2026 - 30 Sep 2026</span>
          </div>

          {/* Search Pill */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-4 text-xs text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none w-36 sm:w-48"
            />
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Ask CFO Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 rounded-full bg-[#1E2024] px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>CFO AI</span>
          </button>

          {/* Demo Controls Button */}
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sandbox</span>
          </button>

          {/* Notification Bell */}
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50">
            <Bell className="h-3.5 w-3.5" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E2024] text-white font-bold text-xs shadow-sm">
            RP
          </div>
        </div>
      </div>
    </header>
  );
};
