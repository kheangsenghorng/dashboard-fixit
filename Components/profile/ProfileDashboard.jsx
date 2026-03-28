"use client";

import React, { useState } from "react";
import {
  User,
  Pencil,
  Package,
  Heart,
  CheckCircle2,
  ChevronRight,
  Shield,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  CreditCard,
} from "lucide-react";
import { useRequireAuth } from "../../app/hooks/useRequireAuth";

const ProfileDashboard = () => {
  const { user: authUser, initialized } = useRequireAuth();
  const [activeTab, setActiveTab] = useState("Dashboard");

  if (!initialized || !authUser) {
    return null;
  }

  const stats = [
    {
      label: "My Orders",
      value: "0",
      icon: Package,
      color: "bg-indigo-50 text-indigo-600",
      hover: "hover:border-indigo-100",
    },
    {
      label: "Saved Items",
      value: "0",
      icon: Heart,
      color: "bg-rose-50 text-rose-500",
      hover: "hover:border-rose-100",
    },
    {
      label: "Security",
      value: authUser.is_active ? "Strong" : "Pending",
      icon: Shield,
      color: "bg-emerald-50 text-emerald-500",
      hover: "hover:border-emerald-100",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
              <CheckCircle2 size={14} />
              ACCOUNT {authUser.is_active ? "VERIFIED" : "PENDING"}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight">
              Welcome back, {authUser.name || authUser.login || "User"}!
            </h1>

            <p className="text-slate-400 flex items-center gap-2">
              <span className="text-slate-300">✉</span>
              {authUser.email || "No email linked"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 border border-slate-200 rounded-2xl text-slate-400 hover:bg-white transition-all shadow-sm">
              <Bell size={20} />
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-white transition-all shadow-sm">
              <Pencil size={18} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-12">
          <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2 mb-6">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div>
            </div>
            At a Glance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group transition-all cursor-pointer ${stat.hover}`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${stat.color}`}
                >
                  <stat.icon size={24} />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {stat.label}
                    </p>
                    <h4 className="text-4xl font-extrabold">{stat.value}</h4>
                  </div>
                  <ChevronRight
                    className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all"
                    size={20}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User size={20} />
            </div>
            <h3 className="text-xl font-extrabold">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
            <InfoField
              label="Full Name"
              value={authUser.name || authUser.login}
            />
            <InfoField label="Email Address" value={authUser.email} />
            <InfoField
              label="Phone Number"
              value={authUser.phone || authUser.mobile}
            />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Primary Address
              </p>
              <button className="text-indigo-600 font-bold hover:underline">
                Manage your delivery locations
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for clean fields
const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
      {label}
    </p>
    <p className="text-lg font-bold">{value || "-"}</p>
  </div>
);

export default ProfileDashboard;
