import React from 'react';
import { Filter, ChevronDown, Crown, User as UserIcon, Wrench, Check, Shield } from "lucide-react";

export default function UserRoleDropdown({ 
  isOpen, 
  setIsOpen, 
  activeRole, // "all" | "owner" | "customer" | "provider"
  setActiveRole, 
  onSelect 
}) {
  
  // Dynamic label based on active role
  const getRoleLabel = () => {
    switch(activeRole) {
      case 'owner': return "Owners Only";
      case 'customer': return "Customers Only";
      case 'provider': return "Providers Only";
      default: return "All Roles";
    }
  };

  const roles = [
    { id: "all", label: "All Roles", icon: Shield, color: "blue" },
    { id: "owner", label: "Owners", icon: Crown, color: "amber" },
    { id: "customer", label: "Customers", icon: UserIcon, color: "indigo" },
    { id: "provider", label: "Providers", icon: Wrench, color: "slate" },
  ];

  const colorMap = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-600",
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
    slate: "bg-slate-100 text-slate-600 group-hover:bg-slate-900",
    activeBlue: "bg-blue-600 text-white",
    activeAmber: "bg-amber-600 text-white",
    activeIndigo: "bg-indigo-600 text-white",
    activeSlate: "bg-slate-900 text-white",
  };

  return (
    <div className="relative w-full md:w-auto">
      {/* Dropdown Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full md:w-60 flex items-center justify-between gap-3 px-6 py-4 rounded-[2rem] border transition-all font-bold text-xs uppercase tracking-widest shadow-sm ${
          isOpen 
            ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]' 
            : activeRole !== 'all'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
              : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <Filter size={16} className={activeRole !== 'all' && !isOpen ? 'text-indigo-600' : ''} /> 
          {getRoleLabel()}
        </div>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute left-0 mt-3 w-full md:w-64 bg-white border border-slate-100 rounded-[2rem] shadow-2xl z-20 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {roles.map((role) => {
              const isActive = activeRole === role.id;
              const Icon = role.icon;
              
              return (
                <button 
                  key={role.id}
                  onClick={() => { 
                    setActiveRole(role.id); 
                    if(onSelect) onSelect();
                    setIsOpen(false); 
                  }} 
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                    isActive ? 'bg-slate-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      isActive 
                        ? colorMap[`active${role.color.charAt(0).toUpperCase() + role.color.slice(1)}`] 
                        : colorMap[role.color] + ' group-hover:text-white'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                      {role.label}
                    </span>
                  </div>
                  {isActive && <Check size={16} className={`text-${role.color === 'slate' ? 'slate-900' : role.color + '-600'}`} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}