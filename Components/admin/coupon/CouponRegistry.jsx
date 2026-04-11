"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  CheckCircle2,
  Timer,
  Ban,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Ticket,
  Search,
  Filter,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

import useCouponStore from "../../../app/store/useCouponStore";
import useCouponUsageStore from "../../../app/store/useCouponUsageStore";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { toast } from "react-toastify";
import CouponUsageListener from "../../realtime/CouponUsageListener";

export default function CouponRegistry() {
  const {
    fetchCoupons,
    coupons,
    fetchCouponsStats,
    countCoupon,
    meta,
    deleteCoupon,
    loading,
  } = useCouponStore();

  const { fetchTopPerformingCoupons, topPerformingCoupons } =
    useCouponUsageStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showTopPerforming, setShowTopPerforming] = useState(false);

  useEffect(() => {
    fetchCoupons({
      page: 1,
      search: searchQuery,
      status: statusFilter === "all" ? "" : statusFilter,
      owner_id: ownerFilter || "",
    });

    fetchCouponsStats();
  }, [fetchCoupons, fetchCouponsStats, searchQuery, statusFilter, ownerFilter]);

  useEffect(() => {
    fetchTopPerformingCoupons();
  }, [fetchTopPerformingCoupons]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCoupons({
      page: 1,
      search: searchQuery,
      status: statusFilter === "all" ? "" : statusFilter,
      owner_id: ownerFilter || "",
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setOwnerFilter("");
    fetchCoupons({ page: 1, search: "", status: "", owner_id: "" });
  };

  const handleDeleteClick = (id) => {
    setSelectedCouponId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCouponId) return;
    try {
      await deleteCoupon(selectedCouponId);
      toast.success("Coupon deleted successfully!");
      setDeleteModalOpen(false);
      setSelectedCouponId(null);
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const stats = [
    {
      label: "Total",
      count: countCoupon?.total_coupon ?? 0,
      desc: "Created",
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: <Ticket className="w-5 h-5" />,
    },
    {
      label: "Active",
      count: countCoupon?.active_coupon ?? 0,
      desc: "Live",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      label: "Expired",
      count: countCoupon?.expired_coupon ?? 0,
      desc: "Ended",
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: <Timer className="w-5 h-5" />,
    },
    {
      label: "Disabled",
      count: countCoupon?.disabled_coupon ?? 0,
      desc: "Revoked",
      color: "text-slate-600",
      bg: "bg-slate-50",
      icon: <Ban className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-sans text-slate-900">
      <CouponUsageListener />

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Coupon Registry
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Manage and monitor promotional campaign performance.
          </p>
        </div>

        <Link
          href="/admin/create/coupons"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Create Coupon</span>
        </Link>
      </div>

      {/* STATS GRID */}
      {/* MOBILE STATS TOGGLE BUTTON (Only visible on small screens) */}
      <button
        onClick={() => setShowMobileStats(!showMobileStats)}
        className="sm:hidden w-full mb-4 bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Ticket className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-bold text-slate-700 text-sm">
            {showMobileStats ? "Hide Dashboard Stats" : "Show Dashboard Stats"}
          </span>
        </div>
        <div className="text-slate-400">
          {showMobileStats ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </div>
      </button>

      {/* STATS GRID */}
      <div
        className={`
  ${showMobileStats ? "grid" : "hidden"} 
  sm:grid 
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8
`}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`${stat.bg} p-2.5 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded ${stat.bg} ${stat.color} uppercase tracking-wider`}
              >
                {stat.label}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800">
                {stat.count}
              </h3>
              <p className="text-slate-400 text-xs mt-1">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row flex-1 gap-3"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Unique ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 sm:flex-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Owner:
              </span>
              <input
                type="text"
                placeholder="ID"
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none text-slate-600 w-12 sm:w-20"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 sm:flex-none">
              <Filter size={14} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none text-slate-600 cursor-pointer w-full"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            {(searchQuery || statusFilter !== "all" || ownerFilter) && (
              <button
                onClick={resetFilters}
                className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-sm font-medium ml-auto"
              >
                <X size={16} /> <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* TABLE SECTION */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col min-w-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Unique ID</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4">Redemptions</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {coupons.length > 0 ? (
                  coupons.map((coupon) => {
                    const usagePercent =
                      coupon.max_uses > 0
                        ? (Number(coupon.total_times_used) / coupon.max_uses) *
                          100
                        : 0;
                    return (
                      <tr
                        key={coupon.id}
                        className="group hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-blue-600 text-[13px] uppercase">
                          {coupon.unique_id}
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                            Owner: {coupon.owner_id ?? "Global"}
                          </div>
                        </td>
                        {/* UPDATED DISCOUNT CELL */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* Smaller, bold value */}
                            <span className="text-base font-bold text-slate-800 tracking-tight">
                              {coupon.discount_type === "percent"
                                ? `${coupon.discount_value}%`
                                : `$${coupon.discount_value}`}
                            </span>

                            {/* Small, compact badge */}
                            <span className="flex items-center gap-1.5 px-1.5 py-0.5 bg-white text-slate-500 text-[10px] font-bold rounded border border-slate-200">
                              {/* The isolated color dot */}
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  coupon.discount_type === "percent"
                                    ? "bg-blue-500"
                                    : "bg-indigo-500"
                                }`}
                              />
                              {coupon.discount_type === "percent"
                                ? "PCT"
                                : "FIX"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[12px] font-semibold text-slate-700">
                          {coupon.expires_at
                            ? new Date(coupon.expires_at).toLocaleDateString()
                            : "No expiry"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-24">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-1">
                              <div
                                className={`h-full ${
                                  coupon.status === "expired"
                                    ? "bg-slate-400"
                                    : "bg-blue-600"
                                }`}
                                style={{
                                  width: `${Math.min(usagePercent, 100)}%`,
                                }}
                              />
                            </div>
                            <div className="text-[10px] font-medium text-slate-400">
                              {coupon.total_times_used} / {coupon.max_uses}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                              coupon.status === "active"
                                ? "bg-green-100 text-green-600"
                                : coupon.status === "expired"
                                ? "bg-red-100 text-red-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {coupon.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/edit/coupons/${coupon.id}`}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(coupon.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-400 italic"
                    >
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Showing {meta?.from ?? 0}-{meta?.to ?? 0} of {meta?.total ?? 0}
            </span>
            <div className="flex items-center gap-3">
              <button
                disabled={!meta?.prev_page_url}
                onClick={() =>
                  fetchCoupons({
                    page: meta.current_page - 1,
                    search: searchQuery,
                    status: statusFilter === "all" ? "" : statusFilter,
                    owner_id: ownerFilter,
                  })
                }
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs font-bold text-slate-600">
                Page {meta?.current_page} of {meta?.last_page}
              </span>
              <button
                disabled={!meta?.next_page_url}
                onClick={() =>
                  fetchCoupons({
                    page: meta.current_page + 1,
                    search: searchQuery,
                    status: statusFilter === "all" ? "" : statusFilter,
                    owner_id: ownerFilter,
                  })
                }
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* TOP PERFORMING TOGGLE (Only visible on small/medium screens) */}
        <button
          onClick={() => setShowTopPerforming(!showTopPerforming)}
          className="lg:hidden w-full mb-6 bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <span className="font-bold text-slate-700 text-sm">
              {showTopPerforming
                ? "Hide Top Performing"
                : "Show Top Performing"}
            </span>
          </div>
          <div className="text-slate-400">
            {showTopPerforming ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>
        </button>

        {/* TOP PERFORMING SIDEBAR */}
        <div
          className={`
  ${showTopPerforming ? "block" : "hidden"} 
  lg:block 
  bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit
`}
        >
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-blue-600" />
            Top Performing
          </h2>
          <div className="space-y-5">
            {topPerformingCoupons.map((item, index) => (
              <div
                key={item.coupon_id}
                className="flex items-center gap-4 group"
              >
                <div className="w-8 h-8 shrink-0 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors rounded flex items-center justify-center text-xs font-black">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-800 truncate uppercase">
                    {item.coupon?.unique_id}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {Number(item.total_times_used).toLocaleString()} Redemptions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedCouponId(null);
        }}
        onConfirm={handleConfirmDelete}
        count={1}
        loading={loading}
      />
    </div>
  );
}
