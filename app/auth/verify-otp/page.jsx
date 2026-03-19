"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Loader2,
  ArrowRight,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";

const OTP_LENGTH = 5;

export default function VerifyOtpPage() {
  const router = useRouter();

  const login = useAuthStore((s) => s.otpLogin);
  const channel = useAuthStore((s) => s.otpChannel) || "phone";
  const redirect = useAuthStore((s) => s.otpRedirect);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const resendOtp = useAuthStore((s) => s.resendOtp);
  const clearOtpContext = useAuthStore((s) => s.clearOtpContext);
  const storeLoading = useAuthStore((s) => s.loading);
  const storeError = useAuthStore((s) => s.error);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [localError, setLocalError] = useState(null);
  const [resending, setResending] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const error = localError || storeError;
  const loading = storeLoading;

  const finishLogin = useCallback(
    (user) => {
      clearOtpContext();

      if (redirect) {
        router.replace(redirect);
        return;
      }

      switch (user.role) {
        case "admin":
          router.replace("/admin/dashboard");
          break;
        case "owner":
          router.replace("/owner/dashboard");
          break;
        default:
          router.replace("/");
      }
    },
    [clearOtpContext, redirect, router]
  );

  const submitOtp = useCallback(
    async (otpCode) => {
      if (!login) {
        setLocalError("Missing login info. Please go back and try again.");
        return;
      }

      if (otpCode.length !== OTP_LENGTH || loading) {
        return;
      }

      try {
        const user = await verifyOtp(login, otpCode, channel);
        finishLogin(user);
      } catch (e) {
        console.error("OTP verify error:", e);
        setHasAutoSubmitted(false);
      }
    },
    [login, loading, verifyOtp, channel, finishLogin]
  );

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
    setLocalError(null);

    if (!value) {
      setHasAutoSubmitted(false);
    }

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const nextOtp = [...otp];
        nextOtp[index] = "";
        setOtp(nextOtp);
        setHasAutoSubmitted(false);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const nextOtp = pasted.split("");
    while (nextOtp.length < OTP_LENGTH) nextOtp.push("");

    setOtp(nextOtp);
    setLocalError(null);
    setHasAutoSubmitted(false);

    const focusIndex = Math.min(pasted.length - 1, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== OTP_LENGTH) {
      setLocalError(`Please enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }

    await submitOtp(otpCode);
  };

  const handleResend = async () => {
    if (!login) {
      setLocalError("Missing login info. Please go back and try again.");
      return;
    }

    try {
      setResending(true);
      setLocalError(null);
      setHasAutoSubmitted(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      await resendOtp(login, channel);
      inputRefs.current[0]?.focus();
    } catch (e) {
      console.error("Resend OTP error:", e);
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
    clearOtpContext();
  };

  useEffect(() => {
    const otpCode = otp.join("");
    const isComplete = otp.every((digit) => digit !== "");

    if (
      isComplete &&
      otpCode.length === OTP_LENGTH &&
      !loading &&
      !hasAutoSubmitted
    ) {
      setHasAutoSubmitted(true);
      submitOtp(otpCode);
    }
  }, [otp, loading, hasAutoSubmitted, submitOtp]);

  const destinationLabel = channel === "email" ? login : login || "your phone";

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/60 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-rose-100/50 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-white rounded-[32px] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">
              <Link href="/" className="block">
                <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  Saby-Tinh
                </span>
              </Link>
            </div>

            <div className="w-full h-px bg-slate-100 my-2" />

            <div className="mt-5">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 mx-auto shadow-sm">
                <ShieldCheck size={24} strokeWidth={2} />
              </div>

              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Verify your identity
              </h2>

              <p className="text-[12px] text-slate-400 font-bold mt-1.5 leading-relaxed max-w-[260px] mx-auto">
                Enter the {OTP_LENGTH}-digit code sent to{" "}
                <span className="text-slate-700 font-black">
                  {destinationLabel}
                </span>
              </p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  autoFocus={index === 0}
                  className={`w-12 h-14 rounded-xl border-2 text-center text-xl font-black transition-all outline-none ${
                    digit
                      ? "border-indigo-400 bg-white text-indigo-600 focus:ring-4 focus:ring-indigo-500/5"
                      : "border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2.5 p-3 bg-rose-50 border border-rose-100 rounded-xl"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <p className="text-[11px] font-bold text-rose-600 leading-snug">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  Confirm Code <ArrowRight size={14} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between">
            <Link
              href="/auth/login"
              onClick={handleBackToLogin}
              className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
            >
              ← Back to Login
            </Link>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending || loading}
              className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-60"
            >
              <RefreshCcw
                size={11}
                className={resending ? "animate-spin" : ""}
              />
              {resending ? "Sending..." : "Resend Code"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
