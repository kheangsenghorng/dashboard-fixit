import React, { useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  GripVertical,
  ListChecks,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- SKELETON COMPONENT ---
// This mimics the structure of the checklist while data is loading
const ChecklistSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="flex justify-between items-end pb-6 border-b border-slate-100">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-4 w-64 bg-slate-100 animate-pulse rounded-md" />
      </div>
      <div className="h-12 w-40 bg-slate-200 animate-pulse rounded-xl" />
    </div>
    {[1, 2].map((i) => (
      <div
        key={i}
        className="h-44 w-full bg-white border border-slate-200 rounded-[2rem] p-8 space-y-4"
      >
        <div className="h-8 w-1/3 bg-slate-100 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 gap-3">
          <div className="h-14 bg-slate-50 animate-pulse rounded-2xl" />
          <div className="h-14 bg-slate-50 animate-pulse rounded-2xl" />
        </div>
      </div>
    ))}
  </div>
);

export default function Step3Checklist({
  formData,
  setFormData,
  isLoading = false,
}) {
  const taskGroups = formData.task_groups || [];
  // Keep the first group expanded by default
  const [expandedGroups, setExpandedGroups] = useState({ 0: true });

  if (isLoading) return <ChecklistSkeleton />;

  const toggleGroup = (idx) => {
    setExpandedGroups((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const updateGroups = (newGroups) => {
    setFormData({ ...formData, task_groups: newGroups });
  };

  const addGroup = () => {
    const newGroups = [
      ...taskGroups,
      {
        name: "",
        description: null,
        status: "active",
        items: [
          { title: "", description: null, sort_order: 1, status: "active" },
        ],
      },
    ];
    updateGroups(newGroups);
    // Automatically focus/expand the new group
    setExpandedGroups((prev) => ({ ...prev, [newGroups.length - 1]: true }));
  };

  const removeGroup = (gIdx) => {
    updateGroups(taskGroups.filter((_, index) => index !== gIdx));
  };

  const updateGroup = (gIdx, field, value) => {
    const newGroups = taskGroups.map((group, index) =>
      index === gIdx ? { ...group, [field]: value } : group
    );
    updateGroups(newGroups);
  };

  const addItem = (gIdx) => {
    const newGroups = taskGroups.map((group, index) => {
      if (index !== gIdx) return group;
      const items = group.items || [];
      return {
        ...group,
        items: [
          ...items,
          {
            title: "",
            description: null,
            sort_order: items.length + 1,
            status: "active",
          },
        ],
      };
    });
    updateGroups(newGroups);
  };

  const updateItem = (gIdx, iIdx, field, value) => {
    const newGroups = taskGroups.map((group, groupIndex) => {
      if (groupIndex !== gIdx) return group;
      return {
        ...group,
        items: group.items.map((item, itemIndex) =>
          itemIndex === iIdx ? { ...item, [field]: value } : item
        ),
      };
    });
    updateGroups(newGroups);
  };

  const removeItem = (gIdx, iIdx) => {
    const newGroups = taskGroups.map((group, groupIndex) => {
      if (groupIndex !== gIdx) return group;
      return {
        ...group,
        items: group.items.filter((_, itemIndex) => itemIndex !== iIdx),
      };
    });
    updateGroups(newGroups);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10 pb-24"
    >
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
              <ListChecks size={24} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Scope of <span className="text-indigo-600">Work</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">
            Break down your service into organized task groups.
          </p>
        </div>

        <button
          type="button"
          onClick={addGroup}
          className="group inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl active:scale-95"
        >
          <Plus
            size={18}
            className="group-hover:rotate-90 transition-transform"
          />
          Add Task Group
        </button>
      </div>

      {/* --- CONTENT LIST --- */}
      <div className="space-y-6">
        <AnimatePresence>
          {taskGroups.map((group, gIdx) => {
            const isExpanded = !!expandedGroups[gIdx];

            return (
              <motion.div
                key={gIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden transition-all hover:border-slate-300"
              >
                <div className="p-7">
                  {/* Group Header Info */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <input
                        className="w-full text-xl font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none bg-transparent"
                        value={group.name}
                        placeholder="Group Name (e.g., Bedroom Cleaning)"
                        onChange={(e) =>
                          updateGroup(gIdx, "name", e.target.value)
                        }
                      />
                      <input
                        className="w-full text-sm text-slate-400 font-medium bg-transparent border-none focus:ring-0 placeholder:text-slate-200"
                        value={group.description ?? ""}
                        placeholder="Add a brief description..."
                        onChange={(e) =>
                          updateGroup(
                            gIdx,
                            "description",
                            e.target.value || null
                          )
                        }
                      />
                    </div>

                    {/* Group Actions Pill */}
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      <button
                        type="button"
                        onClick={() => removeGroup(gIdx)}
                        className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleGroup(gIdx)}
                        className={`h-9 w-9 flex items-center justify-center bg-white shadow-sm rounded-xl transition-all ${
                          isExpanded
                            ? "rotate-180 text-indigo-600"
                            : "text-slate-600"
                        }`}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Task Items Area (Collapsible) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 mt-8 pt-8 border-t border-slate-50">
                          {(group.items || []).map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="group flex flex-col gap-2 p-4 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 rounded-[1.25rem] transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical
                                  size={16}
                                  className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0"
                                />
                                <CheckCircle2
                                  size={18}
                                  className="text-indigo-500 shrink-0"
                                />
                                <input
                                  className="bg-transparent flex-1 font-bold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-300"
                                  value={item.title}
                                  placeholder="What needs to be done?"
                                  onChange={(e) =>
                                    updateItem(
                                      gIdx,
                                      iIdx,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={() => removeItem(gIdx, iIdx)}
                                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <textarea
                                className="ml-8 bg-transparent text-xs text-slate-500 font-medium outline-none resize-none placeholder:text-slate-300"
                                value={item.description ?? ""}
                                placeholder="Add specific task instructions..."
                                rows={1}
                                onChange={(e) =>
                                  updateItem(
                                    gIdx,
                                    iIdx,
                                    "description",
                                    e.target.value || null
                                  )
                                }
                              />
                            </div>
                          ))}

                          {/* Add Item Button */}
                          <button
                            type="button"
                            onClick={() => addItem(gIdx)}
                            className="w-full mt-2 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-[1.25rem] text-slate-400 text-xs font-black uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
                          >
                            <Plus size={14} /> Add Line Item
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* --- EMPTY STATE --- */}
        {taskGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/30">
            <div className="p-5 bg-white rounded-3xl shadow-sm mb-5">
              <ListChecks className="text-slate-200" size={40} />
            </div>
            <p className="text-slate-500 font-bold text-lg">
              Your checklist is empty
            </p>
            <p className="text-slate-400 text-sm mb-8">
              Start by adding a task group for your service workflow.
            </p>
            <button
              onClick={addGroup}
              className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Create First Group
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
