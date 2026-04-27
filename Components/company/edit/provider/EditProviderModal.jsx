"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { toast } from "react-toastify";

import { useProviderStore } from "../../../../app/store/provider/providerStore";
import { useOwnerGuard } from "../../../../app/hooks/useOwnerGuard";
import { useOwnerCategoryStore } from "../../../../app/store/owner/useOwnerCategoryStore";

export default function EditProviderModal({ isOpen, onClose, provider }) {
  const { ownerId, authUser, initialized } = useOwnerGuard();

  const {
    updateProvider,
    loading: providerLoading,
    fetchProvidersByOwner,
  } = useProviderStore();

  const {
    activeCategories,
    fetchActiveCategoriesByOwner,
    loading: categoryLoading,
  } = useOwnerCategoryStore();

  const [formData, setFormData] = useState({
    category_id: "",
    status: "active",
  });

  useEffect(() => {
    if (isOpen) {
      fetchActiveCategoriesByOwner();
    }
  }, [isOpen, fetchActiveCategoriesByOwner]);

  useEffect(() => {
    if (provider) {
      setFormData({
        category_id: provider.category_id || provider.category?.id || "",
        status: provider.status || "active",
        comment: provider.comment || "",
      });
    }
  }, [provider]);

  if (!isOpen || !provider) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const providerId = provider.providerId || provider.id;

    if (!providerId) {
      toast.error("Provider ID not found.");
      return;
    }

    if (!formData.category_id) {
      toast.warning("Please select a category.");
      return;
    }

    try {
      const payload = {
        category_id: Number(formData.category_id),
        status: formData.status,
      };

      await updateProvider(providerId, payload);

      if (ownerId) {
        await fetchProvidersByOwner(ownerId);
      }

      toast.success("Provider updated successfully!");
      onClose();
    } catch (err) {
      const validationErrors = err?.response?.data?.errors;

      const errorMessage = validationErrors
        ? Object.values(validationErrors).flat().join(" ")
        : err?.response?.data?.message || "Failed to update provider.";

      toast.error(errorMessage);
      console.error("Update failed:", err?.response?.data || err);
    }
  };

  if (!initialized || !authUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                formData.status === "active"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {formData.status === "active" ? (
                <ShieldCheck size={24} />
              ) : (
                <ShieldAlert size={24} />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Manage Provider
              </h2>

              <p className="text-sm text-slate-500 font-medium">
                {provider.user?.name || provider.name || "Service Provider"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Category
              </label>

              <div className="relative">
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category_id: e.target.value,
                    }))
                  }
                  disabled={categoryLoading}
                  className="w-full appearance-none px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium cursor-pointer disabled:opacity-60"
                >
                  <option value="">
                    {categoryLoading
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {activeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 4.5 3 3 3-3" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Availability Status
              </label>

              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full appearance-none px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium cursor-pointer"
                >
                  <option value="active">Active (Visible to users)</option>
                  <option value="inactive">Inactive (Hidden from users)</option>
                  <option value="suspended">Suspended</option>
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 4.5 3 3 3-3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl p-4 flex gap-3 border ${
              formData.status === "inactive"
                ? "bg-rose-50 border-rose-100"
                : "bg-indigo-50 border-indigo-100"
            }`}
          >
            <AlertCircle
              className={`shrink-0 mt-0.5 ${
                formData.status === "inactive"
                  ? "text-rose-600"
                  : "text-indigo-600"
              }`}
              size={18}
            />

            <p
              className={`text-[12px] font-medium leading-relaxed ${
                formData.status === "inactive"
                  ? "text-rose-700"
                  : "text-indigo-700"
              }`}
            >
              {formData.status === "inactive"
                ? "Warning: Setting this provider to Inactive will prevent them from appearing in search results and receiving new job notifications."
                : "This provider is currently Active. They can receive job requests and is visible to customers."}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={providerLoading}
              className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {providerLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} />
                  <span>Update Provider</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
