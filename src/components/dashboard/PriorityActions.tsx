import React from 'react';

const TRANSACTIONS = [
  { date: 'Oct 26', description: 'Razorpay Daily Settlement', category: 'Revenue', amount: 124000.50 },
  { date: 'Oct 25', description: 'AWS Cloud Services', category: 'Cloud', amount: -45000.00 },
  { date: 'Oct 25', description: 'Google Workspace', category: 'Software', amount: -12500.00 },
  { date: 'Oct 24', description: 'Razorpay Daily Settlement', category: 'Revenue', amount: 98000.00 },
  { date: 'Oct 23', description: 'GrowthMatrix Marketing', category: 'Vendor', amount: -52000.00 },
];

export const PriorityActions: React.FC<any> = () => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2DFD8] rounded-lg p-5">
      <h3 className="font-serif text-[#1C2331] text-lg mb-4">Recent Transactions</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-2 border-b border-[#E2DFD8] text-[#1C2331] text-[11px] uppercase tracking-wider font-semibold">Date</th>
              <th className="py-2 border-b border-[#E2DFD8] text-[#1C2331] text-[11px] uppercase tracking-wider font-semibold">Description</th>
              <th className="py-2 border-b border-[#E2DFD8] text-[#1C2331] text-[11px] uppercase tracking-wider font-semibold">Category</th>
              <th className="py-2 border-b border-[#E2DFD8] text-[#1C2331] text-[11px] uppercase tracking-wider font-semibold text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx, idx) => (
              <tr key={idx} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2] transition-colors">
                <td className="py-3 text-[13px] text-[#5E6C84]">{tx.date}</td>
                <td className="py-3 text-[13px] text-[#1C2331]">{tx.description}</td>
                <td className="py-3 text-[13px] text-[#1C2331]">{tx.category}</td>
                <td className={`py-3 text-[13px] font-medium text-right ${tx.amount > 0 ? 'text-[#3A5A40]' : 'text-[#A34A4A]'}`}>
                  {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
