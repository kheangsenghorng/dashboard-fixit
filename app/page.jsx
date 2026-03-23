"use client";

import React, { useEffect } from "react";
import { Layers, ArrowRight, Zap, LayoutGrid } from "lucide-react";
import Link from "next/link";

// Stores & Hooks
import { useCategoryStore } from "./store/useCategoryStore";
import { useCategoryRealtime } from "./hooks/useCategoryRealtime";
import { useTypeStore } from "./store/useTypeStore";
import { useAuthGuard } from "./hooks/useAuthGuard";
import { encodeId } from "./utils/hashids";
// Components
import NavbarFixit from "../Components/nabvar/Navbar";
import Footer from "../Components/nabvar/Footer";
import TypeListener from "../Components/realtime/TypeListener";
import FloatingStartSelling from "../Components/FloatingStartSelling";

const FixitLandingPage = () => {
  const { categories, isLoading, error } = useCategoryStore();

  return (
    <>
      <TypeListener />
      <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
        {/* NAVBAR */}
        <NavbarFixit />

        {/* Adding top padding to account for fixed navbar */}
        <div className="pt-24">
          <main className="max-w-[1550px] mx-auto p-8 grid grid-cols-12 gap-8">
            {/* --- SIDEBAR: CATEGORIES --- */}
            <aside className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden sticky top-28">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-slate-900 p-2.5 rounded-xl text-white shadow-lg shadow-slate-200">
                      <Layers size={18} />
                    </div>
                    <h2 className="font-black text-[11px] tracking-[0.2em] uppercase text-slate-800">
                      Category
                    </h2>
                  </div>

                  <div className="space-y-5">
                    {error ? (
                      <p className="text-red-500 text-xs">{error}</p>
                    ) : categories?.length > 0 ? (
                      categories.slice(0, 10).map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${encodeId(category.id)}`}
                          className="group flex items-center justify-between text-[13.5px] font-bold text-slate-500 hover:text-blue-600 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-600 group-hover:scale-150 transition-all"></span>
                            {category.name}
                          </div>
                          <ArrowRight
                            size={14}
                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600"
                          />
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No categories found.
                      </p>
                    )}
                  </div>
                </div>

                <button className="w-full py-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 group">
                  Explore All Categories{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </aside>

            {/* --- HERO SECTION & COLLECTIONS --- */}
            <section className="col-span-12 lg:col-span-9">
              {/* FESTIVE HERO BANNER */}
              <div className="relative rounded-[3.5rem] bg-[#0A0A0B] h-[550px] overflow-hidden flex items-center px-16 shadow-2xl shadow-slate-200">
                {/* Background Light Effects (Simulating the image lanterns) */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="absolute top-0 right-20 w-64 h-80 bg-orange-500/20 blur-[100px] rounded-full" />
                  <div className="absolute bottom-[-100px] left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-2xl">
                  <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black px-4 py-2 rounded-lg flex items-center gap-2 w-fit mb-8 tracking-[0.2em]">
                    <Zap size={12} fill="currentColor" /> FEATURED
                  </span>

                  <h1 className="text-7xl font-black text-white mb-4 tracking-tighter leading-[1.05]">
                    HAPPY NEW YEAR
                  </h1>
                  <p className="text-slate-400 text-xl mb-10 font-medium tracking-wide">
                    Celebrating new beginnings with premium curated collections.
                  </p>

                  {/* COUNTDOWN TIMER */}
                  <div className="flex items-center gap-4 mb-12">
                    <div className="bg-[#B91C1C] text-white px-4 py-2 rounded-lg text-[10px] font-black tracking-widest mr-2 flex items-center gap-2">
                      <Zap size={12} fill="currentColor" /> ENDS:
                    </div>
                    <div className="flex gap-3">
                      {[
                        { v: "10", l: "D" },
                        { v: "16", l: "H" },
                        { v: "13", l: "M" },
                        { v: "01", l: "S" },
                      ].map((time, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center bg-white/5 backdrop-blur-xl rounded-2xl p-3 w-14 border border-white/10"
                        >
                          <span className="text-white font-black text-xl leading-none">
                            {time.v}
                          </span>
                          <span className="text-[9px] text-slate-500 font-black mt-1.5 uppercase tracking-tighter">
                            {time.l}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="bg-white text-slate-950 px-10 py-5 rounded-[2rem] font-black text-sm flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl active:scale-95 group">
                    <ArrowRight
                      size={20}
                      className="rotate-[-45deg] group-hover:rotate-0 transition-transform"
                    />
                    EXPLORE NOW
                  </button>
                </div>
              </div>

              {/* EXPLORE COLLECTION HEADER */}
              <div className="mt-16">
                <div className="flex items-end justify-between mb-10">
                  <div className="flex items-center gap-6">
                    <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 text-slate-300">
                      <LayoutGrid size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
                        EXPLORE COLLECTION
                        <span className="text-[11px] bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-black">
                          0
                        </span>
                      </h3>
                      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-1">
                        Curated hardware and premium accessories
                      </p>
                    </div>
                  </div>
                  <button className="text-[11px] font-black text-blue-600 flex items-center gap-2 hover:underline tracking-widest">
                    VIEW ALL <ArrowRight size={14} />
                  </button>
                </div>

                {/* Browse Entire Registry Button */}
                <div className="flex justify-center mt-20">
                  <button className="bg-white border border-slate-200 px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center gap-3 shadow-sm hover:shadow-xl">
                    Browse Entire Registry <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* --- FLOATING "START SELLING" BUTTON --- */}
        <FloatingStartSelling />
        <Footer />
      </div>
    </>
  );
};

export default FixitLandingPage;
