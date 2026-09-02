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
      <h3 className="font-serif text-[#1C2331] text-lg mb-4">Account Balances</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[#1C2331] text-[13px] font-medium mb-1">Checking</p>
          <p className="text-[#5E6C84] text-[13px]">{formatINR(company.totalCashINR * 0.72, { compact: true })}</p>
        </div>
        <div>
          <p className="text-[#1C2331] text-[13px] font-medium mb-1">Savings</p>
          <p className="text-[#5E6C84] text-[13px]">{formatINR(company.totalCashINR * 0.15, { compact: true })}</p>
        </div>
        <div>
          <p className="text-[#1C2331] text-[13px] font-medium mb-1">Investment</p>
          <p className="text-[#5E6C84] text-[13px]">{formatINR(company.totalCashINR * 0.13, { compact: true })}</p>
        </div>
      </div>
    </div>
  );
};
