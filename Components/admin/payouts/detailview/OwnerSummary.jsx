import React from "react";
import { MapPin } from "lucide-react";
import { formatMoney } from "../../../../utils/formatters";

const OwnerSummary = ({ owner, totals }) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-200 shadow-sm mb-10 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full opacity-50" />

      <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
          {(owner?.business_name || "B").charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
              {owner?.business_name}
            </h1>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ring-1 ring-emerald-200">
              {owner?.status || "active"}
            </span>
          </div>

          <div className="flex items-start gap-2 text-slate-400 text-sm max-w-xl font-medium">
            <MapPin
              size={16}
              className="mt-0.5 text-indigo-400 flex-shrink-0"
            />
            <p>{owner?.address}</p>
          </div>
        </div>

        <div className="w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-10 text-center md:text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Total Lifetime Paid
          </p>
          <p className="text-4xl font-black text-slate-900">
            <span className="text-indigo-600">$</span>
            {formatMoney(totals.paid)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerSummary;
