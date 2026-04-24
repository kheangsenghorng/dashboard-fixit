"use client";

import React from "react";
import { cn } from "./bookingPaymentUtils";

export default function StatusBadge({ config }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset",
        config?.bg,
        config?.text,
        config?.ring
      )}
    >
      {config?.dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            config.dot,
            config.pulse && "animate-pulse"
          )}
        />
      )}

      {config?.label}
    </span>
  );
}