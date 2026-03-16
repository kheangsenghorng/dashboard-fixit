"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Camera,
  Globe,
  ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  MapPin,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";

import LocationPickerOSM from "../../LocationPickerOSM";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useOwnerStore } from "../../../app/store/owner/useOwnerStore";
import { toast } from "react-toastify";

export default function BusinessSettings() {
  const { user: authUser } = useAuthGuard();
  const authId = authUser?.id;
  const { owner, fetchOwner, updateOwner, loading, deleteImage } =
    useOwnerStore();

  const [formData, setFormData] = useState({
    business_name: "",
    address: "",
    lat: "",
    lng: "",
    status: "",
  });

  const [logo, setLogo] = useState({ file: null, preview: null });
  const [gallery, setGallery] = useState({ existing: [], newFiles: [] });

  useEffect(() => {
    if (authId) fetchOwner(authId);
  }, [authId, fetchOwner]);

  useEffect(() => {
    if (!owner) return;
    setFormData({
      business_name: owner.business_name || "",
      address: owner.address || "",
      lat: owner.lat || "",
      lng: owner.lng || "",
      status: owner.status || "pending",
    });
    setLogo({ file: null, preview: owner.logo || null });

    // UPDATED: Mapping the array of objects {url, path}
    setGallery({ existing: owner.images || [], newFiles: [] });
  }, [owner]);

  useEffect(() => {
    return () => {
      gallery.newFiles.forEach((img) => URL.revokeObjectURL(img.preview));
      if (logo.preview && logo.file) URL.revokeObjectURL(logo.preview);
    };
  }, [gallery.newFiles, logo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (loc) => {
    setFormData((prev) => ({
      ...prev,
      lat: loc.lat,
      lng: loc.lng,
      address: loc.address,
    }));
  };

  const processImages = (files) => {
    const selected = Array.from(files || []);
    if (
      selected.length + gallery.newFiles.length + gallery.existing.length >
      10
    ) {
      alert("Maximum 10 images allowed");
      return;
    }
    const newImages = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setGallery((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...newImages],
    }));
  };

  const handleSave = async () => {
    if (!owner?.id) return;

    try {
      const form = new FormData();

      form.append("business_name", formData.business_name);
      form.append("address", formData.address);

      if (formData.lat) form.append("lat", formData.lat);
      if (formData.lng) form.append("lng", formData.lng);

      form.append("_method", "PUT");

      // Upload new logo
      if (logo.file) {
        form.append("logo", logo.file);
      }

      // Upload new gallery images
      gallery.newFiles.forEach((img) => {
        form.append("images[]", img.file);
      });

      // Keep existing images
      gallery.existing.forEach((item) => {
        form.append("existing_images[]", item.path);
      });

      await updateOwner(owner.id, form);

      toast.success("Business profile updated successfully 🎉");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to update business profile"
      );
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* 1. BRANDING SECTION */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.8rem] p-1 shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        <div className="relative bg-slate-900/40 backdrop-blur-md rounded-[2.7rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="relative group">
            <div className="relative w-44 h-44 rounded-[2rem] bg-slate-950 border border-white/10 flex items-center justify-center overflow-hidden">
              {logo.preview ? (
                <img
                  src={logo.preview}
                  className="w-full h-full object-cover p-2"
                  alt="Logo"
                />
              ) : (
                <Building2 className="w-16 h-16 text-slate-800" />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 p-4 bg-white text-slate-950 rounded-2xl shadow-xl cursor-pointer hover:scale-110 border-4 border-slate-900 z-10">
              <Camera size={22} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  setLogo({
                    file: e.target.files[0],
                    preview: URL.createObjectURL(e.target.files[0]),
                  })
                }
              />
            </label>
          </div>
          <div className="flex-1 w-full space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-300">
              <Sparkles size={12} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Enterprise Registry
              </span>
            </div>
            <input
              name="business_name"
              value={formData.business_name}
              onChange={handleInputChange}
              className="w-full bg-transparent border-none p-0 text-4xl font-black text-white outline-none placeholder:text-white/5"
              placeholder="Business Name"
            />
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={14} /> {formData.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LOCATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
              <Globe size={24} />
            </div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">
              Location Metadata
            </h3>
          </div>

          <div className="relative group">
            <label className="absolute -top-2.5 left-6 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">
              Address String
            </label>
            <textarea
              name="address"
              rows={4}
              value={formData.address}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] px-7 py-6 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-slate-900 transition-all resize-none shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <label className="absolute -top-2.5 left-5 bg-white px-2 text-[10px] font-black text-slate-400">
                Lat
              </label>
              <input
                type="number"
                step="any"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:border-slate-900 outline-none"
              />
            </div>
            <div className="relative group">
              <label className="absolute -top-2.5 left-5 bg-white px-2 text-[10px] font-black text-slate-400">
                Lng
              </label>
              <input
                type="number"
                step="any"
                name="lng"
                value={formData.lng}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:border-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <LocationPickerOSM
            value={{
              lat: formData.lat,
              lng: formData.lng,
              address: formData.address,
            }}
            onChange={handleLocationChange}
          />
        </div>
      </div>

      {/* 3. SHOWCASE GALLERY */}
      <div className="space-y-8 bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100">
        <h3 className="px-2 text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
          <ImageIcon size={16} className="text-indigo-500" /> Media Showcase
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {/* UPDATED: existing images map using item.url */}
          {gallery.existing.map((item, i) => (
            <div
              key={`ex-${i}`}
              className="group relative aspect-square rounded-[2rem] overflow-hidden border-2 border-white shadow-md bg-white"
            >
              <img
                src={item.url}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Gallery"
              />
              <div
                onClick={() => {
                  deleteImage(owner.id, item.path);

                  setGallery((p) => ({
                    ...p,
                    existing: p.existing.filter((_, idx) => idx !== i),
                  }));
                }}
                className="absolute inset-0 bg-rose-600/90 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
              >
                <Trash2 size={24} className="text-white" />
              </div>
            </div>
          ))}

          {/* New Files remain the same */}
          {gallery.newFiles.map((img, i) => (
            <div
              key={`new-${i}`}
              className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-indigo-500 shadow-xl animate-in zoom-in-95"
            >
              <img
                src={img.preview}
                className="w-full h-full object-cover"
                alt="New"
              />
              <button
                onClick={() =>
                  setGallery((p) => ({
                    ...p,
                    newFiles: p.newFiles.filter((_, idx) => idx !== i),
                  }))
                }
                className="absolute top-3 right-3 p-1.5 bg-white text-rose-500 rounded-lg shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <label className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-500 hover:bg-white transition-all group">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
              <Plus size={32} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Add Media
            </span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => processImages(e.target.files)}
            />
          </label>
        </div>
      </div>

      {/* 4. ACTIONS */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="group flex items-center gap-4 bg-slate-950 text-white px-12 py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 shadow-2xl"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {loading ? "Synchronizing Data..." : "Commit Registry Updates"}
        </button>
      </div>
    </div>
  );
}
