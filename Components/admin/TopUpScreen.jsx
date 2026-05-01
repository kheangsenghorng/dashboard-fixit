"use client";

import React, { useState } from "react";
import {
  Wallet,
  DollarSign,
  QrCode,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Copy,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useServicePaymentKhqrStore from "@/app/store/khqr/useServicePaymentKhqrStore";

const TopUpScreen = () => {
  const router = useRouter();

  const { loading, error, generateMerchantKhqr, generateKhqrImage } =
    useServicePaymentKhqrStore();

  const [formData, setFormData] = useState({
    amount: "",
    currency: "usd",
    bakong_account_id: "kheang_senghorng@bkrt",
    merchant_id: "39",
    acquiring_bank: "Bakong",
    merchant_name: "SAOKHOUCH KHORN",
    merchant_city: "Phnom Penh",
    mobile_number: "",
    store_label: "Store A",
    terminal_label: "POS 1",
  });

  const [khqr, setKhqr] = useState(null);
  const [copied, setCopied] = useState(false);

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getImageSrc = (image) => {
    if (!image) return null;

    if (image.startsWith("data:image")) {
      return image;
    }

    return `data:image/png;base64,${image}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateKhqr = async (e) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!formData.bakong_account_id) {
      alert("Bakong account ID is required.");
      return;
    }

    setKhqr(null);

    try {
      const khqrResponse = await generateMerchantKhqr({
        bakong_account_id: formData.bakong_account_id,
        merchant_id: String(formData.merchant_id || "MID001").slice(0, 32),
        acquiring_bank: String(formData.acquiring_bank || "Bakong").slice(
          0,
          32
        ),
        currency: formData.currency,
        amount: Number(formData.amount),
        merchant_name: String(formData.merchant_name || "Merchant").slice(
          0,
          25
        ),
        merchant_city: String(formData.merchant_city || "Phnom Penh").slice(
          0,
          15
        ),
        bill_number: `TOPUP-${Date.now()}`.slice(0, 25),
        mobile_number: formData.mobile_number || undefined,
        store_label: String(formData.store_label || "Store").slice(0, 25),
        terminal_label: String(formData.terminal_label || "POS").slice(0, 25),
        purpose_of_transaction: "Top up".slice(0, 25),
        expiration_timestamp: Date.now() + 10 * 60 * 1000,
        merchant_category_code: "5999",
      });

      const qr = khqrResponse?.data?.data?.qr;
      const md5 = khqrResponse?.data?.data?.md5;

      if (!qr || !md5) {
        alert("Failed to generate KHQR.");
        return;
      }

      const imageResponse = await generateKhqrImage({ qr });

      const qrImage =
        imageResponse?.data?.image ||
        imageResponse?.data?.qr_image ||
        imageResponse?.data?.data?.image ||
        imageResponse?.data?.data?.qr_image ||
        imageResponse?.image ||
        imageResponse?.qr_image ||
        null;

      setKhqr({
        qr,
        md5,
        image: qrImage,
        amount: Number(formData.amount),
        currency: formData.currency,
      });
    } catch (err) {
      console.log("Top up KHQR error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          Object.values(err.response?.data?.errors || {})?.flat()?.[0] ||
          err.message ||
          "Failed to generate top up KHQR"
      );
    }
  };

  const handleCopyQr = async () => {
    if (!khqr?.qr) return;

    await navigator.clipboard.writeText(khqr.qr);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleCopyMd5 = async () => {
    if (!khqr?.md5) return;

    await navigator.clipboard.writeText(khqr.md5);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-200">
              <ArrowLeft size={20} />
            </div>
            <span>Back</span>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-2">
            <Wallet size={18} />
            <span>Wallet Top Up</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight">Top Up Balance</h1>

          <p className="text-slate-500 mt-1">
            Generate a KHQR code for wallet top up payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form
            onSubmit={handleGenerateKhqr}
            className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 md:p-8 space-y-6"
          >
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                  Top Up Amount
                </p>

                <p className="text-3xl font-black text-indigo-700">
                  {formData.currency === "usd" ? "$" : "៛"}
                  {formatMoney(formData.amount || 0)}
                </p>
              </div>

              <div className="p-3 bg-indigo-200/50 rounded-xl text-indigo-600">
                <DollarSign size={30} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Currency
              </label>

              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="usd">USD</option>
                <option value="khr">KHR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Bakong Account ID
              </label>

              <input
                type="text"
                name="bakong_account_id"
                value={formData.bakong_account_id}
                onChange={handleChange}
                placeholder="account@bank"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Merchant Name
              </label>

              <input
                type="text"
                name="merchant_name"
                maxLength={25}
                value={formData.merchant_name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />

              <p className="text-[10px] text-slate-400 font-bold mt-1 ml-1">
                Max 25 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Merchant ID
                </label>

                <input
                  type="text"
                  name="merchant_id"
                  maxLength={32}
                  value={formData.merchant_id}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Acquiring Bank
                </label>

                <input
                  type="text"
                  name="acquiring_bank"
                  maxLength={32}
                  value={formData.acquiring_bank}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Merchant City
              </label>

              <input
                type="text"
                name="merchant_city"
                maxLength={15}
                value={formData.merchant_city}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />

              <p className="text-[10px] text-slate-400 font-bold mt-1 ml-1">
                Max 15 characters
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5" size={20} />
                <p className="text-sm font-bold text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode size={20} />
                  Generate KHQR
                </>
              )}
            </button>
          </form>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 md:p-8">
            {!khqr ? (
              <div className="h-full min-h-[520px] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-5">
                  <QrCode size={42} />
                </div>

                <h2 className="text-xl font-black text-slate-900 mb-2">
                  KHQR Preview
                </h2>

                <p className="text-sm text-slate-500 max-w-xs">
                  Enter an amount and generate a KHQR code. The QR image, QR
                  string, and MD5 reference will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-600" size={22} />

                  <p className="text-sm font-black text-emerald-700">
                    KHQR generated successfully
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Amount
                  </p>

                  <p className="text-4xl font-black text-slate-900">
                    {khqr.currency === "usd" ? "$" : "៛"}
                    {formatMoney(khqr.amount)}
                  </p>
                </div>

                {khqr.image ? (
                  <img
                    src={getImageSrc(khqr.image)}
                    alt="KHQR"
                    className="w-64 h-64 mx-auto bg-white border border-slate-200 rounded-2xl p-3"
                  />
                ) : (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                    <QrCode className="mx-auto text-amber-500 mb-2" />
                    <p className="text-sm font-bold text-amber-700">
                      QR image not available, but QR string was generated.
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      MD5 Reference
                    </p>

                    <button
                      type="button"
                      onClick={handleCopyMd5}
                      className="text-xs font-bold text-indigo-600 flex items-center gap-1"
                    >
                      <Copy size={14} />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <p className="text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 break-all">
                    {khqr.md5}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      QR String
                    </p>

                    <button
                      type="button"
                      onClick={handleCopyQr}
                      className="text-xs font-bold text-indigo-600 flex items-center gap-1"
                    >
                      <Copy size={14} />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <textarea
                    readOnly
                    value={khqr.qr}
                    className="w-full h-28 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setKhqr(null)}
                  className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                >
                  Generate New KHQR
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpScreen;
