"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Tag } from "lucide-react";

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ServiceCard({ service }) {
  const imageSrc =
    service?.images?.[0]?.url || service?.type?.icon || "/placeholder.png";

  const price =
    service?.base_price != null
      ? `$${parseFloat(service.base_price).toFixed(2)}`
      : null;

  const duration = service?.duration != null ? `${service.duration} min` : null;

  return (
    <motion.div
      variants={itemVar}
      layout
      className="group relative bg-white border border-slate-200 rounded-2xl p-4 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-amber-200 cursor-pointer"
    >
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-slate-100">
        <img
          src={imageSrc}
          alt={service?.title || "Service image"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest text-amber-600 shadow-sm">
          {service?.type?.name || "Service"}
        </div>

        <div className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={16} />
        </div>

        {price && (
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-amber-600 text-white text-xs font-black rounded-lg shadow-md">
            {price}
          </div>
        )}
      </div>

      <div className="px-1">
        {service?.category?.name && (
          <div className="flex items-center gap-1 mb-1">
            <Tag size={11} className="text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {service.category.name}
            </span>
          </div>
        )}

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
          {service?.title || "Untitled Service"}
        </h3>

        <p className="text-sm text-slate-500 mt-0.5 font-medium italic">
          {service?.owner?.business_name || "Unknown Provider"}
        </p>

        {service?.description && (
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          {duration ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Clock size={13} className="text-amber-500" />
              {duration}
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-400">
              VERIFIED PROVIDER
            </span>
          )}

          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
