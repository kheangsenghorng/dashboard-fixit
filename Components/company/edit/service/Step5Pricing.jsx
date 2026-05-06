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
    const current = newPkgs[pkgIdx].included_item_indices || [];
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
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Pricing <span className="text-indigo-600">Tiers</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-wider">
            Protocol Specifications & Billing
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

      {/* Table Container */}
      <div className="overflow-x-auto pb-6">
        <table className="w-full border-separate border-spacing-y-3 min-w-[1000px]">
          <thead>
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <th className="px-6 py-4 text-left">Package Identity</th>
              <th className="px-6 py-4 text-left">Logistics & Rates</th>
              <th className="px-6 py-4 text-left">Specifications</th>
              <th className="px-6 py-4 text-left">Assigned Inventory</th>
              <th className="px-6 py-4 text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.packages.map((pkg, pIdx) => (
              <tr
                key={pIdx}
                className="group bg-white border-2 border-slate-100 rounded-3xl transition-all hover:shadow-lg hover:border-indigo-100"
              >
                {/* 1. Identity (Title & Description) */}
                <td className="px-6 py-8 align-top first:rounded-l-[2rem] border-y-2 border-l-2 border-slate-100 group-hover:border-indigo-100">
                  <input
                    value={pkg.title}
                    onChange={(e) =>
                      updatePackage(pIdx, "title", e.target.value)
                    }
                    placeholder="Package Title..."
                    className="text-xl font-black outline-none border-b-2 border-transparent focus:border-indigo-600 w-full mb-3 transition-colors bg-transparent"
                  />
                  <textarea
                    value={pkg.description}
                    onChange={(e) =>
                      updatePackage(pIdx, "description", e.target.value)
                    }
                    placeholder="Tier description..."
                    rows={2}
                    className="w-full text-xs font-bold text-slate-500 bg-slate-50 p-4 rounded-2xl border-none outline-none resize-none focus:ring-1 focus:ring-indigo-500/20"
                  />
                </td>

                {/* 2. Rates & Billing */}
                <td className="px-6 py-8 align-top border-y-2 border-slate-100 group-hover:border-indigo-100 min-w-[220px]">
                  <div className="flex items-center gap-2 bg-slate-900 text-white p-4 rounded-2xl mb-4 shadow-sm shadow-slate-200">
                    <DollarSign size={18} className="text-indigo-400" />
                    <input
                      type="number"
                      className="bg-transparent font-black text-xl w-full outline-none"
                      value={pkg.price}
                      onChange={(e) =>
                        updatePackage(pIdx, "price", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <select
                    className="w-full bg-slate-100 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer appearance-none text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 transition-colors"
                    value={pkg.billing_type}
                    onChange={(e) =>
                      updatePackage(pIdx, "billing_type", e.target.value)
                    }
                  >
                    <option value="one_time">Single Transaction</option>
                    <option value="weekly">Weekly Subscription</option>
                    <option value="monthly">Monthly Retainer</option>
                  </select>
                </td>

                {/* 3. Specifications (Logistics Grid) */}
                <td className="px-6 py-8 align-top border-y-2 border-slate-100 group-hover:border-indigo-100 min-w-[250px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
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

                {/* 4. Assigned Inventory */}
                <td className="px-6 py-8 align-top border-y-2 border-slate-100 group-hover:border-indigo-100 min-w-[200px]">
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                    {formData.included_items.map(
                      (item, iIdx) =>
                        item.name && (
                          <button
                            key={iIdx}
                            type="button"
                            onClick={() => toggleItemInPackage(pIdx, iIdx)}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold transition-all border-2 ${
                              pkg.included_item_indices?.includes(iIdx)
                                ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                : "text-slate-400 border-transparent hover:bg-slate-50"
                            }`}
                          >
                            {pkg.included_item_indices?.includes(iIdx) ? (
                              <CheckCircle2
                                size={14}
                                className="text-indigo-600"
                              />
                            ) : (
                              <div className="w-3.5 h-3.5 border-2 border-slate-200 rounded-md" />
                            )}
                            <span className="truncate">{item.name}</span>
                          </button>
                        )
                    )}
                    {formData.included_items.length === 0 && (
                      <p className="text-[10px] italic text-slate-300 font-medium">
                        No items registered.
                      </p>
                    )}
                  </div>
                </td>

                {/* 5. Actions */}
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
                    className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
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
        <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <Package size={56} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[0.2em]">
            No Tiers Defined
          </h3>
          <p className="text-slate-400 font-bold text-sm mt-2">
            Add a pricing package to complete the protocol deployment.
          </p>
        </div>
      )}
    </motion.section>
  );
}

/**
 * Compact input helper for logistics cells
 */
function TableLogisticsInput({ icon, label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-slate-400 tracking-tighter">
        {icon} <span>{label}</span>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs font-black focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all"
        placeholder="0"
      />
    </div>
  );
}
