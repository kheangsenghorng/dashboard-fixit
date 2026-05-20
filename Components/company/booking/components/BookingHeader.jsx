"use client";

import React from "react";
import { Hash, Activity, RefreshCcw, ChevronDown } from "lucide-react";
import {
  getBookingStatusBadge,
  formatStatus,
} from "../../../../app/utils/statusHelpers";

const cancelReasonSuggestions = [
  "Owner cannot provide this service on selected date.",
  "No available staff for this booking.",
  "Service schedule conflict.",
  "Customer requested cancellation.",
  "Incorrect booking information.",
];

const BookingHeader = ({
  booking,
  isCancelling,
  setIsCancelling,
  cancelReason,
  setCancelReason,
  onUpdateStatus,
  onCancelRefundBooking,
  onRetry,
  cancelRefundLoading,
  cancelRefundBookingId,
}) => {
  const isRefunding =
    cancelRefundLoading && cancelRefundBookingId === booking?.id;

  const isCancelled = booking?.booking_status === "cancelled";
  const isCompleted = booking?.booking_status === "completed";

  const canConfirmRefund = cancelReason.trim().length > 0 && !isRefunding;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
          <Hash className="text-indigo-600" size={20} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-800">
              Booking #{booking?.id}
            </h1>

            <span
              className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${getBookingStatusBadge(
                booking?.booking_status
              )}`}
            >
              {formatStatus(booking?.booking_status)}
            </span>
          </div>

          <p className="text-slate-400 text-[9px] font-bold uppercase flex items-center gap-1.5 mt-0.5">
            <Activity size={10} className="text-emerald-500" />
            System Live • Created{" "}
            {booking?.created_at
              ? new Date(booking.created_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        {!isCancelling ? (
          <>
            <div className="relative flex-1 md:flex-none">
              <select
                disabled={isCancelled || isCompleted || isRefunding}
                onChange={(e) => {
                  const value = e.target.value;

                  if (!value) return;

                  if (value === "cancelled") {
                    setIsCancelling(true);
                    return;
                  }

                  onUpdateStatus(value);
                }}
                className="appearance-none w-full md:w-48 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase px-4 py-2.5 rounded-xl shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">Change Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancel & Refund</option>
              </select>

              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>

            <button
              onClick={onRetry}
              disabled={isRefunding}
              className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm disabled:opacity-60"
            >
              <RefreshCcw size={18} />
            </button>

            <button
              disabled
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold text-[10px] uppercase shadow-lg shadow-indigo-100 disabled:opacity-60"
            >
              Save Changes
            </button>
          </>
        ) : (
          <div className="w-full md:w-[520px] rounded-2xl border border-rose-200 bg-white p-4 shadow-sm animate-in fade-in slide-in-from-right-2">
            <div className="mb-3">
              <p className="text-[10px] font-black uppercase text-rose-600">
                Cancel & Refund Booking
              </p>
              <p className="mt-1 text-[10px] font-semibold text-slate-400">
                Select a reason suggestion or write your own reason.
              </p>
            </div>

            <input
              type="text"
              placeholder="Refund reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              disabled={isRefunding}
              className="w-full bg-rose-50 border border-rose-200 text-slate-800 text-[11px] px-4 py-2.5 rounded-xl focus:outline-none disabled:opacity-60"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {cancelReasonSuggestions.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setCancelReason(reason)}
                  disabled={isRefunding}
                  className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase transition disabled:opacity-60 ${
                    cancelReason === reason
                      ? "border-rose-500 bg-rose-600 text-white"
                      : "border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {!cancelReason.trim() && (
              <p className="mt-2 text-[10px] font-semibold text-rose-500">
                Please add a reason before confirming refund.
              </p>
            )}

            <div className="mt-4 flex flex-col md:flex-row gap-2">
              <button
                onClick={() => onCancelRefundBooking(cancelReason)}
                disabled={!canConfirmRefund}
                className="bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRefunding ? "Refunding..." : "Confirm Refund"}
              </button>

              <button
                onClick={() => {
                  setIsCancelling(false);
                  setCancelReason("");
                }}
                disabled={isRefunding}
                className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase disabled:opacity-60"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHeader;
