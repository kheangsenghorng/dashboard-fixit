"use client";

import React from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  RotateCcw,
  MapPin,
  User,
  Activity,
  ArrowRight,
  ChevronDown,
  Hash,
  X,
  CheckCircle2,
} from "lucide-react";

const LAST_DAYS_OPTIONS = [
  { label: "7 Days", value: "7" },
  { label: "30 Days", value: "30" },
  { label: "90 Days", value: "90" },
];

export default function OwnerFilterSystem({ model }) {
  const {
    search,
    drawer,
    filters,
    actions,
    loading,
    activeCount,
    ownersUsers = [],
  } = model;

  const Label = ({ children }) => (
    <label className="block text-[10px] font-black text-slate-400 mb-1.5 ml-0.5 uppercase tracking-[0.1em]">
      {children}
    </label>
  );

  return (
    <div className="max-w-7xl mx-auto font-sans text-slate-900">
      {/* --- TOOLBAR ACTION BAR --- */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="relative flex-1 w-full group">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              search.value ? "text-indigo-600" : "text-slate-400"
            }`}
            size={18}
          />
          <input
            type="text"
            placeholder="Search by business name, email, or owner..."
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            className="w-full pl-11 pr-10 py-3 text-sm bg-transparent outline-none placeholder:text-slate-400 font-medium"
          />
          {search.value && (
            <button
              onClick={() => search.onChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => drawer.setOpen(!drawer.open)}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
            drawer.open || activeCount > 0
              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Filter size={16} strokeWidth={2.5} />
          <span>{activeCount > 0 ? `Filters (${activeCount})` : "Filter Tools"}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${drawer.open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* --- FILTER DRAWER --- */}
      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          drawer.open
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0 overflow-hidden pointer-events-none"
        }`}
      >
        <div className="min-h-0">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* COLUMN 1: TIMELINE */}
              <div className="p-6 space-y-6 bg-slate-50/30">
                <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                  <Calendar size={14} /> Registration Timeline
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Specific Day</Label>
                    <input
                      type="date"
                      value={filters.values.created_date || ""}
                      onChange={(e) => filters.setValue("created_date", e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
                      <input
                        type="date"
                        value={filters.values.created_from || ""}
                        onChange={(e) => filters.setValue("created_from", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-2 text-xs outline-none focus:border-indigo-500"
                      />
                      <span className="text-slate-300 font-bold">/</span>
                      <input
                        type="date"
                        value={filters.values.created_to || ""}
                        onChange={(e) => filters.setValue("created_to", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-2 text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 2: STATUS & PULSE */}
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-[0.2em]">
                  <Clock size={14} /> Status & Activity
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Verification</Label>
                    <div className="relative">
                      <select
                        value={filters.values.status || ""}
                        onChange={(e) => filters.setValue("status", e.target.value)}
                        className="w-full pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none outline-none cursor-pointer font-medium focus:bg-white"
                      >
                        <option value="">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <Label>Peak Hour</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                      <input
                        type="number"
                        min="0"
                        max="23"
                        placeholder="0-23"
                        value={filters.values.created_hour || ""}
                        onChange={(e) => filters.setValue("created_hour", e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Quick History</Label>
                  <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                    {LAST_DAYS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          filters.setValue(
                            "last_days",
                            filters.values.last_days === opt.value ? "" : opt.value
                          )
                        }
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${
                          filters.values.last_days === opt.value
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMN 3: ATTRIBUTES */}
              <div className="p-6 space-y-6 bg-slate-50/30">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
                  <MapPin size={14} /> Geographical
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <Label>Province / Region</Label>
                    <div className="relative">
                      <MapPin
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                      />
                      <input
                        list="cambodia-cities"
                        value={filters.values.address || ""}
                        onChange={(e) => filters.setValue("address", e.target.value)}
                        placeholder="e.g. Phnom Penh"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none transition-all font-medium focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500"
                      />
                    </div>
                    <datalist id="cambodia-cities">
                      <option value="Phnom Penh" />
                      <option value="Siem Reap" />
                      <option value="Preah Sihanouk" />
                      <option value="Battambang" />
                      <option value="Kandal" />
                      <option value="Kampong Cham" />
                    </datalist>
                  </div>

                  <div>
                    <Label>Assigned Owner</Label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={filters.values.user_id || ""}
                        onChange={(e) => filters.setValue("user_id", e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none appearance-none cursor-pointer font-medium"
                      >
                        <option value="">Select Account</option>
                        {ownersUsers.map((u) => (
                          <option key={u.id} value={u.id}>{u.name || u.email}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => filters.setValue("this_month", !filters.values.this_month)}
                    className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 ${
                      filters.values.this_month
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100"
                        : "bg-white border-dashed border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-600"
                    }`}
                  >
                    {filters.values.this_month ? <CheckCircle2 size={14} /> : <Activity size={14} />}
                    Created: This Month
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="bg-white px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={actions.reset}
                className="group flex items-center gap-2 text-slate-400 hover:text-rose-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                <RotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
                Reset System Filters
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => drawer.setOpen(false)}
                  className="px-6 py-2.5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={actions.apply}
                  disabled={loading}
                  className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Apply Search <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}