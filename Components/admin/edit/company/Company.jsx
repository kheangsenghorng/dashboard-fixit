"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Building2, X, Loader2, Save, CheckCircle2, User, MapPin, 
  Plus, Globe, Trash2, Info, Camera, Sparkles, ArrowLeft, RefreshCcw,
  ImageIcon
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify"; // ✅ Import toast

import { useAuthGuard } from "../../../../app/hooks/useAuthGuard";
import { useUsersStore } from "../../../../app/store/useUsersStore";
import { useOwnerStore } from "../../../../app/store/ownerStore";
import ContentLoader from "../../../ContentLoader";
import LocationPickerOSM from "@/components/LocationPickerOSM";

// Helper for Google Maps link
function buildMapUrl(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number") return "";
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export default function EditCompany() {
  const params = useParams();
  const router = useRouter();
  const companyId = params?.id;
  const { user: authUser } = useAuthGuard();

  // --- Store Hooks ---
  const { fetchUsers, users = [] } = useUsersStore();
  const { fetchOwner, owner, updateOwner, loading: submitting } = useOwnerStore();

  // --- State ---
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [formData, setFormData] = useState({ 
    user_id: "", 
    business_name: "", 
    address: "",
    lat: null,
    lng: null
  });
  const [logo, setLogo] = useState({ file: null, preview: null });
  const [gallery, setGallery] = useState({ existing: [], newFiles: [] });
  
  const logoUrlRef = useRef(null);
  const galleryUrlRefs = useRef([]);

  // --- Initial Data Fetching ---
  useEffect(() => {
    if (authUser && companyId) {
      const init = async () => {
        try {
          await Promise.all([
            fetchUsers({ role: "owner", per_page: 1000 }),
            fetchOwner(companyId)
          ]);
        } catch (err) {
          toast.error("Failed to load company records.");
        } finally {
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
      lat: owner.lat ? Number(owner.lat) : null,
      lng: owner.lng ? Number(owner.lng) : null,
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

  const handleLocationChange = (loc) => {
    setFormData(prev => ({
      ...prev,
      lat: loc?.lat,
      lng: loc?.lng,
      address: loc?.address || prev.address
    }));
  };

  const processLogo = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Logo must be under 2MB"); // ✅ Error Toast
    
    if (logoUrlRef.current) URL.revokeObjectURL(logoUrlRef.current);
    const url = URL.createObjectURL(file);
    logoUrlRef.current = url;
    setLogo({ file, preview: url });
  };

  const processImages = (files) => {
    const fileList = Array.from(files || []);
    const validFiles = fileList.filter(f => f.type.startsWith("image/") && f.size <= 2 * 1024 * 1024);
    
    if (validFiles.length !== fileList.length) {
      toast.warning("Some images were skipped (Must be images under 2MB)"); // ✅ Warning Toast
    }

    const newEntries = validFiles.map(file => {
      const url = URL.createObjectURL(file);
      galleryUrlRefs.current.push(url);
      return { file, preview: url };
    });
    setGallery(prev => ({ ...prev, newFiles: [...prev.newFiles, ...newEntries] }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.lat || !formData.lng) return toast.error("Please pin the location on the map."); // ✅ Error Toast

    const data = new FormData();
    data.append("user_id", formData.user_id);
    data.append("business_name", formData.business_name);
    data.append("address", formData.address);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    data.append("map_url", buildMapUrl(formData.lat, formData.lng));
    
    gallery.existing.forEach(url => data.append("keep_images[]", url));
    gallery.newFiles.forEach(item => data.append("images[]", item.file));
    if (logo.file) data.append("logo", logo.file);
    
    data.append("_method", "PUT");

    const success = await updateOwner(companyId, data);
    if (success) {
      toast.success("Profile updated successfully!"); // ✅ Success Toast
      router.push("/admin/company");
    } else {
      toast.error("An error occurred while updating the profile."); // ✅ Error Toast
    }
  };

  if (!authUser) return null;

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20 selection:bg-indigo-100 antialiased">
      
      {/* OPTICALLY CENTERED LOADER */}
      <AnimatePresence>
        {isFirstLoad && (
          <motion.div 
            initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl"
          >
            <div className="transform -translate-y-12">
               <ContentLoader title="Company Registry" subtitle="Accessing records..." Icon={Sparkles} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-2 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Return to List</span>
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{formData.business_name || "Edit Profile"}</h1>
        </div>

        <button onClick={handleSubmit} disabled={submitting} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 group">
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {submitting ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-10">
          
          <div className="col-span-12 lg:col-span-8 space-y-10">
            {/* BRANDING CARD */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-300">
                    {logo.preview ? <img src={logo.preview} className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" alt="Logo" /> : <Building2 className="w-12 h-12 text-slate-300" />}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl cursor-pointer hover:scale-110 active:scale-90 transition-all">
                    <Camera size={20} /><input type="file" className="hidden" accept="image/*" onChange={(e) => processLogo(e.target.files?.[0])} />
                  </label>
                </div>
                <div className="flex-1 w-full space-y-6">
                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Legal Business Name</label>
                    <input type="text" name="business_name" value={formData.business_name} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-slate-100 py-2 text-2xl font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* GENERAL REGISTRY */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Info size={20} /></div>
                <h3 className="font-bold text-slate-900 text-lg">General Registry</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><User size={12} /> Principal Owner</label>
                  <select name="user_id" value={formData.user_id} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none transition-all">
                    <option value="">Assign Lead...</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><MapPin size={12} /> Registered Address</label>
                  <textarea name="address" rows={3} value={formData.address} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none resize-none transition-all" />
                </div>
              </div>
            </div>

            {/* MAP SECTION */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-100"><MapPin size={24} /></div>
                    <h3 className="font-bold text-slate-900 text-lg">Geospatial Position</h3>
                 </div>
              </div>
              <div className="p-4">
                <div className="rounded-[24px] overflow-hidden border border-slate-100 shadow-inner">
                  <LocationPickerOSM
                    value={{ lat: formData.lat, lng: formData.lng, address: formData.address }}
                    onChange={handleLocationChange}
                    defaultCenter={{ lat: 11.5564, lng: 104.9282 }}
                    height={400}
                  />
                </div>
              </div>
            </div>

            {/* SHOWCASE GALLERY */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600"><ImageIcon size={20} /></div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Showcase Gallery</h3>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">{gallery.existing.length + gallery.newFiles.length} Assets</span>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {gallery.existing.map((url, i) => (
                    <div key={`ex-${i}`} className="relative aspect-square rounded-[2rem] overflow-hidden group border border-slate-200 bg-white">
                      <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Ex" />
                      <button type="button" onClick={() => setGallery(prev => ({ ...prev, existing: prev.existing.filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-rose-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2"><Trash2 size={24} /><span className="text-[10px] font-bold uppercase">Remove</span></button>
                    </div>
                  ))}
                  {gallery.newFiles.map((item, i) => (
                    <div key={`new-${i}`} className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-indigo-500"><img src={item.preview} className="w-full h-full object-cover" alt="New" /><button type="button" onClick={() => setGallery(prev => ({ ...prev, newFiles: prev.newFiles.filter((_, idx) => idx !== i) }))} className="absolute top-3 right-3 p-2 bg-white text-rose-500 rounded-xl shadow-lg hover:bg-rose-500 hover:text-white transition-colors"><X size={16} /></button></div>
                  ))}
                  <label className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all text-slate-400 hover:text-indigo-600 group"><div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors"><Plus size={24} /></div><span className="text-[10px] font-black uppercase tracking-tighter">Add Media</span><input type="file" multiple className="hidden" accept="image/*" onChange={(e) => processImages(e.target.files)} /></label>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-12 lg:col-span-4 space-y-10">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md"><CheckCircle2 size={28} className="text-emerald-400" /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Record Meta</span>
                </div>
                <div className="space-y-8">
                  <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Update Status</p><h4 className="text-3xl font-black tracking-tight">Verified</h4></div>
                  <div className="pt-8 border-t border-white/10 space-y-5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500 font-medium">Map Linked</span><span className={formData.lat ? "text-emerald-400 font-bold" : "text-slate-500"}>{formData.lat ? "Synced" : "Missing"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-medium">Internal Hash</span><span className="font-mono text-indigo-400 font-bold">#{companyId}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-medium">Global Scope</span><div className="flex items-center gap-1.5 text-emerald-400 font-bold"><Globe size={12} /><span>Public</span></div></div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-indigo-600/20 rounded-full blur-[90px]" />
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm transition-all hover:bg-slate-50">
              <div className="flex items-center gap-4 mb-6"><div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center"><Sparkles size={20} className="text-amber-600" /></div><h4 className="font-bold text-slate-900">Optimization</h4></div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Updated geospatial data and gallery visuals increase profile engagement by up to 45%.</p>
            </div>

            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full py-5 border-2 border-slate-100 rounded-3xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:border-slate-200 hover:text-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95"><RefreshCcw size={14} /> Scroll to top</button>
          </div>
        </form>
      </main>
    </div>
  ); 
}