"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { decodeId } from "../../utils/hashids";

export default function CategoryPage() {
  const params = useParams();
  const [types, setTypes] = useState([]);

  const encodedId = params.id;
  const categoryId = decodeId(encodedId);

  // Mock data based on your JSON structure
  const apiResponse = {
    data: [
      {
        id: 1,
        name: "Washing Machines",
        icon: "https://v-khmer24.com/c-electronics-appliances/washing-machines-dryers.png",
        services: ["Samsung", "LG", "Panasonic"],
      },
      {
        id: 2,
        name: "Fridges & Freezers",
        icon: "https://v-khmer24.com/c-electronics-appliances/fridges-freezers.png",
        services: ["Toshiba", "Hitachi", "Sharp"],
      },
      {
        id: 3,
        name: "Air Conditioning",
        icon: "https://v-khmer24.com/c-electronics-appliances/air-conditioning-heating.png",
        services: ["Daikin", "Mitsubishi", "Midea"],
      },
      {
        id: 4,
        name: "Tools",
        icon: "https://v-khmer24.com/c-electronics-appliances/tools.png",
        services: ["Makita", "Bosch", "DeWalt"],
      },
      {
        id: 5,
        name: "Machinery",
        icon: "https://v-khmer24.com/c-electronics-appliances/machinery.png",
        services: ["Generators", "Pumps"],
      },
      {
        id: 6,
        name: "Consumer Electronics",
        icon: "https://v-khmer24.com/c-electronics-appliances/consumer-electronics.png",
        services: ["Hair Dryers", "Shavers"],
      },
      {
        id: 7,
        name: "Security Camera",
        icon: "https://v-khmer24.com/c-electronics-appliances/security-camera.png",
        services: ["Hikvision", "Dahua", "Ezviz"],
      },
      {
        id: 8,
        name: "Lighting",
        icon: "https://v-khmer24.com/c-electronics-appliances/lighting.png",
        services: ["LED", "Solar", "Smart"],
      },
      {
        id: 9,
        name: "Cameras",
        icon: "https://v-khmer24.com/c-electronics-appliances/cameras-camcorders.png",
        services: ["Canon", "Sony", "Nikon"],
      },
      {
        id: 10,
        name: "TVs & Audios",
        icon: "https://v-khmer24.com/c-electronics-appliances/tvs-videos-audios.png",
        services: ["Smart TV", "Speakers"],
      },
      {
        id: 11,
        name: "Home appliances",
        icon: "https://v-khmer24.com/c-electronics-appliances/home-appliances.png",
        services: ["Iron", "Rice Cooker"],
      },
      {
        id: 12,
        name: "Video games",
        icon: "https://v-khmer24.com/c-electronics-appliances/video-games-consoles-toys.png",
        services: ["PS5", "Nintendo", "Xbox"],
      },
    ],
  };

  useEffect(() => {
    // Logic: In a real app, you would fetch data using categoryId
    setTypes(apiResponse.data);
  }, [categoryId]);

  return (
    <div className="bg-[#f2f2f7] min-h-screen pb-10">
      {/* 1. Breadcrumb */}
      <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center gap-2 text-[13px] text-gray-500">
        <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer transition-colors">
          🏠 Home
        </span>
        <span>›</span>
        <span className="text-gray-700">
          Electronics & Appliances in Cambodia
        </span>
      </div>

      <div className="max-w-[1300px] mx-auto px-4">
        {/* 2. Title Header */}
        <div className="bg-white border-x border-t rounded-t-lg p-5">
          <h1 className="text-xl font-bold text-[#222]">
            Electronics & Appliances in Cambodia
          </h1>
        </div>

        {/* 3. Filter Bar (Single Instance) */}
        <div className="bg-white border border-b-gray-200 flex items-center justify-between p-3 sticky top-0 z-20 shadow-sm">
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-[#f5f5f5] border border-gray-200 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors">
              📍 Location
            </button>
            <button className="px-4 py-1.5 bg-[#f5f5f5] border border-gray-200 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
              Sort
            </button>
            <button className="px-4 py-1.5 bg-[#f5f5f5] border border-gray-200 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
              Price
            </button>
            <button className="relative px-4 py-1.5 bg-[#f5f5f5] border border-gray-200 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors">
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

        {/* 4. The Grid (6 Columns on Large Screens) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[1px] bg-gray-200 border-x border-b overflow-hidden mb-8">
          {types.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 flex flex-col items-center text-center transition-all hover:bg-blue-50 group cursor-pointer min-h-[190px]"
            >
              {/* Image with Blue Circle Background */}
              <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                <div className="absolute inset-0 bg-blue-50 rounded-full opacity-60 group-hover:scale-110 transition-transform duration-300"></div>
                <img
                  src={item.icon}
                  alt={item.name}
                  className="relative z-10 w-14 h-14 object-contain group-hover:rotate-3 transition-transform"
                />
              </div>

              {/* Type Name */}
              <h2 className="text-[13px] font-bold text-gray-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                {item.name}
              </h2>

              {/* Services List (Under card type) */}
              <div className="mt-auto">
                <ul className="flex flex-wrap justify-center gap-1">
                  {item.services?.map((service, idx) => (
                    <li
                      key={idx}
                      className="text-[10px] text-gray-400 font-medium whitespace-nowrap"
                    >
                      {service}
                      {idx !== item.services.length - 1 ? " •" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Optional: Footer Message */}
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">
            Showing all categories for your selection
          </p>
        </div>
      </div>
    </div>
  );
}
