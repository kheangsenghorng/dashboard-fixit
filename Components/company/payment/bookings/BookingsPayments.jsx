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
  Home,
  Navigation,
  Layers,
  ShoppingCart,
  ExternalLink,
  AlertTriangle,
  Ban,
  Banknote,
} from "lucide-react";
import { useOwnerGuard } from "../../../../app/hooks/useOwnerGuard";
import { useServiceBookingStore } from "../../../../app/store/useServiceBookingStore";
import ServiceBookingListener from "../../../realtime/ServiceBookingListener";
import useServicePaymentKhqrStore from "../../../../app/store/khqr/useServicePaymentKhqrStore";
import PaymentCheckOverlay from "../../../PaymentCheckOverlay";

const cn = (...c) => c.filter(Boolean).join(" ");

const fmt = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const fmtTime = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const BOOKING_STATUS = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    dot: "bg-amber-400",
    pulse: true,
    icon: Clock,
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
    pulse: false,
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    dot: "bg-rose-400",
    pulse: false,
    icon: Ban,
  },
};

const PAYMENT_STATUS = {
  paid: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  refunded: {
    label: "Refunded",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
  },
  unpaid: {
    label: "Unpaid",
    bg: "bg-slate-100",
    text: "text-slate-500",
    ring: "ring-slate-200",
  },
};

const StatusBadge = ({ config }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset",
      config?.bg,
      config?.text,
      config?.ring
    )}
  >
    {config?.dot && (
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          config.dot,
          config.pulse && "animate-pulse"
        )}
      />
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

const ExpandedRow = ({
  booking,
  onCheckTransaction,
  checkingId,
  transactionResult,
  onCloseTransactionResult,
}) => {
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
              value={`${booking.quantity} unit${
                booking.quantity > 1 ? "s" : ""
              }`}
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
};

export default function BookingPaymentPage() {
  const { ownerId, authUser, initialized } = useOwnerGuard();
  const {
    fetchServiceBookingsByOwner,
    serviceBookings,
    pagination,
    loading,
    error,
  } = useServiceBookingStore();
  const { checkTransactionByExternalRef } = useServicePaymentKhqrStore();

  const [copiedId, setCopiedId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [transactionResults, setTransactionResults] = useState({});
  const [checkingId, setCheckingId] = useState(null);
  const [paymentCheckMessage, setPaymentCheckMessage] = useState(null);

  useEffect(() => {
    if (!ownerId) return;
    fetchServiceBookingsByOwner(ownerId);
  }, [ownerId, fetchServiceBookingsByOwner]);

  const totalBookings = pagination?.total || serviceBookings.length;
  const pendingCount = serviceBookings.filter(
    (b) => b.booking_status === "pending"
  ).length;
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

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleCheckTransaction = async (bookingId, transactionId) => {
    try {
      setCheckingId(bookingId);
      setPaymentCheckMessage(null);

      const result = await checkTransactionByExternalRef(transactionId);
      console.log("normalized result:", result);

      setTransactionResults((prev) => ({
        ...prev,
        [bookingId]: result,
      }));

      if (result?.responseCode === 0) {
        setPaymentCheckMessage({
          type: "success",
          text: `Payment Success • ${result?.data?.amount} ${result?.data?.currency}`,
        });
      } else {
        setPaymentCheckMessage({
          type: "error",
          text: result?.responseMessage || "Payment check failed",
        });
      }
    } catch (error) {
      setPaymentCheckMessage({
        type: "error",
        text:
          error?.response?.data?.data?.responseMessage ||
          error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to check payment",
      });
    } finally {
      setCheckingId(null);

      setTimeout(() => {
        setPaymentCheckMessage(null);
      }, 3000);
    }
  };
  const STATS = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Payments Received",
      value: paidCount,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: Banknote,
      color: "text-slate-700",
      bg: "bg-slate-100",
    },
  ];

  if (!initialized) return null;
  if (!authUser) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading booking payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
            <AlertTriangle className="h-6 w-6 text-rose-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Failed to load bookings
          </h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            onClick={() => ownerId && fetchServiceBookingsByOwner(ownerId)}
            className="mt-5 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/40 p-4 font-sans antialiased md:p-8">
      <ServiceBookingListener />
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-indigo-500" />
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Bookings & Payments
              </h1>
            </div>
            <p className="pl-3 text-sm text-slate-500">
              Full transaction and service booking overview
            </p>
          </div>

          <button className="flex h-9 self-start items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50">
            <Download size={14} />
            Export CSV
          </button>
        </div>
        <div className="mx-auto max-w-7xl space-y-6">
          {paymentCheckMessage && (
            <div className="fixed left-1/2 top-6 z-50 w-full max-w-md -translate-x-1/2 px-4">
              <div
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-center text-sm font-semibold shadow-xl backdrop-blur-sm transition-all duration-300",
                  paymentCheckMessage.type === "success"
                    ? "border-emerald-200 bg-emerald-50/95 text-emerald-700"
                    : "border-rose-200 bg-rose-50/95 text-rose-700"
                )}
              >
                {paymentCheckMessage.type === "success" ? (
                  <CheckCircle2 size={18} className="shrink-0" />
                ) : (
                  <AlertTriangle size={18} className="shrink-0" />
                )}

                <span>{paymentCheckMessage.text}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {STATS.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {label}
                </span>
                <div className={cn("rounded-lg p-2", bg)}>
                  <Icon size={15} className={color} />
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

                    const bkConfig =
                      BOOKING_STATUS[booking.booking_status] ||
                      BOOKING_STATUS.pending;

                    const isExpanded = expandedRow === booking.id;

                    return (
                      <React.Fragment key={booking.id}>
                        <tr
                          className={cn(
                            "cursor-pointer border-b border-slate-100 transition-colors",
                            isExpanded
                              ? "bg-indigo-50/30"
                              : "hover:bg-slate-50/60"
                          )}
                          onClick={() => toggleRow(booking.id)}
                        >
                          <td className="px-5 py-4 align-top">
                            <div className="space-y-1">
                              <span className="rounded border border-indigo-100 bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-600">
                                #BK-00{booking.id}
                              </span>
                              <div className="flex items-center gap-1 pt-0.5 text-[11px] text-slate-500">
                                <Calendar
                                  size={11}
                                  className="text-slate-400"
                                />
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
                                        <Tag
                                          size={9}
                                          className="text-indigo-400"
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(pmt.transaction_id);
                                  }}
                                  className="group flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[9px] text-slate-400 transition-all hover:bg-slate-100 active:scale-95"
                                >
                                  <Hash size={9} />
                                  {pmt.transaction_id?.substring(0, 12)}...
                                  {copiedId === pmt.transaction_id ? (
                                    <Check
                                      size={9}
                                      className="text-emerald-500"
                                    />
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRow(booking.id);
                              }}
                              className={cn(
                                "inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                                isExpanded
                                  ? "rotate-180 bg-indigo-100 text-indigo-600"
                                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                              )}
                            >
                              <ChevronDown size={14} />
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <ExpandedRow
                            booking={booking}
                            onCheckTransaction={handleCheckTransaction}
                            checkingId={checkingId}
                            transactionResult={transactionResults[booking.id]}
                            onCloseTransactionResult={(bookingId) => {
                              setTransactionResults((prev) => ({
                                ...prev,
                                [bookingId]: null,
                              }));
                            }}
                          />
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-5 py-3.5">
            <p className="text-[11px] font-medium text-slate-400">
              Showing {serviceBookings.length} of{" "}
              {pagination?.total || serviceBookings.length} records
            </p>

            <div className="flex items-center gap-2">
              <button className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50">
                Previous
              </button>
              <button className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
