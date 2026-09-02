import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, Tooltip } from 'recharts';

const ALLOCATION_DATA = [
  { name: 'Equities', value: 45, color: '#1E3A8A' }, // Navy
  { name: 'Bonds', value: 30, color: '#819A88' }, // Sage
  { name: 'Real Estate', value: 15, color: '#C6A98F' }, // Tan
  { name: 'Cash', value: 10, color: '#E2DFD8' }, // Light Gray
];

const PERFORMANCE_DATA = [
  { month: 'Jan', portfolio: 4000, benchmark: 2400 },
  { month: 'Feb', portfolio: 3000, benchmark: 1398 },
  { month: 'Mar', portfolio: 2000, benchmark: 9800 },
  { month: 'Apr', portfolio: 2780, benchmark: 3908 },
  { month: 'May', portfolio: 1890, benchmark: 4800 },
  { month: 'Jun', portfolio: 2390, benchmark: 3800 },
  { month: 'Jul', portfolio: 3490, benchmark: 4300 },
];

export const ExpenseBreakdown: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Asset Allocation */}
      <div className="bg-[#FFFFFF] border border-[#E2DFD8] rounded-lg p-5 min-h-[220px]">
        <h3 className="font-serif text-[#1C2331] text-lg mb-4">Asset Allocation</h3>
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

      {/* Investment Performance */}
      <div className="bg-[#FFFFFF] border border-[#E2DFD8] rounded-lg p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-[#1C2331] text-lg">Investment Performance</h3>
          <div className="flex gap-2">
            <button className="text-[11px] font-medium text-[#1C2331] border-b border-[#1C2331] pb-0.5">1M</button>
            <button className="text-[11px] font-normal text-[#5E6C84]">6M</button>
            <button className="text-[11px] font-normal text-[#5E6C84]">1Y</button>
            <button className="text-[11px] font-normal text-[#5E6C84]">ALL</button>
          </div>
        </div>
        
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PERFORMANCE_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
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
              <Line type="monotone" dataKey="portfolio" stroke="#819A88" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="benchmark" stroke="#1E3A8A" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
