"use client";

import Link from "next/link";
import {
  Home,
  LogIn,
  ChevronLeft,
  SearchX,
  FileQuestion,
  Globe,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-100/30 rounded-full blur-[120px]" />

      <div className="max-w-md w-full text-center relative z-10">
        {/* --- CUSTOM 404 ICON COMPOSITION --- */}
        <div className="relative w-48 h-48 mx-auto mb-12 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-2 border-dashed border-indigo-100 rounded-full animate-[spin_20s_linear_infinite]" />

          {/* Floating Small Icons */}
          <div className="absolute top-4 right-4 bg-white p-2 rounded-xl shadow-md border border-slate-50 text-rose-500 animate-bounce">
            <SearchX size={20} />
          </div>
          <div className="absolute bottom-6 left-2 bg-white p-2 rounded-xl shadow-md border border-slate-50 text-indigo-500 animate-[bounce_2s_infinite_1s]">
            <Globe size={18} />
          </div>

          {/* Center Main Icon */}
          <div className="relative bg-white w-32 h-32 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-50 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-500">
            <div className="text-indigo-600 mb-1">
              <FileQuestion size={48} strokeWidth={1.5} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              404
            </span>

            {/* Status Badge */}
            <div className="absolute -bottom-3 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200">
              Error
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Lost in Space?
          </h2>
          <p className="text-slate-500 text-[15px] leading-relaxed max-w-[320px] mx-auto">
            The page you are looking for has been moved, removed, or never
            existed in the first place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/admin/users"
            className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white font-bold rounded-[1.25rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] group"
          >
            <Home
              size={20}
              className="group-hover:-translate-y-0.5 transition-transform"
            />
            Back to Dashboard
          </Link>

          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-3 w-full py-4 bg-white text-slate-600 font-bold rounded-[1.25rem] border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <LogIn size={20} />
            Sign in to Account
          </Link>
        </div>

        {/* Secondary Back Action */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 text-slate-400 hover:text-indigo-600 text-sm font-bold inline-flex items-center gap-2 transition-all group"
        >
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-indigo-100 group-hover:bg-indigo-50">
            <ChevronLeft size={16} />
          </div>
          Go to previous page
        </button>
      </div>
    </div>
  );
}
