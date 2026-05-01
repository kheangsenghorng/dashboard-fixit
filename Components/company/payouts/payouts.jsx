import React from 'react';
import { DollarSign, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';

// Mock Data (In a real app, you would fetch this from your API)
const payoutSummary = {
  totalPaid: "$12,450.00",
  pendingAmount: "$1,200.00",
  lastPayoutDate: "Oct 24, 2023",
};

const payoutHistory = [
  { id: 'TXN-1024', date: '2023-10-24', amount: '$2,500.00', method: 'Bank Transfer', status: 'Completed' },
  { id: 'TXN-1023', date: '2023-09-24', amount: '$3,100.00', method: 'PayPal', status: 'Completed' },
  { id: 'TXN-1022', date: '2023-08-24', amount: '$1,200.00', method: 'Bank Transfer', status: 'Pending' },
  { id: 'TXN-1021', date: '2023-07-24', amount: '$5,650.00', method: 'Bank Transfer', status: 'Completed' },
];

const PayoutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payouts</h1>
          <p className="text-gray-600">View and track the payments sent to you by the Admin.</p>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <DollarSign size={24} />
              </div>
              <span className="text-xs font-medium text-gray-400 uppercase">Total Paid</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{payoutSummary.totalPaid}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Clock size={24} />
              </div>
              <span className="text-xs font-medium text-gray-400 uppercase">Pending</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{payoutSummary.pendingAmount}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <CheckCircle size={24} />
              </div>
              <span className="text-xs font-medium text-gray-400 uppercase">Last Payout</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{payoutSummary.lastPayoutDate}</h3>
          </div>
        </div>

        {/* Payout History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Payout History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Transaction ID</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Method</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payoutHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-700">{item.id}</td>
                    <td className="px-6 py-4 text-gray-600">{item.date}</td>
                    <td className="px-6 py-4 text-gray-600">{item.method}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{item.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <button className="text-sm text-blue-600 font-medium hover:underline flex items-center justify-center mx-auto">
              Download Full Report <ArrowUpRight size={16} className="ml-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PayoutPage;