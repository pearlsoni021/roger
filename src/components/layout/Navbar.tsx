import React from 'react';
import { CompanyProfile } from '../../types/finance';
import { formatINR } from '../../utils/formatters';
import { Building2, ChevronDown, Sparkles, SlidersHorizontal, ShieldCheck, Palette } from 'lucide-react';

export type AppTheme = 'vintage' | 'dark' | 'slate';

interface NavbarProps {
  companies: CompanyProfile[];
  selectedCompany: CompanyProfile;
  onSelectCompany: (company: CompanyProfile) => void;
  onOpenDemo: () => void;
  onOpenCopilot: () => void;
  currentTheme?: AppTheme;
  onSelectTheme?: (theme: AppTheme) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  companies,
  selectedCompany,
  onSelectCompany,
  onOpenDemo,
  onOpenCopilot,
  currentTheme = 'vintage',
  onSelectTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Product Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-slate-100">
                Razorpay <span className="text-blue-600 font-medium">LedgerMind</span>
              </span>
              <span className="rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
                AI Finance Controller
              </span>
            </div>
          </div>
        </div>

        {/* Center: Active Company Selector */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <label htmlFor="company-select" className="sr-only">Select Company</label>
            <select
              id="company-select"
              aria-label="Select Company"
              value={selectedCompany.id}
              onChange={(e) => {
                const found = companies.find(c => c.id === e.target.value);
                if (found) onSelectCompany(found);
              }}
              className="appearance-none cursor-pointer rounded-lg border border-slate-700/70 bg-slate-900/90 py-1.5 pl-8 pr-7 text-xs font-medium text-slate-200 hover:border-slate-600 focus:outline-none transition-colors"
            >
              {companies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name} — {comp.industry}
                </option>
              ))}
            </select>
            <Building2 className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Right: Theme Selector & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Palette Switcher */}
          {onSelectTheme && (
            <div className="hidden lg:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/70 p-1 text-[11px]">
              <Palette className="h-3.5 w-3.5 text-slate-400 ml-1 mr-0.5" />
              <button
                onClick={() => onSelectTheme('vintage')}
                className={`rounded px-2.5 py-0.5 font-medium transition-colors ${
                  currentTheme === 'vintage' ? 'bg-[#92400E] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Vintage Beige
              </button>
              <button
                onClick={() => onSelectTheme('dark')}
                className={`rounded px-2.5 py-0.5 font-medium transition-colors ${
                  currentTheme === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Blade Dark
              </button>
              <button
                onClick={() => onSelectTheme('slate')}
                className={`rounded px-2.5 py-0.5 font-medium transition-colors ${
                  currentTheme === 'slate' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Nordic Slate
              </button>
            </div>
          )}

          {/* RazorpayX Escrow Balance */}
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs">
            <span className="text-[11px] text-slate-400">RazorpayX Escrow:</span>
            <span className="font-semibold text-slate-200 font-mono">{formatINR(selectedCompany.razorpayXBalanceINR, { compact: true })}</span>
          </div>

          {/* Ask CFO Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ask CFO AI</span>
          </button>

          {/* Evaluator Demo Controls Button */}
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Demo Controls</span>
          </button>
        </div>
      </div>
    </header>
  );
};
