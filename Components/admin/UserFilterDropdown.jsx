import React from 'react';
import { Filter, ChevronDown, Shield, CheckCircle2, Clock } from "lucide-react";

export default function UserFilterDropdown({ 
  isOpen, 
  setIsOpen, 
  onFilterAll, 
  onFilterActive, 
  onFilterInactive 
}) {
  return (
    <div className="relative w-full md:w-auto">
      {/* Dropdown Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full md:w-56 flex items-center justify-between gap-3 px-6 py-4 rounded-[2rem] border transition-all font-bold text-xs uppercase tracking-widest ${
          isOpen 
            ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
            : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <Filter size={16} /> 
          Filter Status
        </div>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Click outside to close overlay */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 mt-3 w-full md:w-64 bg-white border border-slate-100 rounded-[2rem] shadow-2xl z-20 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => { onFilterAll(); setIsOpen(false); }} 
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Shield size={16} />
              </div>
              <span className="text-xs font-black text-slate-900 uppercase">All Users</span>
            </button>

            <button 
              onClick={() => { onFilterActive(); setIsOpen(false); }} 
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-xs font-black text-slate-900 uppercase">Active Only</span>
            </button>

            <button 
              onClick={() => { onFilterInactive(); setIsOpen(false); }} 
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Clock size={16} />
              </div>
              <span className="text-xs font-black text-slate-900 uppercase">Inactive</span>
            </button>

          </div>
        </>
      )}
    </div>
  );
}