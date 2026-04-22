import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

export default function PaymentCheckOverlay({
  isChecking,
  transactionResult,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  const hash = transactionResult?.data?.hash || "";
  const shortHash = hash ? hash.slice(0, 8) : "N/A";

  const handleCopyHash = async () => {
    if (!hash) return;

    await navigator.clipboard.writeText(hash);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/70 p-4">
      {isChecking ? (
        <div className="flex flex-col items-center rounded-2xl bg-white px-8 py-8 text-center shadow-xl">
          <div className="relative flex items-center justify-center">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-50 border-t-indigo-600" />

            <div className="absolute">
              <Activity className="h-5 w-5 animate-pulse text-indigo-600" />
            </div>
          </div>

          <h2 className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-slate-900">
            PAYMENT CHECK
          </h2>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Verifying Transaction...
          </p>
        </div>
      ) : transactionResult ? (
        <div
          className={`w-full max-w-sm rounded-2xl border p-4 shadow-xl transition-all duration-300 ${
            transactionResult?.responseCode === 0
              ? "border-emerald-200 bg-emerald-50"
              : "border-rose-200 bg-rose-50"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {transactionResult?.responseCode === 0 ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              )}

              <div>
                <h3
                  className={`text-xs font-black uppercase tracking-widest ${
                    transactionResult?.responseCode === 0
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }`}
                >
                  {transactionResult?.responseMessage || "Unknown"}
                </h3>

                <p className="text-[10px] text-slate-500">
                  Payment Verification Result
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-500 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className="space-y-2 rounded-xl bg-white/70 p-3 text-[11px] text-slate-700">
            <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-400">
                Transaction ID
              </span>
              <span className="font-mono text-right text-slate-700">
                {transactionResult?.data?.externalRef || "N/A"}
              </span>
            </div>

            <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-400">Amount</span>
              <span className="font-bold text-slate-900">
                {transactionResult?.data?.amount || "N/A"}{" "}
                {transactionResult?.data?.currency || ""}
              </span>
            </div>

            <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-400">From</span>
              <span className="max-w-[180px] break-all text-right font-mono text-slate-700">
                {transactionResult?.data?.fromAccountId || "N/A"}
              </span>
            </div>

            <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-400">To</span>
              <span className="max-w-[180px] break-all text-right font-mono text-slate-700">
                {transactionResult?.data?.toAccountId || "N/A"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="font-semibold text-slate-400">Hash</span>

              <div className="flex max-w-[220px] flex-col items-end gap-1">
                <button
                  onClick={handleCopyHash}
                  className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] text-slate-700 hover:bg-slate-50"
                >
                  <span>{shortHash}</span>

                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-slate-400" />
                  )}
                </button>

                <span className="break-all text-right font-mono text-[9px] text-slate-500">
                  {hash || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
