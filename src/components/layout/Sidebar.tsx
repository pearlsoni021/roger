import React from 'react';
import { 
  LayoutDashboard, 
  Scale, 
  TrendingUp, 
  Receipt, 
  MessageSquareCode, 
  AlertTriangle, 
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';

export type TabType = 'dashboard' | 'reconciliation' | 'treasury' | 'vendors' | 'copilot' | 'anomalies' | 'demo';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  openAnomaliesCount: number;
  unreconciledCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  openAnomaliesCount,
  unreconciledCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'CFO Overview',
      subtitle: 'Executive KPIs & Burn',
      icon: LayoutDashboard,
    },
    {
      id: 'reconciliation' as TabType,
      label: '3-Way Reconciliation',
      subtitle: 'Gateway ↔ Bank ↔ ERP',
      icon: Scale,
      badge: unreconciledCount > 0 ? `${unreconciledCount}` : undefined,
    },
    {
      id: 'treasury' as TabType,
      label: 'Runway & Simulator',
      subtitle: 'Monte Carlo & What-If',
      icon: TrendingUp,
    },
    {
      id: 'vendors' as TabType,
      label: 'Vendor & Tax Hub',
      subtitle: 'RazorpayX & TDS 194C/J',
      icon: Receipt,
    },
    {
      id: 'copilot' as TabType,
      label: 'CFO Copilot AI',
      subtitle: 'Natural Language Agent',
      icon: MessageSquareCode,
    },
    {
      id: 'anomalies' as TabType,
      label: 'Anomaly Watchdog',
      subtitle: 'Leakage & SaaS Creep',
      icon: AlertTriangle,
      badge: openAnomaliesCount > 0 ? `${openAnomaliesCount}` : undefined,
    },
    {
      id: 'demo' as TabType,
      label: 'Evaluator Sandbox',
      subtitle: 'Inject Attack & Scenarios',
      icon: SlidersHorizontal,
    },
  ];

  return (
    <aside className="w-60 shrink-0 border-r border-slate-800/80 bg-[#0B0F19] p-3 hidden lg:block">
      <div className="space-y-0.5">
        <div className="px-3 py-2 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
          Finance Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors ${
                isActive
                  ? 'bg-slate-800/80 text-white font-medium border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <div>
                  <div className="text-xs leading-none">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subtle RazorpayX Trust Footer */}
      <div className="mt-8 rounded-lg border border-slate-800/80 bg-slate-900/40 p-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
          <span>RazorpayX Escrow Guard</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">
          TDS auto-calculated on base value. NPCI & RBI compliant double-entry ledger lock.
        </p>
      </div>
    </aside>
  );
};
