import React from "react";
import { Calendar, CheckCircle2, ExternalLink, Hash } from "lucide-react";
import { formatDate, formatMoney } from "../../../../utils/formatters";

const PayoutCard = ({ item }) => {
  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden group">
      <div className="p-6 md:p-8">
        <div className="flex flex-col xl:flex-row justify-between gap-8">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
              <Hash size={24} />
            </div>

            <div>
              <div className="font-black text-lg text-slate-900 mb-1">
                Payout #{item.id}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <Calendar size={14} className="text-indigo-400" />
                {formatDate(item.paid_at)}
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-4 md:gap-12 px-0 xl:px-12 py-6 xl:py-0 border-y xl:border-y-0 xl:border-x border-slate-100">
            <div className="text-center md:text-left">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-2 tracking-widest">
                Gross Sales
              </p>
              <p className="text-base font-bold text-slate-700">
                ${formatMoney(item.split?.service_amount)}
              </p>
            </div>

            <div className="text-center md:text-left">
              <p className="text-[9px] font-bold text-rose-400 uppercase mb-2 tracking-widest">
                Commission
              </p>
              <p className="text-base font-bold text-rose-500">
                -${formatMoney(item.split?.admin_commission)}
              </p>
            </div>

            <div className="text-center md:text-left">
              <p className="text-[9px] font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                Net Earned
              </p>
              <p className="text-xl font-black text-emerald-600">
                ${formatMoney(item.amount)}
              </p>
            </div>
          </div>

          <div className="min-w-[240px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Reference
              </span>
              <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ring-1 ring-indigo-100">
                {item.method || "pending"}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-mono font-semibold text-slate-600 flex items-center justify-between group-hover:bg-white transition-colors">
              <span className="truncate mr-2">
                {item.transaction_reference || "No Ref"}
              </span>
              <ExternalLink
                size={14}
                className="text-slate-300 hover:text-indigo-600 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-8 text-[11px] font-bold">
          <div className="flex items-center gap-2 text-slate-400 uppercase">
            Booking{" "}
            <span className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-900">
              #{item.split?.payment?.service_booking_id}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 uppercase">
            Gateway{" "}
            <span className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-900 font-mono">
              #{item.split?.payment?.transaction_id}
            </span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 py-1 px-4 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${
            item.status === "paid"
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-amber-50 text-amber-700 ring-amber-200"
          }`}
        >
          <CheckCircle2 size={14} /> {item.status}
        </div>
      </div>
    </div>
  );
};

export default PayoutCard;
