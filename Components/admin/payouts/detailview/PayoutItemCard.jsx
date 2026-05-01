import { Hash, Calendar, ExternalLink, CheckCircle2 } from "lucide-react";

export const PayoutItemCard = ({ item, formatMoney, formatDate }) => (
  <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
    <div className="p-6 md:p-8">
      <div className="flex flex-col xl:flex-row justify-between gap-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
            <Hash size={24} />
          </div>
          <div>
            <div className="font-black text-lg text-slate-900 leading-none mb-2">
              Payout #{item.id}
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <Calendar size={14} className="text-indigo-400" />{" "}
              {formatDate(item.paid_at)}
            </div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-4 border-y xl:border-y-0 xl:border-x border-slate-100 py-4 xl:py-0 px-0 xl:px-10">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
              Gross
            </p>
            <p className="font-bold text-slate-700">
              ${formatMoney(item.split?.service_amount)}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-rose-400 uppercase mb-1">
              Fee
            </p>
            <p className="font-bold text-rose-500">
              -${formatMoney(item.split?.admin_commission)}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-emerald-500 uppercase mb-1">
              Net
            </p>
            <p className="font-black text-emerald-600">
              ${formatMoney(item.amount)}
            </p>
          </div>
        </div>
        <div className="min-w-[200px]">
          <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-black uppercase ring-1 ring-indigo-100 mb-2 inline-block">
            {item.method || "pending"}
          </span>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-mono font-semibold text-slate-600 flex items-center justify-between">
            <span className="truncate">
              {item.transaction_reference || "No Ref"}
            </span>
            <ExternalLink size={14} className="text-slate-300" />
          </div>
        </div>
      </div>
    </div>
    <div className="bg-slate-50/50 px-8 py-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
      <span>
        Booking:{" "}
        <span className="text-slate-900">
          #{item.split?.payment?.service_booking_id}
        </span>
      </span>
      <div
        className={`py-1 px-3 rounded-full text-[10px] font-black tracking-widest ring-1 ring-inset ${
          item.status === "paid"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-amber-50 text-amber-700 ring-amber-200"
        }`}
      >
        {item.status}
      </div>
    </div>
  </div>
);
