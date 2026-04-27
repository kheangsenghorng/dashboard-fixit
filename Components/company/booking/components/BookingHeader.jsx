"use client";

import React from "react";
import { Hash, Activity, RefreshCcw, ChevronDown } from "lucide-react";
import {
  getBookingStatusBadge,
  formatStatus,
} from "../../../../app/utils/statusHelpers";

const BookingHeader = ({
  booking,
  isCancelling,
  setIsCancelling,
  cancelReason,
  setCancelReason,
  onUpdateStatus,
  onRetry,
}) => (
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
          <Activity size={10} className="text-emerald-500" /> System Live •
          Created {new Date(booking?.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2 w-full md:w-auto">
      {!isCancelling ? (
        <>
          <div className="relative flex-1 md:flex-none">
            <select
              onChange={(e) =>
                e.target.value === "cancelled"
                  ? setIsCancelling(true)
                  : onUpdateStatus(e.target.value)
              }
              className="appearance-none w-full md:w-48 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase px-4 py-2.5 rounded-xl shadow-sm cursor-pointer"
            >
              <option value="">Change Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
              <ChevronDown size={14} />
            </div>
          </div>
          <button
            onClick={onRetry}
            className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm"
          >
            <RefreshCcw size={18} />
          </button>
          <button className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold text-[10px] uppercase shadow-lg shadow-indigo-100">
            Save Changes
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
          <input
            type="text"
            placeholder="Reason..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="flex-1 md:w-64 bg-rose-50 border border-rose-200 text-slate-800 text-[11px] px-4 py-2.5 rounded-xl focus:outline-none"
          />
          <button
            onClick={() => onUpdateStatus("cancelled", cancelReason)}
            className="bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase"
          >
            Confirm Stop
          </button>
        </div>
      )}
    </div>
  </div>
);

export default BookingHeader;
