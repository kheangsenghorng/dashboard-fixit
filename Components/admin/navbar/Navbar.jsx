"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User as UserIcon,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function Navbar({ toggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const { user } = useAuthGuard();
  const { logout, loading } = useAuthStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <header className="h-16 sm:h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      {/* LEFT: TOGGLE & SEARCH */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={toggleSidebar}
          className="p-2 sm:p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl sm:rounded-2xl transition-all border border-slate-100 active:scale-95"
        >
          <Menu size={20} />
        </button>

        {/* Brand/Logo visible only on Mobile when sidebar is closed */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </div>
        </div>

        {/* Search - Hidden on Phone/Tablet, visible on Desktop */}
        <div className="relative hidden lg:flex items-center">
          <Search className="absolute left-4 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search commands..."
            className="pl-12 pr-16 py-2.5 bg-slate-100/40 rounded-[14px] text-sm w-64 xl:w-80 focus:bg-white border border-transparent focus:border-slate-200 transition-all outline-none"
          />
        </div>
      </div>

      {/* RIGHT: ACTIONS & PROFILE */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search Icon */}
        <button className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
          <Search size={20} />
        </button>

        {/* Notification */}
        <button className="p-2.5 sm:p-3 text-slate-500 hover:bg-white rounded-xl sm:rounded-2xl transition-all relative group">
          <Bell size={20} className="group-hover:text-slate-800" />
          <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-2 h-2 rounded-full border-2 border-white bg-rose-500"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 sm:pr-4 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 transition-all active:scale-95"
          >
            {/* AVATAR */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-xs overflow-hidden shadow-sm shrink-0">
              {user?.avatar ? (
                <img
                  src={user?.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0) || "A"
              )}
            </div>

            {/* User Name - Hidden on Phone */}
            <div className="hidden sm:block text-left max-w-[100px]">
              <p className="text-[12px] font-bold text-slate-900 leading-tight truncate">
                {user?.name || "Loading..."}
              </p>
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                {user?.role || "Admin"}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-300 hidden xs:block ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 overflow-hidden"
              >
                {/* Header inside dropdown */}
                <div className="px-4 py-4 border-b border-slate-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {user?.email || "No email registered"}
                    </span>
                  </div>
                </div>

                <div className="p-1">
                  {/* Settings */}
                  <Link
                    href={`/${user?.role || "admin"}/settings`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <Settings size={16} className="text-slate-400" />
                    Console Settings
                  </Link>

                  {/* Profile */}
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                    <UserIcon size={16} className="text-slate-400" />
                    My Identity
                  </button>

                  <div className="my-1 border-t border-slate-50" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <LogOut size={16} />
                    )}
                    {loading ? "Syncing..." : "Terminate Session"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
