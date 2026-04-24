"use client";

import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "./bookingPaymentUtils";

export default function PaymentCheckToast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed left-1/2 top-6 z-50 w-full max-w-md -translate-x-1/2 px-4">
      <div
        className={cn(
          "flex items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-center text-sm font-semibold shadow-xl backdrop-blur-sm transition-all duration-300",
          message.type === "success"
            ? "border-emerald-200 bg-emerald-50/95 text-emerald-700"
            : "border-rose-200 bg-rose-50/95 text-rose-700"
        )}
      >
        {message.type === "success" ? (
          <CheckCircle2 size={18} className="shrink-0" />
        ) : (
          <AlertTriangle size={18} className="shrink-0" />
        )}

        <span>{message.text}</span>
      </div>
    </div>
  );
}