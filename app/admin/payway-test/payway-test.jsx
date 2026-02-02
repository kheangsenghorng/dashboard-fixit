 "use client";

import { useState } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function PayWayTest() {
  const { user, ready } = useAuthGuard();

  const { pay, loading, error, qrImage, tranId, status } = usePaymentStore();

  const [testAmount, setTestAmount] = useState("1.00");

  if (!ready) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-4">

        <h1 className="text-xl font-bold text-center text-[#005fa9]">
          ABA PayWay Test UI
        </h1>

        {/* Logged-in User */}
        <div className="text-xs text-center text-gray-500">
          Logged in as: {user?.email}
        </div>

        <input
          type="number"
          step="0.01"
          value={testAmount}
          onChange={(e) => setTestAmount(e.target.value)}
          className="border rounded w-full p-2"
          placeholder="Amount"
        />

        <button
          onClick={() => pay(testAmount)}
          disabled={loading}
          className="w-full bg-[#005fa9] text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {status && (
          <div className="text-center text-green-600 font-semibold">
            {status}
          </div>
        )}

        {tranId && (
          <p className="text-xs text-center text-gray-500">
            Tran ID: {tranId}
          </p>
        )}

        {qrImage && (
          <div className="flex justify-center">
            <img src={qrImage} className="w-60 h-60" />
          </div>
        )}

      </div>
    </div>
  );
}
