import React from 'react';
import { 
  SlidersHorizontal, 
  Sparkles, 
  ShieldAlert, 
  Flame, 
  FileWarning, 
  Clock, 
  CheckCircle2, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface DemoControlPanelProps {
  onInjectMdrDiscrepancy: () => void;
  onInjectCloudSpike: () => void;
  onInjectFakeGstinInvoice: () => void;
  onInjectTimingFloat: () => void;
  onAutoReconcileAll: () => void;
  onResetBenchmark: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  onInjectMdrDiscrepancy,
  onInjectCloudSpike,
  onInjectFakeGstinInvoice,
  onInjectTimingFloat,
  onAutoReconcileAll,
  onResetBenchmark,
  onNavigateToTab,
}) => {
  return (
    <div className="space-y-5">
      {/* Top Showcase Banner */}
      <div className="rounded-xl border border-[#E6DFD5] bg-[#FCFBF8] p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F0E6] text-[#68554A]">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#2D1E17]">Evaluator Scenario Control Panel</h2>
            <p className="text-xs text-[#68554A]">Trigger simulated financial edge cases and evaluate autonomous agent responses in real time.</p>
          </div>
        </div>
      </div>

      {/* Scenario Triggers Grid */}
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {/* Scenario 1: MDR Overcharge */}
        <div className="rounded-xl border border-[#E6DFD5] bg-[#FCFBF8] p-4 space-y-2.5 hover:border-[#E6DFD5] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#2D1E17] font-medium text-xs">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              <span>Scenario 1: MDR Fee Contract Drift</span>
            </div>
            <span className="rounded bg-[#F5F0E6] border border-[#E6DFD5] px-1.5 py-0.5 text-[10px] text-[#68554A] font-mono">Gateway Drift</span>
          </div>
          <p className="text-[11px] text-[#68554A] leading-relaxed">
            Simulates Gateway settlement batch applying an unauthorized 3.50% fee tier on ₹8,50,000 corporate card volume.
          </p>
          <button
            onClick={() => {
              onInjectMdrDiscrepancy();
              onNavigateToTab('reconciliation');
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#E6DFD5] bg-[#F5F0E6]/90 py-2 text-xs font-medium text-[#2D1E17] hover:bg-[#E6DFD5] hover:text-[#2D1E17] transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-[#68554A]" />
            <span>Inject ₹42,500 MDR Discrepancy & Open 3-Way Reconcile</span>
          </button>
        </div>

        {/* Scenario 2: Cloud Spend Spike */}
        <div className="rounded-xl border border-[#E6DFD5] bg-[#FCFBF8] p-4 space-y-2.5 hover:border-[#E6DFD5] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#2D1E17] font-medium text-xs">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Scenario 2: AWS Infrastructure Cost Spike</span>
            </div>
            <span className="rounded bg-[#F5F0E6] border border-[#E6DFD5] px-1.5 py-0.5 text-[10px] text-[#68554A] font-mono">Runway Impact</span>
          </div>
          <p className="text-[11px] text-[#68554A] leading-relaxed">
            Injects monthly burn with a +₹4.5L cloud computing spike, shifting Monte Carlo P10 and P50 runway curves.
          </p>
          <button
            onClick={() => {
              onInjectCloudSpike();
              onNavigateToTab('treasury');
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#E6DFD5] bg-[#F5F0E6]/90 py-2 text-xs font-medium text-[#2D1E17] hover:bg-[#E6DFD5] hover:text-[#2D1E17] transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-[#68554A]" />
            <span>Simulate Cloud Burn Shock & Open Monte Carlo</span>
          </button>
        </div>

        {/* Scenario 3: Malicious Fake GSTIN Vendor Invoice */}
        <div className="rounded-xl border border-[#E6DFD5] bg-[#FCFBF8] p-4 space-y-2.5 hover:border-[#E6DFD5] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#2D1E17] font-medium text-xs">
              <FileWarning className="h-3.5 w-3.5 text-purple-400" />
              <span>Scenario 3: Fake GSTIN & Duplicate Invoice</span>
            </div>
            <span className="rounded bg-[#F5F0E6] border border-[#E6DFD5] px-1.5 py-0.5 text-[10px] text-[#68554A] font-mono">Tax Guardrail</span>
          </div>
          <p className="text-[11px] text-[#68554A] leading-relaxed">
            Ingests a vendor invoice with invalid 15-digit GSTIN checksum and duplicate billing fingerprint.
          </p>
          <button
            onClick={() => {
              onInjectFakeGstinInvoice();
              onNavigateToTab('vendors');
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#E6DFD5] bg-[#F5F0E6]/90 py-2 text-xs font-medium text-[#2D1E17] hover:bg-[#E6DFD5] hover:text-[#2D1E17] transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-[#68554A]" />
            <span>Upload Rogue Invoice & Test Tax Guardrails</span>
          </button>
        </div>

        {/* Scenario 4: Timing Float T+2 */}
        <div className="rounded-xl border border-[#E6DFD5] bg-[#FCFBF8] p-4 space-y-2.5 hover:border-[#E6DFD5] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#2D1E17] font-medium text-xs">
              <Clock className="h-3.5 w-3.5 text-[#4A6982]" />
              <span>Scenario 4: Settlement Float & Weekend Cut-Off</span>
            </div>
            <span className="rounded bg-[#F5F0E6] border border-[#E6DFD5] px-1.5 py-0.5 text-[10px] text-[#68554A] font-mono">Timing Float (T+2)</span>
          </div>
          <p className="text-[11px] text-[#68554A] leading-relaxed">
            Simulates weekend UPI/Card payments captured on Friday night and queued for Monday clearance.
          </p>
          <button
            onClick={() => {
              onInjectTimingFloat();
              onNavigateToTab('reconciliation');
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#E6DFD5] bg-[#F5F0E6]/90 py-2 text-xs font-medium text-[#2D1E17] hover:bg-[#E6DFD5] hover:text-[#2D1E17] transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-[#68554A]" />
            <span>Simulate Weekend Float Buffer</span>
          </button>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E6DFD5] bg-[#F5F0E6] p-4">
        <div className="flex items-center gap-2 text-xs text-[#68554A]">
          <Sparkles className="h-3.5 w-3.5 text-[#68554A]" />
          <span>Reset environment or trigger full autonomous reconciliation swarm</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetBenchmark}
            className="flex items-center gap-1.5 rounded-lg border border-[#E6DFD5] bg-[#F5F0E6] px-3.5 py-1.5 text-xs font-medium text-[#68554A] hover:bg-[#E6DFD5] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#68554A]" />
            <span>Reset to Benchmark</span>
          </button>
          <button
            onClick={onAutoReconcileAll}
            className="flex items-center gap-1.5 rounded-lg bg-[#A67C52] px-3.5 py-1.5 text-xs font-medium text-[#2D1E17] hover:bg-[#8F6641] transition-colors shadow-sm"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Run Complete Reconcile & Balance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
