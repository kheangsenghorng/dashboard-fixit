"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Upload, X, Save, Loader2, FileText, 
  DollarSign, Clock, LayoutGrid, Image as ImageIcon,
  Tag, AlignLeft, User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

// Hooks & Stores
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useServiceStoreCompany } from "../../../app/store/owner/useServiceStore";
import { useTypeStoreCompany } from "../../../app/store/owner/useTypeStore";
import ContentLoader from "../../ContentLoader";

export default function CreateServicePage() {
  const router = useRouter();
  const { user: authUser } = useAuthGuard();

  const { createService, owners = [], fetchOwners } = useServiceStoreCompany();

  const {
    activeTypes = [],
    categories = [],
    fetchActiveTypes,
    fetchActiveCategories,
  } = useTypeStoreCompany();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    type_id: "",
    base_price: "",
    duration: "",
    owner_id: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetchActiveCategories();
    if (authUser?.role === "admin") fetchOwners();
  }, []);

  useEffect(() => {
    if (formData.category_id) fetchActiveTypes(formData.category_id);
  }, [formData.category_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "category_id" ? (value ? Number(value) : "") : value,
      ...(name === "category_id" && { type_id: "" }),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      imageFiles.forEach((file) => data.append("images[]", file));

      const response = await createService(data);
      if (response.success) {
        toast.success("Service published successfully!");
        router.push(authUser?.role === "admin" ? "/admin/services" : "/owner/services");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="relative min-h-screen">
        <ContentLoader
          title="Loading Services"
          subtitle="Fetching Categories & Types..."
        />
      </div>
    );
  }

  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 pb-32">
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="group w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">New Service</h1>
            <p className="text-slate-500 text-sm">Fill in the details to list your new offering</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PRIMARY INFO */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <FileText size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">General Information</h2>
            </div>

            <div className="space-y-6">
              {/* ADMIN OWNER SELECTION */}
              {authUser?.role === "admin" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                    <User size={14} /> Business Owner
                  </label>
                  <select
                    name="owner_id"
                    required
                    value={formData.owner_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-slate-700"
                  >
                    <option value="">Select an owner</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>{owner.business_name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* TITLE */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                  <Tag size={14} /> Service Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Premium Haircut & Styling"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-slate-700"
                />
              </div>

              {/* CATEGORY & TYPE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                    <LayoutGrid size={14} /> Category
                  </label>
                  <select
                    name="category_id"
                    required
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none"
                  >
                    <option value="">Choose Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                    <Tag size={14} /> Type
                  </label>
                  <select
                    name="type_id"
                    required
                    disabled={!formData.category_id}
                    value={formData.type_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none disabled:opacity-50"
                  >
                    <option value="">{formData.category_id ? "Select Type" : "Pick Category First"}</option>
                    {activeTypes.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                  <AlignLeft size={14} /> Description
                </label>
                <textarea
                  name="description"
                  rows={5}
                  required
                  placeholder="Describe what's included in this service..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: PRICING & MEDIA */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PRICING SECTION */}
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <DollarSign size={18} className="text-green-500" /> Investment
            </h3>
            
            <div className="space-y-4">
              <div className="relative group">
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="number"
                  name="base_price"
                  placeholder="0.00"
                  required
                  value={formData.base_price}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold text-slate-700"
                />
              </div>

              <div className="relative group">
                <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="number"
                  name="duration"
                  placeholder="Duration (min)"
                  required
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold text-slate-700"
                />
              </div>
            </div>
          </section>

          {/* MEDIA SECTION */}
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ImageIcon size={18} className="text-purple-500" /> Gallery
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {previews.map((src, index) => (
                <div key={index} className="relative aspect-square group overflow-hidden rounded-2xl">
                  <Image src={src} fill className="object-cover transition-transform duration-500 group-hover:scale-110" alt="preview" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all translate-y-[-10px] group-hover:translate-y-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 flex flex-col items-center justify-center cursor-pointer transition-all group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Upload size={18} className="text-slate-400 group-hover:text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Add Photo</span>
                <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </section>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 font-bold shadow-xl shadow-slate-200 hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={18} />
                <span>Publish Service</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}