"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "./bookingPaymentUtils";

export default function InfoRow({ icon: Icon, label, value, mono = false, link }) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-start gap-2">
      <Icon size={12} className="mt-0.5 shrink-0 text-slate-400" />

      <div className="min-w-0">
        <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-slate-400">
          {label}
        </span>

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1 text-[11px] text-indigo-600 hover:underline",
              mono && "font-mono"
            )}
          >
            {value} <ExternalLink size={10} />
          </a>
        ) : (
          <span
            className={cn(
              "break-all text-[11px] text-slate-700",
              mono && "font-mono"
            )}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
}