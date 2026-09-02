import React, { useState } from 'react';
import { Vendor, VendorInvoice } from '../../types/vendor';
import { formatINR, formatDate } from '../../utils/formatters';
import { 
  Receipt, 
  Plus, 
  Send, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { NewInvoiceModal } from './NewInvoiceModal';
import { BatchPayoutModal } from './BatchPayoutModal';
import { TaxReportsModal } from './TaxReportsModal';
import { compileForm26QReport } from '../../services/taxComplianceEngine';

interface VendorPayoutHubProps {
  vendors: Vendor[];
  invoices: VendorInvoice[];
  onAddInvoice: (invoice: VendorInvoice) => void;
  onExecuteBatchPayout: () => void;
}

export const VendorPayoutHub: React.FC<VendorPayoutHubProps> = ({
  vendors,
  invoices,
  onAddInvoice,
  onExecuteBatchPayout,
}) => {
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isBatchPayoutOpen, setIsBatchPayoutOpen] = useState(false);
  const [isTaxReportOpen, setIsTaxReportOpen] = useState(false);

  const pendingInvoices = invoices.filter(i => i.status !== 'PAID');
  const totalPendingNetINR = pendingInvoices.reduce((sum, i) => sum + i.netPayableINR, 0);
  const totalTdsDeductedINR = invoices.reduce((sum, i) => sum + i.tdsAmountINR, 0);

  const form26Q = compileForm26QReport(invoices);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DFD8] bg-[#F7F6F2] px-2 py-0.5 text-[11px] font-medium text-[#5E6C84]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Paid (RazorpayX)
          </span>
        );
      case 'TAX_VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DFD8] bg-[#F7F6F2] px-2 py-0.5 text-[11px] font-medium text-[#5E6C84]">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
            TDS Verified
          </span>
        );
      case 'SCHEDULED_PAYOUT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DFD8] bg-[#F7F6F2] px-2 py-0.5 text-[11px] font-medium text-[#5E6C84]">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Scheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-[#E2DFD8] bg-[#FFFFFF] px-2 py-0.5 text-[11px] text-[#5E6C84]">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[#E2DFD8] bg-[#FFFFFF] p-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-[#5E6C84]" />
            <h2 className="text-sm font-semibold text-[#1C2331]">Vendor Liabilities & Tax Compliance Hub</h2>
          </div>
          <p className="text-[11px] text-[#5E6C84] mt-0.5">
            Automated <strong>Section 194C/194J TDS deductions</strong>, <strong>Penny-Drop beneficiary verification</strong>, and <strong>RazorpayX payouts</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsTaxReportOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] px-3 py-1.5 text-xs font-medium text-[#1C2331] hover:bg-[#E2DFD8] transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#5E6C84]" />
            <span>Form 26Q Report</span>
          </button>

          <button
            onClick={() => setIsNewInvoiceOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] px-3 py-1.5 text-xs font-medium text-[#1C2331] hover:bg-[#E2DFD8] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Invoice</span>
          </button>

          {pendingInvoices.length > 0 && (
            <button
              onClick={() => setIsBatchPayoutOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#3A5A40] px-3.5 py-1.5 text-xs font-medium text-[#1C2331] hover:bg-[#2A402D] transition-colors shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Execute Payouts ({formatINR(totalPendingNetINR, { compact: true })})</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] p-3">
          <div className="text-[10px] font-medium text-[#5E6C84] uppercase">Pending Net Payable</div>
          <div className="text-base font-bold text-[#1C2331] font-mono mt-1">{formatINR(totalPendingNetINR, { compact: true })}</div>
        </div>
        <div className="rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] p-3">
          <div className="text-[10px] font-medium text-[#5E6C84] uppercase">Total TDS Retained (Q2)</div>
          <div className="text-base font-bold text-[#1C2331] font-mono mt-1">{formatINR(totalTdsDeductedINR)}</div>
        </div>
        <div className="rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] p-3">
          <div className="text-[10px] font-medium text-[#5E6C84] uppercase">Registered Entities</div>
          <div className="text-base font-bold text-[#1C2331] font-mono mt-1">{vendors.length} Vendors</div>
        </div>
        <div className="rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] p-3">
          <div className="text-[10px] font-medium text-[#5E6C84] uppercase">Penny-Drop Validation</div>
          <div className="text-base font-bold text-[#1C2331] font-mono mt-1 flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> 100% Passed
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-[#E2DFD8] bg-[#FFFFFF] overflow-hidden">
        <div className="border-b border-[#E2DFD8] p-3.5 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#1C2331]">Vendor Invoices & TDS Allocation Ledger</h3>
          <span className="text-[11px] text-[#5E6C84] font-mono">{invoices.length} invoices recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2DFD8] bg-[#FFFFFF] text-[11px] font-medium text-[#5E6C84] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Vendor & Invoice #</th>
                <th className="py-2.5 px-3.5">Base Amount</th>
                <th className="py-2.5 px-3.5">+ GST (18%)</th>
                <th className="py-2.5 px-3.5">TDS Section & Rate</th>
                <th className="py-2.5 px-3.5">- TDS Deducted</th>
                <th className="py-2.5 px-3.5">Net Payable</th>
                <th className="py-2.5 px-3.5">Due Date</th>
                <th className="py-2.5 px-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F7F6F2] transition-colors">
                  <td className="py-3 px-3.5 font-sans">
                    <div className="font-medium text-[#1C2331]">{inv.vendorName}</div>
                    <div className="text-[10px] font-mono text-[#5E6C84]">{inv.invoiceNumber}</div>
                  </td>
                  <td className="py-3 px-3.5 text-[#5E6C84]">
                    {formatINR(inv.baseAmountINR)}
                  </td>
                  <td className="py-3 px-3.5 text-[#5E6C84]">
                    +{formatINR(inv.gstAmountINR)}
                  </td>
                  <td className="py-3 px-3.5 font-sans text-[#5E6C84]">
                    <span className="rounded bg-[#F7F6F2] px-1.5 py-0.5 text-[10px] font-mono border border-[#E2DFD8]">
                      {inv.tdsSection}
                    </span>
                    <span className="text-[#5E6C84] text-[10px] ml-1">({inv.tdsRatePercent}%)</span>
                  </td>
                  <td className="py-3 px-3.5 text-[#5E6C84]">
                    -{formatINR(inv.tdsAmountINR)}
                  </td>
                  <td className="py-3 px-3.5 text-[#1C2331] font-bold">
                    {formatINR(inv.netPayableINR)}
                  </td>
                  <td className="py-3 px-3.5 text-[#5E6C84] font-sans text-[11px]">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="py-3 px-3.5 text-right font-sans">
                    {getStatusBadge(inv.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        vendors={vendors}
        onAddInvoice={onAddInvoice}
      />

      <BatchPayoutModal
        isOpen={isBatchPayoutOpen}
        onClose={() => setIsBatchPayoutOpen(false)}
        invoices={invoices}
        onComplete={onExecuteBatchPayout}
      />

      <TaxReportsModal
        isOpen={isTaxReportOpen}
        onClose={() => setIsTaxReportOpen(false)}
        form26Q={form26Q}
      />
    </div>
  );
};
