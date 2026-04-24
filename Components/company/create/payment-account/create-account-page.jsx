"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Loader2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Lock,
  ShieldAlert,
  Fingerprint,
  Globe,
} from "lucide-react";

import usePaymentAccountStore from "../../../../app/store/payment-account/payment-accountStore";
import useServicePaymentKhqrStore from "../../../../app/store/khqr/useServicePaymentKhqrStore";
import { useRequireAuth } from "../../../../app/hooks/useRequireAuth";

// --- Logic Helpers ---
const ACTIVE_ACCOUNT_STATUSES = ["ACTIVATED", "NORMAL", "ACTIVE"];
const normalizeBakongResponse = (response) => response?.data || null;
const isFrozenAccount = (value) =>
  value === true || value === 1 || value === "1";
const isSuccessResponseCode = (value) =>
  value === 0 || value === "0" || value === "00";

const isValidBakongAccount = (data) => {
  if (!data) return false;
  const accountStatus = String(data.accountStatus || "").toUpperCase();
  return (
    isSuccessResponseCode(data.responseCode) &&
    data.canReceive === true &&
    !isFrozenAccount(data.frozen) &&
    ACTIVE_ACCOUNT_STATUSES.includes(accountStatus)
  );
};

const getBakongErrorMessage = (data) => {
  if (!data) return "Unable to verify this Bakong account. Please try again.";
  if (!isSuccessResponseCode(data.responseCode))
    return data.responseMessage || "Bakong account not found.";
  if (isFrozenAccount(data.frozen)) return "This account is frozen.";
  return "Invalid account.";
};

export default function CreateAccountPage() {
  const router = useRouter();
  const { user: authUser, initialized } = useRequireAuth();
  const userId = authUser?.id;

  const {
    createPaymentAccount,
    loading: paymentLoading,
    error: paymentError,
  } = usePaymentAccountStore();
  const {
    checkBakongAccount,
    loading: bakongLoading,
    error: bakongError,
  } = useServicePaymentKhqrStore();

  const [formData, setFormData] = useState({
    user_id: "",
    account_name: "",
    account_id: "",
    currency: "usd",
    type_value: "bakong",
    account_city: "Phnom Penh",
    status: 1,
  });

  const [verifiedBakongAccount, setVerifiedBakongAccount] = useState(null);
  const [showBakongPopup, setShowBakongPopup] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  const loading = paymentLoading || bakongLoading;
  const errorMessage = localError || paymentError || bakongError;
  const accountId = useMemo(
    () => formData.account_id.trim(),
    [formData.account_id]
  );

  useEffect(() => {
    if (userId) setFormData((prev) => ({ ...prev, user_id: userId }));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "account_id") {
      setVerifiedBakongAccount(null);
      setLocalError("");
    }
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" || name === "user_id" ? Number(value) : value,
    }));
  };

  const verifyBakongAccount = async () => {
    setLocalError("");
    if (!accountId) return setLocalError("Bakong account ID is required.");
    try {
      const response = await checkBakongAccount(accountId);
      const data = normalizeBakongResponse(response);
      if (!isValidBakongAccount(data)) {
        setLocalError(getBakongErrorMessage(data));
        return;
      }
      setVerifiedBakongAccount({ message: "Verified", data });
      if (data?.fullName && !formData.account_name.trim()) {
        setFormData((prev) => ({ ...prev, account_name: data.fullName }));
      }
      setShowBakongPopup(true);
    } catch (err) {
      setLocalError("Verification failed.");
    }
  };

  const handleFinalSubmit = async () => {
    if (!isAgreed) return setLocalError("Agreement required.");
    try {
      const payload = {
        ...formData,
        user_id: userId || Number(formData.user_id),
        status: 1,
        currency: "usd",
      };
      await createPaymentAccount(payload);
      router.push("/owner/dashboard");
    } catch (err) {
      setLocalError("Creation failed.");
    }
  };

  if (!initialized)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
            <button
              onClick={() => router.back()}
              className="hover:text-blue-600"
            >
              Payments
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Add Account</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Setup Payment Method
          </h1>
        </div>
        {errorMessage && (
          <div className="flex items-center gap-3 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 animate-bounce">
            <AlertCircle className="w-4 h-4" /> {errorMessage}
          </div>
        )}
      </div>

      {/* 1 Row 2 Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start font-sans">
        {/* Card 1: Account Information */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden min-h-[500px] flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Identity Details
                </h2>
                <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  Step 1: Link Bakong
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 flex-1">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Bakong / KHQR ID
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="account_id"
                  value={formData.account_id}
                  onChange={handleChange}
                  placeholder="name@aba"
                  className="w-full pl-6 pr-28 py-5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-blue-600 outline-none transition-all font-mono text-sm shadow-inner"
                />
                <button
                  type="button"
                  onClick={verifyBakongAccount}
                  disabled={bakongLoading || !formData.account_id}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all active:scale-95 disabled:bg-gray-200"
                >
                  {bakongLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    name="account_name"
                    value={formData.account_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-blue-600 outline-none transition-all text-sm font-bold text-gray-800"
                    placeholder="Auto-filled"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    name="account_city"
                    value={formData.account_city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-blue-600 outline-none transition-all text-sm font-bold text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Privacy & Security */}
        <div className="bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col relative border-8 border-gray-900">
          {/* Decorative Background Icon */}
          <Fingerprint className="absolute -right-10 -bottom-10 w-48 h-48 text-white/[0.03] rotate-12" />

          <div className="p-8 border-b border-white/5 flex items-center gap-4 relative">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Privacy & Security
              </h2>
              <p className="text-xs text-white/40 font-medium tracking-wide uppercase">
                Step 2: Agreement
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8 flex-1 relative">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] group hover:bg-white/[0.08] transition-colors">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
                <h3 className="text-white text-sm font-bold mb-1">
                  Encrypted Data
                </h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  Your Bakong ID is stored in an encrypted vault and is never
                  shared with third parties.
                </p>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] group hover:bg-white/[0.08] transition-colors">
                <Globe className="w-6 h-6 text-blue-400 mb-3" />
                <h3 className="text-white text-sm font-bold mb-1">
                  KHQR Standard
                </h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  We strictly follow National Bank of Cambodia (NBC) KHQR
                  security protocols for all transactions.
                </p>
              </div>
            </div>

            {/* Agreement Box */}
            <div className="mt-4 p-6 bg-white rounded-3xl">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-gray-200 transition-all checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
                  />
                  <CheckCircle className="absolute left-1 top-1 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
                    Agreement
                  </p>
                  <span className="text-sm font-bold text-gray-800 leading-tight">
                    I acknowledge that I am linking my official account for
                    business settlements.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar (Below both cards) */}
      <div className="mt-12 flex flex-col-reverse md:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400 max-w-[200px] font-medium leading-relaxed">
            By clicking save, your account will be active immediately.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => router.back()}
            className="flex-1 md:flex-none px-8 py-4 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={
              verifiedBakongAccount ? handleFinalSubmit : verifyBakongAccount
            }
            disabled={loading || !isAgreed}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all active:scale-95 ${
              verifiedBakongAccount
                ? "bg-emerald-600 shadow-emerald-200"
                : "bg-blue-600 shadow-blue-200"
            } disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : verifiedBakongAccount ? (
              "Link Account"
            ) : (
              "Verify & Save"
            )}
          </button>
        </div>
      </div>

      {/* Modal Confirmation */}
      {showBakongPopup && verifiedBakongAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in duration-300">
            <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mb-6">
              <ShieldCheck className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Verified</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
              We found{" "}
              <span className="text-gray-900 font-black">
                {verifiedBakongAccount.data?.fullName}
              </span>
              . <br />
              Ready to generate your KHQR?
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setShowBakongPopup(false)}
                className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600"
              >
                Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
