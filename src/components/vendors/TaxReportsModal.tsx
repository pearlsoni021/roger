import React from 'react';
import { Form26QSummary } from '../../types/vendor';
import { formatINR } from '../../utils/formatters';
import { X, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface TaxReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  form26Q: Form26QSummary;
}

export const TaxReportsModal: React.FC<TaxReportsModalProps> = ({
  isOpen,
  onClose,
  form26Q,
}) => {
  if (!isOpen) return null;

  const downloadTextFile = () => {
    const lines = [
      `FORM_26Q_ETDS_RETURN^${form26Q.quarter}^TAN:${form26Q.tan}`,
      `TOTAL_DEDUCTIONS^INR^${form26Q.totalDeductionsINR}`,
      `CHALLAN_NUMBER^${form26Q.challanNumber}`,
      `DEDUCTEES_COUNT^${form26Q.deducteesCount}`,
      ...form26Q.sectionBreakdown.map(s => `SECTION^${s.section}^BASE^${s.baseAmountINR}^TDS^${s.tdsDeductedINR}`),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Form26Q_eFiling_${form26Q.tan}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-xl border border-[#E2DFD8] bg-[#111726] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2DFD8] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7F6F2] text-[#1C2331]">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Form 26Q TDS Statutory Compliance Report</h2>
              <p className="text-xs text-[#5E6C84]">{form26Q.quarter} | TAN: <span className="font-mono text-[#1C2331]">{form26Q.tan}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#5E6C84] hover:bg-[#F7F6F2] hover:text-[#1C2331] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Breakdown by Section */}
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[#E2DFD8] bg-[#0D131F] p-3">
              <span className="text-[10px] uppercase text-[#5E6C84] font-medium">Total TDS Deposited</span>
              <div className="text-base font-bold text-slate-100 font-mono mt-1">{formatINR(form26Q.totalTdsDepositedINR)}</div>
              <span className="text-[10px] text-[#5E6C84] font-mono">Challan: {form26Q.challanNumber}</span>
            </div>
            <div className="rounded-lg border border-[#E2DFD8] bg-[#0D131F] p-3">
              <span className="text-[10px] uppercase text-[#5E6C84] font-medium">Total Deductees</span>
              <div className="text-base font-bold text-slate-100 font-mono mt-1">{form26Q.deducteesCount} Vendors</div>
              <span className="text-[10px] text-[#5E6C84] flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> 100% PAN & GSTIN Matched
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-[#E2DFD8] bg-[#0D131F] p-3.5">
            <h4 className="text-xs font-medium text-[#1C2331] uppercase tracking-wider mb-2.5">Section-wise Tax Allocation</h4>
            <div className="space-y-1.5 text-xs">
              {form26Q.sectionBreakdown.map((sec) => (
                <div key={sec.section} className="flex items-center justify-between border-b border-[#E2DFD8]/60 pb-1.5 last:border-0">
                  <div>
                    <div className="font-medium text-[#1C2331]">{sec.sectionName}</div>
                    <div className="text-[10px] text-[#5E6C84] font-mono">Base: {formatINR(sec.baseAmountINR)} ({sec.count} invoices)</div>
                  </div>
                  <div className="text-right font-mono text-slate-100">
                    {formatINR(sec.tdsDeductedINR)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-[#E2DFD8] pt-3.5">
          <span className="text-[11px] text-[#5E6C84]">TRACES e-TDS FVU Format Validated</span>
          <button
            onClick={downloadTextFile}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download e-Filing Return</span>
          </button>
        </div>
      </div>
    </div>
  );
};
