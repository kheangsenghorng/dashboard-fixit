"use client";

export const LoadingCard = () => (
    <div className="bg-surface rounded-[24px] p-6 w-full max-w-md animate-pulse">
      {/* Headline Shimmer */}
      <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-4"></div>
      {/* Body Shimmer */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
      </div>
      {/* Button Shimmer */}
      <div className="h-14 bg-gray-200 rounded-button w-full mt-8"></div>
    </div>
);