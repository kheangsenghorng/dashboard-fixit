"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  MapPin,
  ShieldCheck,
  RefreshCcw,
  Calendar,
  CreditCard,
  Package,
  Hash,
  X,
  Trash2,
  Plus,
  Globe,
  Search,
  UserCheck,
  MessageSquare,
  Star,
  Store,
  ExternalLink,
  Info,
  Activity,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";

const StaffBookingAdmin = () => {
  // ----------------------------------------------------------------/
  // 1. DATA FROM YOUR JSON
  // ----------------------------------------------------------------/
  const rawData = {
    data: {
      id: 76,
      user_id: 17,
      service_id: 47,
      street_number: "Stockton St",
      house_number: "1-99",
      booking_date: "2026-04-23",
      booking_hours: "16:00 PM",
      address:
        "1-99, Stockton St, San Francisco (1-99 Stockton St, Union Square, San Francisco 94108)",
      latitude: "37.7858340",
      longitude: "-122.4064170",
      map_url: "https://maps.google.com/?q=37.785834,-122.406417",
      quantity: 1,
      notes: "Please check the back entrance if the front door is locked.", // Example note
      booking_status: "pending",
      customer_status: "pending",
      created_at: "2026-04-23T08:18:00.000000Z",
      user: {
        id: 17,
        name: "SENGHORNG",
        email: "senghorng.tech@gmail.com",
        phone: "+85570890621",
        role: "customer",
        avatar: null,
        created_at: "2026-04-22T07:35:13.000000Z",
      },
      provider: {
        name: "Fix-It Pro Services",
        rating: 4.9,
        reviews_count: 128,
        joined: "Jan 2024",
      },
      service: {
        name: "efyqeufrygv32",
        category: {
          name: "Rep11",
          icon: "categories/CQPGSZYIfihttakkMLnxVpTyBATQbA8N1a5ST527.png",
        },
        type: {
          name: "fwef",
          icon: "types/69c1016725ba8.webp",
        },
      },
      payment: [
        {
          transaction_id: "100FT37467884278",
          original_amount: "1.00",
          discount_amount: "0.00",
          final_amount: "1.00",
          method: "khqr",
          status: "paid",
        },
      ],
      reviews: [
        {
          id: 1,
          user: "John D.",
          rating: 5,
          comment: "Professional service and on time.",
          date: "1 day ago",
        },
        {
          id: 2,
          user: "Alice P.",
          rating: 4,
          comment: "Good quality, reasonable price.",
          date: "3 days ago",
        },
      ],
    },
  };

  const staffDirectory = [
    { id: 101, name: "Sokha Tech", level: "Senior", color: "bg-blue-500" },
    { id: 102, name: "Dara Pro", level: "Expert", color: "bg-indigo-500" },
    { id: 103, name: "Vibol Fix", level: "Junior", color: "bg-emerald-500" },
  ];

  // ----------------------------------------------------------------/
  // 2. STATE LOGIC
  // ----------------------------------------------------------------/
  const [assignedStaff, setAssignedStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleStaff = (staff) => {
    if (assignedStaff.find((s) => s.id === staff.id)) {
      setAssignedStaff(assignedStaff.filter((s) => s.id !== staff.id));
    } else {
      setAssignedStaff([...assignedStaff, staff]);
    }
  };

  const { data } = rawData;
  const filteredStaff = staffDirectory.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 p-4 md:p-8 text-[12px]">
      {/* COMPACT MODAL: STAFF SELECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Assign Personnel
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-3">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search technicians..."
                  className="w-full bg-slate-100 rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {filteredStaff.map((staff) => {
                  const isAssigned = assignedStaff.find(
                    (s) => s.id === staff.id
                  );
                  return (
                    <div
                      key={staff.id}
                      onClick={() => toggleStaff(staff)}
                      className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                        isAssigned
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded ${staff.color} text-white flex items-center justify-center font-bold text-[10px]`}
                        >
                          {staff.name[0]}
                        </div>
                        <span className="font-bold text-slate-700">
                          {staff.name}
                        </span>
                      </div>
                      {isAssigned ? (
                        <CheckCircle size={14} className="text-indigo-600" />
                      ) : (
                        <Plus size={14} className="text-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-4 bg-slate-900 text-white py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
              >
                Confirm Deployment ({assignedStaff.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
              <Hash className="text-indigo-600" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-800">
                  Booking #{data.id}
                </h1>
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border border-amber-200">
                  {data.booking_status}
                </span>
              </div>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <Activity size={10} className="text-emerald-500" /> System Live
                • Created {new Date(data.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-white p-2.5 rounded-xl border text-slate-400 hover:text-slate-900 shadow-sm transition-all">
              <RefreshCcw size={18} />
            </button>
            <button className="flex-[3] md:flex-none bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-all">
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDE (8 COLUMNS) */}
          <div className="lg:col-span-8 space-y-6">
            {/* MAIN SERVICE CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
              <div className="flex flex-wrap md:flex-nowrap gap-6 relative z-10">
                <div className="relative shrink-0">
                  <div className="bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                    <Package size={36} className="text-slate-300" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center border-4 border-white font-black text-xs shadow-md">
                    x{data.quantity}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight leading-none mb-2">
                        {data.service.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                          {data.service.category.name}
                        </span>
                        <ChevronRight size={10} className="text-slate-300" />
                        <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                          {data.service.type.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-50">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                          <Calendar size={16} />
                        </div>
                        <div className="font-bold text-slate-700">
                          {data.booking_date}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                          <Clock size={16} />
                        </div>
                        <div className="font-bold text-slate-700">
                          {data.booking_hours}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <MapPin
                        size={18}
                        className="text-rose-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="font-bold text-slate-700 text-[11px] leading-tight mb-1.5">
                          {data.address}
                        </p>
                        <a
                          href={data.map_url}
                          target="_blank"
                          className="text-[9px] font-black text-indigo-600 uppercase flex items-center gap-1 hover:underline"
                        >
                          <Globe size={10} /> Open Map Navigation
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TEAM & NOTES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* STAFF SECTION */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b bg-slate-50/50 flex justify-between items-center">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <UserCheck size={14} /> Assigned Personnel
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase hover:bg-indigo-600 transition-all"
                  >
                    + Add
                  </button>
                </div>
                <div className="p-4 flex-1">
                  {assignedStaff.length > 0 ? (
                    <div className="space-y-2">
                      {assignedStaff.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 group"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-lg ${s.color} text-white flex items-center justify-center font-bold text-[10px]`}
                            >
                              {s.name[0]}
                            </div>
                            <span className="font-bold text-slate-700 text-[11px]">
                              {s.name}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleStaff(s)}
                            className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-6 text-slate-300">
                      <UserCheck size={32} strokeWidth={1} />
                      <p className="text-[10px] font-bold uppercase mt-2 italic">
                        Waiting for assignment
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* NOTES SECTION */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-slate-50/50">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Info size={14} /> Client Instructions
                  </h2>
                </div>
                <div className="p-5 italic text-slate-500 leading-relaxed text-[11px] relative">
                  <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/50 min-h-[100px]">
                    "
                    {data.notes ||
                      "No special instructions provided by the customer for this booking."}
                    "
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[9px] font-bold uppercase text-slate-400 tracking-tighter">
                    <span>Customer Status: {data.customer_status}</span>
                    <span>Staff Visibility: Public</span>
                  </div>
                </div>
              </div>
            </div>

            {/* REVIEWS LIST */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Star size={14} /> Job History & Feedback
                </h2>
                <div className="flex text-amber-400">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" className="opacity-30" />
                </div>
              </div>
              <div className="space-y-4">
                {data.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0"
                  >
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-[11px] shrink-0">
                      {rev.user[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-black text-slate-700">
                          {rev.user}
                        </span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase">
                          {rev.date}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] italic leading-snug">
                        "{rev.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (4 COLUMNS) */}
          <div className="lg:col-span-4 space-y-6">
            {/* PAYMENT SUMMARY */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group">
              <CreditCard
                size={100}
                className="absolute -bottom-6 -right-6 text-white/5 rotate-12 transition-transform group-hover:scale-110"
              />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Transaction Summary
                  </span>
                  <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-400">
                    Paid
                  </span>
                </div>

                <div className="space-y-2 mb-6 border-b border-white/10 pb-6">
                  <div className="flex justify-between opacity-50 text-[10px] font-bold uppercase">
                    <span>Base Amount</span>
                    <span>${data.payment[0].original_amount}</span>
                  </div>
                  <div className="flex justify-between text-rose-400 text-[10px] font-bold uppercase">
                    <span>Discount Applied</span>
                    <span>-${data.payment[0].discount_amount}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Total Settlement
                    </p>
                    <div className="text-4xl font-black tracking-tighter">
                      ${data.payment[0].final_amount}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                      ID: {data.payment[0].transaction_id.slice(-6)}
                    </p>
                    <p className="text-[10px] font-black uppercase text-indigo-400">
                      {data.payment[0].method}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CUSTOMER PROFILE */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-xl shadow-slate-100 ring-4 ring-slate-50">
                {data.user.name[0]}
              </div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">
                {data.user.name}
              </h3>
              <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-6">
                Verified Customer
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
                  <Phone size={14} className="text-slate-400" />
                  <span className="font-bold text-slate-700">
                    {data.user.phone}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
                  <Mail size={14} className="text-slate-400" />
                  <span className="font-bold text-slate-700 truncate">
                    {data.user.email || "No email linked"}
                  </span>
                </div>
              </div>

              <button className="w-full py-3 bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                <MessageSquare size={14} /> Send Message
              </button>
            </div>

            {/* PROVIDER PROFILE */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
                  <Store size={22} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-xs truncate text-slate-800 uppercase tracking-tight">
                    {data.provider.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[8px] text-emerald-600 font-bold uppercase tracking-tighter">
                    <ShieldCheck size={10} /> Authorized Partner
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">
                    Rating
                  </p>
                  <div className="font-black text-xs flex items-center justify-center gap-1 text-slate-700">
                    <Star size={10} fill="#f59e0b" className="text-amber-500" />{" "}
                    {data.provider.rating}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">
                    Jobs Done
                  </p>
                  <p className="font-black text-xs text-slate-700">
                    {data.provider.reviews_count}
                  </p>
                </div>
              </div>

              <button className="w-full py-3 border-2 border-slate-100 hover:border-slate-900 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 transition-all">
                <ExternalLink size={14} /> Provider Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffBookingAdmin;
