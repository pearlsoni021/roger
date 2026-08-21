import React from 'react';
import { ArrowRight, ShieldAlert, Receipt, TrendingUp } from 'lucide-react';
import { TabType } from '../layout/Sidebar';

interface PriorityActionsProps {
  onNavigateToTab: (tab: TabType) => void;
  onAutoReconcile: () => void;
  onExecutePayouts: () => void;
}

export const PriorityActions: React.FC<PriorityActionsProps> = ({
  onNavigateToTab,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#111726] p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-xs font-semibold text-slate-200">Recommended Controller Actions</h3>
          <p className="text-[11px] text-slate-400">Autonomous monitors identified 3 operational items requiring review</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Action 1: Discrepancy Auto-Resolve */}
        <div className="flex flex-col justify-between rounded-lg border border-slate-800/90 bg-[#0D131F] p-3.5 hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              <span>₹6,670 MDR Variance Found</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              Dispute dossier ready for Razorpay settlement Batch #B-8813 (Corporate card SLA).
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('reconciliation')}
            className="mt-3 flex items-center justify-between rounded-md bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <span>Review & Dispute</span>
            <ArrowRight className="h-3 w-3 text-slate-400" />
          </button>
        </div>

        {/* Action 2: Batch Vendor Payouts */}
        <div className="flex flex-col justify-between rounded-lg border border-slate-800/90 bg-[#0D131F] p-3.5 hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
              <Receipt className="h-3.5 w-3.5 text-emerald-400" />
              <span>₹12.64L Vendor Payouts Ready</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              TDS Section 194C/J verified with Penny-Drop bank check completed.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('vendors')}
            className="mt-3 flex items-center justify-between rounded-md bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <span>Review & Disburse</span>
            <ArrowRight className="h-3 w-3 text-slate-400" />
          </button>
        </div>

        {/* Action 3: Runway Extension Simulation */}
        <div className="flex flex-col justify-between rounded-lg border border-slate-800/90 bg-[#0D131F] p-3.5 hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
              <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
              <span>Extend Runway by +3.2 Months</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              Deprovision 8 idle SaaS seats and enable T+0 instant settlements.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('treasury')}
            className="mt-3 flex items-center justify-between rounded-md bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <span>Open Simulation</span>
            <ArrowRight className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
