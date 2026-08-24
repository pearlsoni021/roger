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
  { month: 'Jan', value: 7.2, fill: '#242831' },
  { month: 'Feb', value: 6.4, fill: '#242831' },
  { month: 'Mar', value: 9.8, fill: '#64748B' }, // Highlighted active bar
  { month: 'Apr', value: 5.1, fill: '#242831' },
  { month: 'May', value: 8.6, fill: '#242831' },
  { month: 'Jun', value: 3.5, fill: '#242831' },
];

export const CashFlowChart: React.FC<CashFlowChartProps> = () => {
  return (
    <div className="rounded-3xl bg-white border border-slate-300 p-6 shadow-sm flex flex-col justify-between h-full min-h-[320px]">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">Total Revenue & Cashflow</h3>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">Razorpay Gateway Gross Settlements (₹ in Lakhs)</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors font-bold">
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="h-56 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="month" 
              stroke="#334155" 
              fontSize={12} 
              fontWeight={700}
              tickLine={false} 
              axisLine={false}
              dy={8}
            />
            <YAxis 
              stroke="#334155" 
              fontSize={11.5} 
              fontWeight={700}
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val}K`} 
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: '#242831',
                borderColor: '#475569',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
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
