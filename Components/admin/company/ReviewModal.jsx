"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useDocumentStore } from "@/app/store/documentStore";
import { toast } from "react-toastify";

export default function ReviewModal({ isOpen, onClose, document }) {
  const { reviewDocument, fetchDocuments } = useDocumentStore();
  const [status, setStatus] = useState("approved");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset state when document changes or modal opens
  useEffect(() => {
    if (document) {
      setStatus(document.status === "pending" ? "approved" : document.status);
      setReason(document.rejection_reason || "");
    }
  }, [document, isOpen]);

  if (!isOpen || !document) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reviewDocument(document.id, {
        status: status,
        rejection_reason: status === "rejected" ? reason : null,
      });
      
      toast.success(`Document ${status} successfully`);
      await fetchDocuments(); // Refresh the list
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update document status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Review Document</h3>
              <p className="text-xs text-slate-500 font-medium">ID: #{document.id} • {document.document_type}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Status Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setStatus("approved")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                status === "approved" 
                ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
              }`}
            >
              <CheckCircle size={24} />
              <span className="text-xs font-black uppercase tracking-widest">Approve</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus("rejected")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                status === "rejected" 
                ? "border-red-500 bg-red-50 text-red-700" 
                : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
              }`}
            >
              <XCircle size={24} />
              <span className="text-xs font-black uppercase tracking-widest">Reject</span>
            </button>
          </div>

          {/* Rejection Reason (Conditional) */}
          {status === "rejected" && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Rejection Reason
              </label>
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this document was rejected..."
                className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                status === "approved" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {status === "approved" ? "CONFIRM APPROVAL" : "CONFIRM REJECTION"}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}