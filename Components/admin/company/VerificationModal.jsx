import React, { useState } from "react";
import { useDocumentStore } from "@/app/store/documentStore";
import { toast } from "react-toastify";

export default function VerificationModal({ isOpen, onClose, document }) {
  const [step, setStep] = useState("request"); // request | verify
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendOtp, verifyOtp } = useDocumentStore();

  if (!isOpen) return null;

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      const res = await sendOtp(document.id);
      toast.success("OTP Sent to Telegram");
      setStep("verify");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyOtp(document.id, otp);
      toast.success("Identity Verified!");
      window.open(res.download_url, "_blank"); // Opens the signed Laravel URL
      onClose();
    } catch (err) {
      toast.error("Invalid OTP or Expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Access</h3>
        <p className="text-slate-500 text-sm mb-6">Accessing encrypted document <b>#{document.id}</b> requires Telegram OTP verification.</p>

        {step === "request" ? (
          <button
            onClick={handleRequestOtp}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
          >
            {loading ? "Sending..." : "Send OTP to Telegram"}
          </button>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter 6-digit Code"
              className="w-full p-4 border border-slate-200 rounded-2xl text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 outline-none"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerify}
              disabled={loading || otp.length < 6}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all"
            >
              Verify & Download
            </button>
          </div>
        )}
        
        <button onClick={onClose} className="w-full mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
          Cancel
        </button>
      </div>
    </div>
  );
}