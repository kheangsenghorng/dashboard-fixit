"use client";

import { useEffect, useState } from "react";
import { RefreshCw, ShieldCheck, AlertCircle, Lock } from "lucide-react";

export default function AbaBridgePage() {
  const [status, setStatus] = useState("connecting"); // connecting | redirecting | error

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        // 1. Fetch signed data from your Laravel Backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/aba/prepare`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 10.00 }), // Example amount
        });
        
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        
        setStatus("redirecting");

        // 2. Create and Submit Hidden Form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";

        Object.keys(data).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = data[key] ?? "";
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } catch (err) {
        setStatus("error");
      }
    };

    initiatePayment();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">
        
        {/* Top Progress Bar */}
        {status !== "error" && (
          <div className="absolute top-0 left-0 h-1 bg-cyan-500 animate-pulse w-full" />
        )}

        <div className="mb-10">
          <h1 className="text-2xl font-black text-[#005fa9] flex items-center justify-center gap-2">
            ABA <span className="text-cyan-500">PAYWAY</span>
          </h1>
        </div>

        {status === "error" ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Connection Failed</h2>
              <p className="text-sm text-gray-500 mt-2">
                Could not connect to the gateway. <br />
                Please check your internet and try again.
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[#005fa9] text-white rounded-2xl font-bold hover:bg-[#004b85] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative flex justify-center">
              <RefreshCw className="w-16 h-16 text-cyan-500 animate-spin" />
              <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#005fa9]" />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-800">
                {status === "connecting" ? "Securing Connection..." : "Redirecting..."}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed px-4">
                We are opening the secure payment gateway.<br />
                <span className="font-semibold text-[#005fa9] block mt-1">
                   Please do not close this window or refresh.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Payment Network Support */}
        <div className="mt-12 pt-8 border-t border-gray-50">
          <div className="flex justify-center items-center gap-6 grayscale opacity-40">
            <span className="text-[11px] font-black italic text-gray-700 tracking-tighter">VISA</span>
            <span className="text-[11px] font-black italic text-gray-700 tracking-tighter">MASTERCARD</span>
            <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}