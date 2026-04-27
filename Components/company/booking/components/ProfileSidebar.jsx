"use client";

import React from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  Store,
  ShieldCheck,
  Star,
  ExternalLink,
} from "lucide-react";

const ProfileSidebar = ({ user, provider }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm text-center">
      <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4">
        {user?.name?.[0] ?? "?"}
      </div>
      <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">
        {user?.name}
      </h3>
      <p className="text-[9px] font-bold text-indigo-600 uppercase mb-6 tracking-widest">
        Verified Customer
      </p>
      <div className="space-y-2 mb-6 text-left">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <Phone size={14} className="text-slate-400" />
          <span className="font-bold text-slate-700">
            {user?.phone || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <Mail size={14} className="text-slate-400" />
          <span className="font-bold text-slate-700 truncate">
            {user?.email}
          </span>
        </div>
      </div>
      <button className="w-full py-3 bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all">
        <MessageSquare size={14} /> Send Message
      </button>
    </div>

    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-50">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
          <Store size={22} />
        </div>
        <div>
          <h3 className="font-black text-xs uppercase tracking-tight truncate max-w-[120px]">
            {provider?.provider_name || "Unknown"}
          </h3>
          <div className="flex items-center gap-1 text-[8px] text-emerald-600 font-bold uppercase">
            <ShieldCheck size={10} /> Partner
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 p-3 rounded-xl text-center">
          <p className="text-[8px] font-bold text-slate-400 uppercase">
            Rating
          </p>
          <div className="font-black text-xs flex items-center justify-center gap-1 text-slate-700">
            <Star size={10} fill="#f59e0b" className="text-amber-500" />{" "}
            {provider?.rating || "N/A"}
          </div>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl text-center">
          <p className="text-[8px] font-bold text-slate-400 uppercase">
            Jobs Done
          </p>
          <p className="font-black text-xs text-slate-700">
            {provider?.reviews_count || 0}
          </p>
        </div>
      </div>
      <button className="w-full py-3 border-2 border-slate-100 hover:border-slate-900 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 transition-all">
        <ExternalLink size={14} /> Profile
      </button>
    </div>
  </div>
);

export default ProfileSidebar;
