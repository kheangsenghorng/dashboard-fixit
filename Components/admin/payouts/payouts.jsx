"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Search,
  Wallet,
  Calendar,
  ArrowDownCircle,
  History,
  RefreshCw,
} from "lucide-react";
import useAdminOwnerPayoutStore from "../../../app/store/payouts/useAdminOwnerPayoutStore";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";

const AdminPayoutPage = () => {
  const { user } = useAuthGuard();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [processingId, setProcessingId] = useState(null);

  const {
    amountByOwner,
    amountByOwnerLoading,
    amountByOwnerError,
    amountByOwnerEmpty,
    fetchAmountByOwner,
  } = useAdminOwnerPayoutStore();

  useEffect(() => {
    fetchAmountByOwner();
  }, [fetchAmountByOwner]);

  const monthOptions = useMemo(() => {
    const options = [];

    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);

      options.push({
        value: d.toISOString().slice(0, 7),
        label: d.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
      });
    }

    return options;
  }, []);

  const handleMonthChange = async (value) => {
    setSelectedMonth(value);

    if (value === "All") {
      await fetchAmountByOwner();
      return;
    }

    const [year, month] = value.split("-");

    const fromDate = `${year}-${month}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const toDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

    await fetchAmountByOwner({
      from_date: fromDate,
      to_date: toDate,
    });
  };

  const filteredData = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();

    if (!keyword) return amountByOwner;

    return amountByOwner.filter((item) => {
      const businessName = item.business_name ?? "";
      const ownerName = item.owner_name ?? "";

      return (
        businessName.toLowerCase().includes(keyword) ||
        ownerName.toLowerCase().includes(keyword)
      );
    });
  }, [searchTerm, amountByOwner]);

  const totalPending = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => acc + Number(curr.pending_amount || 0),
      0
    );
  }, [filteredData]);

  const totalPaid = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => acc + Number(curr.paid_amount || 0),
      0
    );
  }, [filteredData]);

  const totalPayouts = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => acc + Number(curr.total_payouts || 0),
      0
    );
  }, [filteredData]);

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleReleaseFunds = async (ownerId) => {
    setProcessingId(ownerId);

    try {
      // You can connect your real pay API here later.
      // For now, refresh amount-by-owner after action.
      await fetchAmountByOwner();
    } finally {
      setProcessingId(null);
    }
  };
  const handleViewDetail = (ownerId) => {
    router.push(`/admin/payments/payouts/payout-detail-view/${ownerId}`);
  };

  if (!user) return;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-2">
              <Wallet size={16} />
              <span>Financial Treasury</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Payout Control
            </h1>

            <p className="text-slate-500 mt-1">
              Aggregate view of merchant earnings and pending releases.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative group w-full md:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={20}
              />

              <input
                type="text"
                value={searchTerm}
                placeholder="Search business or owner..."
                className="pl-10 pr-4 py-2.5 w-full bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full md:w-48">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={18}
              />

              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="pl-10 pr-8 py-2.5 w-full bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="All">All Time</option>

                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => fetchAmountByOwner()}
              disabled={amountByOwnerLoading}
              className="w-full md:w-auto bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw
                size={16}
                className={amountByOwnerLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            label="Total Pending"
            value={`$${formatMoney(totalPending)}`}
            icon={<AlertCircle className="text-amber-600" />}
            bgColor="bg-amber-50"
            description="Awaiting manual release"
          />

          <StatCard
            label="Total Paid Out"
            value={`$${formatMoney(totalPaid)}`}
            icon={<CheckCircle2 className="text-emerald-600" />}
            bgColor="bg-emerald-50"
            description="Lifetime settled volume"
          />

          <StatCard
            label="Total Payouts"
            value={totalPayouts}
            icon={<History className="text-indigo-600" />}
            bgColor="bg-indigo-50"
            description="Total transaction count"
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          {amountByOwnerLoading && (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-bold text-slate-600">
                Loading payout data...
              </p>
            </div>
          )}

          {!amountByOwnerLoading && amountByOwnerError && (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto text-red-500 mb-4" size={42} />
              <p className="text-lg font-black text-slate-900 mb-1">
                Failed to load payouts
              </p>
              <p className="text-sm text-slate-500 mb-5">
                {amountByOwnerError}
              </p>
              <button
                onClick={() => fetchAmountByOwner()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold"
              >
                Try Again
              </button>
            </div>
          )}

          {!amountByOwnerLoading &&
            !amountByOwnerError &&
            (amountByOwnerEmpty || filteredData.length === 0) && (
              <div className="p-12 text-center">
                <Wallet className="mx-auto text-slate-300 mb-4" size={46} />
                <p className="text-lg font-black text-slate-900 mb-1">
                  No payout data found
                </p>
                <p className="text-sm text-slate-500">
                  Try changing your search or month filter.
                </p>
              </div>
            )}

          {!amountByOwnerLoading &&
            !amountByOwnerError &&
            filteredData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="px-6 py-5 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        Merchant / Business
                      </th>

                      <th className="px-6 py-5 text-[11px] uppercase tracking-wider font-bold text-slate-500 text-center">
                        Trans. Counts
                      </th>

                      <th className="px-6 py-5 text-[11px] uppercase tracking-wider font-bold text-slate-500 text-right">
                        Settled Paid
                      </th>

                      <th className="px-6 py-5 text-[11px] uppercase tracking-wider font-bold text-slate-500 text-right">
                        Available Pending
                      </th>

                      <th className="px-6 py-5 text-[11px] uppercase tracking-wider font-bold text-slate-500 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredData.map((payout) => {
                      const pendingAmount = Number(payout.pending_amount || 0);
                      const businessName = payout.business_name || "N/A";

                      return (
                        <tr
                          key={payout.owner_id}
                          onClick={() => handleViewDetail(payout.owner_id)}
                          className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                                {businessName.charAt(0).toUpperCase()}
                              </div>

                              <div>
                                <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                  {businessName}
                                </div>

                                <div className="text-xs text-slate-400">
                                  Owner: {payout.owner_name || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-4 text-center">
                              <div>
                                <div className="text-xs font-bold text-emerald-600">
                                  {payout.paid_count || 0}
                                </div>
                                <div className="text-[9px] uppercase font-medium text-slate-400 tracking-tighter">
                                  Paid
                                </div>
                              </div>

                              <div>
                                <div className="text-xs font-bold text-amber-600">
                                  {payout.pending_count || 0}
                                </div>
                                <div className="text-[9px] uppercase font-medium text-slate-400 tracking-tighter">
                                  Pend.
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-right">
                            <div className="text-sm font-bold text-slate-600">
                              ${formatMoney(payout.paid_amount)}
                            </div>
                          </td>

                          <td className="px-6 py-5 text-right">
                            <div
                              className={`text-base font-black ${
                                pendingAmount > 0
                                  ? "text-slate-900"
                                  : "text-slate-300"
                              }`}
                            >
                              ${formatMoney(payout.pending_amount)}
                            </div>
                          </td>

                          <td className="px-6 py-5 text-right">
                            {pendingAmount > 0 ? (
                              <button
                                onClick={() =>
                                  handleReleaseFunds(payout.owner_id)
                                }
                                disabled={processingId === payout.owner_id}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ml-auto disabled:opacity-50"
                              >
                                {processingId === payout.owner_id ? (
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                  <>
                                    <ArrowDownCircle size={14} />
                                    <span>Release All</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase">
                                Fully Settled
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, bgColor, description }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 ${bgColor} rounded-xl`}>{icon}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Aggregate
      </div>
    </div>

    <div>
      <p className="text-sm text-slate-500 font-bold mb-1">{label}</p>

      <p className="text-3xl font-black text-slate-900 tracking-tight">
        {value}
      </p>

      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        {description}
      </p>
    </div>
  </div>
);

export default AdminPayoutPage;
