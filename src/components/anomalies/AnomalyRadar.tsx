import React from 'react';
import { FinancialAnomaly } from '../../types/agent';
import { formatINR } from '../../utils/formatters';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

interface AnomalyRadarProps {
  anomalies: FinancialAnomaly[];
  onResolveAnomaly: (anomalyId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const AnomalyRadar: React.FC<AnomalyRadarProps> = ({
  anomalies,
  onResolveAnomaly,
  onNavigateToTab,
}) => {
  const openAnomalies = anomalies.filter(a => a.status === 'OPEN');
  const resolvedAnomalies = anomalies.filter(a => a.status === 'RESOLVED');

  const totalLeakageAtRiskINR = openAnomalies.reduce((sum, a) => sum + a.financialImpactINR, 0);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-rose-900/50 bg-[#F3E8E8] px-2 py-0.5 text-[11px] font-medium text-[#A34A4A]">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            Critical Variance
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-amber-900/50 bg-[#FFF8E1] px-2 py-0.5 text-[11px] font-medium text-[#F4B400]">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Advisory
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-[#EAEAEA] bg-[#F5F0E6] px-2 py-0.5 text-[11px] font-medium text-[#6B6B6B]">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Operational Info
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[#EAEAEA] bg-[#FFFFFF] p-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#6B6B6B]" />
            <h2 className="text-sm font-semibold text-[#2E2E2E]">Financial Leakage & Anomaly Watchdog</h2>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-0.5">
            Continuous background telemetry scanning for <strong>MDR fee drift</strong>, <strong>SaaS subscription seat creep</strong>, and <strong>tax threshold compliance</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#EAEAEA] bg-[#F5F0E6] px-3.5 py-1.5 text-xs">
          <span className="text-[#6B6B6B]">Identified Leakage at Risk: </span>
          <strong className="text-[#2E2E2E] font-mono font-bold">{formatINR(totalLeakageAtRiskINR)}</strong>
        </div>
      </div>

      {/* Anomaly Cards Grid */}
      <div className="space-y-3">
        {openAnomalies.map((anom) => (
          <div
            key={anom.id}
            className="rounded-xl border border-[#EAEAEA] bg-[#FFFFFF] p-4 hover:border-[#EAEAEA] transition-colors shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#EAEAEA] pb-2.5">
              <div className="flex items-center gap-2">
                {getSeverityBadge(anom.severity)}
                <h3 className="text-xs font-semibold text-[#2E2E2E]">{anom.title}</h3>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-[#6B6B6B]">Detected {anom.detectedAt}</span>
                <span className="rounded bg-[#FFFFFF] border border-[#EAEAEA] px-2 py-0.5 font-mono text-[#2E2E2E] font-medium">
                  Impact: {formatINR(anom.financialImpactINR)}
                </span>
              </div>
            </div>

            <p className="mt-2.5 text-xs text-[#6B6B6B] leading-relaxed">
              {anom.description}
            </p>

            <div className="mt-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 rounded-lg border border-[#EAEAEA] bg-[#F5F0E6] p-3">
              <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                <Sparkles className="h-3.5 w-3.5 text-[#4A6982] shrink-0" />
                <span><strong>Recommendation</strong>: {anom.aiSuggestedAction}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (anom.category === 'RECONCILIATION' || anom.category === 'MDR_LEAKAGE') {
                      onNavigateToTab('reconciliation');
                    } else if (anom.category === 'TAX_NONCOMPLIANCE') {
                      onNavigateToTab('vendors');
                    } else {
                      onResolveAnomaly(anom.id);
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-md bg-[#F5F0E6] border border-[#EAEAEA] px-3 py-1 text-xs font-medium text-[#2E2E2E] hover:bg-[#EBE5DE] transition-colors"
                >
                  <span>Remediate</span>
                  <ArrowRight className="h-3 w-3 text-[#6B6B6B]" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Resolved Anomalies History */}
        {resolvedAnomalies.length > 0 && (
          <div className="pt-3">
            <h4 className="text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wider mb-2">
              Recently Resolved Items ({resolvedAnomalies.length})
            </h4>
            <div className="space-y-1.5">
              {resolvedAnomalies.map((anom) => (
                <div key={anom.id} className="flex items-center justify-between rounded-lg border border-[#EAEAEA] bg-[#F5F0E6] p-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-[#6B6B6B]">{anom.title}</span>
                  </div>
                  <span className="text-[#6B6B6B] text-[11px]">Resolved</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
