import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip
} from 'recharts';

interface CashFlowChartProps {
  companyName: string;
}

const CASHFLOW_DATA = [
  { month: 'Jan', value: 800000 },
  { month: 'Feb', value: 850000 },
  { month: 'Mar', value: 820000 },
  { month: 'Apr', value: 950000 },
  { month: 'May', value: 910000 },
  { month: 'Jun', value: 1040000 },
  { month: 'Jul', value: 1100000 },
  { month: 'Aug', value: 1080000 },
  { month: 'Sep', value: 1240560 },
];

export const CashFlowChart: React.FC<CashFlowChartProps> = () => {
  return (
    <div className="rounded-lg bg-[#FFFFFF] border border-[#E2DFD8] p-6 flex flex-col justify-between h-full min-h-[320px]">
      <div>
        <h3 className="font-serif text-[#1C2331] text-lg mb-4">Net Worth</h3>
        <div className="text-4xl font-serif text-[#1C2331] mb-1">
          $1,240,560.80
        </div>
        <div className="text-sm font-medium text-[#4B6359]">
          +2.1% this month
        </div>
      </div>

      <div className="h-40 w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CASHFLOW_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#819A88" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#819A88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#819A88" 
              strokeWidth={2}
              fill="url(#areaGradient)" 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E2DFD8',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                color: '#1C2331',
              }}
              formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Net Worth']}
              labelStyle={{ color: '#5E6C84' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
