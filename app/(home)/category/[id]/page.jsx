"use client";

import React, { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { decodeId } from "../../../utils/hashids";
import { useTypeStore } from "../../../store/useTypeStore";
import TypeListener from "../../../../Components/realtime/TypeListener";
import {
  ChevronRight,
  Home,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  ArrowUpDown,
  Heart,
  Clock,
  Star,
} from "lucide-react"; // Suggested: npm install lucide-react
import { useServiceStore } from "../../../store/useServiceStore";
import ServiceListener from "../../../../Components/realtime/ServiceListener";

export default function CategoryPage() {
  const params = useParams();

  const { fetchTypesCategory, activeTypes, setActiveTypes } = useTypeStore();
  const { fetchServicesCategory, activeServices, setActiveServices } =
    useServiceStore();

  const encodedId = params.id;
  // ✅ Robust check
  const categoryId = useMemo(() => {
    const decoded = decodeId(encodedId);
    // decodeId can return NaN, 0, null, or undefined — reject all
    if (!decoded || isNaN(decoded) || decoded <= 0) return null;
    return decoded;
  }, [encodedId]);

  useEffect(() => {
    if (!categoryId) return;

    // Clear stale data first
    setActiveTypes([]); // add setActiveTypes from useTypeStore
    setActiveServices([]); // add setActiveServices from useServiceStore

    fetchTypesCategory(categoryId);
    fetchServicesCategory(categoryId);
  }, [categoryId]);
  const categoryName = useMemo(() => {
    return activeTypes?.[0]?.category?.name || "Services";
  }, [activeTypes]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <TypeListener />
      <ServiceListener />
      {/* 1. Refined Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-4 h-12 flex items-center gap-2 text-[13px] font-medium">
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Home size={14} />
            Home
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-gray-900">{categoryName} in Cambodia</span>
        </div>
      </nav>

      <main className="max-w-[1300px] mx-auto px-4 py-6">
        {/* 2. Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {/* {categoryName}{" "} */}
            <span className="text-gray-400 font-normal">in Cambodia</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Found {activeTypes.length} sub-categories available
          </p>
        </div>

        {/* 3. Modern Sticky Filter Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl px-4 py-3 shadow-sm mb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 transition-all">
              <MapPin size={16} className="text-blue-500" />
              Location
              <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 transition-all">
              <ArrowUpDown size={16} className="text-blue-500" />
              Sort
            </button>
            <button className="relative flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all">
              <SlidersHorizontal size={16} />
              Filters
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                1
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button className="p-1.5 rounded-md text-gray-400 hover:bg-white hover:text-blue-600 transition-all">
              <List size={18} />
            </button>
            <button className="p-1.5 rounded-md bg-white text-blue-600 shadow-sm">
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>

        {/* 4. The Grid: "Card-Style" UI */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          {activeTypes.map((item) => (
            <Link
              key={item.id}
              href={`/category/${encodedId}/${item.id}`} // Example dynamic path
              className="group bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 hover:border-blue-100"
            >
              {/* Icon Container with Glassmorphism effect */}
              <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                <div className="absolute inset-0 bg-blue-50 rounded-3xl rotate-6 group-hover:rotate-12 group-hover:bg-blue-100 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-blue-50/50 rounded-3xl -rotate-3 group-hover:-rotate-6 transition-all duration-300"></div>
                <img
                  src={item.icon}
                  alt={item.name}
                  className="relative z-10 w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Text Content */}
              <h2 className="text-[14px] font-bold text-gray-800 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                {item.name}
              </h2>

              {/* Tags/Services */}
              <div className="mt-auto w-full">
                <div className="flex flex-wrap justify-center gap-1">
                  {item.services?.slice(0, 2).map((service, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md border border-gray-100 group-hover:bg-white group-hover:border-blue-100"
                    >
                      {service}
                    </span>
                  ))}
                  {activeServices?.length > 2 && (
                    <span className="text-[10px] text-gray-400 font-medium">
                      +{item.services.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 5. Services Section (Replacing the old footer message) */}
        <div className="mt-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Services
              </h2>
              <p className="text-gray-500 text-sm">
                {/* Hand-picked services in {categoryName} */}
              </p>
            </div>
            <button className="text-blue-600 font-semibold text-sm hover:underline">
              View all services
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mapping the data from your JSON */}
            {activeServices.map((service, index) => (
              <div
                key={index + 1}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              >
                {/* Image Header */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={service.images[0]?.url}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Price Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-sm">
                    <span className="text-blue-600 font-bold text-sm">
                      ${service.base_price}
                    </span>
                  </div>
                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md hover:bg-white rounded-full transition-colors group/heart">
                    <Heart
                      size={18}
                      className="text-white group-hover/heart:text-red-500 transition-colors"
                    />
                  </button>
                </div>

                {/* Content Body */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={service.owner.logo}
                      alt={service.owner.business_name}
                      className="w-5 h-5 rounded-full object-cover border border-gray-100"
                    />
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider truncate">
                      {service.owner.business_name}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin size={14} className="shrink-0" />
                      <span className="text-xs truncate">
                        {service.owner.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock size={14} className="shrink-0" />
                      <span className="text-xs">
                        {service.duration} mins duration
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer info */}
                <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-xs font-bold text-gray-700">4.9</span>
                    <span className="text-[10px] text-gray-400">
                      (12 reviews)
                    </span>
                  </div>
                  <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700">
                    BOOK NOW
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State / Explore More Styling */}
          <div className="mt-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-center text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mb-4">
                <LayoutGrid className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Can't find what you're looking for?
              </h3>
              <p className="text-blue-100 mb-6 max-w-md mx-auto">
                Explore thousands of other verified listings in the{" "}
                {categoryName} section across Cambodia.
              </p>
              <button className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg shadow-blue-900/20">
                Browse All Categories
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
