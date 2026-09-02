import React, { useState } from 'react';
import { Vendor, VendorInvoice, TdsSection } from '../../types/vendor';
import { calculateTdsAndGst } from '../../services/taxComplianceEngine';
import { formatINR } from '../../utils/formatters';
import { X, Sparkles } from 'lucide-react';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: Vendor[];
  onAddInvoice: (invoice: VendorInvoice) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
  vendors,
  onAddInvoice,
}) => {
  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [baseAmount, setBaseAmount] = useState<number>(100000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [tdsSection, setTdsSection] = useState<TdsSection>('194J_TECH');

  if (!isOpen) return null;

  const selectedVendor = vendors.find(v => v.id === vendorId);
  const taxCalc = calculateTdsAndGst(
    baseAmount || 0,
    gstRate,
    tdsSection,
    selectedVendor?.gstin,
    selectedVendor?.applicableTdsSection === '194C' && selectedVendor.name.includes('(')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor || !invoiceNumber) return;

    const newInv: VendorInvoice = {
      id: `inv_v_${Date.now()}`,
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.name,
      invoiceNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      baseAmountINR: taxCalc.baseAmountINR,
      gstRatePercent: taxCalc.gstRatePercent,
      gstAmountINR: taxCalc.gstAmountINR,
      grossAmountINR: taxCalc.grossAmountINR,
      tdsSection: taxCalc.tdsSection,
      tdsRatePercent: taxCalc.tdsRatePercent,
      tdsAmountINR: taxCalc.tdsAmountINR,
      netPayableINR: taxCalc.netPayableINR,
      status: taxCalc.isCompliant ? 'TAX_VERIFIED' : 'PENDING_APPROVAL',
      flags: {
        isDuplicateInvoice: false,
        isInvalidGstin: !taxCalc.isCompliant,
        isTdsThresholdBreached: false,
        isBankNameMismatch: false,
      },
    };

    onAddInvoice(newInv);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-[#E2DFD8] bg-[#111726] p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-3.5">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>Ingest Vendor Invoice</span>
          </h3>
          <button onClick={onClose} className="text-[#5E6C84] hover:text-[#1C2331]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div>
            <label className="block text-[#5E6C84] mb-1">Select Vendor Entity</label>
            <select
              value={vendorId}
              onChange={(e) => {
                setVendorId(e.target.value);
                const v = vendors.find(item => item.id === e.target.value);
                if (v) setTdsSection(v.applicableTdsSection);
              }}
              className="w-full rounded-lg border border-[#E2DFD8] bg-[#FFFFFF] p-2 text-[#1C2331]"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#5E6C84] mb-1">Invoice Number</label>
              <input
                type="text"
                placeholder="e.g. AWS-2026-991"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
                className="w-full rounded-lg border border-[#E2DFD8] bg-[#FFFFFF] p-2 text-[#1C2331]"
              />
            </div>
            <div>
              <label className="block text-[#5E6C84] mb-1">Base Amount (Excl. GST)</label>
              <input
                type="number"
                value={baseAmount}
                onChange={(e) => setBaseAmount(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-[#E2DFD8] bg-[#FFFFFF] p-2 text-[#1C2331]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#5E6C84] mb-1">GST Rate (%)</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full rounded-lg border border-[#E2DFD8] bg-[#FFFFFF] p-2 text-[#1C2331]"
              >
                <option value={18}>18% (Standard Services)</option>
                <option value={12}>12%</option>
                <option value={5}>5%</option>
                <option value={0}>0% (Exempt)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#5E6C84] mb-1">Applicable TDS Section</label>
              <select
                value={tdsSection}
                onChange={(e) => setTdsSection(e.target.value as TdsSection)}
                className="w-full rounded-lg border border-[#E2DFD8] bg-[#FFFFFF] p-2 text-[#1C2331]"
              >
                <option value="194J_TECH">Section 194J (Tech/Cloud @ 2%)</option>
                <option value="194C">Section 194C (Contractors @ 1%/2%)</option>
                <option value="194J_PROF">Section 194J (Professional @ 10%)</option>
                <option value="194Q">Section 194Q (Goods Purchase @ 0.1%)</option>
                <option value="EXEMPT">Exempt (0%)</option>
              </select>
            </div>
          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="rounded-lg border border-[#E2DFD8] bg-[#0D131F] p-3 space-y-1.5 font-mono">
            <div className="flex justify-between text-[#5E6C84]">
              <span>Base Amount:</span>
              <span className="text-[#1C2331]">{formatINR(taxCalc.baseAmountINR)}</span>
            </div>
            <div className="flex justify-between text-[#5E6C84]">
              <span>+ GST ({taxCalc.gstRatePercent}%):</span>
              <span className="text-[#1C2331]">+{formatINR(taxCalc.gstAmountINR)}</span>
            </div>
            <div className="flex justify-between text-[#5E6C84] border-b border-[#E2DFD8] pb-1">
              <span>- TDS ({taxCalc.tdsRatePercent}% on Base):</span>
              <span className="text-[#1C2331]">-{formatINR(taxCalc.tdsAmountINR)}</span>
            </div>
            <div className="flex justify-between font-bold text-xs pt-0.5">
              <span className="text-[#1C2331] font-sans">Net Payable via RazorpayX:</span>
              <span className="text-slate-100">{formatINR(taxCalc.netPayableINR)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E2DFD8]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] px-3.5 py-1.5 text-[#1C2331] hover:bg-[#E2DFD8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-3.5 py-1.5 font-medium text-white hover:bg-blue-500 shadow-sm"
            >
              Add & Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
