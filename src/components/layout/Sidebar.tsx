import React from 'react';
import { 
  LayoutDashboard, 
  Scale, 
  TrendingUp, 
  Receipt, 
  MessageSquareCode, 
  AlertTriangle, 
  SlidersHorizontal,
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut,
  Zap
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
  const mainNav = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'reconciliation' as TabType, 
      label: 'Reconciliation', 
      icon: Scale,
      badge: unreconciledCount > 0 ? `${unreconciledCount}` : undefined,
    },
    { id: 'treasury' as TabType, label: 'Treasury & Runway', icon: TrendingUp },
    { id: 'vendors' as TabType, label: 'Vendor Payouts', icon: Receipt },
    { id: 'copilot' as TabType, label: 'CFO Copilot', icon: MessageSquareCode },
    { 
      id: 'anomalies' as TabType, 
      label: 'Risk & Anomalies', 
      icon: AlertTriangle,
      badge: openAnomaliesCount > 0 ? `${openAnomaliesCount}` : undefined,
    },
    { id: 'demo' as TabType, label: 'Demo Sandbox', icon: SlidersHorizontal },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between hidden lg:flex min-h-screen">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1E2024] text-white font-bold text-sm shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
              Razorpay
            </div>
            <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
              LedgerMind AI
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1E2024] text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Middle/Bottom: Dark Promo Card (Matching Screenshot 'Upgrade To Pro' Card) */}
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-[#23262B] to-[#121316] p-4 text-white shadow-md">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <div className="text-xs font-bold">Track 4: Controller</div>
          </div>
          <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">
            Autonomous multi-agent 3-way reconciliation, Monte Carlo runway & tax hub.
          </p>
          <div className="mt-3">
            <span className="inline-block w-full text-center rounded-xl bg-white/15 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              Live AI Swarm
            </span>
          </div>
        </div>

        {/* Bottom System Links */}
        <div className="space-y-1 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-100/80 hover:text-slate-900 transition-colors">
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-100/80 hover:text-slate-900 transition-colors">
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span>Help Center</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
