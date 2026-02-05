"use client";
import React, { useState } from 'react';

import { 
  Wallet, 
  ArrowUpRight, 

  Percent, 
  User, 
  HardHat, 
  Clock, 
  CheckCircle2, 
  MoreVertical,
  Search,
  Download,
  Filter
} from 'lucide-react';

// Mock Data for Bookings & Splits
const bookingsData = [
  { id: "BK-7701", customer: "Alex Rivera", provider: "Marcus Volt", service: "Electrical Wiring", total: 500.00, status: "Completed", date: "2024-03-25" },
  { id: "BK-7702", customer: "Sarah Jenkins", provider: "Jane Cooper", service: "Pipe Leak Repair", total: 150.00, status: "Pending Payout", date: "2024-03-24" },
  { id: "BK-7703", customer: "Michael Cho", provider: "Cody Fisher", service: "AC Installation", total: 1200.00, status: "Completed", date: "2024-03-24" },
  { id: "BK-7704", customer: "Emma Davis", provider: "Robert Fox", service: "Brake Replacement", total: 350.00, status: "In Escrow", date: "2024-03-23" },
];

export default function CommissionPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Financial Summary Calculations
  const totalVolume = bookingsData.reduce((acc, curr) => acc + curr.total, 0);
  const adminCommission = totalVolume * 0.10;
  const providerPayouts = totalVolume * 0.90;

  return (

      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Booking & Payouts</h1>
            <p className="text-slate-500 text-sm">Platform commission (10%) and Provider earnings (90%) tracking.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Export Financial Report
          </button>
        </div>

        {/* Financial Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
             <div className="relative z-10">
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Total Booking Volume</p>
              <h3 className="text-3xl font-bold mt-2">${totalVolume.toLocaleString()}</h3>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-2 py-1 rounded-lg">
                <Clock size={14} /> Global Gross
              </div>
             </div>
             <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Percent size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">10% FEE</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Admin Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">${adminCommission.toLocaleString()}</h3>
            <p className="text-[11px] text-slate-400 mt-2 italic">Platform service charge earned</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <ArrowUpRight size={20} />
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">90% SHARE</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Provider Earnings</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">${providerPayouts.toLocaleString()}</h3>
            <p className="text-[11px] text-slate-400 mt-2 italic">Net disbursed to service owners</p>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by ID or Provider..." 
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-xl outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              <Filter size={18} /> Filter Status
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4 text-center">Booking ID</th>
                  <th className="px-6 py-4">Parties</th>
                  <th className="px-6 py-4">Total Paid</th>
                  <th className="px-6 py-4 text-emerald-600">Admin (10%)</th>
                  <th className="px-6 py-4 text-amber-600">Provider (90%)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookingsData.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-mono font-bold text-slate-400">{booking.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <User size={14} className="text-slate-300" /> {booking.customer}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                          <HardHat size={14} className="text-slate-300" /> {booking.provider}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      ${booking.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 bg-emerald-50/30">
                      ${(booking.total * 0.10).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-amber-600 bg-amber-50/30">
                      ${(booking.total * 0.90).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                        booking.status === 'In Escrow' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informational Footer */}
        <div className="p-6 bg-slate-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <CheckCircle2 size={24} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Automated Settlement System</h4>
              <p className="text-xs text-slate-400">Payouts are calculated in real-time. Payments move to "Pending Payout" after job completion.</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all">
            Process All Due Payouts
          </button>
        </div>

      </div>
   
  );
}