"use client";

import React from "react";
import {
  CreditCard,
  Clock,
  Hash,
  Calendar,
  Copy,
  Check,
  Tag,
  ChevronDown,
  ShoppingCart,
  Eye,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import { useRouter } from "next/navigation"; // For Next.js App Router
import ExpandedBookingRow from "./ExpandedBookingRow";
import { cn, BOOKING_STATUS, PAYMENT_STATUS } from "./bookingPaymentUtils";

export default function BookingPaymentRow({
  booking,
  copiedId,
  onCopy,
  expandedRow,
  onToggleRow,
  checkingId,
  transactionResult,
  onCheckTransaction,
  onCloseTransactionResult,
}) {
  const pmt =
    (booking.payment || []).find((p) => p.status === "paid") ??
    booking.payment?.[0] ??
    null;

  const pmtConfig = pmt
    ? PAYMENT_STATUS[pmt.status] || PAYMENT_STATUS.unpaid
    : PAYMENT_STATUS.unpaid;

  const bkConfig =
    BOOKING_STATUS[booking.booking_status] || BOOKING_STATUS.pending;

  const isExpanded = expandedRow === booking.id;
  const router = useRouter();

  return (
    <React.Fragment>
      <tr
        className={cn(
          "cursor-pointer border-b border-slate-100 transition-colors",
          isExpanded ? "bg-indigo-50/30" : "hover:bg-slate-50/60"
        )}
        onClick={() => onToggleRow(booking.id)}
      >
        <td className="px-5 py-4 align-top">
          <div className="space-y-1">
            <span className="rounded border border-indigo-100 bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-600">
              #BK-00{booking.id}
            </span>

            <div className="flex items-center gap-1 pt-0.5 text-[11px] text-slate-500">
              <Calendar size={11} className="text-slate-400" />
              {booking.booking_date}
            </div>

            {booking.booking_hours && (
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock size={10} />
                {booking.booking_hours}
              </div>
            )}
          </div>
        </td>

        <td className="px-5 py-4 align-top">
          <p className="text-[13px] font-semibold leading-snug text-slate-900">
            {booking.service?.name}
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              {booking.service?.category?.name}
            </span>

            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              {booking.service?.type?.name}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
            <ShoppingCart size={10} />
            Qty: {booking.quantity}
          </div>
        </td>

        <td className="px-5 py-4 align-top">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-[11px] font-bold text-indigo-600">
              {booking.user?.name?.charAt(0) || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold leading-tight text-slate-900">
                {booking.user?.name}
              </p>

              <p className="max-w-[110px] truncate text-[10px] text-slate-400">
                {booking.user?.email}
              </p>
            </div>
          </div>
        </td>

        <td className="px-5 py-4 align-top">
          {pmt ? (
            <div className="space-y-1.5">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-slate-900">
                  ${pmt.final_amount}
                </span>

                {parseFloat(pmt.discount_amount || 0) > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-slate-400 line-through">
                      ${pmt.original_amount}
                    </span>

                    <span className="text-[9px] font-bold text-emerald-600">
                      -{pmt.discount_amount}
                    </span>

                    {pmt.coupons_id && (
                      <Tag size={9} className="text-indigo-400" />
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(pmt.transaction_id);
                }}
                className="group flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[9px] text-slate-400 transition-all hover:bg-slate-100 active:scale-95"
              >
                <Hash size={9} />
                {pmt.transaction_id?.substring(0, 12)}...
                {copiedId === pmt.transaction_id ? (
                  <Check size={9} className="text-emerald-500" />
                ) : (
                  <Copy
                    size={9}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                )}
              </button>
            </div>
          ) : (
            <span className="text-[11px] italic text-slate-400">
              No payment
            </span>
          )}
        </td>

        <td className="px-5 py-4 align-top">
          <StatusBadge config={pmtConfig} />

          {pmt && (
            <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {pmt.method}
            </p>
          )}
        </td>

        <td className="px-5 py-4 align-top">
          <StatusBadge config={bkConfig} />

          <p className="mt-1.5 text-[10px] text-slate-400">
            Customer:{" "}
            <span className="font-semibold capitalize text-slate-600">
              {booking.customer_status}
            </span>
          </p>
        </td>

        <td className="px-5 py-4 text-right align-top">
          <div className="flex items-center justify-end gap-2">
            {/* VIEW DETAIL BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/owner/booking/${booking.id}/detail`);
              }}
              className="inline-flex h-8 px-2 items-center justify-center gap-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider"
            >
              <Eye size={14} />
              View
            </button>

            {/* TOGGLE EXPAND BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleRow(booking.id);
              }}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all border",
                isExpanded
                  ? "rotate-180 bg-indigo-100 text-indigo-600 border-indigo-200"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 border-slate-200"
              )}
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <ExpandedBookingRow
          booking={booking}
          onCheckTransaction={onCheckTransaction}
          checkingId={checkingId}
          transactionResult={transactionResult}
          onCloseTransactionResult={onCloseTransactionResult}
        />
      )}
    </React.Fragment>
  );
}
