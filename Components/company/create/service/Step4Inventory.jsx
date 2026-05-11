import {
  Wrench,
  Plus,
  Trash2,
  Box,
  Info,
  CheckCircle2,
  ImagePlus,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Step4Inventory({ formData, setFormData }) {
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      included_items: [
        ...(prev.included_items || []),
        {
          name: "",
          description: "",
          image: null,
          image_preview: null,
          status: "active",
        },
      ],
    }));
  };

  const updateItem = (index, key, value) => {
    const newItems = [...(formData.included_items || [])];
    newItems[index] = { ...newItems[index], [key]: value };
    setFormData({ ...formData, included_items: newItems });
  };

  const updateItemImage = (index, file) => {
    if (!file) return;
    const newItems = [...(formData.included_items || [])];
    if (newItems[index]?.image_preview) {
      URL.revokeObjectURL(newItems[index].image_preview);
    }
    newItems[index] = {
      ...newItems[index],
      image: file,
      image_preview: URL.createObjectURL(file),
    };
    setFormData({ ...formData, included_items: newItems });
  };

  const removeItem = (index) => {
    const item = formData.included_items[index];
    if (item?.image_preview) URL.revokeObjectURL(item.image_preview);
    setFormData({
      ...formData,
      included_items: formData.included_items.filter((_, i) => i !== index),
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* --- HEADER SECTION --- */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500 text-[10px] font-black px-2 py-1 rounded-md tracking-tighter uppercase">
                Step 04
              </span>
              <h1 className="text-3xl font-black tracking-tight">
                Inventory <span className="text-indigo-400">Manager</span>
              </h1>
            </div>
            <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
              <Layers size={16} className="text-indigo-400" />
              Define the professional gear included in your service packages.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="group relative bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus size={20} className="relative z-10 group-hover:text-white" />
            <span className="relative z-10 group-hover:text-white">
              ADD NEW TOOL
            </span>
          </button>
        </div>

        {/* Background Decorative Element */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      {/* --- INVENTORY GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {(formData.included_items || []).map((item, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
            >
              <div className="flex gap-5">
                {/* Image Upload Area */}
                <div className="shrink-0">
                  <label className="relative block w-28 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors group">
                    {item.image_preview ? (
                      <img
                        src={item.image_preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 group-hover:text-indigo-500">
                        <ImagePlus size={24} />
                        <span className="text-[10px] font-bold mt-2 uppercase tracking-tighter">
                          Upload
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        updateItemImage(idx, e.target.files?.[0])
                      }
                    />
                  </label>
                </div>

                {/* Details Area */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={14} className="text-indigo-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Tool Name
                        </span>
                      </div>
                      <input
                        placeholder="e.g. Industrial Vacuum"
                        className="w-full text-lg font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:text-indigo-600 transition-colors"
                        value={item.name || ""}
                        onChange={(e) =>
                          updateItem(idx, "name", e.target.value)
                        }
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-1">
                      <Info size={14} className="text-indigo-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Description
                      </span>
                    </div>
                    <textarea
                      placeholder="Specify brand, model or capabilities..."
                      rows="2"
                      className="w-full text-sm font-medium text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all resize-none"
                      value={item.description || ""}
                      onChange={(e) =>
                        updateItem(idx, "description", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-1">
                      {["active", "inactive"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateItem(idx, "status", status)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                            item.status === status
                              ? status === "active"
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                                : "bg-slate-800 text-white"
                              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- EMPTY STATE --- */}
      {(formData.included_items || []).length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200"
        >
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50 rotate-3 group-hover:rotate-0 transition-transform">
            <Box size={40} className="text-indigo-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            Your library is empty
          </h3>
          <p className="text-slate-500 font-medium mt-2 max-w-xs mx-auto">
            Click the "Add New Tool" button to start building your equipment
            inventory.
          </p>
        </motion.div>
      )}

      {/* --- FOOTER INFO --- */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-1 rounded-3xl">
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-[calc(1.5rem-1px)] flex flex-col md:flex-row items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
            <CheckCircle2 size={24} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-slate-900 font-black text-sm uppercase tracking-widest">
              Inventory Synchronization
            </h4>
            <p className="text-slate-500 text-xs font-bold leading-relaxed">
              These items will be available globally across all your service
              packages. Updates here will reflect on your public storefront
              instantly.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
