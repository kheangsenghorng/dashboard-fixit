import { FileText, ImageIcon, Trash2, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Step2Identity({
  formData,
  setFormData,
  authUser,
  owners,
  previews,
  setPreviews,
  setImageFiles,
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

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10"
    >
      <div className="lg:col-span-8 space-y-8">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
              <FileText size={22} />
            </div>
            <h2 className="text-2xl font-black">Basic Information</h2>
          </div>

          {authUser?.role === "admin" && (
            <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">
                Partner Account
              </label>
              <select
                value={formData.owner_id}
                onChange={(e) =>
                  setFormData({ ...formData, owner_id: e.target.value })
                }
                className="w-full p-4 bg-white rounded-xl border border-slate-200 font-bold"
              >
                <option value="">Choose a partner...</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.business_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-3 px-1">
                Service Title
              </label>
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Premium Deep Cleaning"
                className="w-full text-3xl font-black outline-none border-b-2 border-slate-100 focus:border-indigo-600 transition-colors pb-4"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-3 px-1">
                Detailed Description
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none resize-none font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black flex items-center gap-4">
              <ImageIcon /> Media
            </h2>
            <label className="cursor-pointer bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-xs">
              Add Assets
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
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group"
              >
                <Image src={src} fill className="object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-xl text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl sticky top-10">
          <Zap size={32} className="text-indigo-400 mb-6" />
          <h4 className="font-bold text-xl mb-4">Pro Insight</h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            Services with actual portfolio images instead of stock photos see a
            3x higher trust rating.
          </p>
        </div>
      </aside>
    </motion.section>
  );
}
