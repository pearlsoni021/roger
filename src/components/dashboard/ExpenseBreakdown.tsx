import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const EXPENSE_DATA = [
  { name: 'Payroll & CTC', value: 1650000, percentage: 51.5, color: '#3B82F6' },
  { name: 'Cloud & Infrastructure', value: 720000, percentage: 22.5, color: '#10B981' },
  { name: 'Digital Marketing', value: 450000, percentage: 14.0, color: '#F59E0B' },
  { name: 'Legal, Tax & Audit', value: 220000, percentage: 6.8, color: '#8B5CF6' },
  { name: 'Gateway & Bank Charges', value: 160000, percentage: 5.2, color: '#64748B' },
];

export const ExpenseBreakdown: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#111726] p-4">
      <div className="pb-1">
        <h3 className="text-xs font-semibold text-slate-200">Expense Category Distribution</h3>
        <p className="text-[11px] text-slate-400">Total Monthly Operating Spend: ₹32.0 Lakhs</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="h-52 w-52 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={EXPENSE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {EXPENSE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#111726" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#F8FAFC',
                }}
                formatter={(val: any) => [`₹${(Number(val) / 100000).toFixed(2)} Lakhs`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-medium text-slate-400">Payroll</span>
            <span className="text-base font-bold text-slate-100 font-mono">51.5%</span>
          </div>
        </div>

        <div className="w-full space-y-1.5 text-xs">
          {EXPENSE_DATA.map((item) => (
            <div key={item.name} className="flex items-center justify-between border-b border-slate-800/50 pb-1.5 last:border-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 text-[11px] truncate max-w-[130px]">{item.name}</span>
              </div>
              <div className="text-right font-mono text-[11px] text-slate-200">
                ₹{(item.value / 100000).toFixed(1)}L <span className="text-slate-500 text-[10px]">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
