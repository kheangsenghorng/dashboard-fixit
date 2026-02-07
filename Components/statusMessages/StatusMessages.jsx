"use client";

import React from 'react';
import { Loader2, AlertCircle, AlertTriangle, RefreshCcw } from 'lucide-react';

// 1. LOADING COMPONENT
// Usage: <Loading message="Fetching data..." />
export const Loading = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center p-12 w-full h-full">
    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
    <p className="mt-4 text-slate-500 font-medium animate-pulse">{message}</p>
  </div>
);

// 2. ERROR COMPONENT
// Usage: <Error message="Failed to load" onRetry={() => fetchData()} />
export const Error = ({ message = "Something went wrong", onRetry }) => (
  <div className="p-6 border border-red-200 bg-red-50 rounded-2xl flex flex-col items-center text-center max-w-md mx-auto my-4">
    <div className="p-3 bg-red-100 rounded-full text-red-600 mb-4">
      <AlertCircle size={32} />
    </div>
    <h3 className="text-lg font-bold text-red-800">System Error</h3>
    <p className="text-red-600 mb-6">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
      >
        <RefreshCcw size={16} />
        Try Again
      </button>
    )}
  </div>
);

// 3. WARNING COMPONENT
// Usage: <Warning message="Your subscription expires soon." />
export const Warning = ({ message = "Attention required" }) => (
  <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl flex items-start gap-4 my-2">
    <div className="text-amber-600 mt-0.5">
      <AlertTriangle size={20} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-amber-800">Warning</p>
      <p className="text-sm text-amber-700">{message}</p>
    </div>
  </div>
);

// 4. SKELETON LOADING (Bonus - for a smoother Dashboard feel)
export const SkeletonLoader = () => (
  <div className="w-full space-y-4 animate-pulse">
    <div className="h-8 bg-slate-200 rounded w-1/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-32 bg-slate-100 rounded-xl"></div>
      <div className="h-32 bg-slate-100 rounded-xl"></div>
      <div className="h-32 bg-slate-100 rounded-xl"></div>
    </div>
    <div className="h-64 bg-slate-100 rounded-xl"></div>
  </div>
);