import {
  FileText,
  ImageIcon,
  Trash2,
  Zap,
  Globe,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Step2Identity({
  formData,
  setFormData,
  authUser,
  owners,

  previews = [],
  setPreviews,
  setImageFiles,

  id,
  existingImages = [],
  setExistingImages,
  newPreviews = [],
  setNewPreviews,
  setNewImageFiles,
  deleteServiceImage,

  onUpdateServer,
  isUpdating = false,
}) {
  const isEditMode = Boolean(id);
  const visibleNewPreviews = isEditMode ? newPreviews : previews;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const objectUrls = files.map((file) => URL.createObjectURL(file));

    if (isEditMode) {
      setNewImageFiles?.((prev) => [...prev, ...files]);
      setNewPreviews?.((prev) => [...prev, ...objectUrls]);
    } else {
      setImageFiles?.((prev) => [...prev, ...files]);
      setPreviews?.((prev) => [...prev, ...objectUrls]);
    }

    e.target.value = "";
  };

  const removeNewImage = (index) => {
    const previewUrl = visibleNewPreviews[index];

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    if (isEditMode) {
      setNewPreviews?.((prev) => prev.filter((_, i) => i !== index));
      setNewImageFiles?.((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPreviews?.((prev) => prev.filter((_, i) => i !== index));
      setImageFiles?.((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const removeExistingImage = async (img) => {
    if (!isEditMode) return;
    if (!deleteServiceImage) {
      toast.error("Delete image action is not available.");
      return;
    }
    if (!img?.path) {
      toast.error("Image path is missing.");
      return;
    }

    if (!window.confirm("Delete this image from the server?")) return;

    try {
      await deleteServiceImage(id, img.path);
      setExistingImages?.((prev) =>
        prev.filter((image) => image.path !== img.path)
      );
      toast.success("Image deleted");
    } catch (error) {
      console.error("Delete service image error:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4"
    >
      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-6">
        {/* Card 1: Basic Info */}
        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100/80 transition-all duration-300 hover:shadow-md/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Basic Information
            </h2>
          </div>

          {/* Admin Assignment */}
          {authUser?.role === "admin" && (
            <div className="mb-8 p-5 bg-slate-50/70 rounded-2xl border border-slate-100 backdrop-blur-sm">
              <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-2 px-1">
                Partner Account Assignment
              </label>
              <select
                value={formData.owner_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, owner_id: e.target.value })
                }
                className="w-full p-3.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm"
              >
                <option value="">Choose a business partner...</option>
                {owners?.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.business_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Core Inputs */}
          <div className="space-y-6">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest block mb-2 px-1">
                Service Title
              </label>
              <input
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Premium Deep Sanitization"
                className="w-full text-2xl font-bold outline-none border-b border-slate-200 focus:border-indigo-600 transition-colors pb-3 placeholder:text-slate-300 text-slate-800"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 tracking-widest block mb-2 px-1">
                Marketplace Description
              </label>
              <textarea
                rows={5}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your service offering here..."
                className="w-full p-5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-medium text-slate-600 outline-none resize-none leading-relaxed transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Portfolio Assets */}
        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100/80 transition-all duration-300 hover:shadow-md/50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 tracking-tight">
              <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                <ImageIcon size={20} />
              </span>
              Portfolio Assets
            </h2>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {isEditMode && (
                <button
                  type="button"
                  onClick={onUpdateServer}
                  disabled={isUpdating}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-sm"
                >
                  {isUpdating ? "Updating..." : "Update Server"}
                </button>
              )}

              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-md hover:shadow-lg shadow-indigo-600/10 flex items-center gap-1.5">
                <Plus size={14} strokeWidth={2.5} /> Add Images
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Grid Area */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Existing Images */}
            {isEditMode &&
              existingImages?.map((img, index) => (
                <div
                  key={`existing-${img.path || index}`}
                  className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50"
                >
                  <Image
                    src={img.url}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    alt="Server asset"
                    unoptimized
                  />

                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1">
                    <Globe size={10} /> Live
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="bg-white/95 text-red-600 p-2.5 rounded-xl transition-transform transform scale-90 group-hover:scale-100 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

            {/* New Previews */}
            {visibleNewPreviews?.map((src, index) => (
              <div
                key={`new-${src}-${index}`}
                className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50"
              >
                <Image
                  src={src}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="New preview"
                  unoptimized
                />

                {/* Badge for Pending Upload */}
                <div className="absolute top-2.5 left-2.5 bg-indigo-600 text-white px-2 py-1 rounded-md text-[9px] font-bold">
                  Pending
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="bg-white/95 text-slate-800 p-2.5 rounded-xl transition-transform transform scale-90 group-hover:scale-100 hover:bg-slate-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {!existingImages?.length && !visibleNewPreviews?.length && (
              <div className="col-span-full border-2 border-dashed border-slate-200/60 rounded-2xl py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <ImageIcon size={22} />
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  No images uploaded yet
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Upload a cover or portfolio photo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Insights */}
      <aside className="lg:col-span-4">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-3xl p-8 text-white shadow-xl sticky top-8 overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400 border border-white/5 backdrop-blur-md">
              <Zap size={20} />
            </div>
            <ArrowUpRight size={18} className="text-slate-500" />
          </div>

          <h4 className="font-bold text-lg mb-2 text-slate-100 tracking-tight">
            Pro Insight
          </h4>

          <p className="text-slate-400 text-xs leading-relaxed font-medium">
            Services featuring authentic, high-quality portfolio images rather
            than placeholder or generic stock photography achieve up to a{" "}
            <strong className="text-indigo-400 font-bold">3x increase</strong>{" "}
            in overall client trust and booking rates.
          </p>
        </div>
      </aside>
    </motion.section>
  );
}
