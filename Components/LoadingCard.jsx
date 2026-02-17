"use client";

export default function LoadingCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-sm animate-pulse">
      {/* Avatar shimmer */}
      <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4"></div>

      {/* Title shimmer */}
      <div className="h-5 bg-slate-200 rounded-md w-3/4 mx-auto mb-3"></div>

      {/* Subtitle shimmer */}
      <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto mb-6"></div>

      {/* Input field shimmers */}
      <div className="space-y-4">
        <div className="h-12 bg-slate-100 rounded-2xl w-full"></div>
        <div className="h-12 bg-slate-100 rounded-2xl w-full"></div>
        <div className="h-12 bg-slate-100 rounded-2xl w-full"></div>
      </div>

      {/* Button shimmer */}
      <div className="h-12 bg-slate-200 rounded-xl w-full mt-6"></div>
    </div>
  );
}
