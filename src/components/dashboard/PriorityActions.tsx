import React from 'react';
import { RotateCw, ArrowUpRight } from 'lucide-react';
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
    statusColor: 'bg-[#C9A84C]/15 text-[#C9A84C]',
  },
  {
    id: 'tx_02',
    description: 'AWS Cloud Infrastructure Payout',
    source: 'RazorpayX Direct',
    refId: '#INV-2026-0881',
    amount: 450000,
    status: 'TDS Paid',
    statusColor: 'bg-[#C9A84C]/15 text-[#C9A84C]',
  },
  {
    id: 'tx_03',
    description: 'UPI AutoPay Recurring Collections',
    source: 'ICICI Bank MT940',
    refId: '#REC-2026-9004',
    amount: 120000,
    status: 'Matched',
    statusColor: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    id: 'tx_04',
    description: 'MDR SLA Contract Variance Dispute',
    source: 'Gateway Auditor',
    refId: '#DSP-2026-9921',
    amount: 42500,
    status: 'Review',
    statusColor: 'bg-amber-500/10 text-amber-400',
  },
];

export const PriorityActions: React.FC<PriorityActionsProps> = ({
  onNavigateToTab,
}) => {
  return (
    <div className="bg-[#0F1629] border border-[#1E293B] rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">Recent Settlement & Payout Feeds</h3>
          <p className="text-xs font-normal text-slate-500 mt-0.5">Real-time ledger entries from Gateway and RazorpayX banking</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigateToTab('reconciliation')}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors font-medium"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => onNavigateToTab('reconciliation')}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors font-medium"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table Rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1E293B] text-xs font-medium text-slate-500">
              <th className="py-3 px-2">Transaction Name</th>
              <th className="py-3 px-2">Source</th>
              <th className="py-3 px-2">Reference ID</th>
              <th className="py-3 px-2">Amount</th>
              <th className="py-3 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B] font-normal">
            {RECENT_TRANSACTIONS.map((tx) => (
              <tr 
                key={tx.id}
                onClick={() => onNavigateToTab('reconciliation')}
                className="cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3.5 px-2">
                  <div className="font-medium text-slate-200">{tx.description}</div>
                </td>
                <td className="py-3.5 px-2 text-slate-400 font-normal">
                  {tx.source}
                </td>
                <td className="py-3.5 px-2 text-slate-500 font-mono text-xs font-normal">
                  {tx.refId}
                </td>
                <td className="py-3.5 px-2 font-mono font-medium text-white text-sm">
                  {formatINR(tx.amount)}
                </td>
                <td className="py-3.5 px-2 text-right">
                  <span className={`inline-block rounded-md px-3 py-1 text-[10.5px] font-medium ${tx.statusColor}`}>
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
