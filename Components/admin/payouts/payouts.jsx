"use client";
import React, { useState } from 'react';
import { Users, CreditCard, AlertCircle, CheckCircle2, Search, ExternalLink } from 'lucide-react';

// Mock Data: List of Owners who need to be paid
const initialOwnersData = [
  { id: 1, name: "John Doe Store", email: "john@example.com", pendingAmount: 1250.00, totalPaid: 5000.00, status: "Pending" },
  { id: 2, name: "Tech Gadgets Inc", email: "admin@techgadgets.com", pendingAmount: 840.50, totalPaid: 12000.00, status: "Pending" },
  { id: 3, name: "Organic Farm", email: "sales@organic.com", pendingAmount: 0.00, totalPaid: 3200.00, status: "Paid" },
  { id: 4, name: "Fashion Hub", email: "contact@fashionhub.com", pendingAmount: 2100.00, totalPaid: 15000.00, status: "Pending" },
];

const AdminPayoutPage = () => {
  const [owners, setOwners] = useState(initialOwnersData);
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate Totals
  const totalToPay = owners.reduce((acc, curr) => acc + curr.pendingAmount, 0);
  const pendingCount = owners.filter(o => o.pendingAmount > 0).length;

  const handlePayOwner = (id) => {
    // In a real app, you would call your API here (e.g., Stripe Connect or Bank Transfer)
    alert(`Processing payment for Owner ID: ${id}`);
    
    setOwners(owners.map(owner => 
      owner.id === id ? { ...owner, pendingAmount: 0, status: "Paid", totalPaid: owner.totalPaid + owner.pendingAmount } : owner
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Payout Control</h1>
            <p className="text-slate-500">Manage and release payments to platform owners.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search owner..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Admin Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><AlertCircle /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Pending Payouts</p>
                <p className="text-2xl font-bold text-slate-900">${totalToPay.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Owners to Pay</p>
                <p className="text-2xl font-bold text-slate-900">{pendingCount} Owners</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">System Status</p>
                <p className="text-2xl font-bold text-green-600">All Clear</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Management Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs uppercase font-semibold text-slate-600">Owner / Merchant</th>
                  <th className="px-6 py-4 text-xs uppercase font-semibold text-slate-600">Total Life-time Paid</th>
                  <th className="px-6 py-4 text-xs uppercase font-semibold text-slate-600">Current Balance</th>
                  <th className="px-6 py-4 text-xs uppercase font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-xs uppercase font-semibold text-slate-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {owners
                  .filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((owner) => (
                  <tr key={owner.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{owner.name}</div>
                      <div className="text-xs text-slate-500">{owner.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      ${owner.totalPaid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${owner.pendingAmount > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                        ${owner.pendingAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {owner.pendingAmount > 0 ? (
                        <span className="flex items-center gap-1.5 text-orange-600 text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                          Awaiting Payment
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                          <CheckCircle2 size={14} />
                          Settled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {owner.pendingAmount > 0 ? (
                        <button 
                          onClick={() => handlePayOwner(owner.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ml-auto"
                        >
                          <CreditCard size={16} />
                          Release Funds
                        </button>
                      ) : (
                        <button 
                          disabled
                          className="bg-slate-100 text-slate-400 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed ml-auto"
                        >
                          Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPayoutPage;