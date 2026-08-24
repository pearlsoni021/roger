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
  { month: 'Jan', value: 7.2, fill: '#2D323B' },
  { month: 'Feb', value: 6.4, fill: '#2D323B' },
  { month: 'Mar', value: 9.8, fill: '#707684' }, // Highlighted active bar
  { month: 'Apr', value: 5.1, fill: '#2D323B' },
  { month: 'May', value: 8.6, fill: '#2D323B' },
  { month: 'Jun', value: 3.5, fill: '#2D323B' },
];

export const CashFlowChart: React.FC<CashFlowChartProps> = () => {
  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between h-full min-h-[320px]">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Total Revenue & Cashflow</h3>
          <p className="text-xs text-slate-400 mt-0.5">Razorpay Gateway Gross Settlements (₹ in Lakhs)</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="h-56 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dy={8}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val}K`} 
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: '#2D323B',
                borderColor: '#3E4450',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#FFFFFF',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              }}
              formatter={(value: any) => [`₹${value} Lakhs`, 'Settlement Volume']}
            />
            <Bar 
              dataKey="value" 
              radius={[12, 12, 12, 12]} 
              maxBarSize={38}
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
