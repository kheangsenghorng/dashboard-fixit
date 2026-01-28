"use client";

import React, { useState } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { 
  LayoutDashboard, Users, Settings, Package, 
  Bell, Search, Menu, LogOut, ChevronRight,
  TrendingUp, TrendingDown, DollarSign, MousePointer2, ShoppingBag,
  Loader2
} from "lucide-react";

// --- SUB-COMPONENTS (Dashboard Widgets) ---

const StatCard = ({ title, value, trend, icon: Icon, isUp }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-md hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

const RecentUsers = () => (
  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="font-bold text-slate-800 text-lg">System Activity</h3>
      <button className="text-sm font-bold text-indigo-600 hover:underline transition-all">View All</button>
    </div>
    <div className="overflow-x-auto px-2">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
          <tr>
            <th className="px-6 py-4">Session</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[1, 2, 3].map((i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-all group">
              <td className="px-6 py-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs shadow-sm">
                  {i === 1 ? 'JD' : i === 2 ? 'BK' : 'MW'}
                </div>
                <span className="font-bold text-slate-700 text-sm italic tracking-tight">Access Node #{i}</span>
              </td>
              <td className="px-6 py-5">
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase border border-green-100">Live</span>
              </td>
              <td className="px-6 py-5 text-slate-400 text-xs font-bold uppercase tracking-tighter">Just Now</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN ADMIN COMPONENT ---

export default function Admin() {
  const { user, ready, error } = useAuthGuard();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // 1. Error Handling (Auth guard handles redirecting)
  if (error) return null;

  // 2. Powerful Loading State
  if (!ready || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-200 blur-3xl rounded-full opacity-30 animate-pulse" />
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
        </div>
        <p className="mt-6 text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
          Establishing Secure Link
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? "w-72" : "w-24"} bg-white border-r border-slate-100 transition-all duration-500 flex flex-col hidden md:flex`}>
        <div className="p-8 flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100 shrink-0">
            <Package className="text-white" size={24} />
          </div>
          {isSidebarOpen && <span className="font-black text-2xl tracking-tighter text-slate-900 italic">POWER.</span>}
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 transition-all font-bold">
            <LayoutDashboard size={22} />
            {isSidebarOpen && <span>Dashboard</span>}
          </button>
          
          {["Users", "Inventory", "Settings"].map((label, idx) => (
            <button key={idx} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all font-bold">
              {label === "Users" && <Users size={22} />}
              {label === "Inventory" && <ShoppingBag size={22} />}
              {label === "Settings" && <Settings size={22} />}
              {isSidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black uppercase text-xs tracking-widest">
            <LogOut size={20} />
            {isSidebarOpen && <span>End Session</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-500 transition-all">
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-8">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search encrypted data..." 
                className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 w-80 outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center gap-4 border-l pl-8 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 leading-none">
                  {user.name}
                </p>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-2">
                  Root Admin
                </p>
              </div>
              <div className="w-12 h-12 bg-slate-900 rounded-[1.2rem] flex items-center justify-center text-white font-black shadow-2xl">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Powerful Greeting */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 font-bold mt-3 text-lg italic">
                  Systems online. Welcome back, {user.name.split(' ')[0]}.
                </p>
              </div>
              <button className="bg-white border-2 border-slate-100 shadow-sm px-6 py-3 rounded-2xl font-black text-slate-900 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">
                Analytics Report
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard title="Revenue" value="$45,231" trend="+12%" icon={DollarSign} isUp={true} />
              <StatCard title="Total Users" value="2,350" trend="+3%" icon={Users} isUp={true} />
              <StatCard title="Transactions" value="12,432" trend="-0.4%" icon={ShoppingBag} isUp={false} />
              <StatCard title="Uptime" value="99.9%" trend="+0.2%" icon={MousePointer2} isUp={true} />
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10">
              <div className="lg:col-span-2">
                <RecentUsers />
              </div>
              
              {/* Premium Card */}
              <div className="bg-indigo-600 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-all" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-4 leading-tight">Master your <br/> Workflow.</h3>
                  <p className="text-indigo-100 text-sm font-bold opacity-80 leading-relaxed">
                    Access advanced API metrics and node management.
                  </p>
                </div>
                <button className="relative z-10 mt-12 bg-white text-indigo-600 font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest">
                  Explore Tools
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}