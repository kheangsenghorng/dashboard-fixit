import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  ChevronDown,
  Save,
  Search,
  PackageCheck,
  FileText,
  ListChecks,
  Recycle,
  Tag,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskGroupStore } from "../../../../app/store/services/useTaskGroupStore";
import { useTaskItemStore } from "../../../../app/store/services/useTaskItemStore";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useServicePackageStore } from "../../../../app/store/services/useServicePackageStore";
import { usePackageTaskGroupStore } from "../../../../app/store/services/usePackageTaskGroupStore";

const ChecklistSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
    <div className="h-20 bg-zinc-100 rounded-3xl" />
    <div className="h-64 bg-white border border-zinc-100 rounded-[2rem]" />
  </div>
);

export default function Step3Checklist({
  formData,
  setFormData,
  isLoading = false,
}) {
  const params = useParams();
  const serviceId = params?.id;

  const {
    items: allTaskGroups = [],
    create: createTaskGroup,
    update: updateTaskGroup,
    remove: removeTaskGroup,
    getByServiceId: getTaskGroupsByServiceId,
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

  const { create: attachTaskGroupToPackage } = usePackageTaskGroupStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({ 0: true });
  const [savingGroupIndex, setSavingGroupIndex] = useState(null);
  const [savingItemKey, setSavingItemKey] = useState(null);

  const taskGroups = Array.isArray(formData.task_groups)
    ? formData.task_groups
    : [];

  useEffect(() => {
    if (serviceId) {
      getByServiceId(serviceId);
      if (getTaskGroupsByServiceId) getTaskGroupsByServiceId(serviceId);
    }
  }, [serviceId, getByServiceId, getTaskGroupsByServiceId]);

  useEffect(() => {
    if (!Array.isArray(packageData) || packageData.length === 0) return;
    const selectedPackageId = formData.package_id || packageData[0]?.id;
    const activePkg =
      packageData.find((pkg) => Number(pkg.id) === Number(selectedPackageId)) ||
      packageData[0];

    const normalizedGroups = (activePkg.task_groups || []).map((group) => ({
      ...group,
      id: group.id || null,
      service_id: group.service_id || serviceId,
      items: (group.task_items || group.items || []).map((item) => ({
        ...item,
        id: item.id || null,
      })),
    }));

    setFormData((prev) => ({
      ...prev,
      package_id: activePkg.id,
      task_groups: normalizedGroups,
    }));
  }, [packageData, formData.package_id, serviceId, setFormData]);

  const activePackage = useMemo(() => {
    return packageData.find(
      (pkg) => Number(pkg.id) === Number(formData.package_id)
    );
  }, [packageData, formData.package_id]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return taskGroups;
    return taskGroups.filter(
      (group) =>
        group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.items?.some((item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, taskGroups]);

  const existingGroupsNotInPackage = useMemo(() => {
    const currentIds = taskGroups.map((group) => Number(group.id));
    return allTaskGroups.filter(
      (group) =>
        group.id &&
        !currentIds.includes(Number(group.id)) &&
        Number(group.service_id) === Number(serviceId)
    );
  }, [allTaskGroups, taskGroups, serviceId]);

  const switchPackage = (pkgId) => {
    const activePkg = packageData.find(
      (pkg) => Number(pkg.id) === Number(pkgId)
    );
    const normalizedGroups = (activePkg?.task_groups || []).map((group) => ({
      ...group,
      id: group.id || null,
      items: (group.task_items || group.items || []).map((item) => ({
        ...item,
        id: item.id || null,
      })),
    }));

    setFormData((prev) => ({
      ...prev,
      package_id: pkgId,
      task_groups: normalizedGroups,
    }));
    setSearchTerm("");
    setExpandedGroups({ 0: true });
  };

  const handleSaveGroup = async (group, gIdx) => {
    if (!group.name?.trim())
      return toast.error("Please enter a Group Name first");
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
      const taskGroupId = group.id || res?.data?.id || res?.id;

      await attachTaskGroupToPackage({
        package_id: Number(formData.package_id),
        task_group_id: Number(taskGroupId),
        sort_order: gIdx + 1,
      });

      toast.success(`Checklist "${group.name}" updated successfully`);
      getByServiceId(serviceId);
    } finally {
      setSavingGroupIndex(null);
    }
  };

  const addGroup = () => {
    if (!formData.package_id) return toast.error("Select a package first");
    const newGroups = [
      ...taskGroups,
      {
        id: null,
        service_id: Number(serviceId),
        name: "",
        description: "",
        items: [],
      },
    ];
    setFormData({ ...formData, task_groups: newGroups });
    setExpandedGroups({ ...expandedGroups, [newGroups.length - 1]: true });
  };

  const addItem = (gIdx) => {
    const updated = [...taskGroups];
    const groupName = updated[gIdx].name || "this group";
    if (!updated[gIdx].id)
      return toast.info(
        `Please save the group "${groupName}" before adding tasks`
      );

    if (!updated[gIdx].items) updated[gIdx].items = [];
    updated[gIdx].items.push({
      id: null,
      task_group_id: updated[gIdx].id,
      title: "",
      description: "",
      status: "active",
      sort_order: updated[gIdx].items.length + 1,
    });
    setFormData({ ...formData, task_groups: updated });
  };

  if (isLoading || servicePackageLoading) return <ChecklistSkeleton />;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-12 pb-32 px-4"
    >
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <LayoutGrid size={14} />
            Step 03 — Checklists
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
            {activePackage?.title || "Configure Package Tasks"}
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-violet-500/5 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={addGroup}
            className="bg-zinc-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-zinc-200"
          >
            <Plus size={18} />
            Add Group
          </button>
        </div>
      </div>

      {/* --- PACKAGE NAV --- */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {packageData.map((pkg) => {
          const isActive = Number(formData.package_id) === Number(pkg.id);
          return (
            <button
              key={pkg.id}
              onClick={() => switchPackage(pkg.id)}
              className={`flex-shrink-0 px-6 py-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                isActive
                  ? "border-violet-600 bg-white shadow-md"
                  : "border-transparent bg-white hover:border-zinc-200 text-zinc-400"
              }`}
            >
              <PackageCheck
                size={20}
                className={isActive ? "text-violet-600" : "text-zinc-300"}
              />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                  Package
                </p>
                <p
                  className={`text-sm font-black ${
                    isActive ? "text-zinc-900" : "text-zinc-500"
                  }`}
                >
                  {pkg.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* --- GROUPS LIST --- */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredGroups.map((group, gIdx) => (
            <motion.div
              key={group.id || `group-${gIdx}`}
              layout
              className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm overflow-hidden"
            >
              <div
                className={`p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-6 ${
                  expandedGroups[gIdx] ? "bg-zinc-50/30" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[9px] font-black uppercase rounded">
                      Group ID: {group.id || "New"}
                    </span>
                    {group.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  <input
                    className="w-full text-2xl font-black text-zinc-900 bg-transparent border-none focus:ring-0 p-0 placeholder:text-zinc-200"
                    value={group.name || ""}
                    placeholder="Enter Group Name (e.g. Living Room Checklist)"
                    onChange={(e) => {
                      const updated = [...taskGroups];
                      updated[gIdx].name = e.target.value;
                      setFormData({ ...formData, task_groups: updated });
                    }}
                  />

                  <div className="flex items-center gap-2 mt-2">
                    <FileText size={14} className="text-zinc-300" />
                    <input
                      className="w-full text-sm font-medium text-zinc-400 bg-transparent border-none focus:ring-0 p-0"
                      value={group.description || ""}
                      placeholder="Add a description for this group..."
                      onChange={(e) => {
                        const updated = [...taskGroups];
                        updated[gIdx].description = e.target.value;
                        setFormData({ ...formData, task_groups: updated });
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleSaveGroup(group, gIdx)}
                    className={`h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                      group.id
                        ? "bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900"
                        : "bg-violet-600 text-white hover:bg-violet-700"
                    }`}
                  >
                    <Save size={16} />
                    {savingGroupIndex === gIdx
                      ? "..."
                      : group.id
                      ? "Update"
                      : "Save Group"}
                  </button>

                  <button
                    onClick={() =>
                      setExpandedGroups({
                        ...expandedGroups,
                        [gIdx]: !expandedGroups[gIdx],
                      })
                    }
                    className={`w-12 h-12 flex items-center justify-center rounded-xl border border-zinc-100 transition-all ${
                      expandedGroups[gIdx]
                        ? "bg-zinc-900 text-white"
                        : "bg-white text-zinc-400 hover:bg-zinc-50"
                    }`}
                  >
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${
                        expandedGroups[gIdx] ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => handleRemoveGroup(gIdx, group)}
                    className="w-12 h-12 flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedGroups[gIdx] && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 md:p-8 pt-0 space-y-3">
                      <div className="h-px bg-zinc-100 w-full mb-6" />

                      {group.items?.length > 0 ? (
                        group.items.map((item, iIdx) => (
                          <div
                            key={item.id || iIdx}
                            className="flex items-start gap-4 p-4 bg-white border border-zinc-100 rounded-2xl group/item hover:border-violet-200 transition-all"
                          >
                            <CheckCircle2
                              size={18}
                              className="mt-1 text-violet-500 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <input
                                className="w-full font-bold text-zinc-800 bg-transparent border-none focus:ring-0 p-0 text-sm"
                                value={item.title || ""}
                                placeholder="Task Title..."
                                onChange={(e) => {
                                  const updated = [...taskGroups];
                                  updated[gIdx].items[iIdx].title =
                                    e.target.value;
                                  setFormData({
                                    ...formData,
                                    task_groups: updated,
                                  });
                                }}
                              />
                              <input
                                className="w-full text-xs font-medium text-zinc-400 bg-transparent border-none focus:ring-0 p-0 mt-1"
                                value={item.description || ""}
                                placeholder="Details..."
                                onChange={(e) => {
                                  const updated = [...taskGroups];
                                  updated[gIdx].items[iIdx].description =
                                    e.target.value;
                                  setFormData({
                                    ...formData,
                                    task_groups: updated,
                                  });
                                }}
                              />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                              <button
                                onClick={() =>
                                  handleSaveItem(item, group, gIdx, iIdx)
                                }
                                className="p-2 text-zinc-400 hover:text-violet-600"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveItem(gIdx, iIdx, item)
                                }
                                className="p-2 text-zinc-400 hover:text-rose-500"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-zinc-50 rounded-2xl text-zinc-300 text-xs font-bold uppercase tracking-widest">
                          No Tasks in {group.name || "this group"}
                        </div>
                      )}

                      <button
                        onClick={() => addItem(gIdx)}
                        className="w-full py-4 mt-2 border-2 border-dashed border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        Add Task to {group.name || "Group"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- TEMPLATE LIBRARY --- */}
      <div className="pt-10 border-t border-zinc-100">
        <div className="flex items-center gap-3 mb-8">
          <Tag size={18} className="text-zinc-400" />
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.3em]">
            Reusable Group Templates
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {existingGroupsNotInPackage.map((template) => (
            <div
              key={template.id}
              className="bg-white border border-zinc-100 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-zinc-200/40 transition-all group"
            >
              <div>
                <h4 className="font-black text-zinc-900 group-hover:text-violet-600 transition-colors">
                  {template.name}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <ListChecks size={12} className="text-zinc-300" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                    {(template.task_items || template.items || []).length} Tasks
                  </span>
                </div>
              </div>
              <button
                onClick={() => addExistingGroupToPackage(template)}
                className="mt-6 w-full py-3 bg-zinc-50 text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-900 hover:text-white transition-all"
              >
                <Recycle size={14} />
                Import Group
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );

  // LOGIC HELPERS
  async function handleRemoveGroup(gIdx, group) {
    if (!group.id) {
      setFormData((prev) => ({
        ...prev,
        task_groups: taskGroups.filter((_, i) => i !== gIdx),
      }));
      return;
    }
    if (window.confirm(`Delete the group "${group.name}"?`)) {
      await removeTaskGroup(group.id);
      toast.success(`Group "${group.name}" deleted`);
      getByServiceId(serviceId);
    }
  }

  async function handleSaveItem(item, group, gIdx, iIdx) {
    if (!item.title?.trim()) return toast.error("Task title required");
    setSavingItemKey(item.id || `${gIdx}-${iIdx}`);
    try {
      const payload = {
        task_group_id: Number(group.id),
        title: item.title,
        description: item.description || null,
        status: "active",
        sort_order: iIdx + 1,
      };
      await (item.id
        ? updateTaskItem(item.id, payload)
        : createTaskItem(payload));
      toast.success(`Task saved to ${group.name}`);
      getByServiceId(serviceId);
    } finally {
      setSavingItemKey(null);
    }
  }

  async function handleRemoveItem(gIdx, iIdx, item) {
    if (!item.id) {
      const updated = [...taskGroups];
      updated[gIdx].items = updated[gIdx].items.filter(
        (_, index) => index !== iIdx
      );
      setFormData({ ...formData, task_groups: updated });
      return;
    }
    await removeTaskItem(item.id);
    getByServiceId(serviceId);
  }

  async function addExistingGroupToPackage(group) {
    await attachTaskGroupToPackage({
      package_id: Number(formData.package_id),
      task_group_id: Number(group.id),
      sort_order: taskGroups.length + 1,
    });
    toast.success(`Group "${group.name}" imported to package`);
    getByServiceId(serviceId);
  }
}
