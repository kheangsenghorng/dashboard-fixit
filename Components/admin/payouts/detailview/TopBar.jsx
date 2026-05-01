import React from "react";
import { ArrowLeft, Download, Send } from "lucide-react";
import { formatMoney } from "../../../../utils/formatters";

const TopBar = ({ router, payouts, totals, onOpenModal }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
      >
        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-200">
          <ArrowLeft size={20} />
        </div>
        <span>Back to Dashboard</span>
      </button>

      <div className="flex items-center gap-3">
        <button
          disabled={payouts.length === 0}
          className="hidden md:flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-40"
        >
          <Download size={18} />
          CSV
        </button>

        <button
          disabled={totals.pendingIds.length === 0}
          onClick={onOpenModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
        >
          <Send size={18} />
          Release ${formatMoney(totals.pending)}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
