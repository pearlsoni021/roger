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
    <header className="w-full bg-[#0C1222] py-4 px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Page Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
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
              className="appearance-none cursor-pointer rounded-lg border border-[#1E293B] bg-[#0F1629] py-1.5 pl-8 pr-7 text-xs font-normal text-slate-300 hover:border-[#C9A84C] focus:outline-none transition-colors"
            >
              {companies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
            <Building2 className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        {/* Center/Right: Period Filter Pills & Search */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
          {/* Timeframe Pill Switcher */}
          <div className="flex items-center gap-1 rounded-lg bg-[#0F1629] p-1 border border-[#1E293B] text-xs font-normal">
            {(['Day', 'Week', 'Month', 'Year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1 transition-all ${
                  period === p
                    ? 'bg-[#C9A84C] text-[#0C1222] font-medium'
                    : 'text-slate-400 font-normal hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Date Range Pill */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-lg bg-[#0F1629] px-3.5 py-1.5 text-xs font-normal text-slate-400 border border-[#1E293B]">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>1 Sep 2026 - 30 Sep 2026</span>
          </div>

          {/* Search Pill */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="rounded-lg border border-[#1E293B] bg-[#0F1629] py-1.5 pl-8 pr-4 text-xs font-normal text-slate-300 placeholder:text-slate-500 focus:outline-none w-36 sm:w-48"
            />
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Ask CFO Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 rounded-lg bg-[#C9A84C] px-4 py-1.5 text-xs font-medium text-[#0C1222] hover:bg-[#D4B65E] transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#0C1222]" />
            <span>CFO AI</span>
          </button>

          {/* Demo Controls Button */}
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 rounded-lg bg-[#0F1629] border border-[#1E293B] px-3.5 py-1.5 text-xs font-normal text-slate-400 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Sandbox</span>
          </button>

          {/* Notification Bell */}
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F1629] border border-[#1E293B] text-slate-400 hover:text-white transition-colors font-normal">
            <Bell className="h-3.5 w-3.5" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F1629] border-2 border-[#C9A84C] text-[#C9A84C] font-medium text-xs">
            RP
          </div>
        </div>
      </div>
    </header>
  );
};
