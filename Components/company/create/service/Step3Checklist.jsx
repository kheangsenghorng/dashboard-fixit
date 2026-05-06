import React, { useState } from "react"; // Added useState
import {
  Plus,
  Trash2,
  CheckCircle2,
  GripVertical,
  ListChecks,
  ChevronDown, // Added Chevron
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Step3Checklist({ formData, setFormData }) {
  const taskGroups = formData.task_groups || [];

  // State to track which groups are expanded (default first one open or all open)
  const [expandedGroups, setExpandedGroups] = useState({ 0: true });

  const toggleGroup = (idx) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
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
    // Automatically expand the newly added group
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
        items: group.items
          .filter((_, itemIndex) => itemIndex !== iIdx)
          .map((item, index) => ({ ...item, sort_order: index + 1 })),
      };
    });
    updateGroups(newGroups);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10 pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ListChecks size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Task <span className="text-indigo-600">Checklist</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Define and organize your service workflow steps.
          </p>
        </div>

        <button
          type="button"
          onClick={addGroup}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          Add New Group
        </button>
      </div>

      <div className="space-y-8">
        <AnimatePresence>
          {taskGroups.map((group, gIdx) => {
            const isExpanded = !!expandedGroups[gIdx];

            return (
              <motion.div
                key={gIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Group Accent Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500" />

                <div className="p-6">
                  {/* Group Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input
                        className="w-full text-xl font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none transition-all"
                        value={group.name}
                        placeholder="Enter Group Name (e.g., Initial Setup)"
                        onChange={(e) =>
                          updateGroup(gIdx, "name", e.target.value)
                        }
                      />
                      <textarea
                        className="w-full mt-2 text-slate-500 text-sm bg-transparent border-none focus:ring-0 resize-none placeholder:text-slate-300"
                        value={group.description ?? ""}
                        rows={1}
                        placeholder="Add a brief group description..."
                        onChange={(e) =>
                          updateGroup(
                            gIdx,
                            "description",
                            e.target.value || null
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeGroup(gIdx)}
                        className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>

                      {/* Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleGroup(gIdx)}
                        className={`h-10 w-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-xl transition-all ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 mt-6 pt-6 border-t border-slate-50">
                          {(group.items || []).map((item, iIdx) => (
                            <motion.div
                              key={iIdx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="group flex flex-col gap-2 p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-all border border-transparent hover:border-slate-200"
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical
                                  size={16}
                                  className="text-slate-300 cursor-grab"
                                />
                                <CheckCircle2
                                  size={18}
                                  className="text-indigo-400"
                                />

                                <input
                                  className="bg-transparent flex-1 font-semibold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400"
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

                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Order
                                  </span>
                                  <input
                                    type="number"
                                    className="w-12 bg-white border border-slate-200 px-2 py-1 rounded text-center text-xs font-bold text-indigo-600 outline-none"
                                    value={item.sort_order ?? iIdx + 1}
                                    onChange={(e) =>
                                      updateItem(
                                        gIdx,
                                        iIdx,
                                        "sort_order",
                                        Number(e.target.value) || iIdx + 1
                                      )
                                    }
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeItem(gIdx, iIdx)}
                                    className="ml-2 text-slate-300 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              <textarea
                                className="ml-8 bg-transparent text-xs text-slate-500 outline-none resize-none placeholder:text-slate-300"
                                value={item.description ?? ""}
                                placeholder="Add details or instructions..."
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
                            </motion.div>
                          ))}

                          <button
                            type="button"
                            onClick={() => addItem(gIdx)}
                            className="w-full mt-2 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all"
                          >
                            <Plus size={16} />
                            Add Task Item
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

        {taskGroups.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
            <p className="text-slate-400 font-medium">
              No task groups added yet. Click "Add New Group" to begin.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
