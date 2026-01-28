"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, Users, Settings, Package, 
  Bell, Search, Menu, LogOut, ChevronRight,
  TrendingUp, TrendingDown, DollarSign, MousePointer2, ShoppingBag 
} from "lucide-react";
import Link from "next/link";

// --- COMPOSER COMPONENTS ---

const StatCard = ({ title, value, trend, icon: Icon, isUp }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-transform hover:scale-[1.02]">
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

const RecentUsers = () => (
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
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">JD</div>
                <span className="font-bold text-slate-700 text-sm">User Name #{i}</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase">Active</span>
              </td>
              <td className="px-6 py-4 text-slate-400 text-sm font-medium">Oct 24, 2024</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN PAGE & LAYOUT ---

export default function DashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col hidden md:flex`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shrink-0">
            <Package className="text-white" size={24} />
          </div>
          {isSidebarOpen && <span className="font-black text-xl tracking-tight text-slate-800">POWER</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-50 text-indigo-600 shadow-sm transition-all font-semibold">
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard</span>}
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-semibold">
            <Users size={20} />
            {isSidebarOpen && <span>Users</span>}
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-semibold">
            <Settings size={20} />
            {isSidebarOpen && <span>Settings</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-semibold">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-64 outline-none"
              />
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin User</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-right">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE PAGE BODY */}
        <main className="p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Dashboard</h2>
              <p className="text-slate-500 font-medium">Welcome back, admin. Here is your overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Revenue" value="$45,231.89" trend="+12.5%" icon={DollarSign} isUp={true} />
              <StatCard title="Active Users" value="2,350" trend="+3.1%" icon={Users} isUp={true} />
              <StatCard title="Total Sales" value="12,432" trend="-0.4%" icon={ShoppingBag} isUp={false} />
              <StatCard title="Click Rate" value="24.5%" trend="+18.2%" icon={MousePointer2} isUp={true} />
            </div>

            {/* Bottom Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
              <div className="lg:col-span-2">
                <RecentUsers />
              </div>
              <div className="bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-200">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">System Status</h3>
                  <p className="text-indigo-100 text-sm opacity-80">All servers are running smoothly today. No issues detected.</p>
                </div>
                <button className="mt-8 bg-white text-indigo-600 font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest">
                  View Server Logs
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}