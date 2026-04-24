"use client";

import React, { useEffect, useState } from "react";
import {
  MapPin,
  CreditCard,
  Globe,
  MoreVertical,
  Loader2,
  Pencil,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  Plus,
  Fingerprint,
  Building2,
} from "lucide-react";

import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import usePaymentAccountStore from "../../../app/store/payment-account/payment-accountStore";
import useServicePaymentKhqrStore from "../../../app/store/khqr/useServicePaymentKhqrStore";

// Bakong verification helpers (Logic remains the same)
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
  if (!data) return "Unable to verify account.";
  if (!isSuccessResponseCode(data.responseCode))
    return data.responseMessage || "Account not found.";
  if (isFrozenAccount(data.frozen)) return "Account is frozen.";
  if (data.canReceive !== true) return "Cannot receive payments.";
  const accountStatus = String(data.accountStatus || "").toUpperCase();
  if (accountStatus && !ACTIVE_ACCOUNT_STATUSES.includes(accountStatus))
    return `Status: ${accountStatus}`;
  return data.responseMessage || "Invalid account.";
};

export default function PaymentAccountTable() {
  const { user: authUser } = useAuthGuard();
  const userId = authUser?.id;

  const {
    getPaymentAccountByUserId,
    paymentAccount,
    loading,
    error,
    updatePaymentAccount,
  } = usePaymentAccountStore();
  const { checkBakongAccount, loading: bakongLoading } =
    useServicePaymentKhqrStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [verifiedBakongAccount, setVerifiedBakongAccount] = useState(null);
  const [localError, setLocalError] = useState("");

  const [formData, setFormData] = useState({
    account_name: "",
    account_id: "",
    currency: "USD",
    type_value: "bakong",
    account_city: "",
    status: 1,
  });

  useEffect(() => {
    if (userId) getPaymentAccountByUserId(userId);
  }, [userId, getPaymentAccountByUserId]);

  const data = Array.isArray(paymentAccount)
    ? paymentAccount[0]
    : paymentAccount;

  const openEditModal = () => {
    if (!data) return;
    setFormData({
      account_name: data.account_name || "",
      account_id: data.account_id || "",
      currency: data.currency || "USD",
      type_value: data.type_value || "bakong",
      account_city: data.account_city || "",
      status: Number(data.status) ?? 1,
    });
    setVerifiedBakongAccount(null);
    setLocalError("");
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "account_id") setVerifiedBakongAccount(null);
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
  };

  const verifyBakongAccount = async () => {
    setLocalError("");
    const accountId = formData.account_id.trim();
    if (!accountId) return setLocalError("Account ID required.");

    try {
      const response = await checkBakongAccount(accountId);
      const bakongData = normalizeBakongResponse(response);
      if (!isValidBakongAccount(bakongData)) {
        setLocalError(getBakongErrorMessage(bakongData));
        return;
      }
      setVerifiedBakongAccount({ data: bakongData });
      setFormData((prev) => ({
        ...prev,
        account_name: bakongData?.fullName || prev.account_name,
      }));
    } catch (err) {
      setLocalError("Verification failed.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!verifiedBakongAccount)
      return setLocalError("Please verify the account first.");
    try {
      await updatePaymentAccount(data.id, {
        ...formData,
        status: Number(formData.status),
      });
      setShowEditModal(false);
      if (userId) await getPaymentAccountByUserId(userId);
    } catch (err) {
      setLocalError("Update failed.");
    }
  };

  if (loading && !showEditModal)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );

  if (!data)
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm font-medium text-slate-500">
        No payment accounts found.
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Payment Accounts
          </h1>
          <p className="text-sm text-slate-500">
            Manage your financial settlement methods and Bakong ID.
          </p>
        </div>
        <button
          onClick={openEditModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
        >
          <Pencil size={16} />
          Edit Account
        </button>
      </div>

      {/* CARD/TABLE CONTAINER */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">
                  Beneficiary
                </th>
                <th className="px-6 py-4 font-semibold text-slate-700">
                  Account details
                </th>
                <th className="px-6 py-4 font-semibold text-slate-700">
                  Currency
                </th>
                <th className="px-6 py-4 font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold">
                      {data.account_name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {data.account_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {data.account_city || "General"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="font-mono text-xs font-medium text-slate-600">
                    {data.account_id}
                  </div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                    {data.type_value}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Globe size={14} className="text-slate-400" />
                    <span>{data.currency}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      Number(data.status) === 1
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                        : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        Number(data.status) === 1
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    {Number(data.status) === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={openEditModal}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CLEAN MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Update Payment Account
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              {localError && (
                <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 border border-red-100">
                  <AlertCircle size={18} /> {localError}
                </div>
              )}
              {verifiedBakongAccount && (
                <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700 border border-emerald-100">
                  <CheckCircle2 size={18} /> Account Verified:{" "}
                  {verifiedBakongAccount.data?.fullName}
                </div>
              )}

              <div className="space-y-4">
                {/* Account ID Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Bakong Account ID
                  </label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <Fingerprint
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        name="account_id"
                        value={formData.account_id}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="yourname@bank"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={verifyBakongAccount}
                      disabled={bakongLoading}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-300"
                    >
                      {bakongLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        "Verify"
                      )}
                    </button>
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Account Holder Name
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      name="account_name"
                      value={formData.account_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Status Select */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!verifiedBakongAccount || loading}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition-all active:scale-95"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
