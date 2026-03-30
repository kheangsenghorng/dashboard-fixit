"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Box, Filter, ShoppingBag, Layers } from "lucide-react";

import { useTypeStore } from "../../store/useTypeStore";
import TypeListener from "../../../Components/realtime/TypeListener";
import { encodeId } from "../../utils/hashids";

export default function Category() {
  const { fetchTypeAction, activeTypes } = useTypeStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTypeAction?.();
  }, [fetchTypeAction]);

  console.log(activeTypes);

  // API response: { data: [...], links: {...}, meta: {...} }
  const types = activeTypes || [];

  // Build unique category list from nested type.category
  const categories = useMemo(() => {
    const map = new Map();

    types.forEach((type) => {
      if (type.category) {
        map.set(type.category.id, type.category);
      }
    });

    return Array.from(map.values());
  }, [types]);

  // Filter by category + search
  const filteredTypes = useMemo(() => {
    return types.filter((type) => {
      const matchesCategory =
        selectedCategory === "all" ||
        type.category?.id === Number(selectedCategory);

      const matchesSearch = type.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [types, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <TypeListener />

      <div className="min-h-screen bg-white p-8 font-sans text-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">
                Explore Components
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Discover high-performance hardware components tailored for your
                build.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-[#0f172a] text-white shadow-lg shadow-slate-200"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              <Box size={18} />
              All Products
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(String(cat.id))}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full font-semibold transition-all border ${
                  selectedCategory === String(cat.id)
                    ? "bg-[#0f172a] text-white border-[#0f172a] shadow-lg shadow-slate-200"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center overflow-hidden ${
                    selectedCategory === String(cat.id)
                      ? "bg-white/20"
                      : "bg-slate-100"
                  }`}
                >
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(cat.name);
                    }}
                  />
                </div>
                <span className="text-sm">{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm mb-6">
            <Filter size={16} />
            Showing
            <span className="text-slate-900 font-bold mx-1">
              {filteredTypes.length}
            </span>
            items
          </div>

          {filteredTypes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredTypes.map((type) => (
                <Link
                  key={type.id}
                  href={`/type/${encodeId(type.id)}`}
                  className="group bg-white border border-gray-100 rounded-[32px] p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/5 hover:-translate-y-1 hover:border-indigo-100"
                >
                  <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 bg-indigo-50 rounded-3xl rotate-6 group-hover:rotate-12 group-hover:bg-indigo-100 transition-all duration-300"></div>
                    <div className="absolute inset-0 bg-indigo-50/50 rounded-3xl -rotate-3 group-hover:-rotate-6 transition-all duration-300"></div>
                    <img
                      src={type.icon}
                      alt={type.name}
                      className="relative z-10 w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(type.name);
                      }}
                    />
                  </div>

                  <h2 className="text-[14px] font-bold text-gray-800 leading-tight mb-3 group-hover:text-indigo-600 transition-colors uppercase">
                    {type.name}
                  </h2>

                  <div className="mt-auto w-full">
                    <div className="flex justify-center gap-1">
                      <span className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 flex items-center gap-1">
                        <Layers size={10} />
                        {type.category?.name || "Type"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full border-2 border-dashed border-slate-100 rounded-[40px] bg-white min-h-[500px] flex items-center justify-center p-12">
              <div className="flex flex-col items-center text-center max-w-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="text-slate-300 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No hardware found
                </h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  We couldn't find any products matching your active filters.
                  Try searching for a different component or resetting your
                  categories.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                  Clear Filters & Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
