"use client";

import React, { useState, useRef } from "react";
import { 
  FileUp, CheckCircle2, X, UploadCloud, 
  AlertCircle, Loader2, HardDrive, Download,
  User, UserCog, ShieldCheck
} from "lucide-react";

export default function BulkUserImport({ onImport, loading }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("customer"); // Default role for bulk import
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const roles = [
    { id: "customer", label: "Customer", icon: User },
    { id: "owner", label: "Owner", icon: UserCog },
    { id: "provider", label: "Provider", icon: ShieldCheck },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a valid Excel or CSV file");
    }
  };

  const handleUpload = () => {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("role", role); // Sending the selected role with the file
    onImport(data);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <FileUp size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Bulk User Import</h2>
        <p className="text-slate-500 mt-1 text-sm">Upload a sheet to create users in batches</p>
      </div>

      {/* 1. ROLE SELECTOR (BATCH ASSIGNMENT) */}
      <div className="mb-8">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 mb-3 block">
          Assign Default Role
        </label>
        <div className="grid grid-cols-3 gap-3">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                role === r.id 
                ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm" 
                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
              }`}
            >
              <r.icon size={20} />
              <span className="text-xs font-bold">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. MODERN FILE PATH SELECTOR + DRAG & DROP */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 block">
          Select Spreadsheet
        </label>
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`group relative cursor-pointer border-2 border-dashed rounded-2xl p-2 transition-all ${
            isDragging 
              ? "border-indigo-500 bg-indigo-50/50" 
              : file 
                ? "border-emerald-500 bg-emerald-50/30" 
                : "border-slate-200 hover:border-indigo-400 bg-slate-50"
          }`}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            onChange={(e) => validateAndSetFile(e.target.files[0])} 
            accept=".xlsx, .xls, .csv" 
          />
          
          <div className="flex items-center gap-4 p-2">
            <div className={`p-3 rounded-xl transition-colors ${file ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
              {file ? <CheckCircle2 size={24} /> : <HardDrive size={24} />}
            </div>
            
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-sm text-slate-700 truncate">
                {file ? file.name : (isDragging ? "Drop file now" : "Click to select file path")}
              </p>
              <p className="text-xs text-slate-400">
                {file ? `${(file.size / 1024).toFixed(2)} KB` : "Excel or CSV (Max 10MB)"}
              </p>
            </div>

            {file ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            ) : (
              <div className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md group-hover:bg-indigo-700 transition-all">
                Browse
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* 3. ACTIONS */}
      <div className="mt-10 space-y-4">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-20 shadow-xl"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : <UploadCloud size={20} />}
          Start Batch Import
        </button>
        
        <button className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold text-sm py-2 hover:text-indigo-600 transition-colors">
          <Download size={16} /> Download CSV Template
        </button>
      </div>
    </div>
  );
}