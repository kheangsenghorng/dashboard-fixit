"use client";

import React from "react";
import { Activity } from "lucide-react";

export default function ContentLoader({ 
  title = "Neural Analytics", 
  subtitle = "Aggregating Data Nodes...",
  Icon = Activity 
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC] rounded-3xl animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Rotating Outer Ring */}
        <div className="w-20 h-20 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
        
        {/* Pulsing Central Icon */}
        <div className="absolute">
          <Icon className="w-8 h-8 text-indigo-600 animate-pulse" />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center text-center px-4">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">
          {title}
        </h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
          {subtitle}
        </p>
      </div>
    </div>
  );
}