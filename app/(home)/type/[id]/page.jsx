"use client";

import React, { useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight, SlidersHorizontal, Home, ArrowUpRight, Search } from "lucide-react";
import { decodeId } from "../../../utils/hashids";
import { useServiceStore } from "../../../store/useServiceStore";
import TypeListener from "../../../../Components/realtime/TypeListener";
import ServiceListener from "../../../../Components/realtime/ServiceListener";

// --- Framer Motion Variants ---
const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function CategoryPage() {
  const params = useParams();
  const { fetchServicesType, activeServices } = useServiceStore();

  const typeId = useMemo(() => decodeId(params.id)?.[0], [params.id]);

  const category = useMemo(() => {
    if (activeServices.length === 0) return { name: "Explore", icon: null };
    return {
      name: activeServices[0]?.category?.name || "Services",
      icon: activeServices[0]?.category?.icon,
    };
  }, [activeServices]);

  useEffect(() => {
    if (typeId) fetchServicesType(typeId);
  }, [typeId, fetchServicesType]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-100">
      <TypeListener />
      <ServiceListener />

      {/* 1. Ultra-Clean Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Home size={16} className="text-slate-400" />
            <ChevronRight size={14} />
            <span className="text-slate-900">{category.name}</span>
          </div>
          <div className="flex gap-4">
             <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Search size={20}/></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* 2. Hero Section */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            {category.icon && (
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <img src={category.icon} alt="" className="w-8 h-8 brightness-0 invert" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                {category.name}
              </h1>
              <p className="text-slate-500 font-medium">Available in Cambodia</p>
            </div>
          </motion.div>

          {/* 3. Smart Filters */}
          <div className="flex flex-wrap gap-3 mt-8">
            <FilterPill icon={<MapPin size={14}/>} label="Location" active />
            <FilterPill label="Price Range" />
            <FilterPill label="Ratings" />
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-md shadow-slate-200">
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>
        </header>

        {/* 4. Bento Grid Layout */}
        <motion.div 
          variants={containerVar}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {activeServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </AnimatePresence>
        </motion.div>

        {activeServices.length === 0 && <EmptyState />}
      </main>
    </div>
  );
}

// --- Dynamic Components ---

function FilterPill({ icon, label, active = false }) {
  return (
    <button className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all
      ${active ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
    `}>
      {icon} {label}
    </button>
  );
}

function ServiceCard({ service }) {
  return (
    <motion.div
      variants={itemVar}
      layout
      className="group relative bg-white border border-slate-100 rounded-3xl p-4 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-blue-100 cursor-pointer"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-50">
        <img
          src={service?.images?.[0]?.url || service?.type?.icon}
          alt={service?.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm">
          {service?.type?.name}
        </div>
        <div className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
           <ArrowUpRight size={16} />
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {service?.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1 font-medium italic">
          {service?.owner?.business_name}
        </p>
        
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
           <span className="text-xs font-bold text-slate-400">VERIFIED PROVIDER</span>
           <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Search className="text-slate-300" size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">No services found</h2>
      <p className="text-slate-500 max-w-xs mx-auto mt-2">
        Try adjusting your filters or searching in a different area of Cambodia.
      </p>
    </div>
  );
}