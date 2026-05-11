import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  GripVertical,
  ChevronDown,
  Save,
  Search,
  Layers,
  PackageCheck,
  AlertCircle,
  FileText,
  MousePointer2,
  ListChecks,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskGroupStore } from "../../../../app/store/services/useTaskGroupStore";
import { useTaskItemStore } from "../../../../app/store/services/useTaskItemStore";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useServicePackageStore } from "../../../../app/store/services/useServicePackageStore";
import { usePackageTaskGroupStore } from "../../../../app/store/services/usePackageTaskGroupStore";

const ChecklistSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-8">
    <div className="h-32 w-full bg-slate-100 animate-pulse rounded-3xl" />
    {[1, 2].map((i) => (
      <div
        key={i}
        className="h-48 w-full bg-white border border-slate-100 rounded-3xl p-8 space-y-4"
      >
        <div className="h-6 w-1/4 bg-slate-100 animate-pulse rounded-full" />
        <div className="h-12 bg-slate-50 animate-pulse rounded-2xl" />
      </div>
    ))}
  </div>
);

export default function Step3Checklist({
  formData,
  setFormData,
  isLoading = false,
}) {
  const params = useParams();
  const serviceId = params?.id;

  // Stores
  const {
    create: createTaskGroup,
    update: updateTaskGroup,
    remove: removeTaskGroup,
  } = useTaskGroupStore();
  const {
    create: createTaskItem,
    update: updateTaskItem,
    remove: removeTaskItem,
  } = useTaskItemStore();
  const {
    items: packageData = [],
    loading: servicePackageLoading,
    getByServiceId,
  } = useServicePackageStore();
  const {
    create: attachTaskGroupToPackage,
    loading: packageTaskGroupRelationLoading,
  } = usePackageTaskGroupStore();

  // Local States
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({ 0: true });
  const [savingGroupIndex, setSavingGroupIndex] = useState(null);
  const [savingItemKey, setSavingItemKey] = useState(null);
  const [deletingGroupIndex, setDeletingGroupIndex] = useState(null);
  const [deletingItemKey, setDeletingItemKey] = useState(null);

  const taskGroups = Array.isArray(formData.task_groups)
    ? formData.task_groups
    : [];

  // --- 1. DATA INITIALIZATION ---
  useEffect(() => {
    if (serviceId) getByServiceId(serviceId);
  }, [serviceId, getByServiceId]);

  useEffect(() => {
    if (!Array.isArray(packageData) || packageData.length === 0) return;
    const activePkg =
      packageData.find((pkg) => Number(pkg.id) === Number(formData.id)) ||
      packageData[0];

    const normalizedGroups = (activePkg.task_groups || []).map(
      (group, gIdx) => ({
        ...group,
        id: group.id || null,
        service_id: group.service_id || serviceId,
        description: group.description || "",
        items: (group.task_items || group.items || []).map((item, iIdx) => ({
          ...item,
          id: item.id || null,
          task_group_id: item.task_group_id || group.id,
          description: item.description || "",
        })),
      })
    );

    setFormData((prev) => ({
      ...prev,
      id: activePkg.id,
      package_id: activePkg.id,
      task_groups: normalizedGroups,
    }));
  }, [packageData, formData.id, serviceId, setFormData]);

  // --- 2. SEARCH FILTER ---
  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return taskGroups;
    return taskGroups.filter(
      (g) =>
        g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.items?.some((i) =>
          i.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, taskGroups]);

  // --- 3. HANDLERS ---
  const switchPackage = (pkgId) => {
    setFormData((prev) => ({ ...prev, id: pkgId, package_id: pkgId }));
    setSearchTerm("");
  };

  const addGroup = () => {
    const newGroups = [
      ...taskGroups,
      {
        id: null,
        service_id: Number(serviceId),
        name: "",
        description: "",
        items: [{ id: null, title: "", description: "", status: "active" }],
      },
    ];
    setFormData((prev) => ({ ...prev, task_groups: newGroups }));
    setExpandedGroups((prev) => ({ ...prev, [newGroups.length - 1]: true }));
  };

  const handleSaveGroup = async (group, gIdx) => {
    if (!formData.id) return toast.error("Select a package first");
    if (!group.name?.trim()) return toast.error("Group name required");
    setSavingGroupIndex(gIdx);
    try {
      const payload = {
        service_id: Number(serviceId),
        name: group.name,
        description: group.description || "",
        sort_order: gIdx + 1,
        status: "active",
      };
      const res = group.id
        ? await updateTaskGroup(group.id, payload)
        : await createTaskGroup(payload);
      if (res) {
        const taskGroupId = group.id || res?.data?.id || res?.id;
        await attachTaskGroupToPackage({
          package_id: Number(formData.id),
          task_group_id: Number(taskGroupId),
          sort_order: gIdx + 1,
        });
        toast.success(group.id ? "Group updated" : "Group created");
        await getByServiceId(serviceId);
      }
    } finally {
      setSavingGroupIndex(null);
    }
  };

  const handleRemoveGroup = async (gIdx, group) => {
    if (!group.id) {
      setFormData((prev) => ({
        ...prev,
        task_groups: taskGroups.filter((_, i) => i !== gIdx),
      }));
      return;
    }
    setDeletingGroupIndex(gIdx);
    try {
      const res = await removeTaskGroup(group.id);
      if (res) {
        toast.success("Group deleted");
        await getByServiceId(serviceId);
      }
    } finally {
      setDeletingGroupIndex(null);
    }
  };

  // --- MISSING ITEM HANDLERS ---
  const addItem = (gIdx) => {
    const updated = [...taskGroups];
    if (!updated[gIdx].items) updated[gIdx].items = [];
    updated[gIdx].items.push({
      id: null,
      task_group_id: updated[gIdx].id || null,
      title: "",
      description: "",
      status: "active",
      sort_order: updated[gIdx].items.length + 1,
    });
    setFormData((prev) => ({ ...prev, task_groups: updated }));
  };

  const handleSaveItem = async (item, group, gIdx, iIdx) => {
    if (!group.id) return toast.info("Please save the group first.");
    if (!item.title?.trim()) return toast.error("Task title is required.");
    const itemKey = item.id || `${gIdx}-${iIdx}`;
    setSavingItemKey(itemKey);
    try {
      const payload = {
        task_group_id: Number(group.id),
        title: item.title,
        description: item.description || null,
        status: item.status || "active",
        sort_order: iIdx + 1,
      };
      const res = item.id
        ? await updateTaskItem(item.id, payload)
        : await createTaskItem(payload);
      if (res) {
        toast.success(item.id ? "Task updated" : "Task created");
        await getByServiceId(serviceId);
      }
    } finally {
      setSavingItemKey(null);
    }
  };

  const handleRemoveItem = async (gIdx, iIdx, item) => {
    if (!item.id) {
      const updated = [...taskGroups];
      updated[gIdx].items = updated[gIdx].items.filter(
        (_, index) => index !== iIdx
      );
      setFormData((prev) => ({ ...prev, task_groups: updated }));
      return;
    }
    setDeletingItemKey(item.id);
    try {
      const res = await removeTaskItem(item.id);
      if (res) {
        toast.success("Task deleted");
        await getByServiceId(serviceId);
      }
    } finally {
      setDeletingItemKey(null);
    }
  };

  if (isLoading || servicePackageLoading) return <ChecklistSkeleton />;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-10 pb-24 px-4"
    >
      {/* --- PACKAGE NAVIGATION --- */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 ml-2">
          <div className="h-6 w-1 bg-indigo-600 rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
            Service Packages
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packageData.map((pkg) => {
            const isActive = Number(formData.id) === Number(pkg.id);
            return (
              <button
                type="button"
                key={pkg.id}
                onClick={() => switchPackage(pkg.id)}
                className={`relative group p-6 rounded-3xl border transition-all text-left overflow-hidden ${
                  isActive
                    ? "bg-white border-indigo-200 shadow-2xl shadow-indigo-100"
                    : "bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-200"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
                )}
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-2xl transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-slate-100 text-slate-400 group-hover:text-indigo-500"
                    }`}
                  >
                    <PackageCheck size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-bold text-base truncate ${
                        isActive ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {pkg.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <ListChecks size={12} className="text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        {pkg.task_groups?.length || 0} Task Groups
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- DASHBOARD HEADER --- */}
      <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-slate-200 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 text-white ring-8 ring-white/5">
            <Layers size={32} />
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
              {packageData.find((p) => Number(p.id) === Number(formData.id))
                ?.title || "Checklist"}{" "}
              Scope
            </h2>
            <p className="text-indigo-300/80 text-sm font-bold uppercase tracking-[0.2em] mt-3 flex items-center justify-center lg:justify-start gap-2">
              <MousePointer2 size={14} /> Define Project Deliverables
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-72 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Filter tasks..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:bg-white/10 focus:border-indigo-400/50 transition-all placeholder:text-slate-500 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={addGroup}
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus size={20} /> New Group
          </button>
        </div>
      </div>

      {/* --- TASK GROUPS --- */}
      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {filteredGroups.map((group, gIdx) => {
            const isExpanded = !!expandedGroups[gIdx];
            return (
              <motion.div
                layout
                key={group.id || `g-idx-${gIdx}`}
                className="group bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden hover:border-indigo-100 transition-colors"
              >
                {/* Group Header */}
                <div
                  className={`p-8 flex flex-col md:flex-row md:items-center gap-6 transition-colors ${
                    isExpanded ? "bg-indigo-50/30" : "bg-white"
                  }`}
                >
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-md uppercase">
                        Group
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        #{gIdx + 1}
                      </span>
                    </div>
                    <input
                      className="w-full text-2xl font-black text-slate-800 bg-transparent outline-none placeholder:text-slate-200"
                      value={group.name || ""}
                      placeholder="e.g., General Tasks"
                      onChange={(e) => {
                        const updated = [...taskGroups];
                        updated[gIdx].name = e.target.value;
                        setFormData((p) => ({ ...p, task_groups: updated }));
                      }}
                    />
                    <div className="flex items-center gap-2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                      <FileText size={14} />
                      <input
                        className="w-full text-sm font-medium bg-transparent outline-none placeholder:text-slate-300"
                        value={group.description || ""}
                        placeholder="Group description..."
                        onChange={(e) => {
                          const updated = [...taskGroups];
                          updated[gIdx].description = e.target.value;
                          setFormData((p) => ({ ...p, task_groups: updated }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0">
                    <div className="flex items-center gap-2 mr-4">
                      <button
                        type="button"
                        onClick={() => handleSaveGroup(group, gIdx)}
                        disabled={
                          savingGroupIndex === gIdx ||
                          packageTaskGroupRelationLoading
                        }
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                          group.id
                            ? "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                            : "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                        }`}
                      >
                        <Save size={14} />{" "}
                        {savingGroupIndex === gIdx
                          ? "..."
                          : group.id
                          ? "Update"
                          : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGroup(gIdx, group)}
                        className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedGroups((p) => ({ ...p, [gIdx]: !p[gIdx] }))
                      }
                      className={`h-12 w-12 flex items-center justify-center rounded-2xl transition-all ${
                        isExpanded
                          ? "bg-indigo-600 text-white rotate-180"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                </div>

                {/* Items Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="p-8 pt-2 space-y-4">
                        <div className="h-px bg-slate-100 w-full mb-6" />
                        {group.items?.map((item, iIdx) => {
                          const itemKey = item.id || `${gIdx}-${iIdx}`;
                          return (
                            <div
                              key={itemKey}
                              className="group/item flex items-start gap-5 p-5 rounded-3xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/20 transition-all"
                            >
                              <div className="mt-1 p-1 bg-white rounded-lg shadow-sm">
                                <CheckCircle2
                                  size={18}
                                  className="text-indigo-500"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <input
                                  className="w-full bg-transparent text-base font-bold text-slate-700 outline-none placeholder:text-slate-300"
                                  value={item.title || ""}
                                  placeholder="Task title..."
                                  onChange={(e) => {
                                    const updated = [...taskGroups];
                                    updated[gIdx].items[iIdx].title =
                                      e.target.value;
                                    setFormData((p) => ({
                                      ...p,
                                      task_groups: updated,
                                    }));
                                  }}
                                />
                                <input
                                  className="w-full bg-transparent text-xs font-medium text-slate-400 outline-none placeholder:text-slate-200"
                                  value={item.description || ""}
                                  placeholder="Task description/notes..."
                                  onChange={(e) => {
                                    const updated = [...taskGroups];
                                    updated[gIdx].items[iIdx].description =
                                      e.target.value;
                                    setFormData((p) => ({
                                      ...p,
                                      task_groups: updated,
                                    }));
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSaveItem(item, group, gIdx, iIdx)
                                  }
                                  className="p-2 text-indigo-500 hover:bg-white rounded-lg shadow-sm transition-all"
                                >
                                  <Save
                                    size={16}
                                    className={
                                      savingItemKey === itemKey
                                        ? "animate-pulse"
                                        : ""
                                    }
                                  />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveItem(gIdx, iIdx, item)
                                  }
                                  className="p-2 text-rose-400 hover:bg-white rounded-lg shadow-sm transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                                <div className="p-2 text-slate-300 cursor-grab active:cursor-grabbing">
                                  <GripVertical size={16} />
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={() => addItem(gIdx)}
                          className="w-full py-6 mt-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-3"
                        >
                          <Plus size={18} /> Add New Task Item
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredGroups.length === 0 && (
          <div className="py-24 text-center bg-slate-50 border border-slate-100 rounded-[3rem] shadow-inner">
            <AlertCircle className="mx-auto text-slate-200 mb-6" size={80} />
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              No match found
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2 font-medium">
              Try another keyword or add a new task group.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
