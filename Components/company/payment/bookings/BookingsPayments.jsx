"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Download,
  Clock,
  Package,
  AlertTriangle,
  Banknote,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useOwnerGuard } from "../../../../app/hooks/useOwnerGuard";
import { useServiceBookingStore } from "../../../../app/store/useServiceBookingStore";
import useServicePaymentKhqrStore from "../../../../app/store/khqr/useServicePaymentKhqrStore";
import ServiceBookingListener from "../../../realtime/ServiceBookingListener";

import BookingStats from "./BookingStats";
import BookingPaymentTable from "./BookingPaymentTable";

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
  const [page, setPage] = useState(1);

  const PER_PAGE = 10;

  useEffect(() => {
    if (!ownerId) return;

    fetchServiceBookingsByOwner(ownerId, {
      page,
      per_page: PER_PAGE,
    });
  }, [ownerId, page, fetchServiceBookingsByOwner]);

  const currentPage = pagination?.current_page || pagination?.page || page;
  const lastPage = pagination?.last_page || pagination?.total_pages || 1;

  const handlePrevious = () => {
    if (currentPage > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < lastPage) {
      setPage((prev) => prev + 1);
    }
  };

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

  const stats = [
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);

    toast.success("Transaction ID copied");

    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const handleCheckTransaction = async (bookingId, transactionId) => {
    try {
      setCheckingId(bookingId);

      const result = await checkTransactionByExternalRef(transactionId);

      setTransactionResults((prev) => ({
        ...prev,
        [bookingId]: result,
      }));

      if (result?.responseCode === 0) {
        toast.success(
          `Payment Success • ${result?.data?.amount} ${result?.data?.currency}`
        );
      } else {
        toast.error(result?.responseMessage || "Payment check failed");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.data?.responseMessage ||
          error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Payment check failed"
      );
    } finally {
      setCheckingId(null);
    }
  };

  const handleCloseTransactionResult = (bookingId) => {
    setTransactionResults((prev) => ({
      ...prev,
      [bookingId]: null,
    }));
  };

  const handleNewBooking = (booking) => {
    toast.success(`New booking received #BK-00${booking?.id || ""}`);

    if (ownerId) {
      fetchServiceBookingsByOwner(ownerId, {
        page,
        per_page: PER_PAGE,
      });
    }
  };

  const handleRetry = () => {
    if (!ownerId) return;

    fetchServiceBookingsByOwner(ownerId, {
      page,
      per_page: PER_PAGE,
    });
  };

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
            type="button"
            onClick={handleRetry}
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
      <ServiceBookingListener
        onNewBooking={(booking) => {
          toast.success(`New booking received #BK-00${booking?.id || ""}`);

          if (ownerId) {
            fetchServiceBookingsByOwner(ownerId, {
              page,
              per_page: PER_PAGE,
            });
          }
        }}
      />

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

          <button
            type="button"
            className="flex h-9 self-start items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>

        <BookingStats stats={stats} />

        <BookingPaymentTable
          serviceBookings={serviceBookings}
          pagination={pagination}
          copiedId={copiedId}
          onCopy={handleCopy}
          expandedRow={expandedRow}
          onToggleRow={toggleRow}
          checkingId={checkingId}
          transactionResults={transactionResults}
          onCheckTransaction={handleCheckTransaction}
          onCloseTransactionResult={handleCloseTransactionResult}
          onPrevious={handlePrevious}
          onNext={handleNext}
          disablePrevious={currentPage <= 1}
          disableNext={currentPage >= lastPage}
        />
      </div>
    </div>
  );
}
