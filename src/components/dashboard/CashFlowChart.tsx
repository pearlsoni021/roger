import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { ArrowUpRight } from 'lucide-react';

interface CashFlowChartProps {
  companyName: string;
}

const CASHFLOW_DATA = [
  { month: 'Jan', value: 7.2, fill: '#EAEAEA' },
  { month: 'Feb', value: 6.4, fill: '#EAEAEA' },
  { month: 'Mar', value: 9.8, fill: 'url(#premiumGradient)' }, // Highlighted active bar with gradient
  { month: 'Apr', value: 5.1, fill: '#EAEAEA' },
  { month: 'May', value: 8.6, fill: '#EAEAEA' },
  { month: 'Jun', value: 3.5, fill: '#EAEAEA' },
];

export const CashFlowChart: React.FC<CashFlowChartProps> = () => {
  return (
    <div className="rounded-xl bg-[#FFFFFF] border border-[#E2DFD8] p-6 shadow-sm flex flex-col justify-between h-full min-h-[320px]">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-base font-semibold text-[#1C2331] tracking-tight">Total Revenue & Cashflow</h3>
          <p className="text-xs font-normal text-[#5E6C84] mt-0.5">Razorpay Gateway Gross Settlements (₹ in Lakhs)</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7F6F2] text-[#5E6C84] hover:bg-[#E2DFD8] transition-colors font-medium">
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="h-56 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5A7A60" />
                <stop offset="100%" stopColor="#3A5A40" />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              stroke="#938278" 
              fontSize={11} 
              fontWeight={400}
              tickLine={false} 
              axisLine={false}
              dy={8}
            />
            <YAxis 
              stroke="#938278" 
              fontSize={11} 
              fontWeight={400}
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val}K`} 
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: '#FCFBF8',
                borderColor: '#E6DFD5',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#2D1E17',
                boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
              }}
              formatter={(value: any) => [`₹${value} Lakhs`, 'Settlement Volume']}
            />
            <Bar 
              dataKey="value" 
              radius={[6, 6, 6, 6]} 
              maxBarSize={38}
              activeBar={{ fill: '#1E3A8A' }}
            >
              {CASHFLOW_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
