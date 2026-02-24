import React from "react";
import { Search } from "lucide-react";

export default function SearchCompany({ value, onChange }) {
  return (
    <div className="relative flex-1 group">
      <Search
        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600"
        size={18}
      />
      <input
        type="text"
        placeholder="Search by name, email, phone..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
      />
    </div>
  );
}
