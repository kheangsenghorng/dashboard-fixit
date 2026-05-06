import {
  FileText,
  ImageIcon,
  Trash2,
  Zap,
  CloudUpload,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Reusable Skeleton Pulse Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

export default function Step2Identity({
  formData,
  setFormData,
  authUser,
  owners,
  previews,
  setPreviews,
  setImageFiles,
  isLoading = false, // Add this prop
}) {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index) => {
    setPreviews((p) => p.filter((_, i) => i !== index));
    setImageFiles((f) => f.filter((_, i) => i !== index));
  };

  // --- SKELETON VIEW ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 space-y-8">
            <div className="flex gap-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="w-40 h-6" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="w-full h-14 rounded-2xl" />
              <Skeleton className="w-3/4 h-10 rounded-lg" />
              <Skeleton className="w-full h-40 rounded-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8">
            <Skeleton className="w-32 h-6 mb-6" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
        <aside className="lg:col-span-4">
          <Skeleton className="w-full h-[300px] rounded-[2.5rem]" />
        </aside>
      </div>
    );
  }

  // --- ACTUAL CONTENT ---
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto"
    >
      <div className="lg:col-span-8 space-y-6">
        {/* Section 1: Basic Info */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Basic Information
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Define your service identity
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {authUser?.role === "admin" && (
              <div className="group">
                <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 block ml-1">
                  Partner Account
                </label>
                <select
                  value={formData.owner_id}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_id: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="">Select a partner business...</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.business_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 block ml-1">
                  Service Title
                </label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Premium Deep Cleaning"
                  className="w-full text-2xl font-bold text-slate-800 placeholder:text-slate-300 outline-none border-b-2 border-slate-100 focus:border-indigo-500 transition-all pb-3"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2 block ml-1">
                  Detailed Description
                </label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-5 bg-slate-50/50 rounded-2xl border border-slate-200 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Media */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <ImageIcon size={22} className="text-indigo-500" /> Media Gallery
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
              <CloudUpload
                className="text-slate-400 group-hover:text-indigo-500"
                size={28}
              />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Add Photo
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            <AnimatePresence>
              {previews.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group"
                >
                  <Image src={src} fill className="object-cover" alt="" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-white/90 p-2 rounded-lg text-red-500 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-10 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
          <Zap size={24} className="text-indigo-400 mb-6" />
          <h4 className="font-bold text-lg mb-3">Pro Insight</h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            Portfolio images see a{" "}
            <span className="text-indigo-400 font-bold">300% higher</span> trust
            rating.
          </p>
        </div>
      </aside>
    </motion.section>
  );
}
