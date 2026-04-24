"use client";

import React from "react";
import {
  CreditCard,
  Hash,
  Calendar,
  MapPin,
  ClipboardList,
  Tag,
  Package,
  User,
  Home,
  Navigation,
  Layers,
  ShoppingCart,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";

import InfoRow from "./InfoRow";
import PaymentCheckOverlay from "../../../PaymentCheckOverlay";
import { fmt, fmtTime } from "./bookingPaymentUtils";

export default function ExpandedBookingRow({
  booking,
  onCheckTransaction,
  checkingId,
  transactionResult,
  onCloseTransactionResult,
}) {
  const pmt = booking.payment?.[0] ?? null;
  const isChecking = checkingId === booking.id;

  return (
    <tr>
      <td colSpan={7} className="border-b border-slate-100 px-0 py-0">
        <div className="grid grid-cols-1 gap-4 border-t border-slate-100 bg-slate-50/80 px-6 py-4 text-xs md:grid-cols-4">
          <div className="space-y-2">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Location
            </p>

            <InfoRow
              icon={Home}
              label="Street / House"
              value={`St. ${booking.street_number}, No. ${booking.house_number}`}
            />

            <InfoRow
              icon={MapPin}
              label="Full Address"
              value={booking.address}
            />

            <InfoRow
              icon={Navigation}
              label="Coordinates"
              value={`${booking.latitude}, ${booking.longitude}`}
              mono
            />

            {booking.map_url && (
              <InfoRow
                icon={ExternalLink}
                label="Map Link"
                value="Open in Maps"
                link={booking.map_url}
              />
            )}
          </div>

          <div className="space-y-2">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Booking Details
            </p>

            <InfoRow
              icon={ShoppingCart}
              label="Quantity"
              value={`${booking.quantity} unit${booking.quantity > 1 ? "s" : ""}`}
            />

            <InfoRow
              icon={Layers}
              label="Category"
              value={booking.service?.category?.name}
            />

            <InfoRow
              icon={Package}
              label="Type"
              value={booking.service?.type?.name}
            />

            {booking.notes && (
              <InfoRow
                icon={ClipboardList}
                label="Notes"
                value={booking.notes}
              />
            )}
          </div>

          <div className="space-y-2">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Timeline
            </p>

            <InfoRow
              icon={Calendar}
              label="Created At"
              value={fmt(booking.created_at)}
            />

            <InfoRow
              icon={Calendar}
              label="Updated At"
              value={fmt(booking.updated_at)}
            />

            {booking.customer_completed_at && (
              <InfoRow
                icon={CheckCircle2}
                label="Completed At"
                value={`${fmt(booking.customer_completed_at)} ${fmtTime(
                  booking.customer_completed_at
                )}`}
              />
            )}

            {booking.auto_complete_at && (
              <InfoRow
                icon={Clock}
                label="Auto-complete"
                value={fmt(booking.auto_complete_at)}
              />
            )}
          </div>

          <div className="space-y-2">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Payment Details
            </p>

            {pmt ? (
              <>
                <InfoRow
                  icon={Hash}
                  label="Transaction ID"
                  value={pmt.transaction_id}
                  mono
                />

                <div className="relative mt-2 flex flex-col items-center">
                  {(isChecking || transactionResult) && (
                    <PaymentCheckOverlay
                      isChecking={isChecking}
                      transactionResult={transactionResult}
                      onClose={() => onCloseTransactionResult?.(booking.id)}
                    />
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCheckTransaction(booking.id, pmt.transaction_id);
                    }}
                    className="rounded border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-medium text-indigo-600 hover:bg-indigo-100"
                  >
                    Check Payment
                  </button>
                </div>

                <InfoRow
                  icon={User}
                  label="User ID / Owner ID"
                  value={`#${pmt.user_id} / #${pmt.owner_id}`}
                />

                <InfoRow
                  icon={Tag}
                  label="Coupon ID"
                  value={pmt.coupons_id ? `#${pmt.coupons_id}` : "None"}
                />

                <InfoRow
                  icon={CreditCard}
                  label="Method"
                  value={pmt.method?.toUpperCase()}
                />
              </>
            ) : (
              <div className="flex items-center gap-2 text-[11px] italic text-slate-400">
                <AlertTriangle size={12} />
                No payment record yet
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}