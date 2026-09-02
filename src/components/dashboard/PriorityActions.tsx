import React from 'react';

const TRANSACTIONS = [
  { date: '02/26/23', description: 'Whole Foods Market', category: 'Category', amount: -230.00 },
  { date: '02/26/23', description: 'Salary Deposit', category: 'Salary', amount: 200.00 },
  { date: '02/26/23', description: 'Adobe Systems', category: 'Category', amount: 100.00 },
  { date: '02/26/23', description: 'Whole Foods Market', category: 'Category', amount: -50.00 },
];

export const PriorityActions: React.FC<any> = () => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2DFD8] rounded-lg p-5">
      <h3 className="font-serif text-[#1C2331] text-lg mb-4">Recent Transactions</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-2 border-b border-[#E2DFD8] text-[#1C2331] text-xs font-semibold">Date</th>
              <th className="py-2 border-b border-[#E2DFD8] text-[#1C2331] text-xs font-semibold">Description</th>
              <th className="py-2 border-b border-[#E2DFD8] text-[#1C2331] text-xs font-semibold">Category</th>
              <th className="py-2 border-b border-[#E2DFD8] text-[#1C2331] text-xs font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx, idx) => (
              <tr key={idx} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2] transition-colors">
                <td className="py-3 text-[13px] text-[#5E6C84]">{tx.date}</td>
                <td className="py-3 text-[13px] text-[#1C2331]">{tx.description}</td>
                <td className="py-3 text-[13px] text-[#1C2331]">{tx.category}</td>
                <td className={`py-3 text-[13px] font-medium text-right ${tx.amount > 0 ? 'text-[#819A88]' : 'text-[#C86A58]'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount > 0 ? `$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
