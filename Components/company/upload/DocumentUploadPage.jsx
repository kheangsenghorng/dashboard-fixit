"use client";

import React, { useState, useCallback } from "react";
import { 
  UploadCloud, 
  FileText, 
  X, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDocumentOwnerStore } from "../../../app/store/owner/useDocumentStore";

export default function DocumentUploadPage() {
  const router = useRouter();
  const {
    uploadDocument,
    loading:LoadingDocument,
    error,
  } = useDocumentOwnerStore();
  // Form State
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [country, setCountry] = useState("KH");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  /* ---------------- HANDLERS ---------------- */
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    // Validation
    const isValidType = selectedFile.type.startsWith("image/") || selectedFile.type === "application/pdf";
    const isValidSize = selectedFile.size <= 10 * 1024 * 1024; // 10MB

    if (!isValidType) {
      toast.error("Please upload an image (JPG, PNG) or a PDF.");
      return;
    }
    if (!isValidSize) {
      toast.error("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentType || !file) {
      toast.error("Please fill in all fields and select a file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("document_type", documentType);
    formData.append("country", country);
    formData.append("file", file); // Key matches $request->file('file') in PHP

    try {
      // API call to your PHP Controller store() method
       await uploadDocument(formData);
      
      setIsSuccess(true);
      toast.success("Document submitted for review");
      setTimeout(() => router.push("/owner/dashboard"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full text-center space-y-4 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Upload Complete!</h2>
          <p className="text-slate-500">Your document has been sent for encryption and admin review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Top Navigation */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition text-sm font-semibold group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Documents
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              
              <div className="p-8 border-b border-slate-50 bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <ShieldCheck size={24} />
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Verify Identity</h1>
                </div>
                <p className="text-slate-500 text-sm">Upload official documents to verify your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Document Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Document Type</label>
                    <select 
                      required
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500/20 transition outline-none appearance-none"
                    >
                      <option value="">Select type...</option>
                      <option value="passport">Passport</option>
                      <option value="national_id">National ID Card</option>
                      <option value="driver_license">Driver's License</option>
                      <option value="id_card">Id Card</option>
                      <option value="birth_certificate">Birth Certificate</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Issuing Country</label>
                    <input 
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value.toUpperCase())}
                      placeholder="e.g. KH, US, TH"
                      maxLength={2}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500/20 transition outline-none uppercase"
                    />
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Document Image</label>
                  <div 
                    onDragEnter={onDrag}
                    onDragLeave={onDrag}
                    onDragOver={onDrag}
                    onDrop={onDrop}
                    className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center
                      ${file ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-white'}
                      ${dragActive ? 'scale-[1.02] border-indigo-500 bg-indigo-50' : ''}`}
                  >
                    {file ? (
                      <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-300">
                        <div className="relative">
                          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                            <FileText size={32} />
                          </div>
                          <button 
                            type="button"
                            onClick={() => setFile(null)}
                            className="absolute -top-2 -right-2 bg-white border border-slate-200 text-red-500 p-1 rounded-full shadow-md hover:scale-110 transition"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white border border-slate-100 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                          <UploadCloud size={32} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                          <p className="text-xs text-slate-400 mt-1">High-quality JPG, PNG or PDF (Max 10MB)</p>
                        </div>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={(e) => handleFile(e.target.files[0])}
                      accept="image/*,.pdf"
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="flex gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                  <Info className="text-blue-500 shrink-0" size={18} />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Your documents are encrypted using AES-256 before being stored. Only authorized administrators can view them during the verification process.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !file || !documentType}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Submit Verification"
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}