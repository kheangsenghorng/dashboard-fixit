"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useTypeStore } from "../../store/useTypeStore";
import TypeListener from "../../../Components/realtime/TypeListener";
import { encodeId } from "../../utils/hashids";

export default function TypesPage() {
  const { fatchTypeAction, activeTypes } = useTypeStore();

  useEffect(() => {
    fatchTypeAction();
  }, [fatchTypeAction]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <TypeListener />
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 uppercase tracking-tight">
            Type
          </h1>

          {/* --- TYPES GRID (The style you requested) --- */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
            {activeTypes?.map((item) => (
              <Link
                key={item.id}
                href={`/type/${encodeId(item.id)}`}
                className="group bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 hover:border-blue-100"
              >
                {/* Stacked Background Icon Section */}
                <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                  <div className="absolute inset-0 bg-blue-50 rounded-3xl rotate-6 group-hover:rotate-12 group-hover:bg-blue-100 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-blue-50/50 rounded-3xl -rotate-3 group-hover:-rotate-6 transition-all duration-300"></div>
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="relative z-10 w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://ui-avatars.com/api/?name=" + item.name;
                    }}
                  />
                </div>

                {/* Type Name */}
                <h2 className="text-[14px] font-bold text-gray-800 leading-tight mb-3 group-hover:text-blue-600 transition-colors uppercase">
                  {item.name}
                </h2>

                {/* Tag Section (Using Category Data from your JSON) */}
                <div className="mt-auto w-full">
                  <div className="flex flex-wrap justify-center gap-1">
                    {/* Display Category Name as a tag */}
                    <span className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md border border-gray-100 group-hover:bg-white group-hover:border-blue-100">
                      {item.category?.name || "General"}
                    </span>
                    {/* Display Group as a tag if it exists */}
                    {item.category?.group && (
                      <span className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md border border-gray-100 group-hover:bg-white group-hover:border-blue-100">
                        {item.category.group}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
