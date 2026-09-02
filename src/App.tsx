import React, { useState } from 'react';
import { Navbar, TabType } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MetricCards } from './components/dashboard/MetricCards';
import { CashFlowChart } from './components/dashboard/CashFlowChart';
import { ExpenseBreakdown } from './components/dashboard/ExpenseBreakdown';
import { PriorityActions } from './components/dashboard/PriorityActions';
import { ReconciliationStudio } from './components/reconciliation/ReconciliationStudio';
import { RunwaySimulator } from './components/treasury/RunwaySimulator';
import { VendorPayoutHub } from './components/vendors/VendorPayoutHub';
import { ConversationalCFO } from './components/copilot/ConversationalCFO';
import { AnomalyRadar } from './components/anomalies/AnomalyRadar';
import { DemoControlPanel } from './components/demo/DemoControlPanel';
import { SettingsHub } from './components/settings/SettingsHub';

import { MOCK_COMPANIES } from './data/mockCompanies';
import { INITIAL_RECONCILIATION_RECORDS } from './data/mockReconciliation';
import { MOCK_VENDORS, INITIAL_VENDOR_INVOICES } from './data/mockVendors';
import { INITIAL_ANOMALIES } from './data/mockAnomalies';
import { calculateReconciliationMetrics } from './services/reconciliationEngine';
import { CompanyProfile, ReconciliationRecord } from './types/finance';
import { VendorInvoice } from './types/vendor';
import { FinancialAnomaly } from './types/agent';
import { CheckCircle2, AlertCircle, Sparkles, X, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [companies] = useState<CompanyProfile[]>(MOCK_COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile>(MOCK_COMPANIES[0]);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [reconciliationRecords, setReconciliationRecords] = useState<ReconciliationRecord[]>(INITIAL_RECONCILIATION_RECORDS);
  const [vendors] = useState(MOCK_VENDORS);
  const [vendorInvoices, setVendorInvoices] = useState<VendorInvoice[]>(INITIAL_VENDOR_INVOICES);
  const [anomalies, setAnomalies] = useState<FinancialAnomaly[]>(INITIAL_ANOMALIES);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const reconMetrics = calculateReconciliationMetrics(reconciliationRecords);
  const openAnomaliesCount = anomalies.filter(a => a.status === 'OPEN').length;
  const unreconciledCount = reconciliationRecords.filter(r => r.status !== 'MATCHED' && r.status !== 'TIMING_LAG' && r.resolutionStatus === 'PENDING').length;

  // Handler: Resolve single reconciliation record
  const handleUpdateRecordStatus = (recordId: string, actionType: string) => {
    setReconciliationRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          return {
            ...r,
            resolutionStatus: 'RESOLVED',
            aiExplanation: `${r.aiExplanation} [RESOLVED via ${actionType} on ${new Date().toLocaleTimeString('en-IN')}]`,
          };
        }
        return r;
      })
    );
    showToast(`Record ${recordId} balanced with journal adjustment.`, 'success');
  };

  // Handler: Auto-resolve all reconciliation discrepancies
  const handleAutoResolveAll = () => {
    setReconciliationRecords(prev =>
      prev.map(r => ({
        ...r,
        resolutionStatus: 'RESOLVED',
      }))
    );
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    showToast('Balancing journal entries posted for all variances.', 'success');
  };

  // Handler: Add new vendor invoice
  const handleAddInvoice = (newInv: VendorInvoice) => {
    setVendorInvoices(prev => [newInv, ...prev]);
    showToast(`Invoice ${newInv.invoiceNumber} recorded under Section ${newInv.tdsSection}`, 'success');
  };

  // Handler: Execute batch payout
  const handleExecuteBatchPayout = () => {
    setVendorInvoices(prev =>
      prev.map(inv => ({
        ...inv,
        status: 'PAID',
        payoutDetails: {
          payoutId: `pout_${Math.floor(100000 + Math.random() * 900000)}`,
          utrNumber: `RZPX${Math.floor(10000000 + Math.random() * 90000000)}`,
          executedAt: new Date().toISOString(),
          mode: 'NEFT',
        },
      }))
    );
    showToast('RazorpayX batch payout completed. Advices sent to vendors.', 'success');
  };

  // Handler: Resolve anomaly
  const handleResolveAnomaly = (anomalyId: string) => {
    setAnomalies(prev =>
      prev.map(a => (a.id === anomalyId ? { ...a, status: 'RESOLVED' } : a))
    );
    showToast('Anomaly resolved & safeguard verified.', 'success');
  };

  // Demo Injector 1: Inject MDR Discrepancy
  const handleInjectMdrDiscrepancy = () => {
    const newRecord: ReconciliationRecord = {
      id: `REC-2026-${Math.floor(9000 + Math.random() * 900)}`,
      reconciliationDate: new Date().toISOString().split('T')[0],
      orderId: `order_INJ_${Math.random().toString(36).substring(7)}`,
      paymentId: `pay_INJ_${Math.random().toString(36).substring(7)}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      gatewayGrossINR: 850000,
      gatewayMdrINR: 42500, // 5.0% instead of 1.85%
      gatewayNetINR: 807500,
      bankCreditINR: 807500,
      erpAmountINR: 850000,
      varianceINR: -26775,
      status: 'DISCREPANCY_MDR',
      aiExplanation: 'MDR Rate Variance: Gateway applied 5.00% instead of negotiated 1.85% SLA rate on corporate batch.',
      suggestedAction: 'RAISE_RAZORPAY_TICKET',
      resolutionStatus: 'PENDING',
      journalEntry: {
        debitAccount: 'Razorpay Gateway Dispute Receivable A/c',
        creditAccount: 'Gateway Processing Charges A/c',
        amountINR: 26775,
        narration: 'Dispute adjustment for excess MDR fee rate',
      },
    };
    setReconciliationRecords(prev => [newRecord, ...prev]);
    showToast('Injected ₹42,500 MDR Discrepancy into live stream.', 'warning');
  };

  // Demo Injector 2: Cloud Spend Shock
  const handleInjectCloudSpike = () => {
    setSelectedCompany(prev => ({
      ...prev,
      monthlyBurnINR: prev.monthlyBurnINR + 450000,
      runwayMonths: Number(((prev.totalCashINR / (prev.monthlyBurnINR + 450000)).toFixed(1))),
    }));
    showToast('AWS Cloud Burn (+₹4.5L/mo) injected. Runway recalculated.', 'warning');
  };

  // Demo Injector 3: Fake GSTIN Vendor Invoice
  const handleInjectFakeGstinInvoice = () => {
    const rogueInv: VendorInvoice = {
      id: `inv_rogue_${Date.now()}`,
      vendorId: 'vend_02',
      vendorName: 'GrowthMatrix Digital Marketing LLP',
      invoiceNumber: 'GM-26-AUG-102',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      baseAmountINR: 520000,
      gstRatePercent: 18,
      gstAmountINR: 93600,
      grossAmountINR: 613600,
      tdsSection: '194C',
      tdsRatePercent: 2.0,
      tdsAmountINR: 10400,
      netPayableINR: 603200,
      status: 'FLAGGED_ANOMALY',
      flags: {
        isDuplicateInvoice: true,
        isInvalidGstin: true,
        isTdsThresholdBreached: false,
        isBankNameMismatch: false,
        anomalyNote: 'Tax Guardrail Flag: Duplicate invoice number & unverified GSTIN detected.',
      },
    };
    setVendorInvoices(prev => [rogueInv, ...prev]);
    showToast('Duplicate Invoice with unverified GSTIN flagged by Guardrail.', 'warning');
  };

  // Demo Injector 4: Settlement Float T+2
  const handleInjectTimingFloat = () => {
    const floatRecord: ReconciliationRecord = {
      id: `REC-2026-${Math.floor(9500 + Math.random() * 400)}`,
      reconciliationDate: new Date().toISOString().split('T')[0],
      orderId: `order_FLOAT_${Math.random().toString(36).substring(7)}`,
      paymentId: `pay_FLOAT_${Math.random().toString(36).substring(7)}`,
      invoiceNumber: `INV-2026-FLOAT`,
      gatewayGrossINR: 320000,
      gatewayMdrINR: 6400,
      gatewayNetINR: 313600,
      bankCreditINR: 0,
      erpAmountINR: 320000,
      varianceINR: 313600,
      status: 'TIMING_LAG',
      aiExplanation: 'Settlement Timing Float (T+2): Friday night transaction pending weekend bank clearance.',
      suggestedAction: 'WAIT_T2_FLOAT',
      resolutionStatus: 'PENDING',
    };
    setReconciliationRecords(prev => [floatRecord, ...prev]);
    showToast('Weekend Settlement Float (T+2) record added.', 'info');
  };

  // Demo Reset
  const handleResetBenchmark = () => {
    setReconciliationRecords(INITIAL_RECONCILIATION_RECORDS);
    setVendorInvoices(INITIAL_VENDOR_INVOICES);
    setAnomalies(INITIAL_ANOMALIES);
    setSelectedCompany(MOCK_COMPANIES[0]);
    showToast('Reset ledgers and simulations to benchmark state.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#EBE9E4] flex justify-center p-0 md:p-6 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-[#E2DFD8] bg-[#FFFFFF] px-4 py-3 shadow-md text-xs">
          {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-[#4CAF50] shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="h-4 w-4 text-[#F4B400] shrink-0" />}
          {toast.type === 'info' && <Sparkles className="h-4 w-4 text-[#1E3A8A] shrink-0" />}
          <span className="text-[#1C2331] font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-[#5E6C84] hover:text-[#1C2331] ml-2">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main App Container */}
      <div className="w-full max-w-7xl bg-[#F7F6F2] rounded-xl border border-[#E2DFD8] shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col relative">
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          companies={companies}
          selectedCompany={selectedCompany}
        />

        {/* Tab Content Body */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top Greeting */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-serif text-[#1C2331] mb-1">Good morning, Alexander.</h1>
                <p className="text-[#5E6C84] text-sm">Your portfolio overview for October 26, 2023</p>
              </div>

              {/* Layout Grid (3 columns to match reference image) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Column 1: Net Worth & Transactions */}
                <div className="lg:col-span-5 space-y-6">
                  <CashFlowChart companyName={selectedCompany.name} />
                  <PriorityActions
                    onNavigateToTab={setActiveTab}
                    onAutoReconcile={handleAutoResolveAll}
                    onExecutePayouts={handleExecuteBatchPayout}
                  />
                </div>

                {/* Column 2: Account Balances, Asset Allocation, Performance */}
                <div className="lg:col-span-4 space-y-6">
                  <MetricCards
                    company={selectedCompany}
                    reconciliationHealth={reconMetrics.reconciliationHealthScore}
                    openAnomaliesCount={openAnomaliesCount}
                    onNavigateToTab={setActiveTab}
                  />
                  <ExpenseBreakdown />
                </div>

                {/* Column 3: Premium Insights (Reusing Copilot logic/Sidebar style) */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-[#FFFFFF] border border-[#E2DFD8] rounded-lg p-5">
                    <h3 className="font-serif text-[#1C2331] text-lg mb-4">Premium Handcrafted Insights</h3>
                    
                    <div className="space-y-4 border-b border-[#E2DFD8] pb-4">
                      <p className="text-[13px] text-[#1C2331] font-medium leading-relaxed">Navigating Market Volatility: A Conservative Approach</p>
                      <button className="text-[#1E3A8A] text-[11px] font-medium flex items-center gap-1 hover:underline">
                        Read Article <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <div className="space-y-4 border-b border-[#E2DFD8] py-4">
                      <p className="text-[13px] text-[#1C2331] font-medium leading-relaxed">Optimizing Your Retirement Strategy</p>
                      <button className="text-[#1E3A8A] text-[11px] font-medium flex items-center gap-1 hover:underline">
                        Read Article <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                      <p className="text-[13px] text-[#1C2331] font-medium leading-relaxed">Tax-Efficient Investing Tips</p>
                      <button className="text-[#1E3A8A] text-[11px] font-medium flex items-center gap-1 hover:underline">
                        Read Article <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] border border-[#E2DFD8] rounded-lg p-5">
                    <h3 className="font-serif text-[#1C2331] text-lg mb-2">Advisor Connection</h3>
                    <p className="text-[#5E6C84] text-[11px] mb-4 leading-relaxed">Stay connected in real time to your personal financial advisor.</p>
                    <button className="text-[#1E3A8A] text-[11px] font-medium flex items-center gap-1 hover:underline">
                      Schedule a Consultation <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'reconciliation' && (
            <ReconciliationStudio
              records={reconciliationRecords}
              company={selectedCompany}
              onUpdateRecordStatus={handleUpdateRecordStatus}
              onAutoResolveAll={handleAutoResolveAll}
            />
          )}

          {activeTab === 'treasury' && (
            <RunwaySimulator company={selectedCompany} />
          )}

          {activeTab === 'vendors' && (
            <VendorPayoutHub
              vendors={vendors}
              invoices={vendorInvoices}
              onAddInvoice={handleAddInvoice}
              onExecuteBatchPayout={handleExecuteBatchPayout}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsHub
              company={selectedCompany}
              onSave={() => showToast('Configuration saved successfully.', 'success')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
