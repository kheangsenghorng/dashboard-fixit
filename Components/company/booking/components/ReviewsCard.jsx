"use client";

import React from "react";
import { Star } from "lucide-react";

const ReviewsCard = ({ reviews }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Star size={14} /> Job History & Feedback
        </h2>

        {/* This represents the visual rating average */}
        <div className="flex text-amber-400">
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" />
          <Star size={12} fill="currentColor" className="opacity-30" />
        </div>
      </div>

      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((rev, index) => (
            <div
              key={rev.id || index}
              className="flex gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0"
            >
              {/* User Initial Circle */}
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-[11px] shrink-0 uppercase">
                {rev?.user?.[0] ?? "?"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-black text-slate-700 text-[11px]">
                    {rev?.user ?? "Unknown user"}
                  </span>

                  <span className="text-[9px] font-bold text-slate-300 uppercase">
                    {rev?.date ?? ""}
                  </span>
                </div>

                <p className="text-slate-500 text-[11px] italic leading-snug">
                  "{rev?.comment ?? "No comment provided."}"
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center border-2 border-dashed border-slate-50 rounded-xl">
            <p className="text-slate-400 text-[11px] font-bold italic">
              No reviews available for this booking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsCard;
