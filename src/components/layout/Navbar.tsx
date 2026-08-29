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
    <header className="w-full bg-[#F5F0E6] py-4 px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Page Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-[#2D1E17]">
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
              className="appearance-none cursor-pointer rounded-lg border border-[#E6DFD5] bg-[#FCFBF8] py-1.5 pl-8 pr-7 text-xs font-normal text-[#68554A] hover:border-[#A67C52] focus:outline-none transition-colors"
            >
              {companies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
            <Building2 className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#68554A]" />
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#68554A]" />
          </div>
        </div>

        {/* Center/Right: Period Filter Pills & Search */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
          {/* Timeframe Pill Switcher */}
          <div className="flex items-center gap-1 rounded-lg bg-[#FCFBF8] p-1 border border-[#E6DFD5] text-xs font-normal">
            {(['Day', 'Week', 'Month', 'Year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1 transition-all ${
                  period === p
                    ? 'bg-[#A67C52] text-[#FCFBF8] font-medium'
                    : 'text-[#68554A] font-normal hover:text-[#2D1E17]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Date Range Pill */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-lg bg-[#FCFBF8] px-3.5 py-1.5 text-xs font-normal text-[#68554A] border border-[#E6DFD5]">
            <Calendar className="h-3.5 w-3.5 text-[#68554A]" />
            <span>1 Sep 2026 - 30 Sep 2026</span>
          </div>

          {/* Search Pill */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="rounded-lg border border-[#E6DFD5] bg-[#FCFBF8] py-1.5 pl-8 pr-4 text-xs font-normal text-[#68554A] placeholder:text-[#68554A] focus:outline-none w-36 sm:w-48"
            />
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#68554A]" />
          </div>

          {/* Ask CFO Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 rounded-lg bg-[#A67C52] px-4 py-1.5 text-xs font-medium text-[#FCFBF8] hover:bg-[#8F6641] transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FCFBF8]" />
            <span>CFO AI</span>
          </button>

          {/* Demo Controls Button */}
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 rounded-lg bg-[#FCFBF8] border border-[#E6DFD5] px-3.5 py-1.5 text-xs font-normal text-[#68554A] hover:text-[#2D1E17] transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#68554A]" />
            <span className="hidden sm:inline">Sandbox</span>
          </button>

          {/* Notification Bell */}
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FCFBF8] border border-[#E6DFD5] text-[#68554A] hover:text-[#2D1E17] transition-colors font-normal">
            <Bell className="h-3.5 w-3.5" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCFBF8] border-2 border-[#A67C52] text-[#A67C52] font-medium text-xs">
            RP
          </div>
        </div>
      </div>
    </header>
  );
};
