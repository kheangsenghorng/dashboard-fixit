"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Layers,
  Save,
  Upload,
  X,
  AlertCircle,
  ImageIcon,
  FolderTree,
  Type as TypeIcon,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

// Stores
import { useTypeStore } from "../../../../app/store/useTypeStore";
import { useCategoryStore } from "../../../../app/store/useCategoryStore";
import ContentLoader from "../../../ContentLoader";
import { decodeId } from "../../../../app/utils/hashids";

export default function EditTypePage() {
  const router = useRouter();
  const { id: encodedId } = useParams();
  const id = decodeId(encodedId);

  const { updateType, fetchType, loading: isSubmitting, type } = useTypeStore();

  const { categories, fetchCategories } = useCategoryStore();

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    status: "active",
    icon: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCategories({ all: true });
        await fetchType(id);
      } catch (error) {
        toast.error("Could not load type data");
        // router.push("/admin/types");
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (type) {
      setFormData({
        name: type.name || "",
        category_id: type.category?.id || "",
        status: type.status || "active",
        icon: null,
      });

      if (type.icon) {
        setPreviewUrl(type.icon);
      }
    }
  }, [type]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

    if (!formData.name) {
      return toast.error("Name is required");
    }
    if (!formData.category_id) {
      return toast.error("Category is required");
    }

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("category_id", formData.category_id);
      data.append("status", formData.status);

      data.append("_method", "PUT");

      if (formData.icon) {
        data.append("icon", formData.icon);
      }

      await updateType(id, data);

      toast.success("Type updated successfully");
      router.push("/admin/types");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  if (initialLoading)
    return (
      <ContentLoader
        title="Loading"
        subtitle="Fetching category details..."
        Icon={Layers}
      />
    );

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
            <span className="text-xs font-black uppercase tracking-widest">
              Discard Changes
            </span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
            <Layers className="text-indigo-600" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">
              Edit Mode
            </span>
          </div>
        </div>

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Update Type Identity
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Modify the details and classification of{" "}
            <span className="text-indigo-600 font-bold">#{id}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT COLUMN: UPLOADER */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm text-center">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                  Type Icon
                </label>

                <div className="relative group cursor-pointer">
                  {previewUrl ? (
                    <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-indigo-500 p-1 bg-white">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover rounded-2xl"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer p-3 bg-white rounded-full text-indigo-600 shadow-xl scale-90 group-hover:scale-100 transition-transform">
                          <Upload size={20} />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform z-10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all cursor-pointer group">
                      <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                        <Upload
                          className="text-slate-400 group-hover:text-indigo-600"
                          size={24}
                        />
                      </div>
                      <span className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Replace Icon
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* STATUS SELECTOR */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["active", "inactive"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, status }))}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.status === status
                          ? status === "active"
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                            : "bg-slate-900 text-white shadow-lg shadow-slate-200"
                          : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {status === "active" ? "Active" : "Hidden"}
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
                    <TypeIcon size={14} /> Update Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter type name..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                {/* CATEGORY SELECT */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    <FolderTree size={14} /> Change Category
                  </label>
                  <div className="relative">
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Category...</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ArrowLeft className="rotate-[270deg]" size={16} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertCircle className="text-amber-500 shrink-0" size={18} />
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Updating the category will move this type and all associated
                    products to the new parent classification. This action is
                    immediate.
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={16} /> Update Type Information
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
