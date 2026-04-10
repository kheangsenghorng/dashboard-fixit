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
  ImageIcon,
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

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
      {children}
    </label>
  );
}

function TextInput({
  name,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  className = "",
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800
        placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all ${className}`}
    />
  );
}

function SelectInput({ name, value, onChange, required, children }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    >
      {children}
    </select>
  );
}

function ImageThumbnail({ src, onRemove, isNew }) {
  return (
    <div className="relative aspect-square group rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <Image src={src} fill className="object-cover" alt="" unoptimized />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded-lg text-white shadow-md
          opacity-0 group-hover:opacity-100 transition-opacity
          bg-red-500 hover:bg-red-600"
      >
        {isNew ? <X size={13} /> : <Trash2 size={13} />}
      </button>
      {isNew && (
        <span
          className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wide
          bg-blue-500 text-white px-1.5 py-0.5 rounded-md"
        >
          New
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

const INITIAL_FORM = {
  title: "",
  description: "",
  category_id: "",
  type_id: "",
  base_price: "",
  duration: "",
  owner_id: "",
};

export default function EditServicePage() {
  const router = useRouter();
  const { id } = useParams();
  const { user: authUser } = useAuthGuard();

  const isAdmin = authUser?.role === "admin";
  const isInitialLoad = useRef(true);

  const {
    updateService,
    owners = [],
    fetchOwners,
    fetchOneService,
    deleteServiceImage,
  } = useServiceStoreCompany();
  const {
    activeTypes = [],
    categories = [],
    fetchActiveTypes,
    fetchActiveCategories,
  } = useTypeStoreCompany();

  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // ── Load page data ──────────────────────────

  useEffect(() => {
    if (!id || !authUser) return;

    const initPage = async () => {
      setPageLoading(true);
      try {
        const fetchDeps = [fetchActiveCategories()];
        if (isAdmin) fetchDeps.push(fetchOwners());
        await Promise.all(fetchDeps);

        const service = await fetchOneService(id);
        if (!service) return;

        if (service.category?.id) {
          await fetchActiveTypes(service.category.id);
        }

        setFormData({
          title: service.title || "",
          description: service.description || "",
          category_id: service.category?.id?.toString() || "",
          type_id: service.type?.id?.toString() || "",
          base_price: service.base_price || "",
          duration: service.duration || "",
          owner_id: service.owner_id?.toString() || "",
        });

        setExistingImages(service.images || []);
      } catch {
        toast.error("Could not load service data.");
      } finally {
        setPageLoading(false);
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 100);
      }
    };

    initPage();
  }, [id, authUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Re-fetch types when category changes ───

  useEffect(() => {
    if (!isInitialLoad.current && formData.category_id) {
      fetchActiveTypes(formData.category_id);
    }
  }, [formData.category_id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup blob URLs on unmount ────────────

  useEffect(() => {
    return () => newImagePreviews.forEach(URL.revokeObjectURL);
  }, [newImagePreviews]);

  // ── Input handlers ──────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset type when category changes manually
      ...(name === "category_id" && !isInitialLoad.current
        ? { type_id: "" }
        : {}),
    }));
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...files.map(URL.createObjectURL)]);
  };

  const removeExistingImage = async (img) => {
    try {
      await deleteServiceImage(id, img.path);

      setExistingImages((prev) =>
        prev.filter((image) => image.path !== img.path)
      );

      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Form submit ─────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const payload = new FormData();

      Object.entries({
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        type_id: formData.type_id,
        base_price: formData.base_price,
        duration: formData.duration,
        _method: "PUT",
      }).forEach(([key, value]) => payload.append(key, value));

      if (formData.owner_id) payload.append("owner_id", formData.owner_id);
      newImageFiles.forEach((file) => payload.append("images[]", file));
      payload.append(
        "existing_images",
        JSON.stringify(existingImages.map((img) => img.id))
      );

      const response = await updateService(id, payload);

      if (response.success) {
        toast.success("Service updated successfully!");
        router.push(isAdmin ? "/admin/services" : "/owner/services");
      }
    } catch (error) {
      toast.error(error.message || "Update failed. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Render ──────────────────────────────────

  if (pageLoading) {
    return (
      <ContentLoader title="Loading Service" subtitle="Fetching details…" />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white
              hover:bg-slate-50 shadow-sm transition-all group"
          >
            <ArrowLeft
              size={17}
              className="text-slate-500 group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit Service</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Update details, pricing, and images
            </p>
          </div>
        </div>

        {/* Form Grid */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* ── Left: Main Details (2/3 width) ── */}
          <div className="lg:col-span-2 space-y-6">
            <SectionCard icon={<FileText size={17} />} title="Service Details">
              <div className="space-y-5">
                {/* Admin: Owner selector */}
                {isAdmin && (
                  <div>
                    <FieldLabel>Business Owner</FieldLabel>
                    <SelectInput
                      name="owner_id"
                      value={formData.owner_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select owner…</option>
                      {owners.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.business_name}
                        </option>
                      ))}
                    </SelectInput>
                  </div>
                )}

                {/* Title */}
                <div>
                  <FieldLabel>Title</FieldLabel>
                  <TextInput
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category + Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Category</FieldLabel>
                    <SelectInput
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category…</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </SelectInput>
                  </div>
                  <div>
                    <FieldLabel>Type</FieldLabel>
                    <SelectInput
                      name="type_id"
                      value={formData.type_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select type…</option>
                      {activeTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </SelectInput>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    name="description"
                    rows={5}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all resize-none"
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── Right: Pricing, Gallery, Submit (1/3 width) ── */}
          <div className="space-y-6">
            {/* Pricing & Duration */}
            <SectionCard
              icon={<DollarSign size={17} />}
              title="Pricing & Duration"
            >
              <div className="space-y-4">
                <div>
                  <FieldLabel>Base Price</FieldLabel>
                  <div className="relative">
                    <DollarSign
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <TextInput
                      name="base_price"
                      type="number"
                      value={formData.base_price}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Duration</FieldLabel>
                  <div className="relative">
                    <Clock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <TextInput
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      placeholder="Minutes"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Gallery */}
            <SectionCard icon={<ImageIcon size={17} />} title="Gallery">
              <div className="grid grid-cols-2 gap-3">
                {/* Existing images */}
                {existingImages.map((img, index) => (
                  <ImageThumbnail
                    key={`existing-${index + 1}`}
                    src={img.url}
                    onRemove={() => removeExistingImage(img)}
                    isNew={false}
                  />
                ))}

                {/* New image previews */}
                {newImagePreviews.map((src, i) => (
                  <ImageThumbnail
                    key={`new-${i + 1}`}
                    src={src}
                    onRemove={() => removeNewImage(i)}
                    isNew
                  />
                ))}

                {/* Upload trigger */}
                <label
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-200
                  hover:border-blue-400 hover:bg-blue-50/30 flex flex-col items-center justify-center
                  gap-1.5 cursor-pointer transition-all"
                >
                  <Upload size={16} className="text-slate-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Add
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddImages}
                  />
                </label>
              </div>
            </SectionCard>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full h-12 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold
                flex items-center justify-center gap-2.5 transition-colors shadow-sm
                disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {submitLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
