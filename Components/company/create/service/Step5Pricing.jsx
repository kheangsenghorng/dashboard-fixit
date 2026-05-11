import {
  Package,
  Plus,
  DollarSign,
  CheckSquare,
  CheckCircle2,
  Trash2,
  Clock,
  Users,
  Maximize,
  Layout,
  Bed,
  Settings2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Step5Pricing({ formData, setFormData }) {
  const addPackage = () => {
    setFormData((p) => ({
      ...p,
      packages: [
        ...p.packages,
        {
          title: "",
          description: "",
          price: "",
          billing_type: "one_time",
          min_area_m2: "",
          max_area_m2: "",
          floor_number: "",
          bedrooms: "",
          duration_hours: "",
          workers_count: "",
          status: "active",
          included_item_indices: [],
        },
      ],
    }));
  };

  const updatePackage = (index, field, value) => {
    const newPkgs = [...formData.packages];
    newPkgs[index][field] = value;
    setFormData({ ...formData, packages: newPkgs });
  };

  const toggleItemInPackage = (pkgIdx, itemIdx) => {
    const newPkgs = [...formData.packages];
    const current = newPkgs[pkgIdx].included_item_indices;
    newPkgs[pkgIdx].included_item_indices = current.includes(itemIdx)
      ? current.filter((i) => i !== itemIdx)
      : [...current, itemIdx];
    setFormData({ ...formData, packages: newPkgs });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Pricing <span className="text-indigo-600">Tiers</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-1">
            Manage your service packages and specifications
          </p>
        </div>
        <button
          type="button"
          onClick={addPackage}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus size={18} /> ADD NEW TIER
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <th className="px-6 py-4 text-left">Package Details</th>
              <th className="px-6 py-4 text-left">Pricing & Billing</th>
              <th className="px-6 py-4 text-left">Specifications</th>
              <th className="px-6 py-4 text-left">Included Inventory</th>
              <th className="px-6 py-4 text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.packages.map((pkg, pIdx) => (
              <tr
                key={pIdx}
                className="group bg-white border-2 border-slate-100 rounded-3xl transition-all hover:shadow-md"
              >
                {/* 1. Title & Description */}
                <td className="px-6 py-8 align-top first:rounded-l-[2rem] border-y-2 border-l-2 border-slate-100 group-hover:border-indigo-100">
                  <input
                    value={pkg.title}
                    onChange={(e) =>
                      updatePackage(pIdx, "title", e.target.value)
                    }
                    placeholder="Package Name"
                    className="text-xl font-black outline-none border-b-2 border-transparent focus:border-indigo-600 w-full mb-2"
                  />
                  <textarea
                    value={pkg.description}
                    onChange={(e) =>
                      updatePackage(pIdx, "description", e.target.value)
                    }
                    placeholder="Short description..."
                    rows={2}
                    className="w-full text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-xl border-none outline-none resize-none"
                  />
                </td>

                {/* 2. Pricing & Billing */}
                <td className="px-6 py-8 align-top border-y-2 border-slate-100 group-hover:border-indigo-100 min-w-[200px]">
                  <div className="flex items-center gap-2 bg-slate-900 text-white p-3 rounded-xl mb-3">
                    <DollarSign size={16} className="text-indigo-400" />
                    <input
                      type="number"
                      className="bg-transparent font-black text-lg w-full outline-none"
                      value={pkg.price}
                      onChange={(e) =>
                        updatePackage(pIdx, "price", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <select
                    className="w-full bg-slate-100 p-3 rounded-xl font-black text-[10px] uppercase tracking-wider outline-none cursor-pointer"
                    value={pkg.billing_type}
                    onChange={(e) =>
                      updatePackage(pIdx, "billing_type", e.target.value)
                    }
                  >
                    <option value="one_time">One Time</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </td>

                {/* 3. Logistics Grid */}
                <td className="px-6 py-8 align-top border-y-2 border-slate-100 group-hover:border-indigo-100">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <TableLogisticsInput
                      icon={<Maximize size={12} />}
                      label="Min m²"
                      value={pkg.min_area_m2}
                      onChange={(v) => updatePackage(pIdx, "min_area_m2", v)}
                    />
                    <TableLogisticsInput
                      icon={<Maximize size={12} />}
                      label="Max m²"
                      value={pkg.max_area_m2}
                      onChange={(v) => updatePackage(pIdx, "max_area_m2", v)}
                    />
                    <TableLogisticsInput
                      icon={<Layout size={12} />}
                      label="Floors"
                      value={pkg.floor_number}
                      onChange={(v) => updatePackage(pIdx, "floor_number", v)}
                    />
                    <TableLogisticsInput
                      icon={<Bed size={12} />}
                      label="Beds"
                      value={pkg.bedrooms}
                      onChange={(v) => updatePackage(pIdx, "bedrooms", v)}
                    />
                    <TableLogisticsInput
                      icon={<Clock size={12} />}
                      label="Hours"
                      value={pkg.duration_hours}
                      onChange={(v) => updatePackage(pIdx, "duration_hours", v)}
                    />
                    <TableLogisticsInput
                      icon={<Users size={12} />}
                      label="Staff"
                      value={pkg.workers_count}
                      onChange={(v) => updatePackage(pIdx, "workers_count", v)}
                    />
                  </div>
                </td>

                {/* 4. Inventory List */}
                <td className="px-6 py-8 align-top border-y-2 border-slate-100 group-hover:border-indigo-100">
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                    {formData.included_items.map(
                      (item, iIdx) =>
                        item.name && (
                          <button
                            key={iIdx}
                            type="button"
                            onClick={() => toggleItemInPackage(pIdx, iIdx)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                              pkg.included_item_indices.includes(iIdx)
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                                : "text-slate-400 hover:bg-slate-50"
                            }`}
                          >
                            {pkg.included_item_indices.includes(iIdx) ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <div className="w-3 h-3 border border-slate-300 rounded-sm" />
                            )}
                            <span className="truncate">{item.name}</span>
                          </button>
                        )
                    )}
                  </div>
                </td>

                {/* 5. Delete Action */}
                <td className="px-6 py-8 align-middle text-center last:rounded-r-[2rem] border-y-2 border-r-2 border-slate-100 group-hover:border-indigo-100">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        packages: formData.packages.filter(
                          (_, i) => i !== pIdx
                        ),
                      })
                    }
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formData.packages.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <Package size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">
            No Tiers Created
          </h3>
          <p className="text-slate-400 font-bold text-sm">
            Click "Add New Tier" to get started
          </p>
        </div>
      )}
    </motion.section>
  );
}

// Compact Sub-component for Table Inputs
function TableLogisticsInput({ icon, label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-[8px] font-black uppercase text-slate-400 tracking-tighter">
        {icon} <span>{label}</span>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 p-2 rounded-lg text-xs font-black focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
        placeholder="0"
      />
    </div>
  );
}
