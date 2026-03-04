"use client";

import React, { useEffect, useMemo, useState } from "react";
import { 
  FileText, 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  Search, 
  Filter,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Activity
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useDocumentStore } from "@/app/store/documentStore";
import { useAuthGuard } from "../../../../app/hooks/useAuthGuard";
import VerificationModal from "../VerificationModal";
import ReviewModal from "../ReviewModal";

export default function DocumentManagementPage() {
  const params = useParams();
  const router = useRouter();
  const { user: authUser } = useAuthGuard();

  const { documents = [], loading, fetchDocumentsIdOwner } = useDocumentStore();

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const ownerId = useMemo(() => {
    const raw = params?.ownerId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  useEffect(() => {
    if (!ownerId) return;
    fetchDocumentsIdOwner(ownerId);
  }, [ownerId, fetchDocumentsIdOwner]);

  const stats = useMemo(() => ({
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending' || d.status === 'resubmitted').length,
    approved: documents.filter(d => d.status === 'approved').length,
  }), [documents]);

  const handleOpenVerify = (doc) => {
    setSelectedDoc(doc);
    setIsVerifyOpen(true);
  };

  const handleOpenReview = (doc) => {
    setSelectedDoc(doc);
    setIsReviewOpen(true);
  };

  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* SECURITY TOP BAR */}
      <div className="bg-white border-b border-slate-200/60 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">Compliance Portal</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              <Activity size={14} className="text-emerald-500" />
              System Secure
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs font-medium text-slate-500 italic">Auth Level: Administrator</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        {/* HEADER & STATS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight font-sans">
              Identity Verification
            </h1>
            <p className="text-slate-500 font-medium">
              Owner Archive: <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{ownerId}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <QuickStat label="Total Files" value={stats.total} />
            <QuickStat label="Awaiting Review" value={stats.pending} highlight />
            <QuickStat label="Approved" value={stats.approved} />
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Filter by document type or filename..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* DOCUMENT TABLE CARD */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Encrypted Document
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Classification
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">
                    Verification Status
                  </th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">
                    Security Protocols
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <LoadingRows />
                ) : documents.length === 0 ? (
                  <EmptyState />
                ) : (
                  documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-indigo-50/20 transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                              <FileText size={22} />
                            </div>
                            {doc.status === 'resubmitted' && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 border-2 border-white rounded-full animate-pulse" />
                            )}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm tracking-tight uppercase group-hover:text-indigo-600 transition-colors">
                              {doc.original_name || "PROTECTED_FILE.PDF"}
                            </p>
                            <p className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">
                            SHA-256: {String(doc.id).substring(0, 12)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">
                            {doc.document_type?.replace('_', ' ')}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                            <Fingerprint size={10} />
                            Issuer: {doc.country}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <StatusBadge status={doc.status} />
                        </div>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenReview(doc)}
                            className="h-10 px-4 text-[11px] font-black uppercase tracking-tight bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
                          >
                            <ShieldAlert size={14} /> Audit
                          </button>

                          <button
                            onClick={() => handleOpenVerify(doc)}
                            className="h-10 px-4 text-[11px] font-black uppercase tracking-tight bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 flex items-center gap-2"
                          >
                            <Lock size={14} /> Decrypt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER ACTION */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              End-to-End Encrypted Session
            </p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
              Page 1 of 1 <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>

      <VerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        document={selectedDoc}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        document={selectedDoc}
      />
    </div>
  );
}

// SUB-COMPONENTS
function QuickStat({ label, value, highlight = false }) {
  return (
    <div className={`px-5 py-3 rounded-2xl border ${highlight ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 shadow-sm'}`}>
      <p className={`text-[10px] font-black uppercase tracking-widest ${highlight ? 'text-indigo-100' : 'text-slate-400'}`}>{label}</p>
      <p className={`text-xl font-black ${highlight ? 'text-white' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-200/50 ring-amber-500/10",
    approved: "bg-emerald-50 text-emerald-600 border-emerald-200/50 ring-emerald-500/10",
    rejected: "bg-rose-50 text-rose-600 border-rose-200/50 ring-rose-500/10",
    resubmitted: "bg-indigo-50 text-indigo-600 border-indigo-200/50 ring-indigo-500/10",
  };

  const current = styles[status] || styles.pending;

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ring-4 ring-offset-0 transition-all ${current}`}>
      {status}
    </span>
  );
}

function LoadingRows() {
  return [1, 2, 3].map((i) => (
    <tr key={i} className="animate-pulse">
      <td colSpan={4} className="px-8 py-6">
        <div className="h-12 bg-slate-100 rounded-2xl w-full" />
      </td>
    </tr>
  ));
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={4} className="px-8 py-20 text-center">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="text-slate-200" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Data Vaults Found</h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">This owner has not uploaded any identity verification documents yet.</p>
      </td>
    </tr>
  );
}