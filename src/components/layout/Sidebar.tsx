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
    <aside className="w-64 shrink-0 bg-[#FFFFFF] border-r border-[#E2DFD8] p-5 flex flex-col justify-between hidden lg:flex min-h-screen">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-transparent border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold text-sm shadow-sm">
            <ShieldCheck className="h-5 w-5 text-[#1E3A8A]" />
          </div>
          <div>
            <div className="font-bold text-xl text-[#1C2331] tracking-tight leading-none">
              Razorpay
            </div>
            <div className="text-[11px] font-normal text-[#5E6C84] mt-0.5">
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
                className={`flex w-full items-center justify-between rounded-lg px-3.5 py-3 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#F0F4F8] text-[#1E3A8A] border-l-2 border-[#1E3A8A]'
                    : 'text-[#5E6C84] hover:text-[#1C2331] hover:bg-black/5 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#1E3A8A]' : 'text-[#5E6C84]'}`} />
                  <span className={isActive ? 'text-[#1E3A8A] font-medium' : 'text-[#5E6C84] font-medium'}>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="rounded-md px-2 py-0.5 text-[10px] font-medium bg-[#F0F4F8] text-[#1E3A8A]">
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
        <div className="rounded-xl bg-[#FFFFFF] p-4 shadow-sm border border-[#E2DFD8] border-l-2 border-l-[#A67C52]">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#1E3A8A] shrink-0" />
            <div className="text-xs font-medium text-[#1C2331]">Track 4: Controller</div>
          </div>
          <p className="text-[11px] text-[#5E6C84] mt-1.5 leading-relaxed font-normal">
            Autonomous 3-way reconciliation, Monte Carlo runway & tax hub.
          </p>
          <div className="mt-3">
            <span className="inline-block w-full text-center rounded-lg bg-[#F0F4F8] py-1.5 text-[11px] font-medium text-[#1E3A8A]">
              Live AI Swarm
            </span>
          </div>
        </div>

        {/* Bottom System Links */}
        <div className="space-y-1 pt-2 border-t border-[#E2DFD8] text-xs font-medium text-[#5E6C84]">
          <button 
            onClick={() => onSelectTab('settings')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors font-medium ${
              activeTab === 'settings' ? 'bg-[#F0F4F8] text-[#1E3A8A] border-l-2 border-[#1E3A8A]' : 'hover:text-[#1C2331] hover:bg-black/5 border-l-2 border-transparent text-[#5E6C84]'
            }`}
          >
            <Settings className={`h-4 w-4 ${activeTab === 'settings' ? 'text-[#1E3A8A]' : 'text-[#5E6C84]'}`} />
            <span>Settings</span>
          </button>
          <button 
            onClick={() => onSelectTab('copilot')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:text-[#1C2331] hover:bg-black/5 transition-colors font-medium border-l-2 border-transparent text-[#5E6C84]"
          >
            <HelpCircle className="h-4 w-4 text-[#5E6C84]" />
            <span>Help Center</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
