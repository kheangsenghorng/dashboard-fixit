import { Plus, Trash2, CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Step3Checklist({ formData, setFormData }) {
  const addGroup = () =>
    setFormData({
      ...formData,
      task_groups: [
        ...formData.task_groups,
        { name: "", items: [{ title: "" }] },
      ],
    });

  const updateItem = (gIdx, iIdx, val) => {
    const newGroups = [...formData.task_groups];
    newGroups[gIdx].items[iIdx].title = val;
    setFormData({ ...formData, task_groups: newGroups });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black">
          Task <span className="text-indigo-600">Checklist</span>
        </h1>
        <button
          type="button"
          onClick={addGroup}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <Plus size={18} /> Add Group
        </button>
      </div>

      {formData.task_groups.map((group, gIdx) => (
        <div
          key={gIdx}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm"
        >
          <input
            className="w-full text-xl font-bold bg-slate-50 p-4 rounded-xl mb-6"
            value={group.name}
            placeholder="Group Name..."
            onChange={(e) => {
              const newGroups = [...formData.task_groups];
              newGroups[gIdx].name = e.target.value;
              setFormData({ ...formData, task_groups: newGroups });
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.items.map((item, iIdx) => (
              <div
                key={iIdx}
                className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl"
              >
                <CheckCircle2 size={18} className="text-slate-300" />
                <input
                  className="bg-transparent flex-1 outline-none font-bold text-sm"
                  value={item.title}
                  onChange={(e) => updateItem(gIdx, iIdx, e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newGroups = [...formData.task_groups];
                newGroups[gIdx].items.push({ title: "" });
                setFormData({ ...formData, task_groups: newGroups });
              }}
              className="border-2 border-dashed border-slate-200 p-4 rounded-xl text-slate-400 font-bold"
            >
              + Add Line
            </button>
          </div>
        </div>
      ))}
    </motion.section>
  );
}
