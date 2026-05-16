"use client";

import React, { useEffect } from "react";
import { CreditCard, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import useAdminPaymentSplitStore from "../../../app/store/payouts/useAdminPaymentSplitStore";

const formatMoney = (value) => {
  const amount = Number(value || 0);

  return `$${amount.toFixed(2)}`;
};

const formatDateTime = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString();
};

const getStatusStyle = (status) => {
  switch (status) {
    case "paid":
    case "completed":
      return "bg-green-50 text-green-600 border-green-100";

    case "pending":
      return "bg-amber-50 text-amber-600 border-amber-100";

    case "failed":
    case "rejected":
      return "bg-red-50 text-red-600 border-red-100";

    default:
      return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

const getStatusIcon = (status) => {
  if (status === "pending") return <Clock size={14} />;
  if (status === "paid" || status === "completed")
    return <CheckCircle2 size={14} />;

  return <AlertCircle size={14} />;
};

const RecentUsers = () => {
  const { paymentSplits, loading, error, fetchPaymentSplits } =
    useAdminPaymentSplitStore();

  useEffect(() => {
    fetchPaymentSplits();
  }, [fetchPaymentSplits]);

  const rows = Array.isArray(paymentSplits) ? paymentSplits.slice(0, 5) : [];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">
          Payment Split Activity
        </h3>

        <button className="text-sm font-bold text-indigo-600 hover:underline transition-all">
          View All
        </button>
      </div>

      <div className="overflow-x-auto px-2">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Service Amount</th>
              <th className="px-6 py-4">Commission</th>
              <th className="px-6 py-4">Payout</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Time</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-400 text-sm font-bold"
                >
                  Loading payment splits...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-red-500 text-sm font-bold"
                >
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-400 text-sm font-bold"
                >
                  No payment split activity found.
                </td>
              </tr>
            ) : (
              rows.map((split) => {
                const payoutStatus = split.owner_payout?.status || "pending";
                const ownerName = split.owner?.business_name || "Unknown Owner";

                return (
                  <tr
                    key={split.id}
                    className="hover:bg-slate-50/50 transition-all group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xs shadow-sm">
                          <CreditCard size={18} />
                        </div>

                        <div>
                          <p className="font-bold text-slate-700 text-sm tracking-tight">
                            {ownerName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold">
                            Payment #{split.payment_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-700 text-xs font-black">
                      {formatMoney(split.service_amount)}
                    </td>

                    <td className="px-6 py-5 text-red-500 text-xs font-black">
                      {formatMoney(split.admin_commission)}
                    </td>

                    <td className="px-6 py-5 text-emerald-600 text-xs font-black">
                      {formatMoney(split.owner_payout?.amount)}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black rounded-full uppercase border ${getStatusStyle(
                          payoutStatus
                        )}`}
                      >
                        {getStatusIcon(payoutStatus)}
                        {payoutStatus}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-400 text-xs font-bold uppercase tracking-tighter">
                      {formatDateTime(split.created_at)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentUsers;
