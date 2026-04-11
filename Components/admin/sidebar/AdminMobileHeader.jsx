"use client";

import React from "react";
import { Menu, ShieldCheck, Bell } from "lucide-react";
import { useAuthStore } from "../../../app/store/useAuthStore";

export default function AdminMobileHeader({ toggleSidebar }) {
  const { user } = useAuthStore();
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-16">
      {/* LEFT: Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all active:scale-95 border border-slate-200"
        aria-label="Open Menu"
      >
        <Menu size={22} />
      </button>

      {/* CENTER: Logo */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 shadow-sm">
          <ShieldCheck size={16} className="text-white" />
        </div>
        <span className="text-base font-black tracking-tight text-slate-900">
          Fix<span className="text-indigo-600">Admin</span>
        </span>
      </div>

      {/* RIGHT: User Avatar / Notifications */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
          {userInitial}
        </div>
      </div>
    </header>
  );
}
