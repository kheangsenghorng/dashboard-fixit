import React from 'react';
import { Filter, ChevronDown, Shield, CheckCircle2, Clock, Check } from "lucide-react";

export default function UserFilterDropdown({ 
  isOpen, 
  setIsOpen, 
  onFilterAll, 
  activeStatus, // "all" | "active" | "inactive"
  onFilterActive, 
  onFilterInactive 
}) {
  
  // Dynamic label based on status
  const getStatusLabel = () => {
    if (activeStatus === 'active') return "Active Only";
    if (activeStatus === 'inactive') return "Inactive Only";
    return "Filter Status";
  };

  return (
    <div className="relative w-full md:w-auto">
      {/* Dropdown Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full md:w-60 flex items-center justify-between gap-3 px-6 py-4 rounded-[2rem] border transition-all font-bold text-xs uppercase tracking-widest shadow-sm ${
          isOpen 
            ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]' 
            : activeStatus !== 'all'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200' // Highlight if filter is applied
              : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <Filter size={16} className={activeStatus !== 'all' && !isOpen ? 'text-indigo-600' : ''} /> 
          {getStatusLabel()}
        </div>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay to close when clicking outside */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 mt-3 w-full md:w-64 bg-white border border-slate-100 rounded-[2rem] shadow-2xl z-20 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* OPTION: ALL USERS */}
            <button 
              onClick={() => { onFilterAll(); setIsOpen(false); }} 
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                activeStatus === 'all' ? 'bg-slate-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  activeStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                }`}>
                  <Shield size={16} />
                </div>
                <span className={`text-xs font-black uppercase tracking-widest ${activeStatus === 'all' ? 'text-slate-900' : 'text-slate-500'}`}>All Users</span>
              </div>
              {activeStatus === 'all' && <Check size={16} className="text-blue-600" />}
            </button>

            {/* OPTION: ACTIVE ONLY */}
            <button 
              onClick={() => { onFilterActive(); setIsOpen(false); }} 
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                activeStatus === 'active' ? 'bg-slate-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  activeStatus === 'active' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                }`}>
                  <CheckCircle2 size={16} />
                </div>
                <span className={`text-xs font-black uppercase tracking-widest ${activeStatus === 'active' ? 'text-slate-900' : 'text-slate-500'}`}>Active Only</span>
              </div>
              {activeStatus === 'active' && <Check size={16} className="text-emerald-600" />}
            </button>

            {/* OPTION: INACTIVE */}
            <button 
              onClick={() => { onFilterInactive(); setIsOpen(false); }} 
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                activeStatus === 'inactive' ? 'bg-slate-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  activeStatus === 'inactive' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
                }`}>
                  <Clock size={16} />
                </div>
                <span className={`text-xs font-black uppercase tracking-widest ${activeStatus === 'inactive' ? 'text-slate-900' : 'text-slate-500'}`}>Inactive</span>
              </div>
              {activeStatus === 'inactive' && <Check size={16} className="text-amber-600" />}
            </button>

          </div>
        </>
      )}
    </div>
  );
}