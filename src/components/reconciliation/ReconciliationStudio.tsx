import React, { useState } from 'react';
import { ReconciliationRecord, MatchStatus, CompanyProfile } from '../../types/finance';
import { formatINR } from '../../utils/formatters';
import { 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RotateCcw, 
  FileText, 
  ArrowUpRight, 
  CheckCircle,
  ShieldAlert,
  Activity,
  Zap
} from 'lucide-react';
import { DiscrepancyResolverModal } from './DiscrepancyResolverModal';
import { LiveReconcileLogModal } from './LiveReconcileLogModal';
import { AuditReportModal } from './AuditReportModal';
import { generateReconciliationAgentThoughts, calculateReconciliationMetrics } from '../../services/reconciliationEngine';

interface ReconciliationStudioProps {
  records: ReconciliationRecord[];
  company: CompanyProfile;
  onUpdateRecordStatus: (recordId: string, actionType: string) => void;
  onAutoResolveAll: () => void;
}

export const ReconciliationStudio: React.FC<ReconciliationStudioProps> = ({
  records,
  company,
  onUpdateRecordStatus,
  onAutoResolveAll,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null);
  const [isLiveLogOpen, setIsLiveLogOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'ALL' | 'MATCHED' | 'DISCREPANCIES' | 'TIMING_LAG' | 'UNRESOLVABLE'>('ALL');

  const metrics = calculateReconciliationMetrics(records);
  const matchedCount = records.filter(r => r.status === 'MATCHED' || r.resolutionStatus === 'RESOLVED').length;
  const discrepancies = records.filter(r => r.status !== 'MATCHED' && r.status !== 'TIMING_LAG' && r.status !== 'UNRESOLVED_EXCEPTION' && r.resolutionStatus === 'PENDING');
  const timingLags = records.filter(r => r.status === 'TIMING_LAG');
  const unresolvable = records.filter(r => r.status === 'UNRESOLVED_EXCEPTION' || r.resolutionStatus === 'FLAGGED_UNRESOLVED');

  const filteredRecords = records.filter(r => {
    if (filterTab === 'MATCHED') return r.status === 'MATCHED' || r.resolutionStatus === 'RESOLVED';
    if (filterTab === 'DISCREPANCIES') return r.status !== 'MATCHED' && r.status !== 'TIMING_LAG' && r.status !== 'UNRESOLVED_EXCEPTION' && r.resolutionStatus === 'PENDING';
    if (filterTab === 'TIMING_LAG') return r.status === 'TIMING_LAG';
    if (filterTab === 'UNRESOLVABLE') return r.status === 'UNRESOLVED_EXCEPTION' || r.resolutionStatus === 'FLAGGED_UNRESOLVED';
    return true;
  });

  const getStatusBadge = (status: MatchStatus, resolutionStatus: string) => {
    if (resolutionStatus === 'RESOLVED') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Balanced (Journal Posted)
        </span>
      );
    }

    if (resolutionStatus === 'FLAGGED_UNRESOLVED' || status === 'UNRESOLVED_EXCEPTION') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-purple-900/50 bg-purple-950/40 px-2 py-0.5 text-[11px] font-medium text-purple-300">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
          Honest Exception (Legal Ops)
        </span>
      );
    }

    switch (status) {
      case 'MATCHED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-800/60 px-2 py-0.5 text-[11px] font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Exact 3-Way Match
          </span>
        );
      case 'DISCREPANCY_MDR':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-900/50 bg-rose-950/40 px-2 py-0.5 text-[11px] font-medium text-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            MDR Fee Drift
          </span>
        );
      case 'TIMING_LAG':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-800/60 px-2 py-0.5 text-[11px] font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
            Timing Float (T+2)
          </span>
        );
      case 'UNRECORDED_REFUND':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-900/50 bg-amber-950/40 px-2 py-0.5 text-[11px] font-medium text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Unrecorded Refund
          </span>
        );
      case 'GHOST_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/70 px-2 py-0.5 text-[11px] font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            Ghost Payment
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#111726] p-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">3-Way Financial Reconciliation Studio</h2>
            <span className="rounded bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 text-[10px] font-mono text-blue-300">
              Track 4 Benchmark Batch: {records.length} Records
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Automated reconciliation across <strong>Razorpay Gateway Settlements</strong>, <strong>Bank Feeds (MT940)</strong>, and <strong>ERP Invoices</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span>Audit Certificate</span>
          </button>

          {discrepancies.length > 0 && (
            <button
              onClick={onAutoResolveAll}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Auto-Balance {discrepancies.length} Variances</span>
            </button>
          )}

          <button
            onClick={() => setIsLiveLogOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Run 3-Way Match ({records.length} Batch)</span>
          </button>
        </div>
      </div>

      {/* Track 4 Evaluation Bar (Honest Exception List & Match Rate Bar) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-lg border border-slate-800 bg-[#0D131F] p-3">
          <div className="text-[10px] font-medium text-slate-400 uppercase">Batch Match Rate</div>
          <div className="text-base font-bold text-slate-100 font-mono mt-1">{metrics.batchMatchRatePercent}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{matchedCount}/{records.length} records verified</div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#0D131F] p-3">
          <div className="text-[10px] font-medium text-slate-400 uppercase">Total Audited Volume</div>
          <div className="text-base font-bold text-slate-100 font-mono mt-1">{formatINR(records.reduce((s, r) => s + r.gatewayGrossINR, 0), { compact: true })}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{metrics.throughputRecordsPerSec} rec/sec</div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#0D131F] p-3">
          <div className="text-[10px] font-medium text-slate-400 uppercase">Fee Drift Variances</div>
          <div className="text-base font-bold text-slate-100 font-mono mt-1">{discrepancies.length} Items</div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">1-click auto-balance</div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#0D131F] p-3">
          <div className="text-[10px] font-medium text-slate-400 uppercase">Settlement Timing Float</div>
          <div className="text-base font-bold text-slate-100 font-mono mt-1">{timingLags.length} Pending</div>
          <div className="text-[10px] text-slate-500 mt-0.5">T+2 clearing window</div>
        </div>

        <div className="rounded-lg border border-purple-900/40 bg-purple-950/20 p-3">
          <div className="text-[10px] font-medium text-purple-300 uppercase">Honest Exception List</div>
          <div className="text-base font-bold text-purple-200 font-mono mt-1">{unresolvable.length} Exception</div>
          <div className="text-[10px] text-purple-400 mt-0.5">Routed to Legal Ops</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setFilterTab('ALL')}
          className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
            filterTab === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Records ({records.length})
        </button>
        <button
          onClick={() => setFilterTab('DISCREPANCIES')}
          className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
            filterTab === 'DISCREPANCIES' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Variances ({discrepancies.length})
        </button>
        <button
          onClick={() => setFilterTab('TIMING_LAG')}
          className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
            filterTab === 'TIMING_LAG' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Timing Float ({timingLags.length})
        </button>
        <button
          onClick={() => setFilterTab('UNRESOLVABLE')}
          className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
            filterTab === 'UNRESOLVABLE' ? 'bg-purple-950 border border-purple-800 text-purple-200' : 'text-purple-400 hover:text-purple-200'
          }`}
        >
          Honest Exception List ({unresolvable.length})
        </button>
        <button
          onClick={() => setFilterTab('MATCHED')}
          className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
            filterTab === 'MATCHED' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Clean Matches ({matchedCount})
        </button>
      </div>

      {/* 3-Way Match Matrix Table */}
      <div className="rounded-xl border border-slate-800 bg-[#111726] overflow-hidden">
        <div className="overflow-x-auto max-h-[520px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 border-b border-slate-800 bg-slate-900 text-[11px] font-medium text-slate-400 uppercase tracking-wider z-10">
              <tr>
                <th className="py-2.5 px-3.5">Record ID</th>
                <th className="py-2.5 px-3.5">1. Gateway Gross</th>
                <th className="py-2.5 px-3.5">MDR Fee + GST</th>
                <th className="py-2.5 px-3.5">2. Bank Credit</th>
                <th className="py-2.5 px-3.5">3. ERP Invoice</th>
                <th className="py-2.5 px-3.5">Variance</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.map((rec) => (
                <tr 
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className="cursor-pointer hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-3.5">
                    <div className="font-semibold text-slate-200 group-hover:text-blue-400">{rec.id}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{rec.orderId}</div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-200">
                    {formatINR(rec.gatewayGrossINR)}
                  </td>
                  <td className="py-3 px-3.5 text-slate-400">
                    {formatINR(rec.gatewayMdrINR)}
                  </td>
                  <td className="py-3 px-3.5 text-slate-300">
                    {formatINR(rec.bankCreditINR)}
                  </td>
                  <td className="py-3 px-3.5 text-slate-300 font-sans">
                    {rec.invoiceNumber ? (
                      <span className="font-mono text-slate-300">{rec.invoiceNumber}</span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Unrecorded</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 font-bold">
                    <span className={rec.varianceINR === 0 ? 'text-slate-400' : 'text-slate-200'}>
                      {formatINR(rec.varianceINR)}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-sans">
                    {getStatusBadge(rec.status, rec.resolutionStatus)}
                  </td>
                  <td className="py-3 px-3.5 text-right font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecord(rec);
                      }}
                      className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <span>Review</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <DiscrepancyResolverModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onResolve={onUpdateRecordStatus}
      />

      <LiveReconcileLogModal
        isOpen={isLiveLogOpen}
        onClose={() => setIsLiveLogOpen(false)}
        thoughts={generateReconciliationAgentThoughts(records)}
        onComplete={() => {}}
      />

      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        company={company}
        records={records}
      />
    </div>
  );
};
