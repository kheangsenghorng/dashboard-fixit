"use client";

import React, { useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  RotateCcw,
  CreditCard,
  Package,
  Loader2,
  RefreshCcw,
  User,
  Maximize2,
  Users,
  Timer,
  Layers,
  Hash,
} from "lucide-react";
import { useOwnerGuard } from "../../../app/hooks/useOwnerGuard";
import { useServiceBookingStore } from "../../../app/store/useServiceBookingStore";

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
// Robust Date Formatter
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

export default function RefundsCompanyPage() {
  const { ownerId } = useOwnerGuard();
  const {
    serviceBookings,
    pagination,
    loading,
    error,
    fetchRefundedCancelledByOwner,
  } = useServiceBookingStore();

  useEffect(() => {
    if (ownerId) fetchRefundedCancelledByOwner(ownerId);
  }, [ownerId, fetchRefundedCancelledByOwner]);

  const bookings = Array.isArray(serviceBookings) ? serviceBookings : [];

  const totalRefundedAmount = bookings.reduce((sum, booking) => {
    const payment = booking?.payments?.[0];
    return sum + Number(payment?.final_amount || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#f1f5f9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Refund Console
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-lg">
              Detailed history of cancelled and refunded services.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                Total Returned
              </p>
              <p className="text-2xl font-black text-slate-900">
                {formatMoney(totalRefundedAmount)}
              </p>
            </div>
            <button
              onClick={() => ownerId && fetchRefundedCancelledByOwner(ownerId)}
              className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all active:scale-95"
            >
              <RefreshCcw size={22} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* List of Bookings */}
        <div className="space-y-8">
          {loading ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] shadow-sm border border-slate-200">
              <Loader2
                className="animate-spin mx-auto text-indigo-600 mb-4"
                size={48}
              />
              <p className="text-slate-400 font-bold text-lg">
                Synchronizing records...
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const service = booking?.service || {};
              const pkg = booking?.package || {};
              const payment = booking?.payments?.[0] || {};
              const walletTx =
                booking?.wallet_transactions?.find(
                  (t) => t.type === "credit"
                ) || booking?.wallet_transactions?.[0];
              const customer = booking?.user || {};

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* 1. HIGH VISIBILITY DATE/TIME HEADER */}
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
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-slate-300 font-mono text-sm">
                      <Hash size={14} /> ID: {booking.id}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row gap-10">
                      {/* Customer & Image Section */}
                      <div className="w-full lg:w-48 shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="relative w-40 h-40 rounded-3xl overflow-hidden shadow-inner bg-slate-100 mb-4 border-4 border-slate-50">
                          <img
                            src={getImageUrl(service?.images?.[0])}
                            alt="service"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="bg-slate-50 w-full p-3 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Booked By
                          </p>
                          <div className="flex items-center gap-2 justify-center lg:justify-start">
                            <User size={14} className="text-indigo-500" />
                            <p className="text-sm font-bold text-slate-700 truncate">
                              {customer.name || "Customer"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Main Details Section */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                            {booking.booking_status}
                          </span>
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider">
                            {booking.customer_status}
                          </span>
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                          {service.title}
                        </h2>

                        <div className="flex items-center gap-2 text-slate-500 mb-8">
                          <MapPin
                            size={16}
                            className="text-indigo-500 shrink-0"
                          />
                          <p className="text-sm font-medium leading-relaxed">
                            {booking.address?.address}
                          </p>
                        </div>

                        {/* 2. PACKAGE SPECIFICATIONS GRID */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-indigo-400">
                              <Layers size={16} />
                              <span className="text-[10px] font-black uppercase">
                                Plan
                              </span>
                            </div>
                            <p className="text-base font-bold text-slate-800">
                              {pkg.title}
                            </p>
                          </div>

                          <div className="space-y-1 border-l border-indigo-100/50 pl-4">
                            <div className="flex items-center gap-2 text-indigo-400">
                              <Maximize2 size={16} />
                              <span className="text-[10px] font-black uppercase">
                                Area
                              </span>
                            </div>
                            <p className="text-base font-bold text-slate-800">
                              {pkg.min_area_m2} - {pkg.max_area_m2} m²
                            </p>
                          </div>

                          <div className="space-y-1 border-l border-indigo-100/50 pl-4">
                            <div className="flex items-center gap-2 text-indigo-400">
                              <Users size={16} />
                              <span className="text-[10px] font-black uppercase">
                                Staff
                              </span>
                            </div>
                            <p className="text-base font-bold text-slate-800">
                              {pkg.workers_count} Staff
                            </p>
                          </div>

                          <div className="space-y-1 border-l border-indigo-100/50 pl-4">
                            <div className="flex items-center gap-2 text-indigo-400">
                              <Timer size={16} />
                              <span className="text-[10px] font-black uppercase">
                                Duration
                              </span>
                            </div>
                            <p className="text-base font-bold text-slate-800">
                              {pkg.duration_hours} Hrs
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Financial Summary Section */}
                      <div className="w-full lg:w-48 shrink-0 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-10 text-center lg:text-right">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                          Amount Refunded
                        </p>
                        <p className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
                          {formatMoney(payment.final_amount)}
                        </p>
                        <div className="inline-flex items-center gap-2 justify-center lg:justify-end text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl self-center lg:self-end">
                          <CreditCard size={14} />
                          {payment.method?.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Cancellation Reason Footer */}
                    <div className="mt-8 flex items-start gap-4 bg-rose-50/50 p-6 rounded-[2rem] border border-rose-100/50">
                      <div className="bg-rose-100 p-2 rounded-xl text-rose-600">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">
                          Reason for cancellation
                        </p>
                        <p className="text-base font-bold text-rose-900 italic leading-relaxed">
                          "
                          {walletTx?.description ||
                            "No specific reason provided."}
                          "
                        </p>
                      </div>
                      <div className="ml-auto text-[10px] font-mono font-bold text-slate-400 uppercase hidden sm:block">
                        TXN: {payment.transaction_id}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
