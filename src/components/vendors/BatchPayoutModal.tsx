import React, { useState, useEffect } from 'react';
import { VendorInvoice } from '../../types/vendor';
import { formatINR } from '../../utils/formatters';
import { X, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BatchPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: VendorInvoice[];
  onComplete: () => void;
}

export const BatchPayoutModal: React.FC<BatchPayoutModalProps> = ({
  isOpen,
  onClose,
  invoices,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const payableInvoices = invoices.filter(i => i.status !== 'PAID');
  const totalNetPayable = payableInvoices.reduce((sum, i) => sum + i.netPayableINR, 0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsDone(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 25;
        } else {
          setIsDone(true);
          clearInterval(interval);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
          onComplete();
          return 100;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-[#111726] p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">RazorpayX Batch Payout Execution</h3>
            <p className="text-xs text-slate-400">Direct Escrow NEFT/RTGS with Penny-Drop Verified Beneficiaries</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs">
          <div className="rounded-lg border border-slate-800 bg-[#0D131F] p-3.5">
            <div className="flex justify-between text-slate-400 pb-1.5 border-b border-slate-800">
              <span>Total Invoices in Batch:</span>
              <span className="font-semibold text-slate-200 font-mono">{payableInvoices.length} Invoices</span>
            </div>
            <div className="flex justify-between font-semibold text-xs pt-1.5">
              <span className="text-slate-300">Total Net Disbursement:</span>
              <span className="text-slate-100 font-mono font-bold">{formatINR(totalNetPayable)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>RazorpayX Banking Pipeline</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Simulated Payout Items */}
          <div className="rounded-lg border border-slate-800 bg-[#0D131F] p-3 max-h-44 overflow-y-auto space-y-2 font-mono">
            {payableInvoices.map((inv, idx) => (
              <div key={inv.id} className="flex items-center justify-between text-[11px] border-b border-slate-900 pb-1.5 last:border-0">
                <div>
                  <div className="text-slate-200 font-sans font-medium">{inv.vendorName}</div>
                  <div className="text-[10px] text-slate-500">{inv.invoiceNumber} | TDS: {formatINR(inv.tdsAmountINR)}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-100 font-bold">{formatINR(inv.netPayableINR)}</div>
                  <div className="text-[9px] text-slate-400">
                    {progress >= (idx + 1) * 20 ? `UTR: RZPX${Math.floor(10000000 + Math.random() * 90000000)}` : 'Queued'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-[#0D131F] p-2.5 rounded border border-slate-800">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Form 26Q TDS ledger updated and payment advices dispatched.</span>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              onClick={onClose}
              disabled={!isDone}
              className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                isDone
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isDone ? 'Close & View Updated Ledger' : 'Processing...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
