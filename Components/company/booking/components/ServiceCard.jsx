"use client";

import React, { useState } from "react";
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Home,
  Layers,
  Users,
  CheckCircle2,
  Info,
  CreditCard,
  Bed,
  X,
  ChevronRight,
} from "lucide-react";

const ServiceCard = ({ booking: bookingData }) => {
  // State for the Pop-up/Modal
  const [activeModal, setActiveModal] = useState(null);

  const booking = bookingData;
  const service = booking?.service ?? {};
  const category = service?.category ?? {};
  const type = service?.type ?? {};
  const serviceImage = service?.images?.[0]?.url ?? null;

  const address = booking?.address ?? {};
  const packageData = booking?.package ?? {};
  const taskGroups = packageData?.task_groups ?? [];
  const includedItems = packageData?.included_items ?? [];
  const payment = booking?.payments?.[0] ?? null;

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "confirmed" || s === "active" || s === "completed")
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (s === "pending") return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden relative">
      {/* --- MODAL / TOP-UP SCREEN --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveModal(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 uppercase tracking-tight">
                {activeModal.type === "task"
                  ? "Task Group Details"
                  : "Equipment Info"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-8">
              {activeModal.type === "task" ? (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800 uppercase">
                        {activeModal.data.name}
                      </h4>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Step #{activeModal.data.sort_order}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">
                      Checklist Items
                    </p>
                    {activeModal.data.task_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-full h-48 rounded-[24px] bg-slate-100 mb-6 overflow-hidden border border-slate-200">
                    <img
                      src={activeModal.data.image_url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <h4 className="text-2xl font-black text-slate-800 uppercase mb-2">
                    {activeModal.data.name}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {activeModal.data.description ||
                      "This item is included as part of your standard service package to ensure the highest quality results."}
                  </p>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors"
                  >
                    Got it
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CARD UI --- */}

      {/* Header */}
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex gap-5 items-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white">
            {serviceImage ? (
              <img
                src={serviceImage}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <Package className="p-5 text-slate-300" />
            )}
          </div>
          <div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(
                booking.booking_status
              )}`}
            >
              {booking.booking_status}
            </span>
            <h2 className="text-2xl font-black text-slate-800 uppercase mt-1">
              {service.name}
            </h2>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm self-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <CreditCard size={12} /> Payment
          </p>
          <span className="text-xl font-black text-indigo-600">
            ${payment?.final_amount}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Logistics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Date
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {booking.booking_date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Time
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {booking.booking_hours}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-2">
              <MapPin size={14} className="text-rose-500" /> {address.label}
            </p>
            <p className="text-[11px] text-slate-500 mb-3">{address.address}</p>
            <a
              href={address.map_url}
              target="_blank"
              className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1"
            >
              Open Navigation <Globe size={10} />
            </a>
          </div>
        </div>

        {/* Right: Package & Clickable Items */}
        <div className="lg:col-span-8 space-y-8">
          {/* Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Area",
                val: `${packageData.max_area_m2}m²`,
                icon: Layers,
              },
              { label: "Beds", val: packageData.bedrooms, icon: Bed },
              { label: "Hours", val: packageData.duration_hours, icon: Clock },
              { label: "Staff", val: packageData.workers_count, icon: Users },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-center"
              >
                <item.icon size={16} className="text-indigo-400 mx-auto mb-1" />
                <p className="text-[9px] font-bold text-slate-400 uppercase">
                  {item.label}
                </p>
                <p className="text-xs font-black text-slate-800">{item.val}</p>
              </div>
            ))}
          </div>

          {/* TASK GROUPS (Clickable) */}
          <section>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Service Progress (Click to view tasks)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {taskGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setActiveModal({ type: "task", data: group })}
                  className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-500 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
                      {group.name}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* INCLUDED ITEMS (Clickable) */}
          {includedItems.length > 0 && (
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Included Equipment
              </h4>
              <div className="flex flex-wrap gap-3">
                {includedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveModal({ type: "item", data: item })}
                    className="group relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer hover:border-indigo-500 transition-all active:scale-95 shadow-sm"
                  >
                    <img
                      src={item.image_url}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs uppercase">
            {booking.user.name.charAt(0)}
          </div>
          <p className="text-xs font-bold">
            {booking.user.name}{" "}
            <span className="text-slate-400 font-medium ml-2">
              {booking.user.phone}
            </span>
          </p>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase">
          Booking ID #{booking.id}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
