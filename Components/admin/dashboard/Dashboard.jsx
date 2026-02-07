"use client";

import { TrendingUp, TrendingDown, DollarSign, Users, MousePointer2, ShoppingBag } from "lucide-react";

// 1. STATS CARD
export const StatCard = ({ title, value, trend, icon: Icon, isUp }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-700">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trend}
      </div>
    </div>
    <p className="text-slate-500 font-medium text-sm">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

// 2. RECENT ACTIVITY TABLE
export const RecentUsers = () => (
  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="font-bold text-slate-800 text-lg">Recent Users</h3>
      <button className="text-sm font-bold text-indigo-600 hover:underline">View All</button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
          <tr>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[1, 2, 3].map((i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-all">
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100" />
                <span className="font-bold text-slate-700 text-sm">John Doe #{i}</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase">Active</span>
              </td>
              <td className="px-6 py-4 text-slate-400 text-sm font-medium">Oct 24, 2023</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);