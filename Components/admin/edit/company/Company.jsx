"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Building2, X, Loader2, Save, CheckCircle2, User, MapPin, 
  ChevronRight, Plus, Globe, Trash2, Info, Camera, ArrowUpRight, 
  AlertCircle, Building2 as Company, RefreshCcw, ArrowLeft
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAuthGuard } from "../../../../app/hooks/useAuthGuard";
import { useUsersStore } from "../../../../app/store/useUsersStore";
import { useOwnerStore } from "../../../../app/store/ownerStore";
import ContentLoader from "../../../ContentLoader";
import { toast } from "react-toastify";

export default function EditCompany() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;
  const { user: authUser } = useAuthGuard();

  // --- Store Hooks ---
  const { fetchUsers, users = [] } = useUsersStore();
  const { fetchOwner, owner, updateOwner } = useOwnerStore();

  // --- State ---
  const [formData, setFormData] = useState({ user_id: "", business_name: "", address: "" });
  const [logo, setLogo] = useState({ file: null, preview: null });
  const [gallery, setGallery] = useState({ existing: [], newFiles: [] });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isDragging, setIsDragging] = useState(null);

  // --- Initial Data Fetching ---
  useEffect(() => {
    if (authUser && companyId) {
      const init = async () => {
        try {
          await Promise.all([
            fetchUsers({ role: "owner", per_page: 100 }),
            fetchOwner(companyId)
          ]);
        } finally {
          // ✅ ONLY SHOW FULL LOADER ON FIRST PAGE OPEN
          // Small delay ensures a smooth visual transition
          setTimeout(() => setIsFirstLoad(false), 800);
        }
      };
      init();
    }
  }, [authUser, companyId, fetchUsers, fetchOwner]);

  // --- Sync Store to Local State ---
  useEffect(() => {
    if (!owner) return;
    setFormData({
      user_id: String(owner.user_id ?? ""),
      business_name: owner.business_name ?? "",
      address: owner.address ?? "",
    });
    setLogo({ file: null, preview: owner.logo ?? null });
    setGallery({
      existing: Array.isArray(owner.images) ? owner.images : [],
      newFiles: []
    });
  }, [owner]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processLogo = useCallback((file) => {
    if (!file?.type.startsWith("image/")) return;
    const preview = URL.createObjectURL(file);
    setLogo({ file, preview });
  }, []);

  const processImages = useCallback((files) => {
    const validFiles = Array.from(files || []).filter(f => f.type.startsWith("image/"));
    const newEntries = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setGallery(prev => ({
      ...prev,
      newFiles: [...prev.newFiles, ...newEntries]
    }));
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const data = new FormData();
      data.append("user_id", formData.user_id);
      data.append("business_name", formData.business_name);
      data.append("address", formData.address);
      gallery.existing.forEach(url => data.append("keep_images[]", url));
      gallery.newFiles.forEach(item => data.append("images[]", item.file));
      if (logo.file) data.append("logo", logo.file);
      data.append("_method", "PUT");
      const success = await updateOwner(companyId, data);
      if (success) {
        toast.success("Company updated successfully!");
        setTimeout(() => setStatus(null), 4000);
      } else {
        toast.error("Failed to update company.");
        throw new Error();
      }
    } catch (err) {
      setStatus({ type: 'error', message: "Update failed." });
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) return null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#F8FAFC] p-4 lg:p-8 space-y-8 font-sans antialiased text-slate-900">
      
      {/* ✅ ONLY SHOW FULL LOADER ON FIRST PAGE OPEN */}
       {isFirstLoad && (
         <ContentLoader 
            title="Company Registry" 
            subtitle="Accessing secure records..." 
            Icon={Company} 
         />
       )}

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-2 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Return to List</span>
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1 w-6 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              Record Editor
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {formData.business_name || "Company Profile"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {status && (
            <div className={`px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-right-4 ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              {status.message}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
        {/* Left Column: Form & Assets */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Branding Card */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative group">
                <div className={`w-32 h-32 rounded-3xl bg-slate-50 border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${isDragging === 'logo' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
                  {logo.preview ? (
                    <img src={logo.preview} className="w-full h-full object-contain p-2" alt="Logo" />
                  ) : (
                    <Building2 className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-xl cursor-pointer hover:scale-110 active:scale-90 transition-all">
                  <Camera size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => processLogo(e.target.files?.[0])} />
                </label>
              </div>
              
              <div className="flex-1 w-full space-y-6">
                <div className="group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Legal Business Name</label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b-2 border-slate-100 py-2 text-xl font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-200"
                    placeholder="Enter official name..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Core Information */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <Info className="text-indigo-600" size={20} />
              <h3 className="font-bold text-slate-900">General Registry</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <User size={12} /> Account Executive
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                >
                  <option value="">Assign Lead...</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MapPin size={12} /> Headquarters Address
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
                  placeholder="Street, City, State, Zip..."
                />
              </div>
            </div>
          </div>

          {/* Visual Assets */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Showcase Gallery</h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {gallery.existing.length + gallery.newFiles.length} Photos
                </span>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.existing.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-200">
                    <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Gallery" />
                    <button 
                      onClick={() => setGallery(prev => ({ ...prev, existing: prev.existing.filter((_, idx) => idx !== i) }))}
                      className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                ))}
                
                {gallery.newFiles.map((item, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-indigo-500 animate-in zoom-in">
                    <img src={item.preview} className="w-full h-full object-cover" alt="New" />
                    <button 
                      onClick={() => setGallery(prev => {
                        const updated = [...prev.newFiles];
                        updated.splice(i, 1);
                        return { ...prev, newFiles: updated };
                      })}
                      className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all text-slate-400 hover:text-indigo-600">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-100">
                    <Plus size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase">Add Media</span>
                  <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => processImages(e.target.files)} />
                </label>
             </div>
          </div>
        </div>

        {/* Right Column: Status & Metadata */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <CheckCircle2 size={24} className="text-emerald-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Status</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Company Health</p>
                  <h4 className="text-3xl font-black">Verified</h4>
                </div>
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Created At</span>
                    <span className="font-bold">{owner?.created_at ? new Date(owner.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Internal ID</span>
                    <span className="font-mono text-indigo-400">{companyId}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-indigo-600/20 rounded-full blur-[80px]" />
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <ArrowUpRight size={16} className="text-amber-600" />
              </div>
              <h4 className="font-bold text-slate-900">Pro Tip</h4>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Companies with high-quality workspace imagery and accurate location data see <strong>35% higher</strong> partner interest.
            </p>
          </div>

          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:border-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw size={12} /> Back to top
          </button>
        </div>
      </div>
    </div>
  );
}