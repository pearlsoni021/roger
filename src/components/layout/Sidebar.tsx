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
  Zap
} from 'lucide-react';

export type TabType = 'dashboard' | 'reconciliation' | 'treasury' | 'vendors' | 'copilot' | 'anomalies' | 'demo' | 'settings';

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
    { id: 'settings' as TabType, label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-300 p-5 flex flex-col justify-between hidden lg:flex min-h-screen">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#242831] text-white font-black text-sm shadow-sm">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-black text-xl text-slate-900 tracking-tight leading-none">
              Razorpay
            </div>
            <div className="text-[11px] font-bold text-slate-600 mt-0.5">
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
                className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#242831] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-bold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  <span className={isActive ? 'text-white font-extrabold' : 'text-slate-800 font-bold'}>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    isActive ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-900'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Middle/Bottom: Dark Promo Card */}
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-[#2D323B] to-[#1E2127] p-4 text-white shadow-md border border-slate-700">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400 shrink-0" />
            <div className="text-xs font-black text-white">Track 4: Controller</div>
          </div>
          <p className="text-[11px] text-slate-200 mt-1.5 leading-relaxed font-semibold">
            Autonomous 3-way reconciliation, Monte Carlo runway & tax hub.
          </p>
          <div className="mt-3">
            <span className="inline-block w-full text-center rounded-xl bg-white/20 py-1.5 text-[11px] font-black text-white backdrop-blur-sm border border-white/10">
              Live AI Swarm
            </span>
          </div>
        </div>

        {/* Bottom System Links */}
        <div className="space-y-1 pt-2 border-t border-slate-200 text-xs font-bold text-slate-700">
          <button 
            onClick={() => onSelectTab('settings')}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors font-bold ${
              activeTab === 'settings' ? 'bg-[#242831] text-white' : 'hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Settings className="h-4 w-4 text-slate-600" />
            <span>Settings</span>
          </button>
          <button 
            onClick={() => onSelectTab('copilot')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-100 hover:text-slate-950 transition-colors font-bold"
          >
            <HelpCircle className="h-4 w-4 text-slate-600" />
            <span>Help Center</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
