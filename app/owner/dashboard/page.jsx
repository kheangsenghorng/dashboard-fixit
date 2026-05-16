"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  Calendar,
  Command,
  Bell,
  Search,
  ChevronRight,
  Landmark,
  AlertCircle,
  DollarSign,
  Wallet,
  ArrowDownCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAuthStore } from "../../store/useAuthStore";
import CompanyLoyout from "../CompanyLoyout";
import ContentLoader from "../../../Components/ContentLoader";
import usePaymentAccountStore from "../../store/payment-account/payment-accountStore";
import { useServiceBookingStore } from "../../store/useServiceBookingStore";
import { useOwnerGuard } from "../../hooks/useOwnerGuard";
import ServiceBookingListener from "../../../Components/realtime/ServiceBookingListener";
import useOwnerPayoutStore from "../../store/owner/ownerPayoutStore";

const PER_PAGE = 10;

const formatMoney = (value) => {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export default function OwnerDashboard() {
  const { ownerId } = useOwnerGuard();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const loadUser = useAuthStore((s) => s.loadUser);

  const {
    hasBankAccount,
    paymentAccount,
    loading: bankLoading,
    checkCompanyBankAccount,
  } = usePaymentAccountStore();

  const { serviceBookings, fetchServiceBookingsByOwner } =
    useServiceBookingStore();

  const {
    payouts,
    stats: payoutStats,
    loading: payoutLoading,
    statsLoading,
    fetchPayoutsByOwnerId,
    fetchStatsByOwnerId,
  } = useOwnerPayoutStore();

  const [showFullLoader, setShowFullLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hidePaymentWarning, setHidePaymentWarning] = useState(false);

  const currentMonth = useMemo(() => getCurrentMonth(), []);

  useEffect(() => {
    if (!user) {
      loadUser();
    }

    const timer = setTimeout(() => {
      setShowFullLoader(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [user, loadUser]);

  useEffect(() => {
    if (user?.id) {
      checkCompanyBankAccount(user.id);
    }
  }, [user?.id, checkCompanyBankAccount]);

  useEffect(() => {
    if (ownerId) {
      fetchServiceBookingsByOwner(ownerId, {
        page: 1,
        per_page: PER_PAGE,
      });

      fetchPayoutsByOwnerId(ownerId, {
        month: currentMonth,
        per_page: PER_PAGE,
      });

      fetchStatsByOwnerId(ownerId, {
        month: currentMonth,
      });
    }
  }, [
    ownerId,
    currentMonth,
    fetchServiceBookingsByOwner,
    fetchPayoutsByOwnerId,
    fetchStatsByOwnerId,
  ]);

  console.log(payoutStats);

  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) {
      return serviceBookings || [];
    }

    const query = searchQuery.toLowerCase();

    return (serviceBookings || []).filter((booking) => {
      const customerName = booking?.user?.name?.toLowerCase() || "";
      const serviceTitle =
        booking?.service?.title?.toLowerCase() ||
        booking?.service?.name?.toLowerCase() ||
        "";

      return customerName.includes(query) || serviceTitle.includes(query);
    });
  }, [serviceBookings, searchQuery]);

  const dashboardStats = useMemo(() => {
    const totalRevenue = Number(payoutStats?.paid_amount || 0);
    const pendingPayout = Number(payoutStats?.pending_amount || 0);
    const payoutCount = Number(payoutStats?.paid_count || 0);

    const uniqueCustomerIds = new Set(
      (serviceBookings || [])
        .map((booking) => booking?.user?.id || booking?.user_id)
        .filter(Boolean)
    );

    return {
      revenue: totalRevenue,
      pending: pendingPayout,
      payoutCount,
      totalCustomers: uniqueCustomerIds.size,
      netEarnings: totalRevenue * 0.9,
      platformFee: totalRevenue * 0.1,
    };
  }, [payoutStats, serviceBookings]);

  const shouldShowPaymentWarning =
    !bankLoading && !hasBankAccount && !hidePaymentWarning;

  if (!user) {
    return null;
  }

  return (
    <CompanyLoyout>
      <div className="relative min-h-screen bg-[#FDFDFD] font-sans selection:bg-indigo-100 selection:text-indigo-700">
        <AnimatePresence>
          {showFullLoader && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.8, ease: "circOut" },
              }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
            >
              <ContentLoader
                title="Terminal"
                subtitle="Initialising Secure Environment..."
                Icon={Command}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="mx-auto max-w-[1600px] space-y-8 p-6 lg:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5">
                  <span className="text-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                    Financial Node
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Welcome,{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  {user.name || "Owner"}
                </span>
                .
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden xl:block">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookings..."
                  className="w-64 rounded-xl border-none bg-slate-100/50 py-2.5 pl-10 pr-4 text-sm shadow-inner transition-all focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="button"
                className="relative rounded-xl border border-slate-200 bg-white p-3 transition-all hover:bg-slate-50"
              >
                <Bell size={18} className="text-slate-600" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
              </button>
            </div>
          </div>

          {shouldShowPaymentWarning && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 rounded-[2rem] border border-amber-200 bg-amber-50/50 p-6 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-100 bg-white text-amber-600 shadow-sm">
                  <AlertCircle size={24} />
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-amber-700">
                    Setup Payout Account
                  </h3>

                  <p className="mt-1 max-w-xl text-sm font-medium text-amber-700/70">
                    Connect your bank account to start receiving your $
                    {formatMoney(dashboardStats.revenue)} monthly revenue.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setHidePaymentWarning(true)}
                  className="rounded-2xl border border-amber-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-amber-700 transition-all hover:bg-amber-100"
                >
                  Hide
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/owner/create/payment-account")}
                  className="rounded-2xl bg-slate-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-slate-200 transition-all hover:bg-indigo-600 active:scale-95"
                >
                  Add Account
                </button>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Monthly Revenue"
              value={
                statsLoading
                  ? "Loading..."
                  : `$${formatMoney(dashboardStats.revenue)}`
              }
              trend="Paid"
              icon={DollarSign}
              chartColor="#10b981"
              isCurrency
            />

            <StatCard
              title="Total Payouts"
              value={statsLoading ? "Loading..." : dashboardStats.payoutCount}
              trend="Completed"
              icon={ArrowDownCircle}
              chartColor="#6366f1"
            />

            <StatCard
              title="Pending Payout"
              value={
                statsLoading
                  ? "Loading..."
                  : `$${formatMoney(dashboardStats.pending)}`
              }
              trend="In Queue"
              icon={Wallet}
              chartColor="#f59e0b"
              isCurrency
            />

            <StatCard
              title="Total Customers"
              value={dashboardStats.totalCustomers}
              trend="Active"
              icon={Users}
              chartColor="#8b5cf6"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-50 p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <Calendar size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">Booking Log</h3>
                    <p className="text-xs font-medium text-slate-400">
                      Showing recent bookings
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1 p-4">
                <ServiceBookingListener
                  onNewBooking={(booking) => {
                    toast.success(
                      `New booking received #BK-00${booking?.id || ""}`
                    );

                    if (ownerId) {
                      fetchServiceBookingsByOwner(ownerId, {
                        page: 1,
                        per_page: PER_PAGE,
                      });

                      fetchPayoutsByOwnerId(ownerId, {
                        month: currentMonth,
                        per_page: PER_PAGE,
                      });

                      fetchStatsByOwnerId(ownerId, {
                        month: currentMonth,
                      });
                    }
                  }}
                />

                {filteredBookings.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center">
                    <p className="text-sm font-bold text-slate-500">
                      No bookings found.
                    </p>
                  </div>
                ) : (
                  filteredBookings.map((booking) => {
                    const payment =
                      booking?.payments?.[0] ||
                      booking?.payment?.[0] ||
                      booking?.payment ||
                      null;

                    return (
                      <BookingItem
                        key={booking.id}
                        name={booking?.user?.name}
                        service={
                          booking?.service?.title ||
                          booking?.service?.name ||
                          "Unknown service"
                        }
                        date={booking?.booking_date}
                        time={booking?.booking_hours}
                        status={payment?.status || "pending"}
                        amount={
                          payment?.final_amount || payment?.amount || "0.00"
                        }
                      />
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-900 p-8 text-white shadow-xl">
                <div className="absolute right-0 top-0 -mr-12 -mt-12 h-24 w-24 rounded-full bg-white/5" />

                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Withdrawal Readiness
                  </h3>

                  <Landmark size={18} className="text-slate-500" />
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="mb-2 flex justify-between text-xs font-bold">
                      <span>Net Earnings 90%</span>
                      <span className="text-emerald-400">
                        ${formatMoney(dashboardStats.netEarnings)}
                      </span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[90%] bg-emerald-500" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-xs font-bold text-slate-400">
                      <span>Platform Fee 10%</span>
                      <span>${formatMoney(dashboardStats.platformFee)}</span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[10%] bg-rose-500" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/5 pt-8">
                  <p className="mb-1 text-[10px] font-black uppercase text-slate-500">
                    Target Account
                  </p>

                  <p className="truncate text-sm font-bold text-white">
                    {hasBankAccount
                      ? paymentAccount?.bank_name || "Bank account linked"
                      : "No account linked"}
                  </p>
                </div>
              </div>

              <div className="rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <TrendingUp className="text-indigo-600" size={20} />
                </div>

                <p className="mb-1 text-sm font-bold text-slate-900">
                  Revenue Forecast
                </p>

                <p className="text-xs leading-relaxed text-slate-500">
                  Current paid payout this month is{" "}
                  <span className="font-bold text-indigo-600">
                    ${formatMoney(dashboardStats.revenue)}
                  </span>
                  .
                </p>
              </div>

              <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-400">
                  Recent Payouts
                </h3>

                {payoutLoading ? (
                  <p className="text-sm font-bold text-slate-500">
                    Loading payouts...
                  </p>
                ) : payouts.length === 0 ? (
                  <p className="text-sm font-bold text-slate-500">
                    No payout this month.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {payouts.slice(0, 5).map((payout) => (
                      <div
                        key={payout.id}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                      >
                        <div>
                          <p className="text-sm font-black text-slate-800">
                            #{payout.id}
                          </p>
                          <p className="text-[10px] font-bold uppercase text-slate-400">
                            {payout.status}
                          </p>
                        </div>

                        <p className="text-sm font-black text-slate-900">
                          ${formatMoney(payout.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </CompanyLoyout>
  );
}

function StatCard({ title, value, trend, icon: Icon, chartColor, isCurrency }) {
  return (
    <div className="group rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-sm transition-all hover:shadow-xl">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
          <Icon size={24} />
        </div>

        <span className="rounded-lg bg-slate-50 px-2 py-1 text-[9px] font-black uppercase tracking-tighter text-slate-600">
          {trend}
        </span>
      </div>

      <div>
        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {title}
        </p>

        <div className="flex items-end justify-between">
          <h4
            className={`text-3xl font-black tracking-tighter text-slate-900 ${
              isCurrency ? "font-mono" : ""
            }`}
          >
            {value}
          </h4>

          <div className="flex h-8 items-end gap-1 pb-1">
            {[4, 7, 5, 9, 6].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-slate-100"
                style={{
                  height: `${h * 10}%`,
                  backgroundColor: i === 4 ? chartColor : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingItem({ name, service, date, time, status, amount }) {
  const isPaid = status === "paid";

  return (
    <div className="group flex cursor-pointer items-center justify-between rounded-3xl border border-transparent p-4 transition-all hover:border-slate-100 hover:bg-slate-50">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
          {name?.[0] || "?"}
        </div>

        <div>
          <h4 className="text-sm font-black text-slate-800">
            {name || "Unknown customer"}
          </h4>

          <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
            {service || "Unknown service"}
          </p>

          <p className="text-[10px] font-bold text-slate-400">
            {date || "No date"} • {time || "No time"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-black text-slate-900">
            ${formatMoney(amount)}
          </p>

          <span
            className={`rounded-md border px-2 py-0.5 text-[9px] font-black uppercase ${
              isPaid
                ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                : "border-amber-100 bg-amber-50 text-amber-600"
            }`}
          >
            {status || "pending"}
          </span>
        </div>

        <ChevronRight
          size={18}
          className="text-slate-300 transition-all group-hover:text-indigo-600"
        />
      </div>
    </div>
  );
}
