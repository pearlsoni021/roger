import React from 'react';
import { RotateCw, ArrowUpRight, CheckCircle2, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface PriorityActionsProps {
  onNavigateToTab: (tab: any) => void;
  onAutoReconcile: () => void;
  onExecutePayouts: () => void;
}

const RECENT_TRANSACTIONS = [
  {
    id: 'tx_01',
    description: 'Corporate Card Gross Settlement',
    source: 'Razorpay Gateway',
    refId: '#REC-2026-9049',
    amount: 580000,
    status: 'Verified',
    statusColor: 'bg-[#1E2024] text-white',
  },
  {
    id: 'tx_02',
    description: 'AWS Cloud Infrastructure Payout',
    source: 'RazorpayX Direct',
    refId: '#INV-2026-0881',
    amount: 450000,
    status: 'TDS Paid',
    statusColor: 'bg-[#1E2024] text-white',
  },
  {
    id: 'tx_03',
    description: 'UPI AutoPay Recurring Collections',
    source: 'ICICI Bank MT940',
    refId: '#REC-2026-9004',
    amount: 120000,
    status: 'Matched',
    statusColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'tx_04',
    description: 'MDR SLA Contract Variance Dispute',
    source: 'Gateway Auditor',
    refId: '#DSP-2026-9921',
    amount: 42500,
    status: 'Review',
    statusColor: 'bg-amber-100 text-amber-800',
  },
];

export const PriorityActions: React.FC<PriorityActionsProps> = ({
  onNavigateToTab,
}) => {
  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
      {/* Header (Exact Match to Screenshot 'Course Purchases' Table Header) */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Settlement & Payout Feeds</h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time ledger entries from Gateway and RazorpayX banking</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigateToTab('reconciliation')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => onNavigateToTab('reconciliation')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table Rows (Matching Screenshot Columns: Name, Entity, ID, Amount, Status Pill) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
              <th className="py-3 px-2 font-medium">Transaction Name</th>
              <th className="py-3 px-2 font-medium">Source</th>
              <th className="py-3 px-2 font-medium">Reference ID</th>
              <th className="py-3 px-2 font-medium">Amount</th>
              <th className="py-3 px-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium">
            {RECENT_TRANSACTIONS.map((tx) => (
              <tr 
                key={tx.id}
                onClick={() => onNavigateToTab('reconciliation')}
                className="cursor-pointer hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-3.5 px-2">
                  <div className="font-bold text-slate-900">{tx.description}</div>
                </td>
                <td className="py-3.5 px-2 text-slate-500 font-normal">
                  {tx.source}
                </td>
                <td className="py-3.5 px-2 text-slate-400 font-mono text-[11px]">
                  {tx.refId}
                </td>
                <td className="py-3.5 px-2 font-mono font-bold text-slate-900">
                  {formatINR(tx.amount)}
                </td>
                <td className="py-3.5 px-2 text-right">
                  <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold ${tx.statusColor}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
