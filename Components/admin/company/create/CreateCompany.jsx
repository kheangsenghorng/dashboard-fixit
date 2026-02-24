"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  X,
  ChevronLeft,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Info,
  Sparkles,
  Globe,
  ArrowLeft,
  Save,
  Loader2,
  Camera,
  UploadCloud
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import ContentLoader from "../../../ContentLoader";
import { useAuthGuard } from "../../../../app/hooks/useAuthGuard";
import LocationPickerOSM from "@/components/LocationPickerOSM";

import { useOwnerStore } from "../../../../app/store/ownerStore";
import { useUsersStore } from "../../../../app/store/useUsersStore";

function buildMapUrl(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number") return "";
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export default function CreateCompanyPage() {
  const { user: authUser } = useAuthGuard();
  const router = useRouter();

  const {
    users = [],
    fetchUsers,
    isLoading: fetchingEligibleUsers,
    error: usersError,
  } = useUsersStore();

  const {
    createOwner,
    loading: submitting,
    error: ownerError,
  } = useOwnerStore();

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [formData, setFormData] = useState({
    user_id: "",
    business_name: "",
    address: "",
    lat: null,
    lng: null,
    map_url: "",
    logo: null,
    images: [],
  });

  const [previews, setPreviews] = useState({ logo: null, images: [] });
  const logoUrlRef = useRef(null);
  const imageUrlsRef = useRef([]);

  useEffect(() => {
    const run = async () => {
      try {
        await fetchUsers({ per_page: 1000 });
      } finally {
        setTimeout(() => setIsFirstLoad(false), 800);
      }
    };
    run();
  }, [fetchUsers]);

  useEffect(() => {
    if (usersError) toast.error(usersError);
    if (ownerError) toast.error(ownerError);
  }, [usersError, ownerError]);

  useEffect(() => {
    return () => {
      if (logoUrlRef.current) URL.revokeObjectURL(logoUrlRef.current);
      imageUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Logo must be under 2MB");
    
    if (logoUrlRef.current) URL.revokeObjectURL(logoUrlRef.current);
    const url = URL.createObjectURL(file);
    logoUrlRef.current = url;

    setFormData((prev) => ({ ...prev, logo: file }));
    setPreviews((prev) => ({ ...prev, logo: url }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      toast.warning("Some images exceeded 2MB and were skipped.");
    }

    const newUrls = validFiles.map((file) => URL.createObjectURL(file));
    imageUrlsRef.current = [...imageUrlsRef.current, ...newUrls];

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...validFiles] }));
    setPreviews((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    setPreviews((prev) => {
      const url = prev.images[index];
      if (url) URL.revokeObjectURL(url);
      return { ...prev, images: prev.images.filter((_, i) => i !== index) };
    });
  };

  const handleLocationChange = (loc) => {
    const lat = typeof loc?.lat === "number" ? loc.lat : null;
    const lng = typeof loc?.lng === "number" ? loc.lng : null;
    setFormData((prev) => ({
      ...prev,
      lat,
      lng,
      address: loc?.address || prev.address,
      map_url: lat && lng ? buildMapUrl(lat, lng) : "",
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!formData.lat || !formData.lng) return toast.error("Please pin the location.");
    if (!formData.user_id) return toast.error("Please assign an owner account.");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((img, i) => data.append(`images[${i}]`, img));
      } else if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    const success = await createOwner(data);
    if (success) {
      toast.success("Business Registered Successfully");
      router.push("/admin/owners");
    }
  };

  if (!authUser) return null;

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20 selection:bg-indigo-100 antialiased">
      
      {/* OPTICALLY CENTERED INTERNAL LOADER */}
      <AnimatePresence>
        {isFirstLoad && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl"
          >
            <div className="transform -translate-y-12">
              <ContentLoader title="Registry" subtitle="Preparing workspace..." Icon={Sparkles} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              Registration Portal
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {formData.business_name || "New Entity Registration"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 group"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {submitting ? "REGISTERING..." : "CONFIRM REGISTRATION"}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-10">
          
          {/* LEFT COLUMN */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            
            {/* BRANDING CARD */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-300">
                    {previews.logo ? (
                      <Image src={previews.logo} fill className="object-contain p-4 transition-transform group-hover:scale-105" alt="Logo" />
                    ) : (
                      <Building2 className="w-12 h-12 text-slate-300" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl cursor-pointer hover:scale-110 active:scale-90 transition-all">
                    <Camera size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                  </label>
                </div>
                
                <div className="flex-1 w-full space-y-6">
                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Legal Business Name</label>
                    <input
                      required
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b-2 border-slate-100 py-2 text-2xl font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-200"
                      placeholder="Enter official trade name..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CORE INFORMATION */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                    <Info size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Identity Registry</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <User size={12} /> Principal Owner
                  </label>
                  <select
                    required
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    disabled={fetchingEligibleUsers}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all disabled:opacity-50"
                  >
                    <option value="">{fetchingEligibleUsers ? "Syncing..." : "Assign Lead..."}</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.name} {u.email && `(${u.email})`}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <MapPin size={12} /> Registered Address
                  </label>
                  <textarea
                    required
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
                    placeholder="Provide full physical address..."
                  />
                </div>
              </div>
            </div>

            {/* GEOLOCATION SECTION */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-100">
                    <MapPin size={24} />
                  </div>
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

            {/* GALLERY ASSETS */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                      <ImageIcon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Showcase Gallery</h3>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
                    {formData.images.length} Assets
                  </span>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  <AnimatePresence>
                     {previews.images.map((src, idx) => (
                        <motion.div
                           key={src}
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.8 }}
                           className="group relative aspect-square rounded-[2rem] overflow-hidden border border-slate-200 bg-white"
                        >
                           <Image src={src} alt="Preview" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                 type="button"
                                 onClick={() => removeImage(idx)}
                                 className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-colors"
                              >
                                 <X size={20} />
                              </button>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
                  
                  {formData.images.length < 10 && (
                     <label className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all text-slate-400 hover:text-indigo-600 group">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                           <Plus size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">Add Media</span>
                        <input type="file" multiple className="hidden" accept="image/*" onChange={handleImagesChange} />
                     </label>
                  )}
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-12 lg:col-span-4 space-y-10">
            
            {/* STATUS CARD */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-200 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <CheckCircle2 size={28} className="text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Record Meta</span>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Registration Status</p>
                    <h4 className="text-3xl font-black tracking-tight">Draft</h4>
                  </div>
                  
                  <div className="pt-8 border-t border-white/10 space-y-5 text-xs">
                    <StatusItem label="Location Pin" isDone={!!formData.lat} />
                    <StatusItem label="Identity Profile" isDone={!!formData.business_name && !!formData.user_id} />
                    <StatusItem label="Brand Asset" isDone={!!formData.logo} />
                  </div>
                </div>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-indigo-600/20 rounded-full blur-[90px]" />
            </div>

            {/* VISIBILITY BADGE */}
            <div className="px-6 py-8 border border-slate-200 rounded-[32px] bg-white flex items-center gap-5 shadow-sm transition-all hover:bg-slate-50">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Globe size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</p>
                <p className="text-sm font-bold text-slate-700">Pending Approval</p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

function StatusItem({ label, isDone }) {
  return (
    <div className="flex justify-between items-center group">
      <span className={`text-xs font-medium transition-colors ${isDone ? 'text-slate-400' : 'text-slate-200'}`}>{label}</span>
      {isDone ? (
        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <CheckCircle2 size={16} className="text-indigo-400" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full border border-slate-700 group-hover:border-slate-500 transition-colors" />
      )}
    </div>
  );
}