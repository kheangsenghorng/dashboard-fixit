"use client";

import React from "react";
import { CheckCircle2, UserPlus, ArrowRight } from "lucide-react";

export default function SuccessMessage({ title, message, onReset, onDirectory }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 w-full animate-in fade-in zoom-in duration-300">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-emerald-50">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        
        {/* Text content */}
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          {title || "Success!"}
        </h2>
        <p className="text-slate-500 mb-10 text-sm leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={onReset}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <UserPlus size={18} />
            Create Another User
          </button>
          
          <button 
            onClick={onDirectory}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            Go to Directory
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}