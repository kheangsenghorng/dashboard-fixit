import { FileText, ImageIcon, Trash2, Zap, Globe, Plus } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Step2Identity({
  formData,
  setFormData,
  authUser,
  owners,

  // Create page props
  previews = [],
  setPreviews,
  setImageFiles,

  // Edit page props
  id,
  existingImages = [],
  setExistingImages,
  newPreviews = [],
  setNewPreviews,
  setNewImageFiles,
  deleteServiceImage,
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

    if (
      !window.confirm("Permanent Action: Delete this image from the server?")
    ) {
      return;
    }

    try {
      await deleteServiceImage(id, img.path);

      setExistingImages?.((prev) =>
        prev.filter((image) => image.path !== img.path)
      );

      toast.success("Asset Purged");
    } catch (error) {
      console.error("Delete service image error:", error);
      toast.error("Failed to delete asset");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10"
    >
      <div className="lg:col-span-8 space-y-8">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <FileText size={22} />
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Basic Information
            </h2>
          </div>

          {authUser?.role === "admin" && (
            <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3 px-1">
                Partner Account Assignment
              </label>

              <select
                value={formData.owner_id || ""}
                onChange={(e) =>
                  setFormData({ ...formData, owner_id: e.target.value })
                }
                className="w-full p-4 bg-white rounded-xl border border-slate-200 font-bold text-slate-700 outline-none"
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

          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] block mb-3 px-1">
                Service Title
              </label>

              <input
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Premium Deep Sanitization"
                className="w-full text-3xl font-black outline-none border-b-2 border-slate-100 focus:border-indigo-600 transition-colors pb-4"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] block mb-3 px-1">
                Marketplace Description
              </label>

              <textarea
                rows={6}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-6 bg-slate-50 rounded-3xl border-none font-medium text-slate-600 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black flex items-center gap-4 text-slate-900">
              <ImageIcon className="text-indigo-600" /> Portfolio Assets
            </h2>

            <label className="cursor-pointer bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-indigo-600 transition-all shadow-lg">
              <span className="flex items-center gap-2">
                <Plus size={14} /> Add Images
              </span>

              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isEditMode &&
              existingImages?.map((img, index) => (
                <div
                  key={`existing-${img.path || index}`}
                  className="relative aspect-square rounded-2xl overflow-hidden border-2 border-indigo-100 group shadow-sm"
                >
                  <Image
                    src={img.url}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    alt="Server asset"
                    unoptimized
                  />

                  <div className="absolute top-2 left-2 bg-indigo-600 text-white p-1 rounded-lg">
                    <Globe size={10} />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeExistingImage(img)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

            {visibleNewPreviews?.map((src, index) => (
              <div
                key={`new-${src}-${index}`}
                className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group shadow-sm"
              >
                <Image
                  src={src}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-70"
                  alt="New preview"
                  unoptimized
                />

                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-2 right-2 bg-slate-800 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {!existingImages?.length && !visibleNewPreviews?.length && (
              <div className="col-span-full border-2 border-dashed border-slate-100 rounded-[2rem] py-12 flex flex-col items-center justify-center text-slate-300">
                <ImageIcon size={40} className="mb-2 opacity-20" />

                <p className="text-xs font-bold uppercase tracking-widest">
                  No images uploaded
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl sticky top-10 overflow-hidden">
          <Zap size={32} className="text-indigo-400 mb-6 relative z-10" />

          <h4 className="font-bold text-xl mb-4 relative z-10">Pro Insight</h4>

          <p className="text-slate-400 text-sm leading-relaxed relative z-10 mb-6">
            Services with high-quality portfolio images instead of stock photos
            see a <strong>3x higher trust rating</strong>.
          </p>
        </div>
      </aside>
    </motion.section>
  );
}
