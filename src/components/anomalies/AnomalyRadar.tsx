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
          <span className="inline-flex items-center gap-1.5 rounded border border-rose-900/50 bg-rose-950/40 px-2 py-0.5 text-[11px] font-medium text-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            Critical Variance
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-amber-900/50 bg-amber-950/40 px-2 py-0.5 text-[11px] font-medium text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Advisory
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            Operational Info
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#111726] p-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-slate-300" />
            <h2 className="text-sm font-semibold text-slate-100">Financial Leakage & Anomaly Watchdog</h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Continuous background telemetry scanning for <strong>MDR fee drift</strong>, <strong>SaaS subscription seat creep</strong>, and <strong>tax threshold compliance</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-[#0D131F] px-3.5 py-1.5 text-xs">
          <span className="text-slate-400">Identified Leakage at Risk: </span>
          <strong className="text-slate-100 font-mono font-bold">{formatINR(totalLeakageAtRiskINR)}</strong>
        </div>
      </div>

      {/* Anomaly Cards Grid */}
      <div className="space-y-3">
        {openAnomalies.map((anom) => (
          <div
            key={anom.id}
            className="rounded-xl border border-slate-800 bg-[#111726] p-4 hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                {getSeverityBadge(anom.severity)}
                <h3 className="text-xs font-semibold text-slate-100">{anom.title}</h3>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-slate-500">Detected {anom.detectedAt}</span>
                <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-slate-200 font-medium">
                  Impact: {formatINR(anom.financialImpactINR)}
                </span>
              </div>
            </div>

            <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
              {anom.description}
            </p>

            <div className="mt-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 rounded-lg border border-slate-800 bg-[#0D131F] p-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0" />
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
                  className="flex items-center gap-1.5 rounded-md bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <span>Remediate</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Resolved Anomalies History */}
        {resolvedAnomalies.length > 0 && (
          <div className="pt-3">
            <h4 className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
              Recently Resolved Items ({resolvedAnomalies.length})
            </h4>
            <div className="space-y-1.5">
              {resolvedAnomalies.map((anom) => (
                <div key={anom.id} className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-[#0D131F] p-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-slate-300">{anom.title}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">Resolved</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
