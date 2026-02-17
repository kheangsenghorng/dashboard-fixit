  "use client";

  import React, { useState, useEffect } from "react";
  import { 
    DollarSign, Users, ShoppingBag, MousePointer2, 
    Activity, ArrowUpRight, ArrowDownRight, Zap, 
    LayoutDashboard, Calendar
  } from "lucide-react";
  import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
  import StatCard from "./StatCard";
  import RecentUsers from "./RecentUsers";
  import ContentLoader from "../../ContentLoader";
import { useRoleGuard } from "../../../app/hooks/useRoleGuard";


  export default function AdminDashboard() {
    const { user } = useAuthGuard();
    const [showFullLoader, setShowFullLoader] = useState(true);
    useRoleGuard(["admin"]);

    useEffect(() => {
      // Deliberate delay for premium feel
      const timer = setTimeout(() => setShowFullLoader(false), 1200);
      return () => clearTimeout(timer);
    }, []);

    if (!user) return null;

    return (
      <div className="relative min-h-[calc(100vh-4rem)] bg-[#F8FAFC] p-4 lg:p-8 space-y-10 font-sans antialiased text-slate-900">
        
        {/* 1. REUSABLE CONTENT LOADER (Sidebar remains visible) */}
        {showFullLoader && (
          <ContentLoader 
            title="Neural Dashboard" 
            subtitle="Initializing System Overview..." 
            Icon={LayoutDashboard} 
          />
        )}

        {/* HEADER SECTION */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in duration-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1 w-6 bg-indigo-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Command Center</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Systems online. Welcome back, <span className="text-indigo-600 font-bold">{user?.name?.split(' ')[0]}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Oct 24, 2023</span>
              </div>
              <button className="bg-white border border-slate-200 shadow-sm px-6 py-3 rounded-2xl font-black text-slate-900 hover:border-indigo-200 hover:bg-slate-50 transition-all text-[10px] uppercase tracking-[0.15em] active:scale-95">
                Analytics Report
              </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-700">
          <StatCard title="Revenue" value="$45,231" trend="+12%" icon={DollarSign} isUp={true} color="blue" />
          <StatCard title="Total Users" value="2,350" trend="+3%" icon={Users} isUp={true} color="emerald" />
          <StatCard title="Transactions" value="12,432" trend="-0.4%" icon={ShoppingBag} isUp={false} color="amber" />
          <StatCard title="Uptime" value="99.9%" trend="Stable" icon={MousePointer2} isUp={true} color="indigo" />
        </div>

        {/* BOTTOM SECTION */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          
          {/* RECENT USERS TABLE (Assuming this component is styled similarly) */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-6 duration-1000">
            <RecentUsers />
          </div>
          
          {/* CTA PROMO CARD */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-indigo-100 relative overflow-hidden group animate-in slide-in-from-bottom-8 duration-1000">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-[40px] -ml-16 -mb-16" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
                  <Zap className="text-white fill-white" size={24} />
              </div>
              <h3 className="text-3xl font-black mb-4 leading-tight tracking-tight">Master your <br/> Workflow.</h3>
              <p className="text-indigo-100 text-sm font-bold opacity-80 leading-relaxed max-w-[220px]">
                Access advanced API metrics and node management tools.
              </p>
            </div>
            
            <button className="relative z-10 mt-12 bg-white text-indigo-600 font-black py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em]">
              Explore Advanced Tools
            </button>
          </div>

        </div>
      </div>
    );
  }