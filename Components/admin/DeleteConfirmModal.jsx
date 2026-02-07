"use client";

import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  count,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={36} />
          </div>

          <h3 className="text-2xl font-black mb-2">Confirm Deletion</h3>
          <p className="text-gray-500 mb-8">
            Delete <b>{count}</b> selected {count === 1 ? "user" : "users"}?
            <br />
            This action cannot be undone.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Yes, Delete"}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="w-full bg-gray-100 hover:bg-gray-200 py-4 rounded-2xl font-bold disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
        