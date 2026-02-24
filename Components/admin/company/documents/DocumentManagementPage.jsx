"use client";
import React, { useEffect, useState } from "react";
import { 
  FileText, ShieldCheck, Lock, Download, 
  Eye, CheckCircle, XCircle, RefreshCcw, Search 
} from "lucide-react";
import { useDocumentStore } from "@/app/store/documentStore";
import { toast } from "react-toastify";
import VerificationModal from "../VerificationModal";
import ReviewModal from "../ReviewModal";



export default function DocumentManagementPage() {
  const { documents, loading, fetchDocuments } = useDocumentStore();
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleOpenVerify = (doc) => {
    setSelectedDoc(doc);
    setIsVerifyOpen(true);
  };

  const handleOpenReview = (doc) => {
    setSelectedDoc(doc);
    setIsReviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1 w-6 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 font-sans">
              KYC Compliance
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Owner Documents</h1>
          <p className="text-slate-500 text-sm">Verify and audit encrypted identity documents.</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-sans">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400">Document / Owner</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400">Type & Country</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-indigo-50/30 transition-colors group font-sans">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm uppercase">{doc.original_name}</p>
                        <p className="text-xs text-slate-500">ID: #{doc.id} • Owner ID: {doc.owner_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">{doc.document_type}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenReview(doc)}
                        className="px-4 py-2 text-[11px] font-black uppercase tracking-tight bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                      >
                        <ShieldCheck size={14} className="text-indigo-600" /> Review
                      </button>
                      
                      <button 
                        onClick={() => handleOpenVerify(doc)}
                        className="px-4 py-2 text-[11px] font-black uppercase tracking-tight bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
                      >
                        <Lock size={14} /> Unlock & View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rejected: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}