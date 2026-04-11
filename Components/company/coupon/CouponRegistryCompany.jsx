"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  CheckCircle2,
  Timer,
  Ban,
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
import { toast } from "react-toastify";

import useCouponStore from "../../../app/store/useCouponStore";
import useCouponUsageStore from "../../../app/store/useCouponUsageStore";
import DeleteConfirmModal from "../../admin/DeleteConfirmModal";
import { useRequireAuth } from "../../../app/hooks/useRequireAuth";
import { useOwnerStore } from "../../../app/store/owner/useOwnerStore";
import CouponUsageListener from "../../realtime/CouponUsageListener";

export default function CouponRegistryCompany() {
  const { user: authUser, initialized } = useRequireAuth();
  const userId = authUser?.id;

  const {
    fetchCouponsByOwner,
    fetchCouponStatsByOwner,
    coupons,
    deleteCoupon,
    loading,
    countCoupon,
  } = useCouponStore();

  const { fetchOwner, owner } = useOwnerStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [showMobileStats, setShowMobileStats] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchOwner(userId);
    }
  }, [userId, fetchOwner]);

  useEffect(() => {
    if (!owner?.id) return;

    fetchCouponsByOwner(owner.id);
    fetchCouponStatsByOwner(owner.id);
  }, [owner?.id, fetchCouponsByOwner, fetchCouponStatsByOwner]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const handleDeleteClick = (id) => {
    setSelectedCouponId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCouponId) return;

    try {
      await deleteCoupon(selectedCouponId);

      if (owner?.id) {
        fetchCouponsByOwner(owner.id);
        fetchCouponStatsByOwner(owner.id);
      }

      toast.success("Coupon deleted successfully!");
      setDeleteModalOpen(false);
      setSelectedCouponId(null);
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const filteredCoupons = useMemo(() => {
    return (coupons || []).filter((coupon) => {
      const matchSearch = searchQuery
        ? coupon.unique_id
            ?.toLowerCase()
            .includes(searchQuery.trim().toLowerCase())
        : true;

      const matchStatus =
        statusFilter === "all" ? true : coupon.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [coupons, searchQuery, statusFilter]);

  const stats = [
    {
      label: "Total Coupons",
      count: countCoupon?.total_coupon ?? 0,
      desc: "Total created",
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: <Ticket className="w-5 h-5" />,
    },
    {
      label: "Active Now",
      count: countCoupon?.active_coupon ?? 0,
      desc: "Currently circulating",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      label: "Expired",
      count: countCoupon?.expired_coupon ?? 0,
      desc: "Promotion ended",
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: <Timer className="w-5 h-5" />,
    },
    {
      label: "Disabled",
      count: countCoupon?.disabled_coupon ?? 0,
      desc: "Manually revoked",
      color: "text-slate-600",
      bg: "bg-slate-50",
      icon: <Ban className="w-5 h-5" />,
    },
  ];

  if (!initialized) return null;
  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <CouponUsageListener />
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Coupon Registry</h1>
          <p className="text-slate-500 mt-1 text-lg">
            Manage and monitor promotional campaign performance.
          </p>
        </div>

        <Link
          href="/owner/create/coupons"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Create Coupon
        </Link>
      </div>

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

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-wrap items-center justify-between gap-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-1 items-center gap-2 max-w-md"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Unique ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <Filter size={16} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm font-medium focus:outline-none text-slate-600 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={resetFilters}
              type="button"
              className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-5">Unique ID</th>
                  <th className="px-6 py-5">Owner ID</th>
                  <th className="px-6 py-5">Discount</th>
                  <th className="px-6 py-5">Expires At</th>
                  <th className="px-6 py-5">Uses / Max</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => {
                    const usagePercent =
                      coupon.max_uses > 0
                        ? (Number(coupon.total_times_used) / coupon.max_uses) *
                          100
                        : 0;

                    return (
                      <tr
                        key={coupon.id}
                        /* Added 'even:bg-slate-50/50' to create the alternating row effect from your image */
                        className="group hover:bg-slate-100/50 transition-colors even:bg-slate-50/50"
                      >
                        <td className="px-6 py-8 font-bold text-blue-600 text-[13px] tracking-tight uppercase">
                          {coupon.unique_id}
                        </td>

                        <td className="px-6 py-8 text-slate-500 text-[13px] font-medium">
                          {coupon.owner_id ?? "Global"}
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

                        <td className="px-6 py-8 text-[13px] font-semibold text-slate-700">
                          {coupon.expires_at
                            ? new Date(coupon.expires_at).toLocaleDateString()
                            : "No expiry"}
                        </td>

                        <td className="px-6 py-8">
                          <div className="w-32">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-1.5">
                              <div
                                className={`h-full rounded-full ${
                                  coupon.status === "expired"
                                    ? "bg-slate-500"
                                    : "bg-blue-600"
                                }`}
                                style={{
                                  width: `${Math.min(usagePercent, 100)}%`,
                                }}
                              />
                            </div>
                            <div className="text-[11px] font-medium text-slate-400">
                              {Number(coupon.total_times_used).toLocaleString()}{" "}
                              / {Number(coupon.max_uses).toLocaleString()}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-8">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded text-[12px] font-bold leading-none ${
                              coupon.status === "active"
                                ? "bg-green-100 text-green-600"
                                : coupon.status === "expired"
                                ? "bg-red-100 text-red-600"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {coupon.status}
                          </span>
                        </td>

                        <td className="px-6 py-8 text-right">
                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/owner/edit/coupons/${coupon.id}`}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              <Pencil size={18} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(coupon.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-slate-400 italic"
                    >
                      No coupons found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between mt-auto">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Showing {filteredCoupons.length} of {coupons?.length ?? 0} results
            </span>
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
