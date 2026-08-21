import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface CashFlowChartProps {
  companyName: string;
}

const CASHFLOW_DATA = [
  { month: 'Mar', Inflow: 48, Outflow: 31, NetCashflow: 17 },
  { month: 'Apr', Inflow: 51, Outflow: 33, NetCashflow: 18 },
  { month: 'May', Inflow: 54, Outflow: 34, NetCashflow: 20 },
  { month: 'Jun', Inflow: 56, Outflow: 35, NetCashflow: 21 },
  { month: 'Jul', Inflow: 57, Outflow: 32, NetCashflow: 25 },
  { month: 'Aug', Inflow: 58, Outflow: 32, NetCashflow: 26 },
];

export const CashFlowChart: React.FC<CashFlowChartProps> = () => {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#111726] p-4">
      <div className="flex items-center justify-between pb-3">
        <div>
          <h3 className="text-xs font-semibold text-slate-200">Monthly Cash Inflow vs Outflows</h3>
          <p className="text-[11px] text-slate-400">Collections (Razorpay Gateway) vs Operating Disbursements (₹ in Lakhs)</p>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Live Ingestion</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val}L`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#F8FAFC',
              }}
              formatter={(value: any, name: any) => [`₹${value} Lakhs`, name]}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
            <Bar dataKey="Inflow" name="Gateway Collections" fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={28} />
            <Bar dataKey="Outflow" name="Operating Outflows" fill="#475569" radius={[3, 3, 0, 0]} maxBarSize={28} />
            <Line type="monotone" dataKey="NetCashflow" name="Net Operating Cash" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
