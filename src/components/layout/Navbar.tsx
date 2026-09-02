import React from 'react';
import { Search, ChevronDown, User } from 'lucide-react';
import { CompanyProfile } from '../../types/finance';

export type TabType = 'dashboard' | 'reconciliation' | 'treasury' | 'vendors' | 'copilot' | 'anomalies' | 'demo' | 'settings';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  companies: CompanyProfile[];
  selectedCompany: CompanyProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard' },
    { id: 'reconciliation' as TabType, label: 'Accounts' },
    { id: 'treasury' as TabType, label: 'Investments' },
    { id: 'vendors' as TabType, label: 'Planning' },
    { id: 'settings' as TabType, label: 'Activity' }
  ];

  return (
    <header className="bg-[#F7F6F2] border-b border-[#E2DFD8] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex flex-col justify-center cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <span className="text-xl font-serif text-[#1C2331] leading-none tracking-tight">AURA</span>
          <span className="text-[9px] text-[#5E6C84] uppercase tracking-[0.2em] mt-0.5">FINANCE</span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`text-[13px] relative py-5 transition-colors ${
                  isActive ? 'text-[#1C2331] font-medium' : 'text-[#5E6C84] font-normal hover:text-[#1C2331]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1C2331]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: User & Actions */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="h-7 w-7 rounded-full bg-[#E2DFD8] flex items-center justify-center text-[#5E6C84] group-hover:bg-[#D4D1CA] transition-colors">
              <User className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] text-[#1C2331] font-medium">Alexander K.</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#5E6C84]" />
            </div>
          </div>
          <button className="text-[#5E6C84] hover:text-[#1C2331] transition-colors">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
