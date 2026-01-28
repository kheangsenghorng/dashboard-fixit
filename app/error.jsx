"use client";

import { useEffect } from "react";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";

export default function Error({ error }) {
  useEffect(() => {
    // Log the error for debugging
    console.error("Access Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="max-w-md w-full text-center">
        
        {/* Modern Lock Icon with Glow and Animation */}
        <div className="relative flex justify-center mb-10">
          <div className="absolute inset-0 bg-red-200 scale-150 blur-[60px] rounded-full opacity-30 animate-pulse" />
          <div className="relative bg-white p-7 rounded-[2.5rem] shadow-2xl shadow-red-200/50 border border-red-50">
            <LockKeyhole className="w-16 h-16 text-red-500" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
          Access Denied
        </h1>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
          You aren&apos;t logged in yet. Please sign in to access this protected area.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          {/* Main Action: Login - Use Link with 'replace' for clean navigation */}
          <Link 
            href="/login"
            replace
            className="group flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
          >
            Sign in to your account
          </Link>

          <div className="flex gap-4">
            {/* Try Again Button - Important for Error boundaries */}
        

            {/* Back Button */}
            <button 
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3.5 px-4 rounded-2xl transition-all active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
        </div>

        {/* Subtle Footer Information */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500">
             <span className="w-2 h-2 bg-red-500 rounded-full animate-ping mr-2"></span>
             <p className="text-[10px] font-bold uppercase tracking-widest">
                Security Status: Unauthorized
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}