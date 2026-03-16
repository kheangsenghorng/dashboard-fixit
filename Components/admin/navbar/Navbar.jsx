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
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-4 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search commands..."
            className="pl-12 pr-16 py-2.5 bg-slate-100/40 rounded-[14px] text-sm w-80 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="p-3 text-slate-500 hover:bg-white rounded-2xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full border-2 border-white bg-rose-500"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-2 pr-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 transition-all"
          >
            {/* AVATAR WITH FALLBACK LOGIC */}
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-xs overflow-hidden shadow-sm">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0) || "A"
              )}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-bold text-slate-900 leading-tight">
                {user?.name || "Loading..."}
              </p>
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                {user?.role || "Registry Admin"}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-300 ${
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
                className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50"
              >
                {/* Header inside dropdown */}
                <div className="px-4 py-4 border-b border-slate-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
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
                    className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <Settings size={16} className="text-slate-400" />
                    Console Settings
                  </Link>

                  {/* Profile */}
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                    <UserIcon size={16} className="text-slate-400" />
                    My Identity
                  </button>

                  <div className="my-1 border-t border-slate-50" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
