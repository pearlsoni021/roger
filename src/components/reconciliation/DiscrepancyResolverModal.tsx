import React from 'react';
import { ReconciliationRecord } from '../../types/finance';
import { formatINR } from '../../utils/formatters';
import { X, CheckCircle, FileText, Send, Sparkles } from 'lucide-react';

interface DiscrepancyResolverModalProps {
  record: ReconciliationRecord | null;
  onClose: () => void;
  onResolve: (recordId: string, actionType: string) => void;
}

export const DiscrepancyResolverModal: React.FC<DiscrepancyResolverModalProps> = ({
  record,
  onClose,
  onResolve,
}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-xl border border-[#E2DFD8] bg-[#111726] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2DFD8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#F7F6F2] border border-[#E2DFD8] px-2 py-0.5 text-xs font-mono text-[#1C2331]">
                {record.id}
              </span>
              <h2 className="text-sm font-semibold text-slate-100">3-Way Discrepancy Detail & Balancing</h2>
            </div>
            <p className="text-xs text-[#5E6C84] mt-1">Order ID: <span className="text-[#1C2331] font-mono">{record.orderId}</span> | Payment ID: <span className="text-[#1C2331] font-mono">{record.paymentId || 'N/A'}</span></p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#5E6C84] hover:bg-[#F7F6F2] hover:text-[#1C2331] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 3-Way Data Comparison Grid */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg border border-[#E2DFD8] bg-[#0D131F] p-3">
            <div className="text-[#5E6C84] font-medium text-[10px] uppercase">1. Razorpay Gateway</div>
            <div className="mt-1.5 text-sm font-bold text-slate-100 font-mono">{formatINR(record.gatewayGrossINR)}</div>
            <div className="mt-1 text-[11px] text-[#5E6C84]">MDR Fee: <span className="text-[#1C2331] font-mono">{formatINR(record.gatewayMdrINR)}</span></div>
            <div className="text-[11px] text-[#5E6C84]">Net Settled: <span className="text-[#1C2331] font-mono">{formatINR(record.gatewayNetINR)}</span></div>
          </div>

          <div className="rounded-lg border border-[#E2DFD8] bg-[#0D131F] p-3">
            <div className="text-[#5E6C84] font-medium text-[10px] uppercase">2. Bank Statement Feed</div>
            <div className="mt-1.5 text-sm font-bold text-slate-100 font-mono">{formatINR(record.bankCreditINR)}</div>
            <div className="mt-1 text-[11px] text-[#5E6C84]">Status: <span className="text-[#1C2331]">{record.bankCreditINR > 0 ? 'Credited' : 'Pending Float'}</span></div>
            <div className="text-[11px] text-[#5E6C84]">Bank: <span className="text-[#1C2331]">ICICI Current</span></div>
          </div>

          <div className="rounded-lg border border-[#E2DFD8] bg-[#0D131F] p-3">
            <div className="text-[#5E6C84] font-medium text-[10px] uppercase">3. ERP Ledger Invoice</div>
            <div className="mt-1.5 text-sm font-bold text-slate-100 font-mono">{formatINR(record.erpAmountINR)}</div>
            <div className="mt-1 text-[11px] text-[#5E6C84]">Inv #: <span className="text-[#1C2331] font-mono">{record.invoiceNumber || 'Missing'}</span></div>
            <div className="text-[11px] text-[#5E6C84]">Variance: <span className="font-mono text-[#1C2331]">{formatINR(record.varianceINR)}</span></div>
          </div>
        </div>

        {/* AI Explanation Callout */}
        <div className="mt-4 rounded-lg border border-[#E2DFD8] bg-[#0D131F] p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#1C2331]">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Reconciliation Agent Observation</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-[#1C2331]">
            {record.aiExplanation}
          </p>
        </div>

        {/* Journal Entry Preview if applicable */}
        {record.journalEntry && (
          <div className="mt-4 rounded-lg border border-[#E2DFD8] bg-[#0D131F] p-3.5">
            <div className="flex items-center justify-between text-xs font-medium text-[#1C2331] mb-2">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#5E6C84]" />
                Proposed Balancing Journal Entry
              </span>
              <span className="text-[11px] text-[#1C2331] font-mono">Amount: {formatINR(record.journalEntry.amountINR)}</span>
            </div>
            <div className="space-y-1 text-xs font-mono bg-slate-950 p-2.5 rounded border border-[#E2DFD8]/80">
              <div className="flex justify-between text-[#1C2331]">
                <span>DR. {record.journalEntry.debitAccount}</span>
                <span>{formatINR(record.journalEntry.amountINR)}</span>
              </div>
              <div className="flex justify-between text-[#5E6C84] pl-4">
                <span>CR. {record.journalEntry.creditAccount}</span>
                <span>{formatINR(record.journalEntry.amountINR)}</span>
              </div>
              <div className="text-[10px] text-[#5E6C84] italic pt-1 border-t border-slate-900">
                Narration: {record.journalEntry.narration}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-2.5 border-t border-[#E2DFD8] pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] px-3.5 py-1.5 text-xs font-medium text-[#1C2331] hover:bg-[#E2DFD8] transition-colors"
          >
            Close
          </button>

          {record.status === 'DISCREPANCY_MDR' && (
            <button
              onClick={() => {
                onResolve(record.id, 'RAISE_RAZORPAY_TICKET');
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Raise Dispute & Post Journal</span>
            </button>
          )}

          {record.status === 'UNRECORDED_REFUND' && (
            <button
              onClick={() => {
                onResolve(record.id, 'POST_ADJUSTMENT_JOURNAL');
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Post Void Journal Entry</span>
            </button>
          )}

          {record.status === 'GHOST_PAYMENT' && (
            <button
              onClick={() => {
                onResolve(record.id, 'POST_ADJUSTMENT_JOURNAL');
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Record Advance Receipt</span>
            </button>
          )}

          {record.status === 'TIMING_LAG' && (
            <button
              onClick={() => {
                onResolve(record.id, 'WAIT_T2_FLOAT');
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] px-3.5 py-1.5 text-xs font-medium text-[#1C2331] hover:bg-[#E2DFD8] transition-colors"
            >
              <span>Acknowledge Timing Float (T+2)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
