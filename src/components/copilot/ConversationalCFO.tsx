import React, { useState } from 'react';
import { CopilotMessage } from '../../types/agent';
import { CompanyProfile, ReconciliationRecord } from '../../types/finance';
import { VendorInvoice } from '../../types/vendor';
import { queryCfoCopilot } from '../../services/cfoCopilotEngine';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  BarChart3, 
  PieChart as PieIcon, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface ConversationalCFOProps {
  company: CompanyProfile;
  reconciliationRecords: ReconciliationRecord[];
  vendorInvoices: VendorInvoice[];
  onTriggerAction?: (actionType: string, payload: any) => void;
}

const INITIAL_MESSAGES: CopilotMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'COPILOT',
    timestamp: 'Just now',
    content: `Hello! I am your **Autonomous AI Finance Controller & Treasury Copilot**.\n\nI continuously monitor your **Razorpay Gateway Settlements**, **Bank Feeds**, **Vendor TDS Deductions**, and **Monte Carlo Cash Runway**.\n\nHow can I assist your treasury operations today?`,
    suggestedFollowUps: [
      'What is our projected cash runway under 15% stress?',
      'Why is there an MDR fee discrepancy on corporate cards?',
      'Show our top vendor liabilities and TDS compliance',
      'Generate a summary for the board meeting',
    ],
  },
];

export const ConversationalCFO: React.FC<ConversationalCFOProps> = ({
  company,
  reconciliationRecords,
  vendorInvoices,
  onTriggerAction,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(null);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      content: query,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = queryCfoCopilot(query, {
        company,
        reconciliationRecords,
        vendorInvoices,
      });
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 550);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] rounded-xl border border-[#E6DFD5] bg-[#FCFBF8] overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E6DFD5] bg-[#F5F0E6] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A67C52] text-[#2D1E17]">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-[#2D1E17] flex items-center gap-2">
              <span>Razorpay CFO Copilot AI</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </h2>
            <p className="text-[11px] text-[#68554A]">Context: <strong className="text-[#68554A] font-medium">{company.name}</strong></p>
          </div>
        </div>
        <div className="text-right text-[11px] text-[#68554A]">
          <span>AI Engine: </span>
          <span className="text-[#2D1E17] font-medium font-mono">Vulcan Finance</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'USER';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                  isUser
                    ? 'bg-[#A67C52] text-[#2D1E17]'
                    : 'bg-[#F5F0E6] text-[#68554A] border border-[#E6DFD5]'
                }`}
              >
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              <div
                className={`max-w-2xl rounded-xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#A67C52] text-[#2D1E17] rounded-tr-none'
                    : 'bg-[#F5F0E6] border border-[#E6DFD5] text-[#2D1E17] rounded-tl-none'
                }`}
              >
                {/* Agent Thought Steps Dropdown */}
                {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                  <div className="mb-2.5 rounded-lg border border-[#E6DFD5] bg-[#FCFBF8] p-2">
                    <button
                      onClick={() => setExpandedThoughtId(expandedThoughtId === msg.id ? null : msg.id)}
                      className="flex w-full items-center justify-between text-[11px] font-medium text-[#68554A] hover:text-[#2D1E17]"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-[#4A6982]" />
                        <span>Agent Reasoning & Tool Execution ({msg.reasoningSteps.length} steps)</span>
                      </span>
                      {expandedThoughtId === msg.id ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>

                    {expandedThoughtId === msg.id && (
                      <div className="mt-2 space-y-1.5 border-t border-[#E6DFD5] pt-2 font-mono text-[10px]">
                        {msg.reasoningSteps.map((step) => (
                          <div key={step.id} className="text-[#68554A] flex items-start gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[#68554A] font-semibold">[{step.agentRole}]</span> {step.thought}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Content */}
                <div className="space-y-1.5 whitespace-pre-line font-sans">
                  {msg.content}
                </div>

                {/* Embedded Interactive Chart */}
                {msg.chartData && (
                  <div className="mt-3 rounded-lg border border-[#E6DFD5] bg-[#FCFBF8] p-3">
                    <div className="text-[11px] font-medium text-[#68554A] mb-2 flex items-center gap-1.5">
                      {msg.chartData.chartType === 'BAR' ? (
                        <BarChart3 className="h-3.5 w-3.5 text-[#68554A]" />
                      ) : (
                        <PieIcon className="h-3.5 w-3.5 text-[#68554A]" />
                      )}
                      <span>{msg.chartData.title}</span>
                    </div>

                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {msg.chartData.chartType === 'BAR' ? (
                          <BarChart data={msg.chartData.data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <XAxis dataKey="month" stroke="#64748B" fontSize={10} />
                            <YAxis stroke="#64748B" fontSize={10} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '6px', fontSize: '11px' }}
                            />
                            <Bar dataKey="Inflow" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="Outflow" fill="#64748B" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        ) : (
                          <PieChart>
                            <Pie
                              data={msg.chartData.data}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={58}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {msg.chartData.data.map((entry: any, index: number) => (
                                <Cell key={`c-${index}`} fill={entry.fill || '#3B82F6'} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '6px', fontSize: '11px' }}
                            />
                          </PieChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {msg.actionButton && (
                  <div className="mt-2.5 pt-2 border-t border-[#E6DFD5]">
                    <button
                      onClick={() => onTriggerAction && onTriggerAction(msg.actionButton!.actionType, msg.actionButton!.payload)}
                      className="flex items-center gap-1.5 rounded-md bg-[#F5F0E6] border border-[#E6DFD5] px-2.5 py-1 text-[11px] font-medium text-[#2D1E17] hover:bg-[#E6DFD5] transition-colors"
                    >
                      <span>{msg.actionButton.label}</span>
                      <ArrowRight className="h-3 w-3 text-[#68554A]" />
                    </button>
                  </div>
                )}

                {/* Suggested Follow-up chips */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-[#E6DFD5]">
                    {msg.suggestedFollowUps.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="rounded-md border border-[#E6DFD5] bg-[#FCFBF8] px-2 py-0.5 text-[10px] text-[#68554A] hover:border-[#E6DFD5] hover:text-[#2D1E17] transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#68554A] bg-[#F5F0E6] p-2.5 rounded-lg border border-[#E6DFD5] w-fit">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Analyzing financial models and ledger...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t border-[#E6DFD5] bg-[#F5F0E6] p-3.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about cash burn, 3-way reconciliation, TDS filings, or runway scenarios..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 rounded-lg border border-[#E6DFD5] bg-[#FCFBF8] px-3.5 py-2 text-xs text-[#2D1E17] placeholder-slate-500 focus:border-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A67C52] text-[#2D1E17] hover:bg-[#8F6641] disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
