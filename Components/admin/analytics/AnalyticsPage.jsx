"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAnalyticsStore } from "../../../app/store/analytics/useAnalyticsStore";
import {
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Activity,
  ChevronRight,
} from "lucide-react";

const timeframeOptions = [
  { label: "Last 7 Days", days: 7 },
  { label: "Last 30 Days", days: 30 },
  { label: "Last 90 Days", days: 90 },
  { label: "Year to Date", days: 365 },
];

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatNumber = (value) => Number(value || 0).toLocaleString();

const formatCurrency = (value) => {
  return `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const getChangeInfo = (change) => {
  const value = Number(change || 0);
  return {
    trend: value >= 0 ? "up" : "down",
    label: `${value >= 0 ? "+" : ""}${value}%`,
  };
};

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("Last 30 Days");
  const {
    cards,
    revenueForecast,
    topServices,
    loading,
    error,
    fetchAnalyticsOverview,
  } = useAnalyticsStore();

  const selectedDays = useMemo(() => {
    return (
      timeframeOptions.find((item) => item.label === timeframe)?.days || 30
    );
  }, [timeframe]);

  useEffect(() => {
    fetchAnalyticsOverview({ days: selectedDays });
  }, [selectedDays, fetchAnalyticsOverview]);

  const stats = useMemo(() => {
    const data = [
      {
        key: "total_revenue",
        icon: DollarSign,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
      },
      {
        key: "active_users",
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
      },
      {
        key: "services_completed",
        icon: Briefcase,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-100",
      },
      {
        key: "provider_growth",
        icon: TrendingUp,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
      },
    ];

    return data.map((item) => {
      const card = cards?.[item.key];
      const change = getChangeInfo(card?.change_percent);
      return {
        ...item,
        name: card?.label || "Metric",
        value:
          item.key === "total_revenue"
            ? card?.formatted || "$0"
            : formatNumber(card?.value),
        change: change.label,
        trend: change.trend,
      };
    });
  }, [cards]);

  const chartData = useMemo(() => {
    const thisYear = Array.isArray(revenueForecast?.this_year)
      ? revenueForecast.this_year
      : [];
    const maxRevenue = Math.max(
      ...thisYear.map((item) => Number(item.revenue || 0)),
      1
    );
    return monthLabels.map((month) => {
      const found = thisYear.find((item) => item.month === month);
      const revenue = Number(found?.revenue || 0);
      return {
        month,
        revenue,
        height: Math.max((revenue / maxRevenue) * 100, 4),
      };
    });
  }, [revenueForecast]);

  const handleExport = () => {
    const blob = new Blob(
      [JSON.stringify({ cards, revenueForecast, topServices }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${timeframe
      .replace(/\s+/g, "-")
      .toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-20 antialiased"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Intelligence
          </h1>
          <p className="text-slate-500 font-medium">
            Real-time performance metrics & forecasting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:ring-2 ring-indigo-500/10 transition-all">
            <Calendar size={16} className="text-slate-400 mr-3" />
            <select
              className="bg-transparent text-sm font-bold outline-none text-slate-700 cursor-pointer"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              {timeframeOptions.map((option) => (
                <option key={option.label}>{option.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
          <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />{" "}
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all"
          >
            <div className="flex items-center justify-between mb-8">
              <div
                className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border}`}
              >
                <stat.icon size={24} />
              </div>
              <div
                className={`flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border ${
                  stat.trend === "up"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-rose-50 text-rose-600 border-rose-100"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight size={14} className="mr-0.5" />
                ) : (
                  <ArrowDownRight size={14} className="mr-0.5" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.15em] mb-1">
              {stat.name}
            </p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? (
                <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                stat.value
              )}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Forecast */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Revenue Trajectory
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Monthly performance across current fiscal year
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />{" "}
                Growth
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between h-72 gap-3 md:gap-4">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-3xl animate-pulse text-slate-400 font-bold text-xs uppercase tracking-widest">
                Calculating Forecast...
              </div>
            ) : (
              chartData.map((item) => (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center gap-4 group h-full"
                >
                  <div className="relative w-full bg-slate-50/50 rounded-2xl h-full overflow-hidden flex flex-col justify-end">
                    {/* Hover Tooltip */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] px-2 py-1 rounded-md z-10 pointer-events-none">
                      {formatCurrency(item.revenue)}
                    </div>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.height}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-2xl group-hover:to-indigo-300 transition-all relative"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-white/20 rounded-full" />
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-slate-900 transition-colors">
                    {item.month}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Services */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Activity size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Market Demand
            </h3>
          </div>

          <div className="space-y-8 flex-1">
            {loading
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-12 w-full bg-slate-50 rounded-2xl animate-pulse"
                  />
                ))
              : topServices?.slice(0, 5).map((service, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-slate-700">
                        {service.title || "Service"}
                      </span>
                      <span className="text-[11px] font-black text-slate-400 uppercase">
                        {service.orders} orders
                      </span>
                    </div>
                    <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (service.orders / 500) * 100,
                            100
                          )}%`,
                        }}
                        className="bg-slate-900 h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
          </div>

          <button className="w-full mt-10 py-4 text-xs font-black uppercase tracking-[0.15em] text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 border border-indigo-100 rounded-[20px] transition-all flex items-center justify-center gap-2">
            Detailed Analysis <ChevronRight size={16} />
          </button>
        </motion.div>
      </div>

      {/* Footer / Performance Track */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-900 rounded-[44px] p-10 text-white shadow-2xl shadow-slate-200"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight">
              Provider Network Performance
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              Monitoring response times and fulfillment accuracy across all
              regions.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-3xl text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                Avg Score
              </p>
              <p className="text-2xl font-black text-white">4.92</p>
            </div>
            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-3xl text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                Efficiency
              </p>
              <p className="text-2xl font-black text-white">98.4%</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
