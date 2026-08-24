import React from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export const ExpenseBreakdown: React.FC = () => {
  const days = [
    { day: 'Tue', date: 17, isSelected: false },
    { day: 'Wed', date: 18, isSelected: false },
    { day: 'Thu', date: 19, isSelected: true },
    { day: 'Fri', date: 20, isSelected: false },
    { day: 'Sat', date: 21, isSelected: false },
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between h-full min-h-[320px]">
      {/* Top: Calendar Widget Header */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <button className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold text-slate-900 tracking-tight">September 2026</span>
          <button className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Days Row */}
        <div className="grid grid-cols-5 gap-1.5 pt-2 text-center">
          {days.map((d) => (
            <div
              key={d.date}
              className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all ${
                d.isSelected
                  ? 'bg-[#1E2024] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] font-medium ${d.isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                {d.day}
              </span>
              <span className="text-xs font-bold mt-1">
                {d.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Community / Controller Health Growth Card */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-900">Reconciliation Velocity</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+0.9% from last month</span>
          </div>
        </div>

        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center h-12 w-12 rounded-full border-4 border-slate-100 bg-white shadow-inner">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-900 stroke-current"
              strokeWidth="3.5"
              strokeDasharray="65, 100"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="text-[11px] font-bold text-slate-900">80%</span>
        </div>
      </div>
    </div>
  );
};
