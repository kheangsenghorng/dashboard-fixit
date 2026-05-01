"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Loader2,
  QrCode,
  RefreshCw,
  Send,
  Timer,
  AlertTriangle,
  User,
  Wallet,
  Building2,
  MapPin,
  Copy,
  CheckCircle2,
  SearchCheck,
} from "lucide-react";
import { formatMoney, getImageSrc } from "../../../../utils/formatters";

const ProcessPayoutModal = ({
  totals,
  paymentAccount,
  khqrError,
  khqrLoading,
  generatedKhqr,
  copied,
  isSubmitting,
  isCheckingTransaction,
  transactionResult,
  setCopied,
  setIsModalOpen,
  handleProcessPayment,
  handleCheckTransaction,
}) => {
  const INITIAL_TIME = 150;

  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [autoChecking, setAutoChecking] = useState(false);

  const timeLeftRef = useRef(timeLeft);
  const isPaidRef = useRef(false);

  const isPaid =
    transactionResult?.success === true &&
    transactionResult?.status === 200 &&
    transactionResult?.data?.responseCode === 0 &&
    String(transactionResult?.data?.responseMessage || "").toLowerCase() ===
      "success";

  const successData = transactionResult?.data?.data;

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    isPaidRef.current = isPaid;
  }, [isPaid]);

  useEffect(() => {
    if (!generatedKhqr?.md5) return;

    setTimeLeft(INITIAL_TIME);
    timeLeftRef.current = INITIAL_TIME;
  }, [generatedKhqr?.md5]);

  useEffect(() => {
    if (!generatedKhqr?.md5 || isPaid || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(prev - 1, 0);
        timeLeftRef.current = next;
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [generatedKhqr?.md5, isPaid, timeLeft]);

  useEffect(() => {
    if (!generatedKhqr?.md5 || isPaid) return;

    const interval = setInterval(async () => {
      if (timeLeftRef.current <= 0 || isPaidRef.current) return;

      try {
        setAutoChecking(true);
        await handleCheckTransaction(false);
      } catch (error) {
        console.log("Auto check failed:", error);
      } finally {
        setAutoChecking(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [generatedKhqr?.md5, isPaid, handleCheckTransaction]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleCopyMd5 = async () => {
    if (!generatedKhqr?.md5) return;

    try {
      await navigator.clipboard.writeText(generatedKhqr.md5);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch (error) {
      console.log("Copy failed:", error);
    }
  };

  const canCheckPayment =
    Boolean(generatedKhqr?.md5) &&
    timeLeft > 0 &&
    !isPaid &&
    !isCheckingTransaction &&
    !autoChecking;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
      <div
        className={`bg-white w-full rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col lg:flex-row max-h-[90vh] transition-all duration-500 ${
          generatedKhqr ? "max-w-md" : "max-w-5xl"
        }`}
      >
        {!generatedKhqr && (
          <div className="lg:w-2/5 p-10 bg-slate-50 border-r border-slate-100 overflow-y-auto animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900">
                Payout Details
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Review transaction before processing
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-lg shadow-indigo-200">
                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Total Release
                </p>

                <h3 className="text-4xl font-black">
                  ${formatMoney(totals.pending)}
                </h3>
              </div>

              <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <DetailRow
                  icon={<User size={14} />}
                  label="Merchant"
                  value={paymentAccount?.account_name}
                />

                <DetailRow
                  icon={<Wallet size={14} />}
                  label="Account ID"
                  value={paymentAccount?.account_id}
                  isCopyable
                />

                <DetailRow
                  icon={<Building2 size={14} />}
                  label="Type"
                  value={paymentAccount?.type_value}
                  highlight
                />

                <DetailRow
                  icon={<MapPin size={14} />}
                  label="City"
                  value={paymentAccount?.account_city}
                />
              </div>

              {khqrError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-xs font-bold uppercase">
                  <AlertTriangle size={16} />
                  {khqrError}
                </div>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        )}

        <div
          className={`p-8 relative flex flex-col items-center justify-center bg-grid transition-all duration-500 overflow-y-auto ${
            generatedKhqr ? "w-full" : "lg:w-3/5"
          }`}
        >
          {!generatedKhqr ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-indigo-500 mb-6 mx-auto">
                <QrCode size={40} />
              </div>

              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isSubmitting || khqrLoading || !paymentAccount}
                className="bg-[#003d71] text-white px-10 py-4 rounded-xl font-bold hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 mx-auto"
              >
                {khqrLoading || isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}

                {khqrLoading || isSubmitting
                  ? "GENERATING..."
                  : "GENERATE KHQR"}
              </button>
            </div>
          ) : isPaid ? (
            <div className="w-full max-w-sm animate-in zoom-in duration-500">
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
                  <CheckCircle2 size={52} className="text-emerald-600" />
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-2">
                  Payout Success
                </h2>

                <p className="text-sm text-slate-500 font-medium mb-8">
                  Payment has been confirmed and pending payouts were released.
                </p>

                <div className="w-full bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 mb-6">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                    Amount Paid
                  </p>

                  <h3 className="text-4xl font-black text-emerald-700">
                    ${formatMoney(successData?.amount || totals.pending)}
                  </h3>

                  <p className="text-xs text-emerald-600 font-bold mt-2 uppercase">
                    {successData?.currency || "USD"}
                  </p>
                </div>

                <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 space-y-3 text-left shadow-sm">
                  <SuccessRow
                    label="From Account"
                    value={successData?.fromAccountId}
                  />

                  <SuccessRow
                    label="To Account"
                    value={successData?.toAccountId}
                  />

                  <SuccessRow label="Hash" value={successData?.hash} mono />

                  <SuccessRow
                    label="External Ref"
                    value={successData?.externalRef}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm animate-in zoom-in duration-500">
              <div className="p-8 pt-6 flex flex-col items-center">
                {(transactionResult ||
                  autoChecking ||
                  isCheckingTransaction) && (
                  <div className="w-full mb-4 bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-2xl flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />

                    <p className="text-xs font-black uppercase tracking-widest">
                      Waiting For Payment
                    </p>
                  </div>
                )}

                <div className="relative p-2 border border-slate-100 rounded-2xl bg-white">
                  {timeLeft > 0 && (
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-red-500/40 shadow-[0_0_10px_red] animate-scan z-10" />
                  )}

                  {timeLeft === 0 ? (
                    <div className="w-72 h-72 bg-slate-50 flex flex-col items-center justify-center rounded-xl">
                      <AlertTriangle className="text-red-400 mb-2" />

                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Expired
                      </span>
                    </div>
                  ) : (
                    <img
                      src={getImageSrc(generatedKhqr.image)}
                      alt="KHQR"
                      className="w-100 h-100 object-contain"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCopyMd5}
                  disabled={!generatedKhqr?.md5}
                  className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all disabled:opacity-40"
                >
                  <Copy size={12} />
                  {copied ? "Copied MD5" : "Copy MD5"}
                </button>
              </div>

              <div className="mt-4 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                  <Timer
                    size={14}
                    className={
                      timeLeft < 60
                        ? "text-red-500 animate-pulse"
                        : "text-slate-500"
                    }
                  />

                  <span
                    className={`font-mono font-bold text-sm ${
                      timeLeft < 60 ? "text-red-500" : "text-slate-700"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
             

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={khqrLoading || isSubmitting}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-800 transition-all disabled:opacity-50"
                >
                  <RefreshCw
                    size={12}
                    className={
                      khqrLoading || isSubmitting ? "animate-spin" : ""
                    }
                  />
                  Regenerate Code
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-grid {
          background-size: 20px 20px;
          background-image: linear-gradient(
              to right,
              #f8fafc 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, #f8fafc 1px, transparent 1px);
        }

        @keyframes scan {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }

        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

const DetailRow = ({ icon, label, value, isCopyable, highlight }) => {
  const [copiedValue, setCopiedValue] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(true);

      setTimeout(() => {
        setCopiedValue(false);
      }, 1200);
    } catch (error) {
      console.log("Copy failed:", error);
    }
  };

  return (
    <div className="flex justify-between items-center group gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">
          {icon}
        </span>

        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`text-sm font-bold text-right truncate ${
            highlight ? "text-indigo-600" : "text-slate-900"
          }`}
          title={value || "N/A"}
        >
          {value || "N/A"}
        </span>

        {isCopyable && value && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 hover:bg-slate-100 rounded text-slate-300 hover:text-indigo-600 shrink-0"
            title="Copy"
          >
            {copiedValue ? <CheckCircle2 size={12} /> : <Copy size={12} />}
          </button>
        )}
      </div>
    </div>
  );
};

const SuccessRow = ({ label, value, mono }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {label}
    </span>

    <span
      className={`text-xs font-bold text-slate-700 break-all ${
        mono ? "font-mono" : ""
      }`}
    >
      {value || "N/A"}
    </span>
  </div>
);

export default ProcessPayoutModal;
