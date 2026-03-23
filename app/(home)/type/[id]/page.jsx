"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { decodeId } from "../../../utils/hashids";
import { useServiceStore } from "../../../store/useServiceStore";

export default function CategoryPage() {
  const params = useParams();
  const { fetchServicesType, activeServices } = useServiceStore();

  const [groupedTypes, setGroupedTypes] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState({
    name: "Category",
    icon: "",
  });

  const encodedId = params.id;
  const typeId = decodeId(encodedId);

  // 1. Fetch data when ID changes
  useEffect(() => {
    if (typeId) {
      fetchServicesType(typeId);
    }
  }, [typeId, fetchServicesType]);

  // 2. Grouping Logic: Turn flat services into grouped Types
  useEffect(() => {
    if (activeServices && activeServices.length > 0) {
      // Set the Category Header info from the first service found
      const firstItem = activeServices[0];
      setCategoryInfo({
        name: firstItem.category?.name || "Category",
        icon: firstItem.category?.icon || "",
      });

      // Grouping services by Type ID
      const groups = activeServices.reduce((acc, item) => {
        const typeId = item.type.id;
        if (!acc[typeId]) {
          acc[typeId] = {
            id: typeId,
            name: item.type.name,
            icon: item.type.icon,
            services: [],
          };
        }
        // Add the service title to this type's list
        acc[typeId].services.push(item.title);
        return acc;
      }, {});

      setGroupedTypes(Object.values(groups));
    }
  }, [activeServices]);

  return (
    <div className="bg-[#f2f2f7] min-h-screen pb-10">
      {/* 1. Breadcrumb */}
      <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center gap-2 text-[13px] text-gray-500">
        <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
          🏠 Home
        </span>
        <span>›</span>
        <span className="text-gray-700">{categoryInfo.name} in Cambodia</span>
      </div>

      <div className="max-w-[1300px] mx-auto px-4">
        {/* 2. Title Header */}
        <div className="bg-white border-x border-t rounded-t-lg p-5 flex items-center gap-3">
          {categoryInfo.icon && (
            <img
              src={categoryInfo.icon}
              className="w-8 h-8 object-contain"
              alt="cat-icon"
            />
          )}
          <h1 className="text-xl font-bold text-[#222]">
            {categoryInfo.name} in Cambodia
          </h1>
        </div>

        {/* 3. Filter Bar */}
        <div className="bg-white border border-b-gray-200 flex items-center justify-between p-3 sticky top-0 z-20 shadow-sm">
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-[#f5f5f5] border border-gray-200 rounded text-sm font-medium flex items-center gap-2">
              📍 Location
            </button>
            <button className="px-4 py-1.5 bg-[#f5f5f5] border border-gray-200 rounded text-sm font-medium">
              Sort
            </button>
            <button className="px-4 py-1.5 bg-[#f5f5f5] border border-gray-200 rounded text-sm font-medium">
              Price
            </button>
            <button className="relative px-4 py-1.5 bg-[#f5f5f5] border border-gray-200 rounded text-sm font-medium flex items-center gap-2">
              More Filters
              <span className="absolute -top-2 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                1
              </span>
            </button>
          </div>
          <div className="flex items-center gap-5 text-gray-400">
            <span className="cursor-pointer hover:text-blue-500 text-lg">
              🏷️
            </span>
            <span className="cursor-pointer hover:text-blue-500 text-lg">
              🚚
            </span>
            <span className="cursor-pointer hover:text-blue-500 text-lg">
              📋
            </span>
            <span className="cursor-pointer text-blue-500 text-lg">⠿</span>
          </div>
        </div>

        {/* 4. The Grid (Using groupedTypes) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[1px] bg-gray-200 border-x border-b overflow-hidden">
          {groupedTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white p-4 flex flex-col items-center text-center transition-all hover:bg-blue-50 group cursor-pointer min-h-[200px]"
            >
              {/* Image with Blue Circle Background */}
              <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                <div className="absolute inset-0 bg-blue-50 rounded-full opacity-60 group-hover:scale-110 transition-transform"></div>
                <img
                  src={type.icon}
                  alt={type.name}
                  className="relative z-10 w-14 h-14 object-contain"
                />
              </div>

              {/* Type Name */}
              <h2 className="text-[13px] font-bold text-gray-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                {type.name}
              </h2>

              {/* Services List (Titles from the specific type) */}
              <div className="mt-auto">
                <ul className="flex flex-wrap justify-center gap-x-1">
                  {type.services.map((serviceTitle, idx) => (
                    <li
                      key={idx}
                      className="text-[10px] text-gray-400 font-medium whitespace-nowrap"
                    >
                      {serviceTitle}
                      {idx !== type.services.length - 1 ? " •" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {activeServices.length === 0 && (
          <div className="bg-white border-x border-b p-20 text-center text-gray-400">
            No services found in this category.
          </div>
        )}

        <div className="text-center py-10">
          <p className="text-gray-400 text-sm italic">
            Showing grouped services by type
          </p>
        </div>
      </div>
    </div>
  );
}
