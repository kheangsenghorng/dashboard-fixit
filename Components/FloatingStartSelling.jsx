"use client";

import React from "react";
import { ArrowRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useAuthGuard } from "../app/hooks/useAuthGuard";

export default function FloatingStartSelling({
  href = "/become-provider",
  mascotSrc = "https://cdn-icons-png.flaticon.com/512/6028/6028680.png",
  mascotAlt = "Mascot",
}) {
  const { user: authUser, initialized } = useAuthGuard();

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-end z-[90]">
      {/* Mascot */}
      <div className="w-16 h-16 mb-2 animate-bounce hover:animate-none cursor-pointer">
        <img
          src={mascotSrc}
          alt={mascotAlt}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Button */}
      <Link
        href={
          authUser ? href : `/auth/login?redirect=${encodeURIComponent(href)}`
        }
        className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 rounded-full p-2 pr-8 flex items-center gap-4 hover:scale-105 transition-all duration-300 active:scale-95 group"
      >
        <div className="bg-slate-900 p-3 rounded-full text-white group-hover:bg-blue-600 transition-colors">
          <LayoutGrid size={20} />
        </div>

        <div className="text-left">
          <p className="text-[9px] text-slate-400 font-black leading-none uppercase tracking-widest mb-1">
            Start Selling
          </p>

          <p className="text-sm font-black text-slate-800 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
            Join Now <ArrowRight size={16} />
          </p>
        </div>
      </Link>
    </div>
  );
}
