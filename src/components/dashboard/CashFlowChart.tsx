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
  { month: 'Jan', value: 7.2, fill: '#1E3A5F' },
  { month: 'Feb', value: 6.4, fill: '#1E3A5F' },
  { month: 'Mar', value: 9.8, fill: '#C9A84C' }, // Highlighted active bar
  { month: 'Apr', value: 5.1, fill: '#1E3A5F' },
  { month: 'May', value: 8.6, fill: '#1E3A5F' },
  { month: 'Jun', value: 3.5, fill: '#1E3A5F' },
];

export const CashFlowChart: React.FC<CashFlowChartProps> = () => {
  return (
    <div className="rounded-xl bg-[#0F1629] border border-[#1E293B] p-6 shadow-sm flex flex-col justify-between h-full min-h-[320px]">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">Total Revenue & Cashflow</h3>
          <p className="text-xs font-normal text-slate-500 mt-0.5">Razorpay Gateway Gross Settlements (₹ in Lakhs)</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors font-medium">
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="h-56 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="month" 
              stroke="#475569" 
              fontSize={11} 
              fontWeight={400}
              tickLine={false} 
              axisLine={false}
              dy={8}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={11} 
              fontWeight={400}
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val}K`} 
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: 'rgba(201,168,76,0.3)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#F1F5F9',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              }}
              formatter={(value: any) => [`₹${value} Lakhs`, 'Settlement Volume']}
            />
            <Bar 
              dataKey="value" 
              radius={[6, 6, 6, 6]} 
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
