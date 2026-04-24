"use client";

import React, { useState, useEffect } from "react";
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
  X,
} from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import CompanyLoyout from "../CompanyLoyout";
import ContentLoader from "../../../Components/ContentLoader";
import usePaymentAccountStore from "../../store/payment-account/payment-accountStore";

export default function OwnerDashboard() {
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

  const [showFullLoader, setShowFullLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hidePaymentWarning, setHidePaymentWarning] = useState(false);

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

  useEffect(() => {
    if (hasBankAccount) {
      setHidePaymentWarning(true);
    }
  }, [hasBankAccount]);

  if (!user) return null;

  const shouldShowPaymentWarning =
    !bankLoading && !hasBankAccount && !hidePaymentWarning;

  const filteredBookings = mockBookings.filter((booking) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      booking.name.toLowerCase().includes(query) ||
      booking.service.toLowerCase().includes(query) ||
      booking.status.toLowerCase().includes(query)
    );
  });

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
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                    Administrative Node
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
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search bookings..."
                  className="w-64 rounded-xl border-none bg-slate-100/50 py-2.5 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className="relative rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50"
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
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-4 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-amber-700">
                    Payment account required
                  </h3>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-amber-700/80">
                    {bankMessage ||
                      "You do not have a payment account yet. Add one now so you can receive payouts."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:shrink-0">
                <button
                  type="button"
                  onClick={() => router.push("/owner/create/payment-account")}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-indigo-600"
                >
                  Add payment account
                </button>
                
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Customers"
              value="1,284"
              trend="+12.5%"
              icon={Users}
              chartColor="#4F46E5"
            />
            <StatCard
              title="Monthly Revenue"
              value="$42.8k"
              trend="+4.2%"
              icon={TrendingUp}
              chartColor="#10B981"
            />
            <StatCard
              title="Conversion"
              value="24.5%"
              trend="+1.2%"
              icon={Activity}
              chartColor="#F59E0B"
            />
             <StatCard
              title="Conversion"
              value="24.5%"
              trend="+1.2%"
              icon={Activity}
              chartColor="#F59E0B"
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
                    <h3 className="font-bold text-slate-900">
                      Upcoming Schedule
                    </h3>
                    <p className="text-xs font-medium text-slate-400">
                      {filteredBookings.length} booking
                      {filteredBookings.length === 1 ? "" : "s"} shown
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/company/calendar")}
                  className="rounded-lg px-4 py-2 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-50"
                >
                  View full calendar
                </button>
              </div>

              <div className="p-2">
                <div className="overflow-hidden">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <BookingItem
                        key={`${booking.name}-${booking.time}`}
                        {...booking}
                      />
                    ))
                  ) : (
                    <div className="p-10 text-center">
                      <p className="text-sm font-semibold text-slate-700">
                        No bookings found
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Try another customer, service, or status.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                    Live Insights
                  </h3>
                  <MoreHorizontal size={18} className="text-slate-400" />
                </div>
                <div className="space-y-8">
                  <ProgressItem
                    label="Booking Capacity"
                    percentage={65}
                    color="bg-indigo-600"
                  />
                  <ProgressItem
                    label="Client Satisfaction"
                    percentage={92}
                    color="bg-emerald-500"
                  />
                  <ProgressItem
                    label="Payment Readiness"
                    percentage={hasBankAccount ? 100 : 45}
                    color={hasBankAccount ? "bg-emerald-500" : "bg-amber-500"}
                  />
                </div>
              </div>

              <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-slate-50 p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                    <ArrowUpRight size={14} className="text-indigo-600" />
                  </div>
                  <span className="text-xs font-bold uppercase text-slate-900">
                    Optimization Tip
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-500">
                  Your peak booking time is{" "}
                  <span className="font-bold text-slate-900">
                    2 PM on Fridays
                  </span>
                  . Consider launching happy-hour promos then.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </CompanyLoyout>
  );
}

function StatCard({ title, value, trend, icon: Icon, chartColor }) {
  return (
    <div className="group rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600">
          {trend}
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
          {title}
        </p>
        <div className="flex items-end gap-2">
          <h4 className="text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h4>
          <div className="flex h-6 items-end gap-1 pb-1 opacity-20 transition-opacity group-hover:opacity-100">
            {[40, 70, 45, 90, 65].map((height, index) => (
              <div
                key={index}
                className="w-1 rounded-full bg-slate-300"
                style={{ height: `${height}%`, backgroundColor: chartColor }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BankStatusCard({
  hasBankAccount,
  paymentAccount,
  bankMessage,
  bankLoading,
  onSetup,
}) {
  const statusLabel = hasBankAccount ? "Connected" : "Action Required";
  const bankName =
    paymentAccount?.bank_name || paymentAccount?.bankName || "Payment account";
  const accountName =
    paymentAccount?.account_name ||
    paymentAccount?.accountName ||
    "Not configured";

  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
          <Landmark size={24} />
        </div>

        <div
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold ${
            hasBankAccount
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {bankLoading ? <Loader2 size={12} className="animate-spin" /> : null}
          {bankLoading ? "Checking" : statusLabel}
        </div>
      </div>

      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
        Payment Account
      </p>

      <div className="flex items-start gap-2">
        {hasBankAccount ? (
          <CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={18} />
        ) : (
          <AlertCircle className="mt-1 shrink-0 text-amber-500" size={18} />
        )}
        <div>
          <h4 className="text-lg font-bold tracking-tight text-slate-900">
            {hasBankAccount ? bankName : "Setup needed"}
          </h4>
          <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">
            {hasBankAccount
              ? accountName
              : bankMessage || "Connect a payment account to receive payouts."}
          </p>
        </div>
      </div>

      {!hasBankAccount && !bankLoading && (
        <button
          type="button"
          onClick={onSetup}
          className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-indigo-600"
        >
          Add payment account
        </button>
      )}
    </div>
  );
}

function BookingItem({ name, service, date, time, status, amount }) {
  const paid = status === "paid";

  return (
    <div className="group flex cursor-pointer items-center justify-between rounded-3xl p-6 transition-all hover:bg-slate-50/80">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-bold text-slate-500">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">{name}</h4>
          <p className="text-xs font-medium text-slate-500">{service}</p>
        </div>
      </div>

      <div className="hidden text-center md:block">
        <p className="text-xs font-bold text-slate-900">{date}</p>
        <p className="text-[10px] font-black uppercase text-indigo-600">
          {time}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-slate-900">${amount}</p>
          <span
            className={`text-[10px] font-bold uppercase ${
              paid ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            {paid ? "Paid" : "Pending"}
          </span>
        </div>
        <div className="rounded-xl bg-slate-50 p-2 text-slate-400 transition-all group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ label, percentage, color }) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <span className="text-xs font-bold uppercase tracking-tighter text-slate-500">
          {label}
        </span>
        <span className="text-sm font-black text-slate-900">{percentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
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
    amount: "0.00",
    status: "pending",
  },
];
