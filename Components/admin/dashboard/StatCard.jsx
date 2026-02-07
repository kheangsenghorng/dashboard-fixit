"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

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

export default StatCard;