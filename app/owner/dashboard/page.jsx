"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  Activity,
  Calendar,
  ArrowUpRight,
  Command,
  Bell,
  Search,
  ChevronRight,
  MoreHorizontal,
  Landmark,
  AlertCircle,
  CheckCircle2,
  Loader2,
  DollarSign,
  Wallet,
  ArrowDownCircle,
} from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import CompanyLoyout from "../CompanyLoyout";
import ContentLoader from "../../../Components/ContentLoader";
import usePaymentAccountStore from "../../store/payment-account/payment-accountStore";
import { useServiceBookingStore } from "../../store/useServiceBookingStore";
import { useOwnerGuard } from "../../hooks/useOwnerGuard";
import ServiceBookingListener from "../../../Components/realtime/ServiceBookingListener";

export default function OwnerDashboard() {
  const { ownerId, authUser, initialized } = useOwnerGuard();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const loadUser = useAuthStore((s) => s.loadUser);

  const {
    hasBankAccount,
    paymentAccount,
    message: bankMessage,
    loading: bankLoading,
    checkCompanyBankAccount,
  } = usePaymentAccountStore();
  const { serviceBookings, fetchServiceBookingsByOwner, pagination } =
    useServiceBookingStore();

  const [showFullLoader, setShowFullLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hidePaymentWarning, setHidePaymentWarning] = useState(false);

  useEffect(() => {
    if (ownerId) {
      fetchServiceBookingsByOwner(ownerId);
    }
  }, [ownerId, fetchServiceBookingsByOwner]);

  // --- FINANCIAL CALCULATIONS LOGIC ---
  const stats = useMemo(() => {
    // 1. Calculate Monthly Revenue (Sum of paid amounts)
    const revenue = mockBookings
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + parseFloat(b.amount), 0);

    // 2. Count Total Payouts (Number of paid transactions)
    const payoutCount = mockBookings.filter((b) => b.status === "paid").length;

    // 3. Calculate Pending Payouts (Sum of pending amounts)
    const pending = mockBookings
      .filter((b) => b.status === "pending")
      .reduce((sum, b) => sum + parseFloat(b.amount), 0);

    return { revenue, payoutCount, pending };
  }, []);

  useEffect(() => {
    if (!user) loadUser();
    const timer = setTimeout(() => setShowFullLoader(false), 1200);
    return () => clearTimeout(timer);
  }, [user, loadUser]);

  useEffect(() => {
    if (user?.id) {
      checkCompanyBankAccount(user.id);
    }
  }, [user?.id, checkCompanyBankAccount]);

  if (!user) return null;

  const shouldShowPaymentWarning =
    !bankLoading && !hasBankAccount && !hidePaymentWarning;

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
          {/* Header */}
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 text-nowrap">
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
                  placeholder="Search transactions..."
                  className="w-64 rounded-xl border-none bg-slate-100/50 py-2.5 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                />
              </div>
              <button className="relative rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition-all">
                <Bell size={18} className="text-slate-600" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
              </button>
            </div>
          </div>

          {/* Warning Banner */}
          {shouldShowPaymentWarning && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 rounded-[2rem] border border-amber-200 bg-amber-50/50 p-6 backdrop-blur-sm shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm border border-amber-100">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-amber-700">
                    Setup Payout Account
                  </h3>
                  <p className="mt-1 text-sm font-medium text-amber-700/70 max-w-xl">
                    Connect your bank account to start receiving your $
                    {stats.revenue.toLocaleString()} monthly revenue.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/owner/create/payment-account")}
                className="rounded-2xl bg-slate-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600 active:scale-95 shadow-lg shadow-slate-200"
              >
                Add Account
              </button>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* 1. MONTHLY REVENUE */}
            <StatCard
              title="Monthly Revenue"
              value={`$${stats.revenue.toLocaleString()}`}
              trend="+14.2%"
              icon={DollarSign}
              chartColor="#10b981"
              isCurrency={true}
            />

            {/* 2. PAYOUT COUNT */}
            <StatCard
              title="Total Payouts"
              value={stats.payoutCount}
              trend="Completed"
              icon={ArrowDownCircle}
              chartColor="#6366f1"
            />

            {/* 3. PENDING PAYOUTS */}
            <StatCard
              title="Pending Payout"
              value={`$${stats.pending.toLocaleString()}`}
              trend="In Queue"
              icon={Wallet}
              chartColor="#f59e0b"
              isCurrency={true}
            />

            {/* 4. PERFORMANCE/CUSTOMERS */}
            <StatCard
              title="Total Customers"
              value="1,284"
              trend="+12%"
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
                    <h3 className="font-bold text-slate-900">Financial Log</h3>
                    <p className="text-xs font-medium text-slate-400">
                      Showing recent transactions
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <>
                  <ServiceBookingListener
                    onNewBooking={(booking) => {
                      toast.success(
                        `New booking received #BK-00${booking?.id || ""}`
                      );

                      if (ownerId) {
                        fetchServiceBookingsByOwner(ownerId, {
                          page,
                          per_page: PER_PAGE,
                        });
                      }
                    }}
                  />

                  {serviceBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      name={booking.user?.name}
                      service={booking.service?.name}
                      date={booking.booking_date}
                      time={booking.booking_hours}
                      status={booking.payment?.[0]?.status || "pending"}
                      amount={booking.payment?.[0]?.final_amount || "0.00"}
                    />
                  ))}
                </>
              </div>
            </div>

            <div className="space-y-6">
              {/* Payout Insights Sidebar */}
              <div className="rounded-[2.5rem] border border-slate-100 bg-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Withdrawal Readiness
                  </h3>
                  <Landmark size={18} className="text-slate-500" />
                </div>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span>Net Earnings (92%)</span>
                      <span className="text-emerald-400">
                        ${(stats.revenue * 0.92).toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: "92%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2 text-slate-400">
                      <span>Platform Fee (8%)</span>
                      <span>${(stats.revenue * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500"
                        style={{ width: "8%" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">
                    Target Account
                  </p>
                  <p className="text-sm font-bold text-white truncate">
                    {hasBankAccount
                      ? paymentAccount?.bank_name
                      : "No account linked"}
                  </p>
                </div>
              </div>

              <div className="rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50 p-8 text-center">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <TrendingUp className="text-indigo-600" size={20} />
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">
                  Revenue Forecast
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Based on current trends, your month-end revenue is expected to
                  hit <span className="font-bold text-indigo-600">$52k</span>.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </CompanyLoyout>
  );
}

// Sub-components
function StatCard({ title, value, trend, icon: Icon, chartColor, isCurrency }) {
  return (
    <div className="group rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-sm transition-all hover:shadow-xl">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          <Icon size={24} />
        </div>
        <span className="bg-slate-50 text-slate-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">
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
          <div className="flex gap-1 h-8 items-end pb-1">
            {[4, 7, 5, 9, 6].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-slate-100"
                style={{
                  height: `${h * 10}%`,
                  backgroundColor: i === 4 ? chartColor : "",
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
    <div className="group flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
          {name?.[0] || "?"}
        </div>

        <div>
          <h4 className="text-sm font-black text-slate-800">
            {name || "Unknown customer"}
          </h4>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            {service}
          </p>

          <p className="text-[10px] font-bold text-slate-400">
            {date} • {time}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-black text-slate-900">${amount}</p>

          <span
            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
              isPaid
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-amber-50 text-amber-600 border-amber-100"
            }`}
          >
            {status}
          </span>
        </div>

        <ChevronRight
          size={18}
          className="text-slate-300 group-hover:text-indigo-600 transition-all"
        />
      </div>
    </div>
  );
}

function ProgressItem({ label, percentage, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span className="text-slate-900">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
}

const mockBookings = [
  {
    name: "Sokha Mean",
    service: "Full Body Spa",
    date: "Oct 28, 2023",
    time: "02:00 PM",
    amount: "85.00",
    status: "paid",
  },
  {
    name: "John Smith",
    service: "Hair Styling",
    date: "Oct 28, 2023",
    time: "04:30 PM",
    amount: "45.00",
    status: "paid",
  },
  {
    name: "Linda Chen",
    service: "Nail Art Luxe",
    date: "Oct 29, 2023",
    time: "09:00 AM",
    amount: "120.00",
    status: "paid",
  },
  {
    name: "James Wilson",
    service: "Skin Consultation",
    date: "Oct 29, 2023",
    time: "11:30 AM",
    amount: "50.00",
    status: "pending",
  },
];
