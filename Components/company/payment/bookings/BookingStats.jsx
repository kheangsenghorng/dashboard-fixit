"use client";

import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function BookingStats({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {label}
            </span>

            <div className={cn("rounded-lg p-2", bg)}>
              <Icon size={15} className={color} />
            </div>
          </div>

          <p className={cn("text-2xl font-bold", color)}>{value}</p>
        </div>
      ))}
    </div>
  );
}