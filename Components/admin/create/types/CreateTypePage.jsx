"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Layers, 
  Save, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ImageIcon,
  FolderTree,
  Type
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { useTypeStore } from "../../../../app/store/useTypeStore";
import { useCategoryStore } from "../../../../app/store/useCategoryStore";

export default function CreateTypePage() {
  const router = useRouter();
  const { createType, loading: isSubmitting } = useTypeStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    status: "active",
    icon: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch categories for the dropdown on mount
  useEffect(() => {
    fetchCategories({ all: true }); // Fetch all for dropdown
  }, [fetchCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      setFormData((prev) => ({ ...prev, icon: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, icon: null }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) return toast.error("Name is required");
    if (!formData.category_id) return toast.error("Please select a category");

    // Use FormData for image upload
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category_id", formData.category_id);
    data.append("status", formData.status);
    if (formData.icon) {
      data.append("icon", formData.icon);
    }

    try {
      const res = await createType(data);
      if (res) {
        toast.success("Type created successfully!");
        router.push("/admin/types"); // Adjust route to your table path
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create type");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <div className="p-2 rounded-xl group-hover:bg-white transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Back to List</span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
            <Layers className="text-indigo-600" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">New Registry</span>
          </div>
        </div>

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Create New Type</h1>
          <p className="text-slate-500 text-sm mt-1">Define a sub-classification for your services or products.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: UPLOADER */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm text-center">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                  Identity Icon
                </label>
                
                <div className="relative group cursor-pointer">
                  {previewUrl ? (
                    <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-indigo-500 p-1 bg-white">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover rounded-2xl" />
                      <button 
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all cursor-pointer group">
                      <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="text-slate-400 group-hover:text-indigo-600" size={24} />
                      </div>
                      <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Icon</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
                <p className="mt-4 text-[9px] text-slate-400 font-medium">PNG, JPG or SVG (Max 2MB)</p>
              </div>

              {/* STATUS SELECTOR */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Visibility</label>
                <div className="grid grid-cols-2 gap-2">
                  {['active', 'inactive'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, status }))}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.status === status 
                        ? (status === 'active' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-900 text-white shadow-lg shadow-slate-200')
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FIELDS */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                
                {/* NAME INPUT */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    <Type size={14} /> Type Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Premium Support, Express Delivery..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                {/* CATEGORY SELECT */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    <FolderTree size={14} /> Parent Category
                  </label>
                  <div className="relative">
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a category...</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name.toUpperCase()} ({cat.group})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ArrowLeft className="rotate-[270deg]" size={16} />
                    </div>
                  </div>
                </div>

                {/* INFO BOX */}
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                  <AlertCircle className="text-blue-500 shrink-0" size={18} />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    <strong>Note:</strong> Types are sub-divisions of categories. Ensure you select the correct parent category so users can find this type easily in the marketplace.
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={16} /> Save New Type
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}