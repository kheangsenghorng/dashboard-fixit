"use client";
import React from "react";

import { DollarSign, Users, ShoppingBag, MousePointer2 } from "lucide-react";
import StatCard from "../../../Components/admin/dashboard/StatCard";
import RecentUsers from "../../../Components/admin/dashboard/RecentUsers";
import { useAuthGuard } from "../../hooks/useAuthGuard";



export default function AdminDashboard() {
  const { user } = useAuthGuard();

  return (
    <div className="space-y-10">
      {/* Powerful Greeting */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 font-bold mt-3 text-lg italic">
            Systems online. Welcome back, {user?.name?.split(' ')[0]}.
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

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10">
        <div className="lg:col-span-2">
          <RecentUsers />
        </div>
        
        <div className="bg-indigo-600 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-indigo-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[80px]" />
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
  );
}