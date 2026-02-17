"use client";

import React from "react";

export default function StatCard({ title, value, trend, icon: Icon, isUp, color }) {
  // Map color names to Tailwind classes
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${colorMap[color] || colorMap.indigo}`}>
          <Icon size={24} />
        </div>
        
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trend}
        </div>
      </div>
      
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {title}
      </p>
      
      <h3 className="text-3xl font-black mt-1 text-slate-900 tracking-tight">
        {value}
      </h3>
    </div>
  );
}