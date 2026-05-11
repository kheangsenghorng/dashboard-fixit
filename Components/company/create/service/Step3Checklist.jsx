import React, { useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  GripVertical,
  ListChecks,
  ChevronDown,
  Hash,
  LayoutList,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Step3Checklist({ formData, setFormData }) {
  const taskGroups = formData.task_groups || [];
  const [expandedGroups, setExpandedGroups] = useState({ 0: true });

  const updateGroups = (newGroups) => {
    setFormData({ ...formData, task_groups: newGroups });
  };

  const toggleGroup = (index) => {
    setExpandedGroups((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const addGroup = () => {
    const newGroups = [
      ...taskGroups,
      {
        name: "",
        description: "",
        status: "active",
        items: [
          { title: "", description: "", sort_order: 1, status: "active" },
        ],
      },
    ];
    updateGroups(newGroups);
    setExpandedGroups((prev) => ({ ...prev, [newGroups.length - 1]: true }));
  };

  const removeGroup = (groupIndex) => {
    const newGroups = taskGroups.filter((_, index) => index !== groupIndex);
    updateGroups(newGroups);
  };

  const updateGroup = (groupIndex, field, value) => {
    const newGroups = taskGroups.map((group, index) =>
      index === groupIndex ? { ...group, [field]: value } : group
    );
    updateGroups(newGroups);
  };

  const addItem = (groupIndex) => {
    const newGroups = taskGroups.map((group, index) => {
      if (index !== groupIndex) return group;
      const items = group.items || [];
      return {
        ...group,
        items: [
          ...items,
          {
            title: "",
            description: "",
            sort_order: items.length + 1,
            status: "active",
          },
        ],
      };
    });
    updateGroups(newGroups);
  };

  const updateItem = (groupIndex, itemIndex, field, value) => {
    const newGroups = taskGroups.map((group, gIdx) => {
      if (gIdx !== groupIndex) return group;
      return {
        ...group,
        items: group.items.map((item, iIdx) =>
          iIdx === itemIndex ? { ...item, [field]: value } : item
        ),
      };
    });
    updateGroups(newGroups);
  };

  const removeItem = (groupIndex, itemIndex) => {
    const newGroups = taskGroups.map((group, gIdx) => {
      if (gIdx !== groupIndex) return group;
      return {
        ...group,
        items: group.items
          .filter((_, iIdx) => iIdx !== itemIndex)
          .map((it, idx) => ({ ...it, sort_order: idx + 1 })),
      };
    });
    updateGroups(newGroups);
  };

  // Helper to prevent card toggle when clicking inputs/buttons
  const stopProp = (e) => e.stopPropagation();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-8 pb-24"
    >
      {/* --- HEADER --- */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ListChecks size={30} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">
              Service Checklist
            </h1>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-1">
              Operational Workflow Builder
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addGroup}
          className="group bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs tracking-[0.15em] transition-all flex items-center gap-3"
        >
          <Plus
            size={18}
            className="group-hover:rotate-90 transition-transform"
          />
          CREATE NEW STAGE
        </button>
      </div>

      {/* --- STAGES LIST --- */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {taskGroups.map((group, gIdx) => {
            const isExpanded = !!expandedGroups[gIdx];
            return (
              <motion.div
                key={gIdx}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden transition-all hover:border-indigo-200"
              >
                {/* --- CLICKABLE HEADER AREA --- */}
                <div
                  onClick={() => toggleGroup(gIdx)}
                  className={`p-6 flex items-center gap-4 cursor-pointer select-none transition-colors group/header ${
                    isExpanded
                      ? "bg-indigo-50/30 border-b border-slate-100"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                      isExpanded
                        ? "bg-indigo-600 text-white rotate-6"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {gIdx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <input
                        onClick={stopProp} // Prevent expand on click
                        className="bg-transparent text-xl font-black text-slate-800 placeholder:text-slate-200 outline-none w-full focus:text-indigo-600"
                        value={group.name || ""}
                        placeholder="Stage Name (e.g. Pre-Arrival)"
                        onChange={(e) =>
                          updateGroup(gIdx, "name", e.target.value)
                        }
                      />
                      <span className="shrink-0 bg-white border border-slate-200 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                        {group.items?.length || 0} Tasks
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        stopProp(e);
                        updateGroup(
                          gIdx,
                          "status",
                          group.status === "active" ? "inactive" : "active"
                        );
                      }}
                      className={`hidden sm:block text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                        group.status === "active"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {group.status}
                    </button>

                    {/* Delete Group */}
                    <button
                      type="button"
                      onClick={(e) => {
                        stopProp(e);
                        removeGroup(gIdx);
                      }}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>

                    {/* Expansion Icon */}
                    <div
                      className={`p-3 rounded-2xl transition-all ${
                        isExpanded
                          ? "bg-indigo-600 text-white rotate-180"
                          : "bg-slate-100 text-slate-400 group-hover/header:bg-indigo-100 group-hover/header:text-indigo-600"
                      }`}
                    >
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                {/* --- EXPANDABLE TASK LIST --- */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="p-8 space-y-4 bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-2">
                          <LayoutList size={16} className="text-indigo-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Workflow sequence
                          </span>
                        </div>

                        {(group.items || []).map((item, iIdx) => (
                          <motion.div
                            key={iIdx}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{
                              x: 0,
                              opacity: 1,
                              transition: { delay: iIdx * 0.05 },
                            }}
                            className="group flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all"
                          >
                            <GripVertical
                              size={18}
                              className="mt-1 text-slate-200 cursor-grab group-hover:text-slate-400 transition-colors"
                            />

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    updateItem(
                                      gIdx,
                                      iIdx,
                                      "status",
                                      item.status === "active"
                                        ? "inactive"
                                        : "active"
                                    )
                                  }
                                  className="focus:outline-none"
                                >
                                  {item.status === "active" ? (
                                    <CheckCircle2
                                      size={22}
                                      className="text-emerald-500 fill-emerald-50"
                                    />
                                  ) : (
                                    <Circle
                                      size={22}
                                      className="text-slate-200"
                                    />
                                  )}
                                </button>
                                <input
                                  className="w-full bg-transparent font-bold text-slate-700 placeholder:text-slate-300 outline-none"
                                  value={item.title || ""}
                                  placeholder="Task title..."
                                  onChange={(e) =>
                                    updateItem(
                                      gIdx,
                                      iIdx,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <textarea
                                className="w-full bg-transparent text-xs text-slate-400 placeholder:text-slate-200 outline-none resize-none ml-8"
                                value={item.description || ""}
                                placeholder="Add specific instructions for this step..."
                                rows={1}
                                onChange={(e) =>
                                  updateItem(
                                    gIdx,
                                    iIdx,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                <Hash size={12} className="text-slate-400" />
                                <input
                                  type="number"
                                  className="w-6 bg-transparent text-xs font-black text-indigo-600 outline-none"
                                  value={item.sort_order}
                                  onChange={(e) =>
                                    updateItem(
                                      gIdx,
                                      iIdx,
                                      "sort_order",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(gIdx, iIdx)}
                                className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </motion.div>
                        ))}

                        {/* Add Task Button */}
                        <button
                          type="button"
                          onClick={() => addItem(gIdx)}
                          className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-slate-400 text-[11px] font-black uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 hover:bg-white transition-all flex items-center justify-center gap-3"
                        >
                          <div className="p-1 bg-indigo-600 rounded-full text-white">
                            <Plus size={14} />
                          </div>
                          Add task to {group.name || "Stage"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
