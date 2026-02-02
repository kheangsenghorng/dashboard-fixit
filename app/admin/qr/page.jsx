"use client";


import { useRouter } from "next/navigation";
import { CheckCircle, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { usePaymentStore } from "../../store/payment/useAbaStore";

export default function AdminQRPage() {
  const router = useRouter();

  const {
    qrString,   
    qrImage,
    tranId,
    statusMessage,
    deeplink,
  } = usePaymentStore();

  useEffect(() => {
    if (!qrString && !qrImage) {
      const t = setTimeout(() => router.push("/admin/aba"), 1500);
      return () => clearTimeout(t);
    }
  }, [qrString, qrImage, router]);

  if (!qrString && !qrImage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No QR data. Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border p-8 text-center max-w-sm w-full">

        {/* STATUS */}
        <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">{statusMessage || "Success"}</span>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Transaction ID: {tranId}
        </p>

        <h1 className="text-xl font-bold text-[#005fa9] mb-4">
          Scan to Pay (ABA KHQR)
        </h1>

        {/* QR IMAGE (preferred) */}
        {qrImage ? (
          <img src={qrImage} className="mx-auto mb-4" />
        ) : (
          <div className="text-xs text-gray-400 mb-4">
            QR fallback active
          </div>
        )}

        <p className="text-xs text-gray-500 mb-4">
          Open ABA PAY or any KHQR-supported banking app.
        </p>

        {/* ABA Deeplink */}
        {deeplink && (
          <a
            href={deeplink}
            className="w-full mb-3 bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            Open ABA App
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        <button
          onClick={() => router.push("/admin/aba")}
          className="w-full bg-[#005fa9] text-white py-2 rounded-lg font-bold"
        >
          Back to Admin
        </button>
      </div>
    </div>
  );
}
