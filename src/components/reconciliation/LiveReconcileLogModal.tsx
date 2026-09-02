import React, { useState, useEffect } from 'react';
import { AgentThoughtStep } from '../../types/agent';
import { X, CheckCircle2, Loader2, Terminal } from 'lucide-react';

interface LiveReconcileLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  thoughts: AgentThoughtStep[];
  onComplete: () => void;
}

export const LiveReconcileLogModal: React.FC<LiveReconcileLogModalProps> = ({
  isOpen,
  onClose,
  thoughts,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsFinished(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < thoughts.length - 1) {
          return prev + 1;
        } else {
          setIsFinished(true);
          clearInterval(interval);
          onComplete();
          return prev;
        }
      });
    }, 650);

    return () => clearInterval(interval);
  }, [isOpen, thoughts.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-xl border border-[#E2DFD8] bg-[#111726] p-6 shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#F7F6F2] text-[#1C2331]">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Autonomous 3-Way Reconciliation Stream</span>
                {!isFinished ? (
                  <span className="flex items-center gap-1 text-[11px] font-normal text-[#5E6C84]">
                    <Loader2 className="h-3 w-3 animate-spin" /> In Progress
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#5E6C84]">Cross-referencing Gateway Settlements, ICICI MT940 logs, and ERP Invoices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#5E6C84] hover:bg-[#F7F6F2] hover:text-[#1C2331] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Streaming Thought Steps Terminal */}
        <div className="mt-4 space-y-2.5 font-mono text-xs max-h-80 overflow-y-auto pr-1">
          {thoughts.slice(0, currentStepIndex + 1).map((step, idx) => {
            const isCurrent = idx === currentStepIndex && !isFinished;
            return (
              <div
                key={step.id}
                className={`rounded-lg border p-3 transition-colors ${
                  isCurrent
                    ? 'border-[#E2DFD8] bg-[#FFFFFF]/90 text-[#1C2331]'
                    : 'border-[#E2DFD8]/80 bg-[#0D131F] text-[#1C2331]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#5E6C84] mb-1">
                  <span className="text-blue-400 font-medium">
                    {step.agentRole}
                  </span>
                  <span>{step.timestamp}</span>
                </div>
                <div className="flex items-start gap-2">
                  {isCurrent ? (
                    <Loader2 className="h-3.5 w-3.5 shrink-0 text-[#5E6C84] animate-spin mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                  )}
                  <p className="text-xs font-sans leading-relaxed text-[#1C2331]">
                    {step.thought}
                  </p>
                </div>

                {step.toolCall && (
                  <div className="mt-2 rounded bg-slate-950 p-2 text-[10px] font-mono border border-[#E2DFD8]/80 text-[#5E6C84]">
                    <span className="text-[#1C2331]">TOOL</span>: {step.toolCall.toolName}(
                    <span className="text-[#5E6C84]">{JSON.stringify(step.toolCall.input)}</span>
                    )
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-[#E2DFD8] pt-4">
          <span className="text-xs text-[#5E6C84]">
            Double-entry balancing ledger synchronized
          </span>
          <button
            onClick={onClose}
            disabled={!isFinished}
            className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
              isFinished
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
                : 'bg-[#F7F6F2] text-[#5E6C84] cursor-not-allowed'
            }`}
          >
            {isFinished ? 'View Results' : 'Reconciling...'}
          </button>
        </div>
      </div>
    </div>
  );
};
