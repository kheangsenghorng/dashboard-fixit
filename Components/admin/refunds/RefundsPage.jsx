"use client";

import React, { useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  RotateCcw,
  CreditCard,
  ChevronRight,
  Package,
  Maximize2,
  Users,
  Timer,
  Layers,
  Hash,
  Loader2,
  RefreshCcw,
  User,
} from "lucide-react";
import { useServiceBookingStore } from "../../../app/store/useServiceBookingStore";

// Robust Date Formatter to ensure "May 27, 2026" looks perfect

const getImageUrl = (image) => {
  if (!image) {
    return "https://via.placeholder.com/300x300?text=No+Image";
  }

  // if image is already a full URL string
  if (typeof image === "string") {
    return image;
  }

  // if image object contains url
  if (image?.url) {
    return image.url;
  }

  return "https://via.placeholder.com/300x300?text=No+Image";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const [year, month, day] = dateStr.split("-");
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return `$${amount.toFixed(2)}`;
};

export default function RefundsPage() {
  const {
    refundedBookings,
    pagination,
    loading,
    error,
    fetchRefundedCancelledByadmin,
  } = useServiceBookingStore();

  useEffect(() => {
    fetchRefundedCancelledByadmin({
      page: 1,
      per_page: 10,
    });
  }, [fetchRefundedCancelledByadmin]);

  const bookings = Array.isArray(refundedBookings) ? refundedBookings : [];

  // Calculate total refunded dollar amount
  const totalRefundedAmount = bookings.reduce((sum, booking) => {
    const payment = booking?.payments?.[0];
    return sum + Number(payment?.final_amount || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Refunds & Cancellations
            </h1>
            <p className="text-slate-500 text-lg mt-1 font-medium">
              Audit trail for all processed refunds and cancelled services.
            </p>
          </div>
          <button
            onClick={() =>
              fetchRefundedCancelledByadmin({ page: 1, per_page: 10 })
            }
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCcw size={18} />
            )}
            Sync Records
          </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Total Cancelled
              </p>
              <p className="text-3xl font-black text-slate-900">
                {bookings.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <RotateCcw size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Total Refunded
              </p>
              <p className="text-3xl font-black text-slate-900">
                {formatMoney(totalRefundedAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {loading ? (
            <div className="py-24 text-center bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
              <Loader2
                className="animate-spin mx-auto text-indigo-600 mb-4"
                size={48}
              />
              <p className="text-slate-500 font-bold text-xl tracking-tight">
                Accessing Database...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-300">
              <Package className="mx-auto text-slate-200 mb-4" size={64} />
              <h3 className="text-2xl font-black text-slate-800">
                No Refunds Found
              </h3>
              <p className="text-slate-500 text-lg">
                There are currently no cancellation records to display.
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const service = booking?.service || {};
              const pkg = booking?.package || {};
              const payment = booking?.payments?.[0] || {};
              const walletTx =
                booking?.wallet_transactions?.find(
                  (item) => item.type === "credit"
                ) || booking?.wallet_transactions?.[0];

              return (
                <div
                  key={booking.id}
                  className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group"
                >
                  {/* 1. THE SCHEDULE HEADER (HIGH VISIBILITY) */}
                  <div className="bg-slate-900 px-8 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-indigo-400" size={20} />
                        <span className="text-white font-black text-lg tracking-tight">
                          {formatDate(booking.booking_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="text-indigo-400" size={20} />
                        <span className="text-white font-black text-lg tracking-tight">
                          {booking.booking_hours}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-sm px-4 py-1.5 bg-white/10 rounded-full">
                      <Hash size={14} /> ID: {booking.id}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row gap-10">
                      {/* Image */}
                      <div className="w-full lg:w-40 shrink-0">
                        <div className="w-full lg:w-48 shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
                          <div className="relative w-40 h-40 rounded-3xl overflow-hidden shadow-inner bg-slate-100 mb-4 border-4 border-slate-50">
                            <img
                              src={getImageUrl(service?.images?.[0])}
                              alt="service"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="bg-gradient-to-br from-slate-50 to-white w-full p-4 rounded-3xl border border-slate-200 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                              Booked By
                            </p>

                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                                <User size={18} className="text-indigo-600" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-black text-slate-800 truncate">
                                  {booking?.user?.name || "Customer"}
                                </p>

                                <p className="text-xs text-slate-400 truncate mt-0.5">
                                  {booking?.user?.phone ||
                                    booking?.user?.email ||
                                    "No contact"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info and Package Grid */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {booking.booking_status}
                          </span>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {booking.customer_status}
                          </span>
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                          {service?.title || "Standard Service"}
                        </h3>

                        <div className="flex items-start gap-2 text-slate-500 mb-8">
                          <MapPin
                            size={18}
                            className="text-indigo-500 shrink-0 mt-0.5"
                          />
                          <p className="text-sm font-medium leading-relaxed">
                            {booking?.address?.address}
                          </p>
                        </div>

                        {/* PACKAGE SPECS SECTION */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Layers size={14} />
                              <span className="text-[10px] font-black uppercase tracking-wider">
                                Plan
                              </span>
                            </div>
                            <p className="text-sm font-bold text-indigo-600">
                              {pkg.title || "N/A"}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Maximize2 size={14} />
                              <span className="text-[10px] font-black uppercase tracking-wider">
                                Area
                              </span>
                            </div>
                            <p className="text-sm font-bold text-slate-700">
                              {pkg.min_area_m2 || "0"} -{" "}
                              {pkg.max_area_m2 || "0"} m²
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Users size={14} />
                              <span className="text-[10px] font-black uppercase tracking-wider">
                                Staff
                              </span>
                            </div>
                            <p className="text-sm font-bold text-slate-700">
                              {pkg.workers_count || "0"} Staff
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Timer size={14} />
                              <span className="text-[10px] font-black uppercase tracking-wider">
                                Duration
                              </span>
                            </div>
                            <p className="text-sm font-bold text-slate-700">
                              {pkg.duration_hours || "0"} Hrs
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Refund Amount Area */}
                      <div className="w-full lg:w-48 shrink-0 flex flex-col justify-center items-center lg:items-end border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-10">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Total Refunded
                        </p>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
                          {formatMoney(payment?.final_amount)}
                        </p>
                        <button className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all text-sm group-hover:underline">
                          View Details <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Footer Reason and Transaction Meta */}
                    <div className="mt-8 pt-8 border-t border-slate-50">
                      <div className="bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100/50 flex flex-col md:flex-row gap-6 md:items-center">
                        <div className="flex-1 flex items-start gap-4">
                          <div className="bg-rose-100 p-2 rounded-xl text-rose-600 shrink-0">
                            <AlertCircle size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">
                              Reason for Cancellation
                            </p>
                            <p className="text-base font-bold text-rose-900 leading-relaxed italic">
                              "
                              {walletTx?.description ||
                                "Administrative refund processed by management."}
                              "
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100">
                            <CreditCard size={14} /> {payment.method}
                          </div>
                          <div className="bg-white px-4 py-2 rounded-xl border border-slate-100">
                            TXN: {payment.transaction_id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination && pagination.last_page > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              className="h-14 px-8 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30"
              disabled
            >
              Previous
            </button>
            <div className="h-14 w-14 flex items-center justify-center bg-slate-900 text-white rounded-2xl font-black text-lg shadow-lg">
              {pagination.current_page}
            </div>
            <button className="h-14 px-8 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
