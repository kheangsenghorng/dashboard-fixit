"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Clock,
  CheckCircle2,
  Download,
  Hash,
  Calendar,
  Copy,
  Check,
  MapPin,
  ClipboardList,
  Tag,
  Package,
  ChevronDown,
  User,
  ShoppingCart,
  ExternalLink,

  Banknote,
  ReceiptText, // New icon

} from "lucide-react";
import { useOwnerGuard } from "../../../../app/hooks/useOwnerGuard";
import { useServiceBookingStore } from "../../../../app/store/useServiceBookingStore";
import ServiceBookingListener from "../../../realtime/ServiceBookingListener";

const cn = (...c) => c.filter(Boolean).join(" ");

const fmt = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PAYMENT_STATUS = {
  paid: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    dot: "bg-amber-400",
  },
  refunded: {
    label: "Refunded",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    dot: "bg-blue-400",
  },
  unpaid: {
    label: "Unpaid",
    bg: "bg-slate-100",
    text: "text-slate-500",
    ring: "ring-slate-200",
    dot: "bg-slate-400",
  },
};

const StatusBadge = ({ config }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset",
      config?.bg,
      config?.text,
      config?.ring
    )}
  >
    {config?.dot && (
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", config.dot)} />
    )}
    {config?.label}
  </span>
);

const InfoRow = ({ icon: Icon, label, value, mono = false, link }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon size={12} className="mt-0.5 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1 text-[11px] text-indigo-600 hover:underline",
              mono && "font-mono"
            )}
          >
            {value} <ExternalLink size={10} />
          </a>
        ) : (
          <span
            className={cn(
              "break-all text-[11px] text-slate-700",
              mono && "font-mono"
            )}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

const ExpandedRow = ({ booking }) => {
  const pmt = booking.payment?.[0] ?? null;
  return (
    <tr>
      <td colSpan={7} className="border-b border-slate-100 px-0 py-0">
        <div className="grid grid-cols-1 gap-6 border-t border-slate-100 bg-slate-50/80 px-6 py-6 text-xs md:grid-cols-4">
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Transaction Breakdown
            </p>
            <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2 shadow-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-medium text-slate-700">
                  ${pmt?.original_amount || "0.00"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400">Discount</span>
                <span className="font-medium text-emerald-600">
                  -${pmt?.discount_amount || "0.00"}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-900">Total Paid</span>
                <span className="font-bold text-indigo-600 text-sm">
                  ${pmt?.final_amount || "0.00"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Payment Info
            </p>
            <InfoRow
              icon={CreditCard}
              label="Payment Method"
              value={pmt?.method?.toUpperCase() || "N/A"}
            />
            <InfoRow
              icon={Hash}
              label="Gateway Transaction ID"
              value={pmt?.transaction_id}
              mono
            />
            <InfoRow
              icon={Tag}
              label="Coupon Applied"
              value={
                pmt?.coupons_id ? `ID: #${pmt.coupons_id}` : "No promo code"
              }
            />
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Service Reference
            </p>
            <InfoRow
              icon={Package}
              label="Service Name"
              value={booking.service?.name}
            />
            <InfoRow
              icon={ShoppingCart}
              label="Quantity"
              value={`${booking.quantity} units`}
            />
            <InfoRow
              icon={Calendar}
              label="Booking Date"
              value={booking.booking_date}
            />
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Customer Details
            </p>
            <InfoRow
              icon={User}
              label="Payer Name"
              value={booking.user?.name}
            />
            <InfoRow
              icon={MapPin}
              label="Service Location"
              value={booking.address}
            />
            <InfoRow
              icon={Clock}
              label="Status at Payment"
              value={booking.booking_status}
            />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default function PaymentHistoryPage() {
  const { ownerId, authUser, initialized } = useOwnerGuard();
  const {
    fetchServiceBookingsByOwner,
    serviceBookings,
    pagination,
    loading,
    error,
  } = useServiceBookingStore();
  const [copiedId, setCopiedId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    if (ownerId) fetchServiceBookingsByOwner(ownerId);
  }, [ownerId, fetchServiceBookingsByOwner]);

  const totalBookings = pagination?.total || serviceBookings.length;
  const paidCount = serviceBookings.filter((b) =>
    (b.payment || []).some((p) => p.status === "paid")
  ).length;
  const totalRevenue = serviceBookings.reduce((sum, b) => {
    const p = (b.payment || []).find((item) => item.status === "paid");
    return sum + (p ? parseFloat(p.final_amount || 0) : 0);
  }, 0);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const STATS = [
    {
      label: "Total Transactions",
      value: totalBookings,
      icon: ReceiptText,
      color: "text-slate-600",
      bg: "bg-slate-100",
    },
    {
      label: "Successful Payments",
      value: paidCount,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Net Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: Banknote,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Pending Payouts",
      value: `$${(totalRevenue * 0.1).toFixed(2)}`,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  if (!initialized || !authUser) return null;
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading payment history...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/40 p-4 font-sans antialiased md:p-8">
      <ServiceBookingListener />
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Payment History
            </h1>
            <p className="text-sm text-slate-500">
              Monitor your earnings and transaction logs
            </p>
          </div>
          <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50">
            <Download size={14} /> Export History
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {label}
                </span>
                <div className={cn("rounded-lg p-2", bg)}>
                  <Icon size={16} className={color} />
                </div>
              </div>
              <p className={cn("text-2xl font-bold", color)}>{value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Date & Reference
                  </th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Payer
                  </th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Transaction ID
                  </th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Method
                  </th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody>
                {serviceBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-slate-400"
                    >
                      No payment history found.
                    </td>
                  </tr>
                ) : (
                  serviceBookings.map((booking) => {
                    const pmt =
                      (booking.payment || []).find(
                        (p) => p.status === "paid"
                      ) ??
                      booking.payment?.[0] ??
                      null;
                    const pmtConfig = pmt
                      ? PAYMENT_STATUS[pmt.status] || PAYMENT_STATUS.unpaid
                      : PAYMENT_STATUS.unpaid;
                    const isExpanded = expandedRow === booking.id;

                    return (
                      <React.Fragment key={booking.id}>
                        <tr
                          className={cn(
                            "cursor-pointer border-b border-slate-100 transition-colors",
                            isExpanded
                              ? "bg-indigo-50/40"
                              : "hover:bg-slate-50/60"
                          )}
                          onClick={() =>
                            setExpandedRow(isExpanded ? null : booking.id)
                          }
                        >
                          <td className="px-5 py-4">
                            <div className="font-medium text-slate-900">
                              {fmt(booking.created_at)}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 uppercase">
                              REF: BK-{booking.id}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {booking.user?.name?.charAt(0)}
                              </div>
                              <span className="text-[13px] font-medium text-slate-700">
                                {booking.user?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {pmt ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(pmt.transaction_id);
                                }}
                                className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 hover:text-indigo-600"
                              >
                                {pmt.transaction_id?.substring(0, 10)}...
                                {copiedId === pmt.transaction_id ? (
                                  <Check
                                    size={10}
                                    className="text-emerald-500"
                                  />
                                ) : (
                                  <Copy size={10} />
                                )}
                              </button>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-[14px] font-bold text-slate-900">
                              ${pmt?.final_amount || "0.00"}
                            </div>
                            {parseFloat(pmt?.discount_amount) > 0 && (
                              <div className="text-[10px] text-emerald-600">
                                Saved ${pmt.discount_amount}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge config={pmtConfig} />
                          </td>
                          <td className="px-5 py-4 text-[11px] font-medium uppercase text-slate-500">
                            {pmt?.method || "—"}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <ChevronDown
                              size={16}
                              className={cn(
                                "text-slate-300 transition-transform",
                                isExpanded && "rotate-180 text-indigo-500"
                              )}
                            />
                          </td>
                        </tr>
                        {isExpanded && <ExpandedRow booking={booking} />}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-5 py-4">
            <p className="text-[11px] text-slate-400 font-medium">
              Page 1 of {Math.ceil(totalBookings / 10)}
            </p>
            <div className="flex gap-2">
              <button className="h-8 rounded border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50">
                Previous
              </button>
              <button className="h-8 rounded border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
