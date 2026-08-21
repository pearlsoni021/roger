export type AgentRole = 
  | 'RECONCILIATION_AGENT'
  | 'TREASURY_AGENT'
  | 'TAX_COMPLIANCE_AGENT'
  | 'ANOMALY_WATCHDOG'
  | 'CFO_COPILOT';

export interface AgentThoughtStep {
  id: string;
  timestamp: string;
  agentRole: AgentRole;
  thought: string;
  toolCall?: {
    toolName: string;
    input: Record<string, any>;
    output: Record<string, any>;
  };
  confidence: number;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FLAGGED';
}

export interface FinancialAnomaly {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'RECONCILIATION' | 'SUBSCRIPTION_CREEP' | 'MDR_LEAKAGE' | 'TAX_NONCOMPLIANCE' | 'DUPLICATE_PAYOUT';
  description: string;
  detectedAt: string;
  financialImpactINR: number;
  aiSuggestedAction: string;
  actionPayload?: Record<string, any>;
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
}

export interface CopilotMessage {
  id: string;
  sender: 'USER' | 'COPILOT';
  timestamp: string;
  content: string;
  reasoningSteps?: AgentThoughtStep[];
  chartData?: {
    chartType: 'BAR' | 'LINE' | 'PIE' | 'TABLE' | 'KPI_GRID';
    title: string;
    data: any[];
  };
  suggestedFollowUps?: string[];
  actionButton?: {
    label: string;
    actionType: string;
    payload: any;
  };
}
