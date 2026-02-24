// ==============================
// Navbar.jsx / Navbar.tsx
// ==============================
"use client";

import React from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";

export default function Navbar({ toggleSidebar, user }) {
  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden md:flex items-center group">
          <Search className="absolute left-4 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search commands..."
            className="pl-12 pr-16 py-2.5 bg-slate-100/40 border border-transparent rounded-[14px] text-sm w-80 focus:bg-white focus:border-indigo-100 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 text-slate-500 hover:bg-white hover:border-slate-200 border border-transparent rounded-2xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full border-2 border-white bg-rose-500"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

        <button className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white transition-all shadow-sm group">
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-bold text-slate-900 leading-none">
              Admin
            </p>
            <span className="text-[9px] font-black uppercase text-slate-400">
              System Admin
            </span>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
}