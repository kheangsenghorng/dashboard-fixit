'use client';

import Link from "next/link";
import { Home, LogIn, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Visual Element */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] font-black text-white leading-none drop-shadow-sm select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-2xl border border-white shadow-xl">
              <span className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-sm">
                Page Not Found
              </span>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-lg mb-10">
          The page you are looking for has been moved, removed, or never existed in the first place.
        </p>

        <div className="space-y-3">
          <Link 
            href="/admin/users" 
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
          >
            <Home size={18} />
            Back to Dashboard
          </Link>
          
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
          >
            <LogIn size={18} />
            Sign in to Account
          </Link>
        </div>

        <button 
          onClick={() => window.history.back()}
          className="mt-8 text-slate-400 hover:text-indigo-500 text-sm font-semibold inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={16} />
          Go to previous page
        </button>
      </div>
    </div>
  );
}
