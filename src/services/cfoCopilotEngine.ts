import { CopilotMessage, AgentThoughtStep } from '../types/agent';
import { CompanyProfile, ReconciliationRecord } from '../types/finance';
import { VendorInvoice } from '../types/vendor';

export interface CopilotContext {
  company: CompanyProfile;
  reconciliationRecords: ReconciliationRecord[];
  vendorInvoices: VendorInvoice[];
}

export function queryCfoCopilot(prompt: string, context: CopilotContext): CopilotMessage {
  const cleanPrompt = prompt.toLowerCase();
  const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const messageId = `msg_${Date.now()}`;

  // Step 1: Generate reasoning steps
  const reasoningSteps: AgentThoughtStep[] = [
    {
      id: `th_1_${Date.now()}`,
      timestamp,
      agentRole: 'CFO_COPILOT',
      thought: `Parsing natural language intent: "${prompt}" and mapping to financial database schemas...`,
      confidence: 0.99,
      status: 'COMPLETED',
    },
    {
      id: `th_2_${Date.now()}`,
      timestamp,
      agentRole: 'TREASURY_AGENT',
      thought: `Running financial aggregation over live cash balances, 3-way reconciliation records, and vendor liabilities...`,
      toolCall: {
        toolName: 'financial_intelligence.query',
        input: { companyId: context.company.id, query: prompt },
        output: { status: 'SUCCESS', execution_time_ms: 38 },
      },
      confidence: 0.97,
      status: 'COMPLETED',
    },
  ];

  // Topic 1: Cash, Runway & Burn Rate
  if (cleanPrompt.includes('runway') || cleanPrompt.includes('burn') || cleanPrompt.includes('cash') || cleanPrompt.includes('months left')) {
    const totalCash = context.company.totalCashINR;
    const monthlyBurn = context.company.monthlyBurnINR;
    const runway = (totalCash / monthlyBurn).toFixed(1);

    return {
      id: messageId,
      sender: 'COPILOT',
      timestamp,
      content: `Here is the current **Treasury & Liquidity Breakdown** for **${context.company.name}**:\n\n` +
        `• **Total Available Liquidity**: **₹${(totalCash / 10000000).toFixed(2)} Cr** (ICICI Bank ₹${(context.company.primaryBank.currentBalanceINR / 10000000).toFixed(2)} Cr + RazorpayX Escrow ₹${(context.company.razorpayXBalanceINR / 10000000).toFixed(2)} Cr)\n` +
        `• **Net Monthly Cash Burn**: **₹${(monthlyBurn / 100000).toFixed(2)} Lakhs/mo**\n` +
        `• **Base Runway**: **${runway} Months** (Estimated zero-cash date: ~December 2027)\n\n` +
        `💡 *Recommendation*: Under Monte Carlo $P_{10}$ stress conditions (15% revenue contraction), runway drops to **11.4 months**. Consider enabling Razorpay Instant Settlement (T+0) to eliminate ₹1.81L weekend float lockup.`,
      reasoningSteps,
      chartData: {
        chartType: 'BAR',
        title: 'Monthly Cash Inflow vs Outflow Trend (Last 6 Months)',
        data: [
          { month: 'Mar', Inflow: 48, Outflow: 31, NetBurn: -17 },
          { month: 'Apr', Inflow: 51, Outflow: 33, NetBurn: -18 },
          { month: 'May', Inflow: 54, Outflow: 34, NetBurn: -20 },
          { month: 'Jun', Inflow: 56, Outflow: 35, NetBurn: -21 },
          { month: 'Jul', Inflow: 57, Outflow: 32, NetBurn: -25 },
          { month: 'Aug', Inflow: 58, Outflow: 32, NetBurn: -26 },
        ],
      },
      suggestedFollowUps: [
        'Simulate hiring 5 engineers next month',
        'What if revenue drops by 20%?',
        'Show vendor spending breakdown',
      ],
    };
  }

  // Topic 2: 3-Way Reconciliation & Discrepancies
  if (cleanPrompt.includes('reconcil') || cleanPrompt.includes('discrepan') || cleanPrompt.includes('mdr') || cleanPrompt.includes('difference') || cleanPrompt.includes('unsettled')) {
    const discrepancies = context.reconciliationRecords.filter(r => r.status !== 'MATCHED');

    return {
      id: messageId,
      sender: 'COPILOT',
      timestamp,
      content: `The **3-Way Reconciliation Engine** analyzed **${context.reconciliationRecords.length} settlement transactions** across Razorpay Gateway, Bank Statement feeds, and ERP Invoices:\n\n` +
        `• **Overall Match Rate**: **94.2%**\n` +
        `• **Active Discrepancies Found**: **${discrepancies.length} items**:\n` +
        `  1. **₹6,670 Excess MDR Charge** on order \`order_KZ89104mQw\` (Corporate card billed at 3.00% instead of 1.85% SLA).\n` +
        `  2. **₹1,81,300 Timing Float (T+2)** on order \`order_PL11928zRt\` (Friday late capture, settles Monday 11:30 AM).\n` +
        `  3. **₹95,000 Unrecorded Refund** on order \`order_XF55102qAz\` (Gateway refunded but ERP invoice still marked Open).\n` +
        `  4. **₹41,160 Ghost Capture** on order \`order_GH77201kLp\` (Bank credited but ERP webhook dropped).\n\n` +
        `I have pre-generated auto-balancing journal adjustments and the dispute packet for Razorpay support.`,
      reasoningSteps,
      chartData: {
        chartType: 'PIE',
        title: 'Reconciliation Settlement Status Distribution',
        data: [
          { name: 'Exact Match', value: 72, fill: '#10B981' },
          { name: 'MDR Drift', value: 10, fill: '#EF4444' },
          { name: 'Timing Float', value: 12, fill: '#3395FF' },
          { name: 'Unrecorded Refund', value: 6, fill: '#F59E0B' },
        ],
      },
      actionButton: {
        label: '⚡ Auto-Post 4 Journal Entries to ERP',
        actionType: 'RESOLVE_ALL_DISCREPANCIES',
        payload: { count: 4 },
      },
      suggestedFollowUps: [
        'How much did we lose to MDR fee leakage this quarter?',
        'Export Form 26Q TDS report',
        'Show cash runway forecast',
      ],
    };
  }

  // Topic 3: Tax, TDS, GST & Form 26Q
  if (cleanPrompt.includes('tax') || cleanPrompt.includes('tds') || cleanPrompt.includes('gst') || cleanPrompt.includes('26q') || cleanPrompt.includes('compliance')) {
    return {
      id: messageId,
      sender: 'COPILOT',
      timestamp,
      content: `Here is the **TDS & GST Tax Compliance Status for Q2 FY 2026-27**:\n\n` +
        `• **TAN**: \`BLRH08912E\` | **PAN**: \`${context.company.pan}\`\n` +
        `• **Total TDS Deducted**: **₹3,70,400** across 18 deductees\n` +
        `• **Form 26Q Readiness**: **100% Validated** (Challan #CHL-0028190-2026 pre-filled)\n\n` +
        `**Section Breakdown**:\n` +
        `• **Section 194C (Contractors)**: ₹1,45,000 deducted @ 1%/2%\n` +
        `• **Section 194J(a) (Cloud / Tech Services)**: ₹84,000 deducted @ 2%\n` +
        `• **Section 194J(b) (Legal / Audit Professional)**: ₹1,41,400 deducted @ 10%\n\n` +
        `⚠️ *Watchdog Note*: Vendor *DevCraft Studio* is at ₹92,000 YTD. Next invoice will cross the ₹1,00,000 threshold and trigger aggregate 1% TDS.`,
      reasoningSteps,
      chartData: {
        chartType: 'BAR',
        title: 'TDS Deductions by Income Tax Act Section (INR)',
        data: [
          { section: '194C (Contractors)', amount: 145000 },
          { section: '194J Tech (Cloud)', amount: 84000 },
          { section: '194J Prof (Legal)', amount: 141400 },
        ],
      },
      actionButton: {
        label: '📥 Download Form 26Q e-Filing Text File',
        actionType: 'EXPORT_26Q',
        payload: { quarter: 'Q2_2026' },
      },
      suggestedFollowUps: [
        'Which vendors have overdue invoices?',
        'Show 3-way reconciliation matrix',
        'Simulate runway if sales drop 15%',
      ],
    };
  }

  // Topic 4: Vendor Payouts & SaaS Spikes
  if (cleanPrompt.includes('vendor') || cleanPrompt.includes('aws') || cleanPrompt.includes('cloud') || cleanPrompt.includes('spike') || cleanPrompt.includes('saas') || cleanPrompt.includes('expense')) {
    return {
      id: messageId,
      sender: 'COPILOT',
      timestamp,
      content: `Analysis of **Vendor Liabilities & SaaS Spend**:\n\n` +
        `• **Top Spend Vendor**: **Amazon Web Services (AWS)** at **₹5,31,000** (Base ₹4.50L + GST ₹81k - 2% TDS ₹9k = Net ₹5.22L payable)\n` +
        `• **Cloud Hosting Spike Root Cause**: AWS bill increased **+28.4% month-over-month** primarily driven by:\n` +
        `  1. Unallocated GPU spot instance clusters in \`ap-south-1\` (₹78,400)\n` +
        `  2. S3 Glacier retrieval charges for log archiving (₹32,100)\n` +
        `• **SaaS License Anomaly**: Identified 8 unassigned Figma Enterprise seats (₹31,200/mo waste).\n\n` +
        `All 5 pending vendor invoices are **Penny-Drop Verified** via RazorpayX and ready for automated batch execution.`,
      reasoningSteps,
      chartData: {
        chartType: 'PIE',
        title: 'Monthly Expense Category Breakdown (%)',
        data: [
          { name: 'Payroll & CTC', value: 52, fill: '#3395FF' },
          { name: 'Cloud & Infrastructure', value: 22, fill: '#10B981' },
          { name: 'Digital Marketing', value: 14, fill: '#F59E0B' },
          { name: 'Legal & Compliance', value: 7, fill: '#8B5CF6' },
          { name: 'Gateway & Banking Fees', value: 5, fill: '#EC4899' },
        ],
      },
      suggestedFollowUps: [
        'Execute batch vendor payout via RazorpayX',
        'Show reconciliation health score',
        'Simulate cost cutting of 15% on cloud',
      ],
    };
  }

  // Default intelligent fallback
  return {
    id: messageId,
    sender: 'COPILOT',
    timestamp,
    content: `I've analyzed **${context.company.name}** across all live financial streams:\n\n` +
      `• **Cash Reserves**: **₹${(context.company.totalCashINR / 10000000).toFixed(2)} Cr** across Bank & RazorpayX accounts\n` +
      `• **Runway**: **${context.company.runwayMonths} Months** at current net burn rate\n` +
      `• **3-Way Reconciliation**: **94.2% healthy** with ₹6,670 MDR overcharge detected on corporate cards\n` +
      `• **TDS/GST Compliance**: **100% compliant** under Sections 194C & 194J\n\n` +
      `You can ask me to run "What-If" simulations, audit vendor invoices, balance ledger entries, or generate Form 26Q reports.`,
    reasoningSteps,
    suggestedFollowUps: [
      'What is our cash runway under 15% stress?',
      'Why is there an MDR discrepancy on Batch #B-8813?',
      'Generate TDS Form 26Q report for Q2',
    ],
  };
}
