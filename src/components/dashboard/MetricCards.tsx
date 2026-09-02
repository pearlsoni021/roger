import React from 'react';
import { CompanyProfile } from '../../types/finance';
import { formatINR } from '../../utils/formatters';

interface MetricCardsProps {
  company: CompanyProfile;
  reconciliationHealth: number;
  openAnomaliesCount: number;
  onNavigateToTab: (tab: any) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  company
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2DFD8] rounded-lg p-5">
      <h3 className="font-serif text-[#1C2331] text-lg mb-4">Financial Health</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[#1C2331] text-[13px] font-medium mb-1">Liquid Reserves</p>
          <p className="text-[#5E6C84] text-[13px]">{formatINR(company.totalCashINR, { compact: true })}</p>
        </div>
        <div>
          <p className="text-[#1C2331] text-[13px] font-medium mb-1">Net Burn</p>
          <p className="text-[#5E6C84] text-[13px]">{formatINR(company.monthlyBurnINR, { compact: true })}/mo</p>
        </div>
        <div>
          <p className="text-[#1C2331] text-[13px] font-medium mb-1">Runway</p>
          <p className="text-[#5E6C84] text-[13px]">{company.runwayMonths} Months</p>
        </div>
      </div>
    </div>
  );
};
