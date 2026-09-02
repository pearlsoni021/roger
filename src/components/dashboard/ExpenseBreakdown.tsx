import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip } from 'recharts';

const ALLOCATION_DATA = [
  { name: 'Payroll & CTC', value: 45, color: '#1E3A8A' }, // Navy
  { name: 'Cloud & Tech', value: 30, color: '#819A88' }, // Sage
  { name: 'Marketing', value: 15, color: '#C6A98F' }, // Tan
  { name: 'Logistics', value: 10, color: '#E2DFD8' }, // Light Gray
];

const PERFORMANCE_DATA_ALL = {
  '1M': [
    { period: 'Week 1', opex: 4000, revenue: 2400 },
    { period: 'Week 2', opex: 3000, revenue: 1398 },
    { period: 'Week 3', opex: 2000, revenue: 9800 },
    { period: 'Week 4', opex: 2780, revenue: 3908 },
  ],
  '6M': [
    { period: 'Apr', opex: 1890, revenue: 4800 },
    { period: 'May', opex: 2390, revenue: 3800 },
    { period: 'Jun', opex: 3490, revenue: 4300 },
    { period: 'Jul', opex: 3100, revenue: 5100 },
    { period: 'Aug', opex: 2800, revenue: 4900 },
    { period: 'Sep', opex: 2900, revenue: 6100 },
  ],
  '1Y': [
    { period: 'Q1', opex: 12000, revenue: 15000 },
    { period: 'Q2', opex: 11500, revenue: 18000 },
    { period: 'Q3', opex: 13000, revenue: 21000 },
    { period: 'Q4', opex: 14000, revenue: 26000 },
  ],
  'ALL': [
    { period: '2021', opex: 32000, revenue: 45000 },
    { period: '2022', opex: 41500, revenue: 68000 },
    { period: '2023', opex: 53000, revenue: 91000 },
  ]
};

type TimeRange = '1M' | '6M' | '1Y' | 'ALL';

export const ExpenseBreakdown: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');

  return (
    <div className="space-y-6">
      {/* Expense Allocation */}
      <div className="bg-[#FFFFFF] border border-[#E2DFD8] rounded-lg p-5 min-h-[220px]">
        <h3 className="font-serif text-[#1C2331] text-lg mb-4">OpEx Breakdown</h3>
        <div className="flex items-center gap-6">
          <div className="h-32 w-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ALLOCATION_DATA}
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {ALLOCATION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5">
            {ALLOCATION_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#1C2331] text-[13px]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Trend */}
      <div className="bg-[#FFFFFF] border border-[#E2DFD8] rounded-lg p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-[#1C2331] text-lg">Operating Cashflow Trend</h3>
          <div className="flex gap-2">
            {(['1M', '6M', '1Y', 'ALL'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`text-[11px] px-1 pb-0.5 transition-colors ${
                  timeRange === range 
                    ? 'font-medium text-[#1C2331] border-b border-[#1C2331]' 
                    : 'font-normal text-[#5E6C84] hover:text-[#1C2331]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PERFORMANCE_DATA_ALL[timeRange]} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2DFD8',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  color: '#1C2331',
                  fontSize: '12px'
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#819A88" strokeWidth={2} dot={false} name="Revenue" />
              <Line type="monotone" dataKey="opex" stroke="#1E3A8A" strokeWidth={2} dot={false} name="OpEx" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
