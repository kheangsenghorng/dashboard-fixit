"use client";

import React from "react";

export default function BookingTableFooter({
  serviceBookings = [],
  pagination,
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
}) {
  const currentPage = pagination?.current_page || pagination?.page || 1;
  const lastPage = pagination?.last_page || pagination?.total_pages || 1;
  const total = pagination?.total || serviceBookings.length;

  return (
    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-5 py-3.5">
      <p className="text-[11px] font-medium text-slate-400">
        Showing {serviceBookings.length} of {total} records
        {total > 0 && (
          <span className="ml-2">
            Page {currentPage} of {lastPage}
          </span>
        )}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={disablePrevious}
          className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
