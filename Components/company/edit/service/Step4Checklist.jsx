import { Plus, Trash2, CheckCircle2, ListChecks, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Step4Checklist({ formData, setFormData }) {
  const addGroup = () =>
    setFormData({
      ...formData,
      task_groups: [
        ...formData.task_groups,
        { name: "", items: [{ title: "" }] },
      ],
    });

  const removeGroup = (gIdx) =>
    setFormData({
      ...formData,
      task_groups: formData.task_groups.filter((_, i) => i !== gIdx),
    });

  const addTask = (gIdx) => {
    const newGroups = [...formData.task_groups];
    newGroups[gIdx].items.push({ title: "" });
    setFormData({ ...formData, task_groups: newGroups });
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <header>
          <h1 className="text-6xl font-black tracking-tight text-slate-900 mb-4">
            Task <span className="text-indigo-600">Checklist</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Define the scope of work line by line.
          </p>
        </header>
        <button
          type="button"
          onClick={addGroup}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100"
        >
          <Plus size={18} /> NEW GROUP
        </button>
      </div>

      <div className="space-y-8">
        {formData.task_groups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative"
          >
            <div className="flex gap-4 mb-8">
              <input
                placeholder="Group Title (e.g. Living Room)"
                className="flex-1 text-xl font-bold bg-slate-50 px-6 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={group.name}
                onChange={(e) => {
                  const newGroups = [...formData.task_groups];
                  newGroups[gIdx].name = e.target.value;
                  setFormData({ ...formData, task_groups: newGroups });
                }}
              />
              <button
                type="button"
                onClick={() => removeGroup(gIdx)}
                className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
              >
                <Trash2 size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="flex items-center gap-3 bg-white border border-slate-100 p-4 rounded-xl"
                >
                  <CheckCircle2
                    size={18}
                    className="text-indigo-600 shrink-0"
                  />
                  <input
                    placeholder="Task description..."
                    className="bg-transparent border-none outline-none w-full font-bold text-sm"
                    value={item.title}
                    onChange={(e) => {
                      const newGroups = [...formData.task_groups];
                      newGroups[gIdx].items[iIdx].title = e.target.value;
                      setFormData({ ...formData, task_groups: newGroups });
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addTask(gIdx)}
                className="border-2 border-dashed border-slate-200 p-4 rounded-xl text-slate-400 font-black text-[10px] tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all"
              >
                + ADD LINE ITEM
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
