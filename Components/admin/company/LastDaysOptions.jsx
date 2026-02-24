import React from "react";

const OPTIONS = [
  { label: "7 Days", value: "7" },
  { label: "30 Days", value: "30" },
  { label: "90 Days", value: "90" },
];

export default function LastDaysOptions({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1.5 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
      {OPTIONS.map((opt) => {
        const active = String(value || "") === opt.value;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(active ? "" : opt.value)} // ✅ toggle
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              active ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
