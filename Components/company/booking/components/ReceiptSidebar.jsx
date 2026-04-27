"use client";

import React from "react";
import { CreditCard, CheckCircle, Receipt, Fingerprint } from "lucide-react";
import Image from "next/image";

const ReceiptSidebar = ({ payment }) => {
  const isPaid = payment?.status === "paid";
  const isKHQR =
    payment?.method?.toLowerCase() === "khqr" ||
    payment?.method?.toLowerCase() === "bakong";

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 z-0" />

      <div className="relative z-10">
        {/* Header Area */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Receipt size={18} className="text-indigo-600" />
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Receipt
              </h2>
            </div>
            <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1 uppercase">
              <Fingerprint size={10} /> Ref:{" "}
              {payment?.transaction_id?.slice(0, 10) || "N/A"}
            </p>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
              isPaid
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-100"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaid ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {payment?.status || "Pending"}
            </span>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider">
              Base Amount
            </span>
            <span className="font-bold text-slate-700">
              ${Number(payment?.original_amount ?? 0).toFixed(2)}
            </span>
          </div>

          {Number(payment?.discount_amount) > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-500 uppercase tracking-wider">
                Discount
              </span>
              <span className="font-bold text-emerald-600">
                -${Number(payment?.discount_amount).toFixed(2)}
              </span>
            </div>
          )}

          {/* Dashed Separator */}
          <div className="py-2">
            <div className="border-t-2 border-dashed border-slate-100 w-full" />
          </div>

          <div className="flex justify-between items-end">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-1">
                Total Paid
              </span>
              <span className="text-4xl font-black text-slate-900 tracking-tighter">
                ${Number(payment?.final_amount ?? 0).toFixed(2)}
              </span>
            </div>
            {isPaid && (
              <div className="mb-1 w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <CheckCircle size={20} strokeWidth={3} />
              </div>
            )}
          </div>
        </div>

        {/* Payment Method Footer */}
        <div
          className={`rounded-2xl p-4 flex justify-between items-center border transition-all ${
            isKHQR
              ? "bg-slate-900 border-slate-800"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                isKHQR
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-400 border border-slate-200"
              }`}
            >
              <CreditCard size={18} />
            </div>
            <div>
              <p
                className={`text-[8px] font-black uppercase tracking-[0.15em] ${
                  isKHQR ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Method
              </p>
              <p
                className={`text-xs font-black ${
                  isKHQR ? "text-white" : "text-slate-700"
                }`}
              >
                {payment?.method?.toUpperCase() || "N/A"}
              </p>
            </div>
          </div>

          {/* Conditional Bakong KHQR Logo */}
          {isKHQR && (
            <div className="bg-white p-1.5 rounded-lg">
              <Image
                src="/images/bakong-khqr.png"
                alt="Bakong KHQR"
                width={65}
                height={24}
                className="object-contain h-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptSidebar;
