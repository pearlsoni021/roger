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
    statusColor: 'bg-[#242831] text-white',
  },
  {
    id: 'tx_02',
    description: 'AWS Cloud Infrastructure Payout',
    source: 'RazorpayX Direct',
    refId: '#INV-2026-0881',
    amount: 450000,
    status: 'TDS Paid',
    statusColor: 'bg-[#242831] text-white',
  },
  {
    id: 'tx_03',
    description: 'UPI AutoPay Recurring Collections',
    source: 'ICICI Bank MT940',
    refId: '#REC-2026-9004',
    amount: 120000,
    status: 'Matched',
    statusColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold',
  },
  {
    id: 'tx_04',
    description: 'MDR SLA Contract Variance Dispute',
    source: 'Gateway Auditor',
    refId: '#DSP-2026-9921',
    amount: 42500,
    status: 'Review',
    statusColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold',
  },
];

export const PriorityActions: React.FC<PriorityActionsProps> = ({
  onNavigateToTab,
}) => {
  return (
    <div className="rounded-3xl bg-white border border-slate-300 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">Recent Settlement & Payout Feeds</h3>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">Real-time ledger entries from Gateway and RazorpayX banking</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigateToTab('reconciliation')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors font-bold"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => onNavigateToTab('reconciliation')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors font-bold"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table Rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-black text-slate-800">
              <th className="py-3 px-2">Transaction Name</th>
              <th className="py-3 px-2">Source</th>
              <th className="py-3 px-2">Reference ID</th>
              <th className="py-3 px-2">Amount</th>
              <th className="py-3 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold">
            {RECENT_TRANSACTIONS.map((tx) => (
              <tr 
                key={tx.id}
                onClick={() => onNavigateToTab('reconciliation')}
                className="cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <td className="py-3.5 px-2">
                  <div className="font-extrabold text-slate-900">{tx.description}</div>
                </td>
                <td className="py-3.5 px-2 text-slate-700 font-semibold">
                  {tx.source}
                </td>
                <td className="py-3.5 px-2 text-slate-600 font-mono text-xs font-bold">
                  {tx.refId}
                </td>
                <td className="py-3.5 px-2 font-mono font-black text-slate-950 text-sm">
                  {formatINR(tx.amount)}
                </td>
                <td className="py-3.5 px-2 text-right">
                  <span className={`inline-block rounded-full px-3 py-1 text-[10.5px] font-black ${tx.statusColor}`}>
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
