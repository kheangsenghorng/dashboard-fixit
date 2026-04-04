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
  ShieldAlert,
  Activity,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Send,
  Layout,
  Layers,
  FileSearch,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useDocumentStore } from "@/app/store/documentStore";
import { useAuthGuard } from "../../../../app/hooks/useAuthGuard";
import VerificationModal from "../VerificationModal";
import ReviewModal from "../ReviewModal";
import { decodeId } from "../../../../app/utils/hashids";

export default function DocumentManagementPage() {
  const params = useParams();
  const encodedId = params.ownerId;
  const ownerId = decodeId(encodedId);
  const router = useRouter();
  const { user: authUser, initialized } = useAuthGuard();

  const {
    documents = [],
    loading,
    fetchDocumentsIdOwner,
    sendMissingDocumentEmail,
  } = useDocumentStore();

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailType, setEmailType] = useState("missing_documents"); // New State for Type
  const [emailMessage, setEmailMessage] = useState(
    "Our records show that you have not uploaded your verification documents yet."
  );
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (ownerId) fetchDocumentsIdOwner(ownerId);
  }, [ownerId, fetchDocumentsIdOwner]);

  const filteredDocs = useMemo(() => {
    return documents.filter(
      (doc) =>
        doc.original_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.document_type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  const stats = useMemo(
    () => ({
      total: documents.length,
      pending: documents.filter((d) =>
        ["pending", "resubmitted"].includes(d.status)
      ).length,
      approved: documents.filter((d) => d.status === "approved").length,
    }),
    [documents]
  );

  const handleSendEmail = async () => {
    if (!emailMessage.trim()) return toast.error("Please enter a message");

    try {
      setSendingEmail(true);
      await sendMissingDocumentEmail({
        owner_id: ownerId,
        message_text: emailMessage,
        type: emailType, // Passing the selected type to the API
      });
      toast.success("Security reminder dispatched");
      setIsEmailModalOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to dispatch protocol"
      );
    } finally {
      setSendingEmail(false);
    }
  };

  if (!authUser || !initialized) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-indigo-100 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-50/40 to-transparent -z-10" />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => router.back()}
              className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all border border-transparent hover:border-slate-200"
            >
              <ArrowLeft size={20} className="text-slate-500" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <h2 className="text-sm font-black tracking-tight text-slate-900 uppercase">
                Compliance Portal
              </h2>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tight text-slate-950">
              Identity <span className="text-indigo-600">Vault</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-lg text-lg text-pretty">
              Authorized access to end-to-end encrypted identity verification
              assets.
            </p>
          </div>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center gap-2.5 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95 group"
          >
            <Mail
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
            Compose Reminder
          </button>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Repository"
            value={stats.total}
            icon={FileText}
            color="indigo"
          />
          <StatCard
            label="Awaiting Review"
            value={stats.pending}
            icon={Clock}
            color="amber"
            highlight
          />
          <StatCard
            label="Security Cleared"
            value={stats.approved}
            icon={CheckCircle2}
            color="emerald"
          />
        </div>

        {/* TABLE CONTROLS */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-[450px] group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search encrypted files..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm text-sm font-medium"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-slate-600 font-bold text-sm hover:bg-slate-50 shadow-sm transition-all">
              <Filter size={18} /> Protocol Filters
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Security Asset
                    </th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Classification
                    </th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">
                      Status
                    </th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <LoadingRows />
                  ) : filteredDocs.length === 0 ? (
                    <EmptyState />
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr
                        key={doc.id}
                        className="group hover:bg-indigo-50/30 transition-all duration-300"
                      >
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                              <FileText size={22} />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors uppercase">
                                {doc.original_name}
                              </p>
                              <p className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                SHA-256: {String(doc.id).substring(0, 16)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-black text-slate-700 tracking-tight uppercase">
                              {doc.document_type?.replace("_", " ")}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-wider">
                              <Fingerprint size={12} /> ID: {doc.country}
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-7 text-center">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="px-10 py-7 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => {
                                setSelectedDoc(doc);
                                setIsReviewOpen(true);
                              }}
                              className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            >
                              <ShieldAlert size={20} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDoc(doc);
                                setIsVerifyOpen(true);
                              }}
                              className="flex items-center gap-2.5 px-5 py-3 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
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
          </div>
        </div>
      </main>

      {/* --- EMAIL PROTOCOL MODAL --- */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => !sendingEmail && setIsEmailModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-100">
                    <Mail className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Dispatch Protocol
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Compliance Request
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-8">
                {/* PROTOCOL TYPE SELECTOR */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-indigo-500 ml-1">
                    Protocol Classification
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <TypeOption
                      active={emailType === "missing_documents"}
                      onClick={() => {
                        setEmailType("missing_documents");
                        setEmailMessage(
                          "Our records show that you have not uploaded your verification documents yet."
                        );
                      }}
                      icon={FileSearch}
                      label="Missing Docs"
                    />
                    <TypeOption
                      active={emailType === "missing_logo"}
                      onClick={() => {
                        setEmailType("missing_logo");
                        setEmailMessage(
                          "Your company logo is missing. Please upload a high-resolution version for verification."
                        );
                      }}
                      icon={Layout}
                      label="Missing Logo"
                    />
                    <TypeOption
                      active={emailType === "need_more_documents"}
                      onClick={() => {
                        setEmailType("need_more_documents");
                        setEmailMessage(
                          "Additional documentation is required to complete your verification process."
                        );
                      }}
                      icon={Layers}
                      label="Need More"
                    />
                  </div>
                </div>

                {/* MESSAGE AREA */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-indigo-500 ml-1">
                    Secure Message
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={5}
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:ring-0 focus:bg-white focus:border-indigo-500 outline-none transition-all text-slate-700 font-bold text-base leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setIsEmailModalOpen(false)}
                    disabled={sendingEmail}
                    className="py-5 px-6 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Abort
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={sendingEmail}
                    className="py-5 px-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                  >
                    {sendingEmail ? (
                      <Activity size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={16} /> Dispatch Protocol
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTHER MODALS */}
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

// --- SUB-COMPONENTS ---

function TypeOption({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
        active
          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
          : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
      }`}
    >
      <Icon size={20} />
      <span className="text-[10px] font-black uppercase tracking-tight">
        {label}
      </span>
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color, highlight = false }) {
  const styles = {
    indigo: "text-indigo-600 bg-indigo-50",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50",
  };
  return (
    <div
      className={`p-8 rounded-[2.5rem] bg-white border border-slate-200 transition-all hover:shadow-2xl shadow-lg shadow-slate-200/40 ${
        highlight ? "ring-2 ring-indigo-500/10" : ""
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${styles[color]}`}
      >
        <Icon size={24} />
      </div>
      <p className="text-4xl font-black text-slate-900 tracking-tight">
        {value}
      </p>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: "text-amber-600 bg-amber-50 border-amber-200/50 dot-bg-amber-500",
    approved:
      "text-emerald-600 bg-emerald-50 border-emerald-200/50 dot-bg-emerald-500",
    rejected: "text-rose-600 bg-rose-50 border-rose-200/50 dot-bg-rose-500",
    resubmitted:
      "text-indigo-600 bg-indigo-50 border-indigo-200/50 dot-bg-indigo-500",
  };
  return (
    <span
      className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
        config[status] || config.pending
      }`}
    >
      {status}
    </span>
  );
}

function LoadingRows() {
  return [1, 2, 3].map((i) => (
    <tr key={i} className="animate-pulse">
      <td colSpan={4} className="p-10">
        <div className="h-12 bg-slate-50 rounded-2xl" />
      </td>
    </tr>
  ));
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={4} className="px-10 py-32 text-center text-slate-400">
        <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
        <p className="font-black uppercase tracking-widest text-sm">
          No identity assets found
        </p>
      </td>
    </tr>
  );
}
