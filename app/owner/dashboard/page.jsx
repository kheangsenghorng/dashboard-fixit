"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  TrendingUp, 
  Users, 
  Activity, 
  Calendar, 
  Zap, 
  ArrowUpRight, 
  Command,
  Bell,
  Search,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import CompanyLoyout from "../CompanyLoyout";
import ContentLoader from "../../../Components/ContentLoader";

export default function OwnerDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loadUser = useAuthStore((s) => s.loadUser);

  const [showFullLoader, setShowFullLoader] = useState(true);

  useEffect(() => {
    if (!user) loadUser();
    const timer = setTimeout(() => setShowFullLoader(false), 1200);
    return () => clearTimeout(timer);
  }, [user, loadUser]);


 
  if (!user) return null;

  return (
    <CompanyLoyout>
      <div className="relative min-h-screen bg-[#FDFDFD] font-sans selection:bg-indigo-100 selection:text-indigo-700">
        
        {/* 1. PREMIUM LOADER */}
        <AnimatePresence>
          {showFullLoader && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.8, ease: "circOut" } }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
            >
              <ContentLoader title="Terminal" subtitle="Initialising Secure Environment..." Icon={Command} />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-8">
          
          {/* TOP NAV BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Administrative Node</span>
                </div>
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{user.name}</span>.
              </h1>
            </div>

            <div className="flex items-center gap-3">
               <div className="relative hidden xl:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search analytics..." 
                    className="pl-10 pr-4 py-2.5 bg-slate-100/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all w-64" 
                  />
               </div>
               <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors relative">
                 <Bell size={18} className="text-slate-600" />
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
               </button>
              
            </div>
          </div>

          {/* BENTO GRID STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              title="Total Customers" 
              value="1,284" 
              trend="+12.5%" 
              icon={Users} 
              chartColor="#4F46E5" 
            />
            <StatCard 
              title="Monthly Revenue" 
              value="$42.8k" 
              trend="+4.2%" 
              icon={TrendingUp} 
              chartColor="#10B981" 
            />
            <StatCard 
              title="Conversion" 
              value="24.5%" 
              trend="+1.2%" 
              icon={Activity} 
              chartColor="#F59E0B" 
            />
           
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* BOOKINGS - MODERN LIST VIEW */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 flex items-center justify-between border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900">Upcoming Schedule</h3>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                    View full calendar
                  </button>
               </div>
               
               <div className="p-2">
                 <div className="overflow-hidden">
                    {mockBookings.map((booking, i) => (
                      <BookingItem key={i} {...booking} />
                    ))}
                 </div>
               </div>
            </div>

            {/* SIDEBAR - INSIGHTS */}
            <div className="space-y-6">
               <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Live Insights</h3>
                    <MoreHorizontal size={18} className="text-slate-400" />
                  </div>
                  <div className="space-y-8">
                    <ProgressItem label="Server Capacity" percentage={65} color="bg-indigo-600" />
                    <ProgressItem label="Client Satisfaction" percentage={92} color="bg-emerald-500" />
                    <ProgressItem label="Storage Used" percentage={38} color="bg-amber-500" />
                  </div>
               </div>

               <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-dashed border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <ArrowUpRight size={14} className="text-indigo-600" />
                     </div>
                     <span className="text-xs font-bold text-slate-900 uppercase">Optimization Tip</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    "Your peak booking time is <span className="text-slate-900 font-bold">2 PM on Fridays</span>. Consider launching happy-hour promos then."
                  </p>
               </div>
            </div>
          </div>
        </main>
      </div>
    </CompanyLoyout>
  );
}

// --- Specialized UI Components ---

function StatCard({ title, value, trend, icon: Icon, chartColor }) {
  return (
    <div className="bg-white border border-slate-100 p-7 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-end gap-2">
          <h4 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h4>
          {/* Subtle Sparkline Placeholder */}
          <div className="flex gap-1 h-6 items-end pb-1 opacity-20 group-hover:opacity-100 transition-opacity">
            {[40, 70, 45, 90, 65].map((h, i) => (
              <div key={i} className="w-1 rounded-full bg-slate-300" style={{ height: `${h}%`, backgroundColor: chartColor }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingItem({ name, service, date, time, status, amount }) {
  return (
    <div className="group flex items-center justify-between p-6 hover:bg-slate-50/80 rounded-3xl transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">{name}</h4>
          <p className="text-xs text-slate-500 font-medium">{service}</p>
        </div>
      </div>
      
      <div className="hidden md:block text-center">
        <p className="text-xs font-bold text-slate-900">{date}</p>
        <p className="text-[10px] text-indigo-600 font-black uppercase">{time}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-900">${amount}</p>
          <span className="text-[10px] uppercase font-bold text-emerald-500">Paid</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ label, percentage, color }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
        <span className="text-sm font-black text-slate-900">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`} 
        />
      </div>
    </div>
  );
}

const mockBookings = [
  { name: "Sokha Mean", service: "Full Body Spa", date: "Oct 28, 2023", time: "02:00 PM", amount: "85.00" },
  { name: "John Smith", service: "Hair Styling", date: "Oct 28, 2023", time: "04:30 PM", amount: "45.00" },
  { name: "Linda Chen", service: "Nail Art Luxe", date: "Oct 29, 2023", time: "09:00 AM", amount: "120.00" },
  { name: "James Wilson", service: "Skin Consultation", date: "Oct 29, 2023", time: "11:30 AM", amount: "0.00" },
];