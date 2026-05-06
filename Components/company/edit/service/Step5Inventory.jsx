import {
  Wrench,
  Plus,
  Trash2,
  Box,
  Info,
  CheckCircle2,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Step4Inventory({ formData, setFormData }) {
  const addItem = () => {
    setFormData((p) => ({
      ...p,
      included_items: [
        ...p.included_items,
        {
          name: "",
          description: "",
          status: "active",
          image: null,
          preview: null,
        },
      ],
    }));
  };

  const updateItem = (index, key, val) => {
    const newItems = [...formData.included_items];
    newItems[index][key] = val;
    setFormData({ ...formData, included_items: newItems });
  };

  const handleItemImage = (index, file) => {
    const newItems = [...formData.included_items];
    newItems[index].image = file;
    newItems[index].preview = URL.createObjectURL(file);
    setFormData({ ...formData, included_items: newItems });
  };

  const removeItem = (idx) => {
    setFormData({
      ...formData,
      included_items: formData.included_items.filter((_, i) => i !== idx),
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Inventory <span className="text-indigo-600">Library</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-1 flex items-center gap-2 uppercase tracking-wider">
            <Box size={16} className="text-indigo-500" /> Equipment & Supplies
            Management
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus size={18} /> REGISTER ITEM
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <th className="px-8 py-4 text-left">Visual & Name</th>
              <th className="px-8 py-4 text-left">
                Tool Details (Description)
              </th>
              <th className="px-8 py-4 text-center">Status</th>
              <th className="px-8 py-4 text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.included_items.map((item, idx) => (
              <tr
                key={idx}
                className="group bg-white border-2 border-slate-100 rounded-3xl transition-all hover:border-indigo-200"
              >
                {/* 1. Image & Name Column */}
                <td className="px-8 py-6 first:rounded-l-[2rem] border-y-2 border-l-2 border-slate-100 group-hover:border-indigo-100">
                  <div className="flex items-center gap-4">
                    <label className="relative w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer overflow-hidden transition-all shrink-0">
                      {item.preview ? (
                        <Image
                          src={item.preview}
                          fill
                          className="object-cover"
                          alt="item"
                        />
                      ) : (
                        <Upload size={20} />
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleItemImage(idx, e.target.files[0])
                        }
                      />
                    </label>
                    <div className="flex-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">
                        Item Title
                      </label>
                      <input
                        placeholder="e.g. Professional Vacuum"
                        className="text-lg font-black outline-none border-b-2 border-transparent focus:border-indigo-600 w-full transition-colors"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(idx, "name", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </td>

                {/* 2. Description Column */}
                <td className="px-8 py-6 border-y-2 border-slate-100 group-hover:border-indigo-100">
                  <div className="relative flex items-center">
                    <Info
                      size={16}
                      className="absolute left-4 text-slate-300"
                    />
                    <input
                      placeholder="Specs, model, or usage notes..."
                      className="w-full text-sm font-bold text-slate-500 bg-slate-50 pl-12 pr-4 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(idx, "description", e.target.value)
                      }
                    />
                  </div>
                </td>

                {/* 3. Status Column */}
                <td className="px-8 py-6 border-y-2 border-slate-100 group-hover:border-indigo-100">
                  <div className="flex justify-center">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateItem(idx, "status", e.target.value)
                      }
                      className={`text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full border-none outline-none cursor-pointer appearance-none text-center shadow-sm transition-colors ${
                        item.status === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <option value="active">● Active</option>
                      <option value="inactive">○ Inactive</option>
                    </select>
                  </div>
                </td>

                {/* 4. Action Column */}
                <td className="px-8 py-6 last:rounded-r-[2rem] border-y-2 border-r-2 border-slate-100 group-hover:border-indigo-100 text-center">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {formData.included_items.length === 0 && (
          <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 mt-4">
            <Box size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">
              Inventory is empty
            </h3>
            <p className="text-slate-400 font-bold text-sm mt-2">
              Register the tools and materials you use for this service
              protocol.
            </p>
          </div>
        )}
      </div>

      {/* Sync Tip */}
      <div className="bg-indigo-50 p-8 rounded-[2.5rem] flex items-start gap-5 border border-indigo-100">
        <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
          <CheckCircle2 size={22} />
        </div>
        <div>
          <h4 className="text-indigo-900 font-black text-sm uppercase tracking-widest mb-1">
            Database Protocol Sync
          </h4>
          <p className="text-indigo-700/70 text-xs font-bold leading-relaxed max-w-2xl">
            This inventory list populates the <strong>included_items</strong>{" "}
            table. Each item registered here can be linked to specific pricing
            packages in the final step to differentiate service value.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
