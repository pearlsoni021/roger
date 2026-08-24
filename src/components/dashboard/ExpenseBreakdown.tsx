import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface DailyScheduleItem {
  time: string;
  title: string;
  type: 'payout' | 'reconciliation' | 'tax' | 'audit';
  amount?: number;
  status: 'Completed' | 'Pending' | 'In Progress';
}

const SCHEDULE_DATA: Record<number, DailyScheduleItem[]> = {
  17: [
    { time: '10:00 AM', title: 'UPI AutoPay Recurring Settlement', type: 'reconciliation', amount: 340000, status: 'Completed' },
    { time: '02:30 PM', title: 'Vendor Payout Batch #902 (Marketing)', type: 'payout', amount: 185000, status: 'Completed' },
  ],
  18: [
    { time: '11:15 AM', title: 'Gateway MDR SLA Rate Verification', type: 'audit', status: 'Completed' },
    { time: '04:00 PM', title: 'ICICI Bank MT940 Statement Ingestion', type: 'reconciliation', amount: 620000, status: 'Completed' },
  ],
  19: [
    { time: '09:30 AM', title: 'RazorpayX Vendor Payout Run', type: 'payout', amount: 522000, status: 'Completed' },
    { time: '01:45 PM', title: '3-Way Batch Reconciliation (60 Recs)', type: 'reconciliation', amount: 1450000, status: 'In Progress' },
    { time: '05:00 PM', title: 'Section 194J TDS Challan Compilation', type: 'tax', amount: 34000, status: 'Pending' },
  ],
  20: [
    { time: '10:30 AM', title: 'AWS Cloud OpEx Journal Posting', type: 'payout', amount: 450000, status: 'Pending' },
    { time: '03:00 PM', title: 'Form 26Q Pre-Filing Validation', type: 'tax', status: 'Pending' },
  ],
  21: [
    { time: '11:00 AM', title: 'Weekend Settlement Float Audit (T+2)', type: 'audit', amount: 313600, status: 'Pending' },
  ],
};

export const ExpenseBreakdown: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number>(19);
  const [monthOffset, setMonthOffset] = useState<number>(0);

  const baseDays = [
    { day: 'Tue', date: 17 + monthOffset * 7 },
    { day: 'Wed', date: 18 + monthOffset * 7 },
    { day: 'Thu', date: 19 + monthOffset * 7 },
    { day: 'Fri', date: 20 + monthOffset * 7 },
    { day: 'Sat', date: 21 + monthOffset * 7 },
  ];

  const currentSchedule = SCHEDULE_DATA[selectedDate] || [
    { time: '10:00 AM', title: 'Autonomous General Ledger Reconciliation', type: 'reconciliation', status: 'Pending' },
    { time: '03:30 PM', title: 'RazorpayX Payout Verification', type: 'payout', status: 'Pending' },
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-300 p-5 shadow-sm flex flex-col justify-between h-full min-h-[360px]">
      {/* Top: Calendar Widget Header */}
      <div>
        <div className="flex items-center justify-between pb-2.5">
          <button 
            onClick={() => setMonthOffset(prev => Math.max(prev - 1, -1))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 font-bold transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-black text-slate-900 tracking-tight">September 2026</span>
          <button 
            onClick={() => setMonthOffset(prev => Math.min(prev + 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 font-bold transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Interactive Days Row */}
        <div className="grid grid-cols-5 gap-1.5 pt-1 text-center">
          {baseDays.map((d) => {
            const isSelected = d.date === selectedDate;
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-[#242831] text-white shadow-md scale-105'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={`text-[11px] font-bold ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                  {d.day}
                </span>
                <span className={`text-xs font-black mt-0.5 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {d.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle: Active Scheduled Operations for Selected Date (Fills Empty Gap!) */}
      <div className="my-3 py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-black text-slate-800 uppercase tracking-wide">
          <span>Schedule for Sep {selectedDate}</span>
          <span className="text-[10px] font-bold text-slate-500">{currentSchedule.length} Tasks</span>
        </div>

        <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
          {currentSchedule.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="text-[10px] font-mono font-bold text-slate-500 shrink-0">
                  {item.time}
                </div>
                <div className="font-bold text-slate-900 truncate text-[11px]">
                  {item.title}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {item.amount && (
                  <span className="font-mono font-bold text-slate-900 text-[11px]">
                    {formatINR(item.amount, { compact: true })}
                  </span>
                )}
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                  item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                  item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-slate-200 text-slate-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Controller Reconciliation Health & Growth */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
        <div>
          <div className="text-xs font-black text-slate-900">Reconciliation Velocity</div>
          <div className="mt-0.5 flex items-center gap-1 text-xs font-extrabold text-emerald-700">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>1,450 records / sec</span>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center h-11 w-11 rounded-full border-4 border-slate-200 bg-white shadow-inner shrink-0">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#242831] stroke-current"
              strokeWidth="3.5"
              strokeDasharray="80, 100"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="text-[11px] font-black text-slate-900">80%</span>
        </div>
      </div>
    </div>
  );
};
