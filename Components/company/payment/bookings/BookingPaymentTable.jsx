"use client";

import React from "react";
import BookingPaymentRow from "./BookingPaymentRow";
import BookingTableFooter from "./BookingTableFooter";

export default function BookingPaymentTable({
  serviceBookings = [],
  pagination,
  copiedId,
  onCopy,
  expandedRow,
  onToggleRow,
  checkingId,
  transactionResults = {},
  onCheckTransaction,
  onCloseTransactionResult,
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Booking
              </th>
              <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Service
              </th>
              <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Customer
              </th>
              <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Transaction
              </th>
              <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Payment
              </th>
              <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Booking Status
              </th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>

          <tbody>
            {serviceBookings.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-slate-400"
                >
                  No booking payments found.
                </td>
              </tr>
            ) : (
              serviceBookings.map((booking) => (
                <BookingPaymentRow
                  key={booking.id}
                  booking={booking}
                  copiedId={copiedId}
                  onCopy={onCopy}
                  expandedRow={expandedRow}
                  onToggleRow={onToggleRow}
                  checkingId={checkingId}
                  transactionResult={transactionResults[booking.id]}
                  onCheckTransaction={onCheckTransaction}
                  onCloseTransactionResult={onCloseTransactionResult}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <BookingTableFooter
        serviceBookings={serviceBookings}
        pagination={pagination}
        onPrevious={onPrevious}
        onNext={onNext}
        disablePrevious={disablePrevious}
        disableNext={disableNext}
      />
    </div>
  );
}
