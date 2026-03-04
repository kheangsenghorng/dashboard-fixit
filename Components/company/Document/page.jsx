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
import { useDocumentOwnerStore } from "../../../app/store/owner/useDocumentStore";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";

export default function CompanyDocumentDashboard() {
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
    if (statusFilter === "all") {
      fetchOwnerDocuments();
    } else {
      fetchDocumentsByStatus(statusFilter);
    }
  }, [statusFilter, fetchOwnerDocuments, fetchDocumentsByStatus]);

  // Instant Client-side Filter
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const searchTarget = `${doc.document_type} ${doc.id}`.toLowerCase();
      return searchTarget.includes(searchQuery.toLowerCase());
    });
  }, [documents, searchQuery]);

  // Statistics Calculation
  const stats = useMemo(() => ({
    total: documents.length,
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  }), [documents]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200/60 pt-8 pb-6 mb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Company Documents
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Manage and monitor your business verification status.
              </p>
            </div>
            <Link
              href="/owner/documents/upload"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              <Plus size={20} />
              <span>Upload New</span>
            </Link>
          </div>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatCard label="Total" value={stats.total} color="text-slate-600" />
            <StatCard label="Approved" value={stats.approved} color="text-emerald-600" />
            <StatCard label="Pending" value={stats.pending} color="text-amber-600" />
            <StatCard label="Rejected" value={stats.rejected} color="text-rose-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        {/* Search & Tabs Toolbar */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or document type..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl outline-none transition-all text-sm"
            />
          </div>
          
          <div className="flex items-center gap-1 w-full md:w-auto p-1 bg-slate-100 rounded-xl">
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  statusFilter === s 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Document List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 w-full bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid gap-4">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id}
                className="group bg-white border border-slate-200 rounded-2xl p-4 md:p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${getStatusBg(doc.status)} transition-transform group-hover:scale-105 duration-300`}>
                    <FileText className={getStatusColor(doc.status)} size={26} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg capitalize">
                      {doc.document_type?.replaceAll("_", " ")}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-slate-400 uppercase">{doc.country}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-xs font-medium text-slate-500">ID: {doc.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 md:gap-12">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
                    <StatusBadge status={doc.status} reason={doc.rejection_reason} />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Updated</span>
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400" />
                      {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : "—"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    {doc.status === "rejected" ? (
                      <Link
                        href={`/owner/documents/reupload/${doc.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-600 hover:text-white transition-all border border-orange-100"
                      >
                        <RefreshCcw size={16} />
                        Re-upload
                      </Link>
                    ) : (
                      <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <ArrowUpRight size={20} />
                      </button>
                    )}
                    <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 py-20 text-center">
            <Search className="text-slate-200 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-900">No documents found</h3>
            <p className="text-slate-500 mt-1">Try changing your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** 
 * Helper Components for Cleanliness
 */

function StatCard({ label, value, color }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status, reason }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10",
    rejected: "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/10",
    pending: "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10",
  }[status] || "bg-slate-50 text-slate-700 border-slate-100";

  const icons = {
    approved: <CheckCircle2 size={14} />,
    rejected: <AlertCircle size={14} />,
    pending: <Clock size={14} />,
  };

  return (
    <div className="group relative cursor-default">
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter ring-2 ring-offset-1 transition-all ${styles}`}>
        {icons[status]}
        {status}
      </span>
      {status === "rejected" && reason && (
        <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl leading-relaxed">
          <p className="font-bold text-rose-400 mb-1 uppercase text-[9px]">Rejection Reason</p>
          {reason}
        </div>
      )}
    </div>
  );
}

// Utility style generators
const getStatusBg = (status) => {
  if (status === "approved") return "bg-emerald-50";
  if (status === "rejected") return "bg-rose-50";
  return "bg-indigo-50";
};

const getStatusColor = (status) => {
  if (status === "approved") return "text-emerald-500";
  if (status === "rejected") return "text-rose-500";
  return "text-indigo-500";
};