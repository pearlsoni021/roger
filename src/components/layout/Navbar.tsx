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
  const isVintage = currentTheme === 'vintage';

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 ${
      isVintage 
        ? 'border-[#E3D9C8] bg-[#FAF7F2]/95 shadow-[0_1px_4px_rgba(40,30,15,0.04)]' 
        : 'border-slate-800/80 bg-[#090D16]/90'
    }`}>
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Product Title */}
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm ${
            isVintage ? 'bg-[#1B365D] text-white' : 'bg-blue-600 text-white'
          }`}>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold tracking-tight ${
                isVintage ? 'text-[#181410]' : 'text-slate-100'
              }`}>
                Razorpay <span className={isVintage ? 'text-[#1B365D] font-bold' : 'text-blue-400 font-medium'}>LedgerMind</span>
              </span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${
                isVintage 
                  ? 'border-[#D8CBB7] bg-[#EFE8DD] text-[#524434]' 
                  : 'border-slate-700 bg-slate-800/80 text-slate-300'
              }`}>
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
              className={`appearance-none cursor-pointer rounded-lg border py-1.5 pl-8 pr-7 text-xs font-medium focus:outline-none transition-colors ${
                isVintage 
                  ? 'border-[#D8CBB7] bg-[#FAF7F2] text-[#181410] hover:border-[#B8A68E]' 
                  : 'border-slate-700/70 bg-slate-900/90 text-slate-200 hover:border-slate-600'
              }`}
            >
              {companies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name} — {comp.industry}
                </option>
              ))}
            </select>
            <Building2 className={`pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
              isVintage ? 'text-[#786B5A]' : 'text-slate-400'
            }`} />
            <ChevronDown className={`pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
              isVintage ? 'text-[#786B5A]' : 'text-slate-400'
            }`} />
          </div>
        </div>

        {/* Right: Theme Selector & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Palette Switcher */}
          {onSelectTheme && (
            <div className={`hidden lg:flex items-center gap-1 rounded-lg border p-1 text-[11px] ${
              isVintage ? 'border-[#E3D9C8] bg-[#EFE8DD]' : 'border-slate-800 bg-slate-900/70'
            }`}>
              <Palette className={`h-3.5 w-3.5 ml-1 mr-0.5 ${isVintage ? 'text-[#786B5A]' : 'text-slate-400'}`} />
              <button
                onClick={() => onSelectTheme('vintage')}
                className={`rounded px-2.5 py-0.5 font-semibold transition-all ${
                  currentTheme === 'vintage' 
                    ? 'bg-[#1B365D] text-white shadow-sm' 
                    : isVintage ? 'text-[#524434] hover:text-[#181410]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Vintage Ivory
              </button>
              <button
                onClick={() => onSelectTheme('dark')}
                className={`rounded px-2.5 py-0.5 font-semibold transition-all ${
                  currentTheme === 'dark' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : isVintage ? 'text-[#524434] hover:text-[#181410]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Blade Dark
              </button>
              <button
                onClick={() => onSelectTheme('slate')}
                className={`rounded px-2.5 py-0.5 font-semibold transition-all ${
                  currentTheme === 'slate' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : isVintage ? 'text-[#524434] hover:text-[#181410]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Nordic Slate
              </button>
            </div>
          )}

          {/* RazorpayX Escrow Balance */}
          <div className={`hidden sm:flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs ${
            isVintage ? 'border-[#E3D9C8] bg-[#EFE8DD]' : 'border-slate-800 bg-slate-900/60'
          }`}>
            <span className={`text-[11px] ${isVintage ? 'text-[#786B5A]' : 'text-slate-400'}`}>RazorpayX Escrow:</span>
            <span className={`font-semibold font-mono ${isVintage ? 'text-[#181410]' : 'text-slate-200'}`}>
              {formatINR(selectedCompany.razorpayXBalanceINR, { compact: true })}
            </span>
          </div>

          {/* Ask CFO Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors ${
              isVintage ? 'bg-[#1B365D] hover:bg-[#142A4A]' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ask CFO AI</span>
          </button>

          {/* Evaluator Demo Controls Button */}
          <button
            onClick={onOpenDemo}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              isVintage 
                ? 'border-[#D5C7B3] bg-[#E6DCCF] text-[#181410] hover:bg-[#D5C7B3]' 
                : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <SlidersHorizontal className={`h-3.5 w-3.5 ${isVintage ? 'text-[#524434]' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Demo Controls</span>
          </button>
        </div>
      </div>
    </header>
  );
};
