import React, { useState } from 'react';
import { 
  Building2, 
  KeyRound, 
  Landmark, 
  Receipt, 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sliders,
  Sparkles
} from 'lucide-react';
import { CompanyProfile } from '../../types/finance';

interface SettingsHubProps {
  company: CompanyProfile;
  onSave?: () => void;
}

export const SettingsHub: React.FC<SettingsHubProps> = ({ company, onSave }) => {
  const [activeSubTab, setActiveSubTab] = useState<'entity' | 'razorpay' | 'banking' | 'tax' | 'guardrails'>('entity');
  const [showSecret, setShowSecret] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: company.name,
    cin: 'U72200KA2024PTC189201',
    gstin: company.gstin,
    pan: company.pan,
    tan: 'BLRH01234D',
    address: '9th Floor, Brigade Tech Gardens, Whitefield, Bengaluru, KA 560066',
    cfoEmail: 'finance@hyperscale.ai',
    financialYear: 'FY 2026-27',
    
    // Razorpay API
    keyId: 'rzp_live_8Xk9A2Lm4P0qZ1',
    keySecret: 'K9pX2Lm0ZaB3cDefGhIjKlMnOpQr',
    webhookSecret: 'whsec_7Nm9Kp2Lx4Vb1Q8RsTuVwXyZ',
    slaMdrRate: '1.85',
    slaDisputeWindowDays: '45',
    autoDisputeEnabled: true,
    
    // Banking
    bankName: company.primaryBank.bankName,
    accountNumber: company.primaryBank.accountNumber,
    ifsc: company.primaryBank.ifsc,
    escrowVpa: 'RZPX_HYPERSCALE_ESCROW',
    dailyPayoutLimit: '2500000',
    otpThreshold: '500000',
    
    // Tax & Compliance
    tds194CThreshold: '100000',
    tds194CRate: '2.0',
    tds194JTechRate: '2.0',
    tds194JProfRate: '10.0',
    autoForm26Q: true,
    pennyDropVerify: true,
    
    // Controller Guardrails
    matchConfidenceThreshold: '90',
    autoBalanceLimitINR: '50000',
    timingFloatToleranceDays: '2',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestSuccess(false);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/settings/test-connection', { method: 'POST' });
      if (response.ok) {
        setTestSuccess(true);
        setTimeout(() => setTestSuccess(false), 4000);
      }
    } catch (e) {
      console.error('Connection test failed', e);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('http://127.0.0.1:5000/api/settings/save', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsSaved(true);
      if (onSave) onSave();
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-6 rounded-xl border border-[#E2DFD8]">
        <div>
          <h2 className="text-xl font-semibold text-[#1C2331] tracking-tight">Controller & System Settings</h2>
          <p className="text-xs font-normal text-[#5E6C84] mt-1">
            Configure legal entities, RazorpayX banking credentials, statutory tax rules & autonomous AI guardrails.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="flex items-center gap-1.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] hover:bg-[#E2DFD8] px-4 py-2 text-xs font-medium text-[#5E6C84] transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
            <span>{testingConnection ? 'Testing API...' : 'Test Razorpay Connection'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-[#3A5A40] hover:bg-[#2A402D] px-5 py-2 text-xs font-medium text-[#FCFBF8] transition-colors"
          >
            <Save className="h-3.5 w-3.5 text-[#FCFBF8]" />
            <span>{isSaved ? 'Settings Saved!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {testSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-[#4E7358]/20 bg-[#E8F5E9] px-4 py-3 text-xs font-normal text-[#4CAF50]">
          <CheckCircle2 className="h-4 w-4 text-[#4CAF50] shrink-0" />
          <span>Razorpay Gateway API & Webhook Handshake verified. Escrow balance synchronized.</span>
        </div>
      )}

      {/* Main Settings Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Sub-tabs */}
        <div className="lg:col-span-3 bg-[#FFFFFF] p-3 rounded-xl border border-[#E2DFD8] space-y-1">
          {[
            { id: 'entity', label: 'Company & Tax Entity', icon: Building2, desc: 'GSTIN, PAN, TAN & Legal info' },
            { id: 'razorpay', label: 'Razorpay API & SLA', icon: KeyRound, desc: 'API Keys, Webhooks & MDR rate' },
            { id: 'banking', label: 'RazorpayX & Banking', icon: Landmark, desc: 'Virtual Escrow & Payout limits' },
            { id: 'tax', label: 'TDS & Statutory Tax', icon: Receipt, desc: 'Section 194C/J & Form 26Q' },
            { id: 'guardrails', label: 'AI Guardrails & Limits', icon: Sliders, desc: 'Tolerance windows & thresholds' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all ${
                  isActive
                    ? 'bg-[#F0F4F8] text-[#1E3A8A] border-l-2 border-[#1E3A8A]'
                    : 'text-[#5E6C84] hover:bg-[#E2DFD8]/50'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? 'text-[#1E3A8A]' : 'text-[#5E6C84]'}`} />
                <div>
                  <div className={`text-xs font-medium ${isActive ? 'text-[#1E3A8A]' : 'text-[#5E6C84]'}`}>{tab.label}</div>
                  <div className="text-[10.5px] mt-0.5 font-normal text-[#5E6C84]">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Content Panels */}
        <div className="lg:col-span-9 bg-[#FFFFFF] p-6 rounded-xl border border-[#E2DFD8]">
          {/* TAB 1: Company & Legal Entity */}
          {activeSubTab === 'entity' && (
            <div className="space-y-5">
              <div className="border-b border-[#E2DFD8] pb-3">
                <h3 className="text-sm font-semibold text-[#1C2331]">Legal Entity & Tax Registration</h3>
                <p className="text-xs font-normal text-[#5E6C84]">Official statutory registration details for GST & TDS return filings.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal">
                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-normal"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Corporate Identification Number (CIN)</label>
                  <input
                    type="text"
                    value={formData.cin}
                    onChange={(e) => handleChange('cin', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">GSTIN (Goods and Services Tax ID)</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => handleChange('gstin', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Company PAN (Permanent Account Number)</label>
                  <input
                    type="text"
                    value={formData.pan}
                    onChange={(e) => handleChange('pan', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Tax Deduction Account Number (TAN)</label>
                  <input
                    type="text"
                    value={formData.tan}
                    onChange={(e) => handleChange('tan', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Financial Year Cycle</label>
                  <input
                    type="text"
                    value={formData.financialYear}
                    onChange={(e) => handleChange('financialYear', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-medium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#5E6C84] font-medium mb-1">Registered Principal Office Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-normal"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Razorpay API & SLA */}
          {activeSubTab === 'razorpay' && (
            <div className="space-y-5">
              <div className="border-b border-[#E2DFD8] pb-3">
                <h3 className="text-sm font-semibold text-[#1C2331]">Razorpay Gateway API & SLA Parameters</h3>
                <p className="text-xs font-normal text-[#5E6C84]">Live API credentials, webhook endpoints, and contract fee thresholds.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal">
                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Razorpay Key ID</label>
                  <input
                    type="text"
                    value={formData.keyId}
                    onChange={(e) => handleChange('keyId', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Razorpay Key Secret</label>
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={formData.keySecret}
                      onChange={(e) => handleChange('keySecret', e.target.value)}
                      className="w-full p-2.5 pr-9 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5E6C84] hover:text-[#1C2331]"
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Webhook Secret (HMAC-SHA256)</label>
                  <input
                    type="text"
                    value={formData.webhookSecret}
                    onChange={(e) => handleChange('webhookSecret', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Negotiated SLA Gateway MDR Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.slaMdrRate}
                    onChange={(e) => handleChange('slaMdrRate', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-medium"
                  />
                  <span className="block mt-1 text-[10.5px] text-[#5E6C84] font-normal">Variance alerts trigger if MDR charged exceeds this threshold.</span>
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">SLA Dispute Representment Window (Days)</label>
                  <input
                    type="number"
                    value={formData.slaDisputeWindowDays}
                    onChange={(e) => handleChange('slaDisputeWindowDays', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-medium"
                  />
                  <span className="block mt-1 text-[10.5px] text-[#5E6C84] font-normal">Disputes exceeding 45 days are escalated to Legal Ops exception list.</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#F7F6F2] border border-[#E2DFD8]">
                  <div>
                    <div className="text-[#1C2331] font-medium">Auto-File Dispute Claims</div>
                    <div className="text-[10.5px] text-[#5E6C84] font-normal">Automatically synthesize adjustment journal when MDR drifts.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoDisputeEnabled}
                    onChange={(e) => handleChange('autoDisputeEnabled', e.target.checked)}
                    className="h-4 w-4 rounded accent-[#A67C52]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RazorpayX & Banking */}
          {activeSubTab === 'banking' && (
            <div className="space-y-5">
              <div className="border-b border-[#E2DFD8] pb-3">
                <h3 className="text-sm font-semibold text-[#1C2331]">RazorpayX Escrow & Current Account Banking</h3>
                <p className="text-xs font-normal text-[#5E6C84]">Direct banking rails, virtual escrow balances, and daily payout controls.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal">
                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Primary Corporate Bank</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-normal"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Corporate Current Account No.</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={formData.ifsc}
                    onChange={(e) => handleChange('ifsc', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">RazorpayX Escrow Virtual Account (VPA)</label>
                  <input
                    type="text"
                    value={formData.escrowVpa}
                    onChange={(e) => handleChange('escrowVpa', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Daily Automated Payout Ceiling (₹)</label>
                  <input
                    type="text"
                    value={formData.dailyPayoutLimit}
                    onChange={(e) => handleChange('dailyPayoutLimit', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Dual-CFO Approval Threshold (₹)</label>
                  <input
                    type="text"
                    value={formData.otpThreshold}
                    onChange={(e) => handleChange('otpThreshold', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Statutory Tax & TDS */}
          {activeSubTab === 'tax' && (
            <div className="space-y-5">
              <div className="border-b border-[#E2DFD8] pb-3">
                <h3 className="text-sm font-semibold text-[#1C2331]">Income Tax TDS (Section 194C / 194J) & GST Rules</h3>
                <p className="text-xs font-normal text-[#5E6C84]">Statutory threshold triggers, withholding percentages, and Form 26Q return rules.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal">
                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Section 194C Contractor Annual Threshold (₹)</label>
                  <input
                    type="text"
                    value={formData.tds194CThreshold}
                    onChange={(e) => handleChange('tds194CThreshold', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                  <span className="block mt-1 text-[10.5px] text-[#5E6C84] font-normal">Aggregate invoice value exceeding ₹1,00,000 mandates 2% TDS.</span>
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Section 194J Technical Services Rate (%)</label>
                  <input
                    type="text"
                    value={formData.tds194JTechRate}
                    onChange={(e) => handleChange('tds194JTechRate', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                  <span className="block mt-1 text-[10.5px] text-[#5E6C84] font-normal">Software, cloud hosting & IT vendor invoices.</span>
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Section 194J Professional Services Rate (%)</label>
                  <input
                    type="text"
                    value={formData.tds194JProfRate}
                    onChange={(e) => handleChange('tds194JProfRate', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-mono font-medium"
                  />
                  <span className="block mt-1 text-[10.5px] text-[#5E6C84] font-normal">Legal counsel, chartered accountants & auditing services.</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#F7F6F2] border border-[#E2DFD8]">
                  <div>
                    <div className="text-[#1C2331] font-medium">Auto-Compile Quarterly Form 26Q</div>
                    <div className="text-[10.5px] text-[#5E6C84] font-normal">Auto-generate NSDL e-TDS return text payload.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoForm26Q}
                    onChange={(e) => handleChange('autoForm26Q', e.target.checked)}
                    className="h-4 w-4 rounded accent-[#A67C52]"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between p-3 rounded-lg bg-[#F7F6F2] border border-[#E2DFD8]">
                  <div>
                    <div className="text-[#1C2331] font-medium">Penny-Drop Vendor Account Verification</div>
                    <div className="text-[10.5px] text-[#5E6C84] font-normal">Execute ₹1 penny-drop API check before scheduling new vendor payouts.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.pennyDropVerify}
                    onChange={(e) => handleChange('pennyDropVerify', e.target.checked)}
                    className="h-4 w-4 rounded accent-[#A67C52]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI Autonomous Guardrails */}
          {activeSubTab === 'guardrails' && (
            <div className="space-y-5">
              <div className="border-b border-[#E2DFD8] pb-3">
                <h3 className="text-sm font-semibold text-[#1C2331]">Autonomous Finance Controller Guardrails</h3>
                <p className="text-xs font-normal text-[#5E6C84]">Safe-operating limits for automated reconciliation, auto-journaling, and exceptions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-normal">
                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Automated 3-Way Match Confidence Cutoff (%)</label>
                  <input
                    type="number"
                    value={formData.matchConfidenceThreshold}
                    onChange={(e) => handleChange('matchConfidenceThreshold', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-medium"
                  />
                  <span className="block mt-1 text-[10.5px] text-[#5E6C84] font-normal">Transactions above 90% confidence are reconciled autonomously.</span>
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Max Autonomous Journal Adjustment (₹)</label>
                  <input
                    type="text"
                    value={formData.autoBalanceLimitINR}
                    onChange={(e) => handleChange('autoBalanceLimitINR', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-medium"
                  />
                  <span className="block mt-1 text-[10.5px] text-[#5E6C84] font-normal">Discrepancies above ₹50,000 require manual human approval.</span>
                </div>

                <div>
                  <label className="block text-[#5E6C84] font-medium mb-1">Settlement Timing Float Tolerance (Days)</label>
                  <input
                    type="number"
                    value={formData.timingFloatToleranceDays}
                    onChange={(e) => handleChange('timingFloatToleranceDays', e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DFD8] bg-[#F7F6F2] text-[#1C2331] font-medium"
                  />
                  <span className="block mt-1 text-[10.5px] text-[#5E6C84] font-normal">Weekend and bank holiday cutoff buffer before raising false alarms.</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F0F4F8] border border-[#E2DFD8]">
                  <ShieldCheck className="h-5 w-5 text-[#1E3A8A] shrink-0" />
                  <div className="text-[11px] font-normal text-[#1E3A8A]">
                    Double-entry balance check: Total Debits must equal Total Credits before any ledger posting.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
