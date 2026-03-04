"use client";

import React, { useEffect, useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useDocumentOwnerStore } from "../../app/store/owner/useDocumentStore";

export default function ReuploadPage() {
  const id = useParams().id;

  const {
    document,
    loading: LoadingDocuments,
    fetchDocumentById,
    updateDocument,
  } = useDocumentOwnerStore();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // States initialized with existing document data
  const [documentType, setDocumentType] = useState("passport");
  const [country, setCountry] = useState("KH");
  const [file, setFile] = useState(null);

  const documentTypes = [
    { value: "passport", label: "Passport" },
    { value: "national_id", label: "National ID" },
    { value: "driver_license", label: "Driver License" },
  ];
  // Step 1: Fetch when id exists
  useEffect(() => {
    if (!id) return;

    fetchDocumentById(id);
  }, [id]);

  // Step 2: Check status after document loads
  useEffect(() => {
    if (!document) return;

    if (document.status !== "rejected") {
      toast.error("Only rejected documents can be re-uploaded.");
      router.replace("/owner/documents");
    }
  }, [document]);

  // When document loads → fill form
  useEffect(() => {
    if (document) {
      setDocumentType(document.document_type || "passport");
      setCountry(document.country || "KH");
    }
  }, [document]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      (selected.type.startsWith("image") || selected.type === "application/pdf")
    ) {
      setFile(selected);
    } else {
      toast.error("Invalid file type. Please upload an image or PDF.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("document_type", documentType);
    formData.append("country", country);
    if (file) formData.append("file", file);

    try {
      await updateDocument(id, formData);
      toast.success("Document updated. Status reset to pending.");

      router.push("/owner/documents");
    } catch (error) {
      toast.error("Failed to update document.");
    } finally {
      setLoading(false);
    }
  };

  if (LoadingDocuments) {
    return <div>Loading document...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition text-sm font-medium"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>

        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <div>
            <p className="text-sm font-bold text-red-800">Rejection Feedback</p>
            <p className="text-sm text-red-600 italic">
              {document?.rejection_reason || "NULL"}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Update Document
          </h2>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Country Code
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition uppercase"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                New File (Leave blank to keep current)
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                {file ? (
                  <div className="flex items-center gap-3 text-indigo-600 font-semibold">
                    <FileText size={24} />
                    <span>{file.name}</span>
                    <X
                      size={18}
                      className="text-slate-400 hover:text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <UploadCloud
                      size={30}
                      className="text-slate-300 group-hover:text-indigo-500 transition"
                    />
                    <span className="text-sm text-slate-500 mt-2">
                      Click to select new file
                    </span>
                  </>
                )}
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-indigo-100 active:scale-95"
            >
              {loading ? "Processing..." : "Submit Replacement"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
