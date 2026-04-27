"use client";

import React from "react";
import {
  Package,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Globe,
} from "lucide-react";

const ServiceCard = ({ service, booking }) => {
  const category = service?.category ?? {};
  const type = service?.type ?? {};
  const serviceImage = service?.images?.[0]?.url ?? null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden">
      <div className="flex flex-wrap md:flex-nowrap gap-6">
        <div className="relative shrink-0">
          <div className="bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
            {serviceImage ? (
              <img
                src={serviceImage}
                alt="Service"
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <Package size={36} className="text-slate-300" />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-8 h-8 rounded-lg flex items-center justify-center border-4 border-white font-black text-xs shadow-md">
            x{booking?.quantity ?? 1}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="min-w-0">
              <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight leading-none mb-2 truncate">
                {service?.name ?? "Unknown service"}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Service ID #{service?.id ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-[9px] font-bold uppercase flex items-center gap-1.5">
              {category?.name ?? "Category"}
            </span>
            <ChevronRight size={10} className="text-slate-300" />
            <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[9px] font-bold uppercase">
              {type?.name ?? "Type"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-50">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-indigo-500" />
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Booking Date
                  </p>
                  <div className="font-bold text-slate-700">
                    {booking?.booking_date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-indigo-500" />
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Booking Time
                  </p>
                  <div className="font-bold text-slate-700">
                    {booking?.booking_hours}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-700 text-[11px] leading-tight mb-1.5">
                  {booking?.address}
                </p>
                {booking?.map_url && (
                  <a
                    href={booking.map_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] font-black text-indigo-600 uppercase flex items-center gap-1"
                  >
                    <Globe size={10} /> Open Map Navigation
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
