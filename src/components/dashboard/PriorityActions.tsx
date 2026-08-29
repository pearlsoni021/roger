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
    statusColor: 'bg-[#F0E5D8] text-[#A67C52]',
  },
  {
    id: 'tx_02',
    description: 'AWS Cloud Infrastructure Payout',
    source: 'RazorpayX Direct',
    refId: '#INV-2026-0881',
    amount: 450000,
    status: 'TDS Paid',
    statusColor: 'bg-[#F0E5D8] text-[#A67C52]',
  },
  {
    id: 'tx_03',
    description: 'UPI AutoPay Recurring Collections',
    source: 'ICICI Bank MT940',
    refId: '#REC-2026-9004',
    amount: 120000,
    status: 'Matched',
    statusColor: 'bg-[#EAF0EB] text-[#4E7358]',
  },
  {
    id: 'tx_04',
    description: 'MDR SLA Contract Variance Dispute',
    source: 'Gateway Auditor',
    refId: '#DSP-2026-9921',
    amount: 42500,
    status: 'Review',
    statusColor: 'bg-[#F8F3E6] text-[#9E7209]',
  },
];

export const PriorityActions: React.FC<PriorityActionsProps> = ({
  onNavigateToTab,
}) => {
  return (
    <div className="bg-[#FCFBF8] border border-[#E6DFD5] rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD5]">
        <div>
          <h3 className="text-base font-semibold text-[#2D1E17] tracking-tight">Recent Settlement & Payout Feeds</h3>
          <p className="text-xs font-normal text-[#68554A] mt-0.5">Real-time ledger entries from Gateway and RazorpayX banking</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigateToTab('reconciliation')}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F2EBE1] text-[#68554A] hover:bg-[#E6DFD5] transition-colors font-medium"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => onNavigateToTab('reconciliation')}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F2EBE1] text-[#68554A] hover:bg-[#E6DFD5] transition-colors font-medium"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table Rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E6DFD5] text-xs font-medium text-[#68554A]">
              <th className="py-3 px-2">Transaction Name</th>
              <th className="py-3 px-2">Source</th>
              <th className="py-3 px-2">Reference ID</th>
              <th className="py-3 px-2">Amount</th>
              <th className="py-3 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6DFD5] font-normal">
            {RECENT_TRANSACTIONS.map((tx) => (
              <tr 
                key={tx.id}
                onClick={() => onNavigateToTab('reconciliation')}
                className="cursor-pointer hover:bg-[#F2EBE1] transition-colors"
              >
                <td className="py-3.5 px-2">
                  <div className="font-medium text-[#2D1E17]">{tx.description}</div>
                </td>
                <td className="py-3.5 px-2 text-[#68554A] font-normal">
                  {tx.source}
                </td>
                <td className="py-3.5 px-2 text-[#68554A] font-mono text-xs font-normal">
                  {tx.refId}
                </td>
                <td className="py-3.5 px-2 font-mono font-medium text-[#2D1E17] text-sm">
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
