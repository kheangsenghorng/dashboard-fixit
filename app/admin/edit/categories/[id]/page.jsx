"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "../../../AdminShell";
import {
  Layers,
  Save,
  ArrowLeft,
  Camera,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import ContentLoader from "../../../../../Components/ContentLoader";
import { useCategoryStore } from "../../../../store/useCategoryStore";
import { useAuthGuard } from "../../../../hooks/useAuthGuard";
import { decodeId } from "../../../../utils/hashids";

const EditCategoryPage = () => {
  const { user } = useAuthGuard();
  const { id: encodedId } = useParams();
  const id = decodeId(encodedId);
  const router = useRouter();
  const fileInputRef = useRef(null);

  const { fetchCategory, updateCategory } = useCategoryStore();

  const [formData, setFormData] = useState({
    name: "",
    status: "active",
    group: "service",
    icon: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* --------------------------------
     LOAD CATEGORY DATA
  --------------------------------*/
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCategory(id);
        if (data) {
          setFormData({
            name: data.name || "",
            status: data.status || "active",
            group: data.group || "service",
            icon: null, // File input starts as null
          });
          setPreview(data.icon); // Set current database image as preview
        }
      } catch (error) {
        toast.error("Failed to load category data");
        router.push("/admin/categories");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, fetchCategory, router]);

  /* --------------------------------
     HANDLE ICON CHANGE
  --------------------------------*/
  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2048 * 1024) {
      toast.error("Image too large (Max 2MB)");
      return;
    }

    setFormData((prev) => ({ ...prev, icon: file }));
    setPreview(URL.createObjectURL(file));
  };

  /* --------------------------------
     SUBMIT UPDATE
  --------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("status", formData.status);
      data.append("group", formData.group);

      // Laravel method spoofing for PUT with FormData
      data.append("_method", "PUT");

      if (formData.icon) {
        data.append("icon", formData.icon);
      }

      await updateCategory(id, data);
      toast.success("Category updated successfully");
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!user) return null; // or a loader, or redirect to login

  if (loading)
    return (
      <ContentLoader
        title="Loading"
        subtitle="Fetching category details..."
        Icon={Layers}
      />
    );

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto py-10 px-4 relative">
        {/* SUBMIT OVERLAY LOADER */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md"
            >
              <ContentLoader
                title="Saving"
                subtitle="Updating category..."
                Icon={Sparkles}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* BACK BUTTON */}
        <Link
          href="/admin/categories"
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 text-sm font-black mb-8 group transition-colors"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition"
          />
          Back to Categories
        </Link>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden"
        >
          {/* PREMIUM HEADER */}
          <div className="p-10 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Layers size={120} />
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl font-black tracking-tight">
                Edit Service
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-bold mt-1">
                Category ID: #{id}
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-[1.5rem] text-indigo-400 backdrop-blur-sm relative z-10">
              <Layers size={32} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            {/* ICON SECTION (THE FACE) */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-100 transition-all"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="text-slate-300" size={40} />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={32} />
                  </div>
                </div>

                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                  <ShieldCheck size={20} />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleIconChange}
              />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-5">
                Change Category Image
              </p>
            </div>

            {/* NAME FIELD */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                Category Title
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Electrical Repair"
                className="w-full px-6 py-5 bg-slate-50 rounded-[1.8rem] border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700 shadow-sm"
              />
            </div>

            {/* STATUS TOGGLE */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] block text-center">
                Visibility Status
              </label>
              <div className="flex bg-slate-100/50 p-1.5 rounded-[1.8rem] max-w-[320px] mx-auto border border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, status: "active" }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    formData.status === "active"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <CheckCircle2 size={16} /> ACTIVE
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, status: "inactive" }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    formData.status === "inactive"
                      ? "bg-white text-rose-500 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <XCircle size={16} /> HIDDEN
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 group"
              >
                <Save size={20} className="group-hover:animate-pulse" />
                {isSubmitting ? "Syncing Database..." : "Commit Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminShell>
  );
};

export default EditCategoryPage;
