"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  X,
  Save,
  Loader2,
  FileText,
  DollarSign,
  Clock,
  LayoutGrid,
  Image as ImageIcon,
  Tag,
  AlignLeft,
  User,
  Trash2,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

// Hooks & Stores
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useServiceStoreCompany } from "../../../app/store/owner/useServiceStore";
import { useTypeStoreCompany } from "../../../app/store/owner/useTypeStore";
import ContentLoader from "../../ContentLoader";

export default function EditServicePage() {
  const router = useRouter();
  const { id } = useParams();
  const { user: authUser } = useAuthGuard();

  // Guard to prevent type_id reset on initial fetch
  const isInitialLoad = useRef(true);

  const {
    updateService,
    owners = [],
    fetchOwners,
    fetchOneService, // Using your provided store function
  } = useServiceStoreCompany();

  const {
    activeTypes = [],
    categories = [],
    fetchActiveTypes,
    fetchActiveCategories,
  } = useTypeStoreCompany();

  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    type_id: "",
    base_price: "",
    duration: "",
    owner_id: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | Initial Data Fetch
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const initPage = async () => {
      try {
        setPageLoading(true);

        // 1. Load basic dependencies
        const promises = [fetchActiveCategories()];
        if (authUser?.role === "admin") {
          promises.push(fetchOwners());
        }
        await Promise.all(promises);

        // 2. Fetch the specific service data
        const service = await fetchOneService(id);

        if (service) {
          // 3. Pre-fetch types for this category so the dropdown works immediately
          if (service.category?.id) {
            await fetchActiveTypes(service.category.id);
          }

          setFormData({
            title: service.title || "",
            description: service.description || "",
            category_id: service.category?.id || "",
            type_id: service.type?.id || "",
            base_price: service.base_price || "",
            duration: service.duration || "",
            owner_id: service.owner_id || "",
          });

          setExistingImages(service.images || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Could not load service data");
      } finally {
        setPageLoading(false);
        // Allow the category watcher to reset types only after this
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 500);
      }
    };

    if (id && authUser) initPage();
  }, [id, authUser]);

  /*
  |--------------------------------------------------------------------------
  | Watch Category Changes
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (formData.category_id && !pageLoading && !isInitialLoad.current) {
      fetchActiveTypes(formData.category_id);
    }
  }, [formData.category_id]);

  /*
  |--------------------------------------------------------------------------
  | Input Handlers
  |--------------------------------------------------------------------------
  */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "category_id" ? (value ? Number(value) : "") : value,
      // Reset type only if it's a manual user change
      ...(name === "category_id" && { type_id: "" }),
    }));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imgId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  /*
  |--------------------------------------------------------------------------
  | Update Submit
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const data = new FormData();

      // Basic Fields
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category_id", formData.category_id);
      data.append("type_id", formData.type_id);
      data.append("base_price", formData.base_price);
      data.append("duration", formData.duration);
      if (formData.owner_id) data.append("owner_id", formData.owner_id);

      // New Images
      imageFiles.forEach((file) => data.append("images[]", file));

      // Pass remaining existing image IDs so backend knows what NOT to delete
      data.append(
        "existing_images",
        JSON.stringify(existingImages.map((img) => img.id))
      );

      // Laravel Method Spoofing for PUT via FormData
      data.append("_method", "PUT");

      const response = await updateService(id, data);
      if (response.success) {
        toast.success("Service updated successfully!");
        router.push(
          authUser?.role === "admin" ? "/admin/services" : "/owner/services"
        );
      }
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <ContentLoader title="Loading Service" subtitle="Fetching details..." />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 pb-32">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex items-center gap-5 mb-10">
        <button
          onClick={() => router.back()}
          className="group w-11 h-11 flex items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all"
        >
          <ArrowLeft
            size={18}
            className="text-slate-600 group-hover:-translate-x-1 transition-transform"
          />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Edit Service
          </h1>
          <p className="text-slate-500 text-sm">
            Refine your service details and gallery
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <FileText size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Service Details
              </h2>
            </div>

            <div className="space-y-6">
              {authUser?.role === "admin" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                    Business Owner
                  </label>
                  <select
                    name="owner_id"
                    required
                    value={formData.owner_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 transition-all outline-none"
                  >
                    <option value="">Select Owner</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.business_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                    Category
                  </label>
                  <select
                    name="category_id"
                    required
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 transition-all outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                    Type
                  </label>
                  <select
                    name="type_id"
                    required
                    value={formData.type_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 transition-all outline-none"
                  >
                    <option value="">Select Type</option>
                    {activeTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={5}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <DollarSign size={18} className="text-green-500" /> Pricing
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <DollarSign
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  name="base_price"
                  required
                  value={formData.base_price}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none"
                />
              </div>
              <div className="relative">
                <Clock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  name="duration"
                  required
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ImageIcon size={18} className="text-purple-500" /> Gallery
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Render Existing */}
              {existingImages.map((img, index) => (
                <div
                  key={index + 1}
                  className="relative aspect-square group overflow-hidden rounded-2xl shadow-sm border"
                >
                  <Image
                    src={img.url}
                    fill
                    className="object-cover"
                    alt="existing"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Render New Previews */}
              {newPreviews.map((src, index) => (
                <div
                  key={index}
                  className="relative aspect-square group overflow-hidden rounded-2xl border-2 border-blue-100"
                >
                  <Image
                    src={src}
                    fill
                    width={400}
                    height={400}
                    className="object-cover"
                    alt="new preview"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-xl shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer transition-all">
                <Upload size={18} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                  Add More
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*"
                  onChange={handleNewImageChange}
                />
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={submitLoading}
            className="w-full py-4.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-70"
          >
            {submitLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
