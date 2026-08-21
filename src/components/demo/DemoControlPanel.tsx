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
      <div className="rounded-xl border border-slate-800 bg-[#111726] p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Evaluator Scenario Control Panel</h2>
            <p className="text-xs text-slate-400">Trigger simulated financial edge cases and evaluate autonomous agent responses in real time.</p>
          </div>
        </div>
      </div>

      {/* Scenario Triggers Grid */}
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {/* Scenario 1: MDR Overcharge */}
        <div className="rounded-xl border border-slate-800 bg-[#111726] p-4 space-y-2.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium text-xs">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              <span>Scenario 1: MDR Fee Contract Drift</span>
            </div>
            <span className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">Gateway Drift</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Simulates Gateway settlement batch applying an unauthorized 3.50% fee tier on ₹8,50,000 corporate card volume.
          </p>
          <button
            onClick={() => {
              onInjectMdrDiscrepancy();
              onNavigateToTab('reconciliation');
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-slate-400" />
            <span>Inject ₹42,500 MDR Discrepancy & Open 3-Way Reconcile</span>
          </button>
        </div>

        {/* Scenario 2: Cloud Spend Spike */}
        <div className="rounded-xl border border-slate-800 bg-[#111726] p-4 space-y-2.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium text-xs">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Scenario 2: AWS Infrastructure Cost Spike</span>
            </div>
            <span className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">Runway Impact</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Injects monthly burn with a +₹4.5L cloud computing spike, shifting Monte Carlo P10 and P50 runway curves.
          </p>
          <button
            onClick={() => {
              onInjectCloudSpike();
              onNavigateToTab('treasury');
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-slate-400" />
            <span>Simulate Cloud Burn Shock & Open Monte Carlo</span>
          </button>
        </div>

        {/* Scenario 3: Malicious Fake GSTIN Vendor Invoice */}
        <div className="rounded-xl border border-slate-800 bg-[#111726] p-4 space-y-2.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium text-xs">
              <FileWarning className="h-3.5 w-3.5 text-purple-400" />
              <span>Scenario 3: Fake GSTIN & Duplicate Invoice</span>
            </div>
            <span className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">Tax Guardrail</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Ingests a vendor invoice with invalid 15-digit GSTIN checksum and duplicate billing fingerprint.
          </p>
          <button
            onClick={() => {
              onInjectFakeGstinInvoice();
              onNavigateToTab('vendors');
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-slate-400" />
            <span>Upload Rogue Invoice & Test Tax Guardrails</span>
          </button>
        </div>

        {/* Scenario 4: Timing Float T+2 */}
        <div className="rounded-xl border border-slate-800 bg-[#111726] p-4 space-y-2.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium text-xs">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span>Scenario 4: Settlement Float & Weekend Cut-Off</span>
            </div>
            <span className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">Timing Float (T+2)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Simulates weekend UPI/Card payments captured on Friday night and queued for Monday clearance.
          </p>
          <button
            onClick={() => {
              onInjectTimingFloat();
              onNavigateToTab('reconciliation');
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Zap className="h-3.5 w-3.5 text-slate-400" />
            <span>Simulate Weekend Float Buffer</span>
          </button>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0D131F] p-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-slate-400" />
          <span>Reset environment or trigger full autonomous reconciliation swarm</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetBenchmark}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset to Benchmark</span>
          </button>
          <button
            onClick={onAutoReconcileAll}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow-sm"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Run Complete Reconcile & Balance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
