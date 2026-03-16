// components/owner/DocumentSection.jsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCcw,
  Search,
  Plus,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { useDocumentOwnerStore } from "@/app/store/owner/useDocumentStore";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

export default function DocumentSection() {
  const { user } = useAuthGuard();
  const {
    documents = [],
    loading,
    fetchOwnerDocuments,
    fetchDocumentsByStatus,
  } = useDocumentOwnerStore();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    statusFilter === "all"
      ? fetchOwnerDocuments()
      : fetchDocumentsByStatus(statusFilter);
  }, [statusFilter, fetchOwnerDocuments, fetchDocumentsByStatus]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const searchTarget = `${doc.document_type} ${doc.id}`.toLowerCase();
      return searchTarget.includes(searchQuery.toLowerCase());
    });
  }, [documents, searchQuery]);



  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Business Documents
          </h3>
          <p className="text-slate-500 text-sm">
            Manage and monitor your verification status.
          </p>
        </div>
        <Link
          href="/owner/documents/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95 text-sm"
        >
          <Plus size={18} />
          <span>Upload New</span>
        </Link>
      </div>


      {/* List */}
      <div className="space-y-3">
        {loading ? (
          [1, 2].map((i) => (
            <div
              key={i}
              className="h-20 w-full bg-slate-100 animate-pulse rounded-2xl"
            />
          ))
        ) : filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${getStatusBg(doc.status)}`}>
                  <FileText className={getStatusColor(doc.status)} size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm capitalize">
                    {doc.document_type?.replaceAll("_", " ")}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    ID: {doc.id} • {doc.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <StatusBadge
                  status={doc.status}
                  reason={doc.rejection_reason}
                />
                {doc.status === "rejected" ? (
                  <Link
                    href={`/owner/documents/reupload/${doc.id}`}
                    className="text-orange-600 bg-orange-50 p-2 rounded-lg hover:bg-orange-600 hover:text-white transition-all"
                  >
                    <RefreshCcw size={16} />
                  </Link>
                ) : (
                  <button className="text-slate-400 hover:text-indigo-600">
                    <ArrowUpRight size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 text-sm italic">
              No documents found matching this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ label, value, color }) {
  return (
    <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className={`text-xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status, reason }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
  }[status];

  return (
    <div className="group relative">
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-tighter ${styles}`}
      >
        {status}
      </span>
      {status === "rejected" && reason && (
        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 shadow-xl">
          {reason}
        </div>
      )}
    </div>
  );
}

const getStatusBg = (status) =>
  status === "approved"
    ? "bg-emerald-50"
    : status === "rejected"
    ? "bg-rose-50"
    : "bg-indigo-50";
const getStatusColor = (status) =>
  status === "approved"
    ? "text-emerald-500"
    : status === "rejected"
    ? "text-rose-500"
    : "text-indigo-500";
