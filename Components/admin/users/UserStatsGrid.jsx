import React from 'react';
import { Shield, Crown, User as UserIcon, Wrench } from "lucide-react";

export default function UserStatsGrid({ stats, activeRole, onRoleChange }) {
  
  const statConfigs = [
    { 
      id: "all", 
      label: "Total Accounts", 
      value: stats.total, 
      icon: Shield, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      activeBorder: "border-blue-600 ring-blue-50"
    },
    { 
      id: "owner", 
      label: "Property Owners", 
      value: stats.owners, 
      icon: Crown, 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      activeBorder: "border-amber-600 ring-amber-50"
    },
    { 
      id: "customer", 
      label: "Regular Customers", 
      value: stats.customers, 
      icon: UserIcon, 
      color: "text-slate-600", 
      bg: "bg-slate-100",
      activeBorder: "border-slate-900 ring-slate-100"
    },
    { 
      id: "provider", 
      label: "Service Providers", 
      value: stats.providers, 
      icon: Wrench, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50",
      activeBorder: "border-indigo-600 ring-indigo-50"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statConfigs.map((stat) => {
        const isActive = activeRole === stat.id;
        const Icon = stat.icon;

        return (
          <button
            key={stat.id}
            onClick={() => onRoleChange(stat.id)}
            className={`group relative text-left bg-white p-7 rounded-[2.5rem] border transition-all duration-300 ${
              isActive 
                ? `${stat.activeBorder} ring-4 shadow-xl translate-y-[-4px]` 
                : "border-slate-100 hover:border-slate-300 hover:shadow-md"
            }`}
          >
            {/* Icon Container */}
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-[1.25rem] flex items-center justify-center mb-5 transition-transform duration-500 group-hover:rotate-[10deg]`}>
              <Icon size={26} strokeWidth={2.5} />
            </div>

            {/* Content */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${
                isActive ? "text-slate-900" : "text-slate-400"
              }`}>
                {stat.label}
              </p>
              <h3 className="text-4xl font-black mt-2 text-slate-900 tracking-tight">
                {stat.value.toLocaleString()}
              </h3>
            </div>

            {/* Active Indicator Dot */}
            {isActive && (
              <div className="absolute top-6 right-8 flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Active</span>
                <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}