"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  ShieldCheck,
  ShieldAlert,
  ImageIcon,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Store & Hooks
import { useCategoryStore } from "../../../app/store/useCategoryStore";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";

// Custom Components
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import ContentLoader from "../../ContentLoader";


export default function CompactServiceCategoriesPage() {
  const { user: authUser } = useAuthGuard();
  const router = useRouter();

  const {
    fetchCategories,
    categories = [],
    meta,
    isLoading,
    deleteMany,
    updateManyStatus,
  } = useCategoryStore();

  const [selectedSet, setSelectedSet] = useState(new Set());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [deleting, setDeleting] = useState(false);

  // Filtering States
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Helper to trigger API call
  const refreshData = async (overrides = {}) => {
    const params = {
      page: overrides.page ?? 1,
      search: searchValue.trim(),
      group: "service",
      date: selectedDate,
    };
    if (activeStatus !== "all") params.status = activeStatus;
    await fetchCategories(params);
  };

  // 1. AUTO-SEARCH LOGIC (Debounce)
  // This effect runs whenever search, status, or date changes
  useEffect(() => {
    // Skip debounce on the very first mount if you want to use the initial load logic
    if (isFirstLoad) {
      refreshData().finally(() => setIsFirstLoad(false));
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      refreshData({ page: 1 });
    }, 500); // 500ms delay after typing stops

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, activeStatus, selectedDate]);

  // Selection Logic
  const selectedIds = useMemo(() => Array.from(selectedSet), [selectedSet]);
  const isAllSelected = useMemo(
    () =>
      categories.length > 0 && categories.every((c) => selectedSet.has(c.id)),
    [categories, selectedSet]
  );

  const toggleSelectOne = (id) => {
    const next = new Set(selectedSet);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedSet(next);
  };

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedSet(new Set());
    else setSelectedSet(new Set(categories.map((c) => c.id)));
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      await updateManyStatus({ ids: selectedIds, status });
      toast.success(`Services updated to ${status}`);
      setSelectedSet(new Set());
      refreshData();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteMany(idsToDelete);
      toast.success("Categories removed");
      setDeleteOpen(false);
      setSelectedSet(new Set());
      refreshData();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const stats = useMemo(
    () => [
      {
        id: "all",
        label: "Total",
        value: meta?.total || 0,
        icon: Layers,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
      {
        id: "active",
        label: "Active",
        value: categories.filter((c) => c.status === "active").length,
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        id: "inactive",
        label: "Hidden",
        value: categories.filter((c) => c.status === "inactive").length,
        icon: ShieldAlert,
        color: "text-rose-600",
        bg: "bg-rose-50",
      },
    ],
    [categories, meta]
  );

  if (!authUser) return null;

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 lg:p-6 space-y-6 pb-24 font-sans antialiased text-slate-900">
      {isFirstLoad && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
          <ContentLoader
            title="Categories Registry"
            subtitle="Loading categories..."
            Icon={Layers}
          />
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <Layers size={18} />
            </div>
            Service Registry
          </h1>
        </div>
        <button
          onClick={() => router.push("/admin/create/category")}
          className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} /> ADD SERVICE
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <button
            key={stat.id}
            onClick={() => setActiveStatus(stat.id)}
            className={`flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all ${
              activeStatus === stat.id
                ? "border-indigo-500 ring-2 ring-indigo-50"
                : "border-slate-100 shadow-sm"
            }`}
          >
            <div
              className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}
            >
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
              <h3 className="text-xl font-black">{stat.value}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* SEARCH + FILTERS (AUTOMATIC NO ENTER NEEDED) */}
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-3">
        {/* AUTO SEARCH */}
        <div className="relative group flex-1">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search service..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* STATUS DROPDOWN */}
        <div className="relative min-w-[170px]">
          <select
            value={activeStatus}
            onChange={(e) => {
              setActiveStatus(e.target.value);
              setSelectedSet(new Set());
            }}
            className="appearance-none w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="all">ALL STATUS</option>
            <option value="active">ACTIVE ONLY</option>
            <option value="inactive">INACTIVE/HIDDEN</option>
          </select>
          <ChevronRight
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none"
          />
        </div>
      </div>

      {/* COMPACT TABLE */}
      <div className="max-w-7xl mx-auto relative">
        <div
          className={`bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm transition-opacity ${
            isLoading ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Identity
                  </th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {categories.map((item) => (
                  <tr
                    key={item.id}
                    className={`group transition-colors ${
                      selectedSet.has(item.id)
                        ? "bg-indigo-50/40"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={selectedSet.has(item.id)}
                        onChange={() => toggleSelectOne(item.id)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center">
                          {item.icon ? (
                            <Image
                              src={item.icon}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <ImageIcon className="text-slate-200" size={16} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs tracking-tight">
                            {item.name}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                            ID #{item.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() =>
                            router.push(`/admin/edit/categories/${item.id}`)
                          }
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setIdsToDelete([item.id]);
                            setDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            <span>Total: {meta?.total || 0}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={meta?.current_page === 1}
                onClick={() => refreshData({ page: meta.current_page - 1 })}
                className="p-1.5 rounded-lg border border-slate-200 bg-white shadow-sm disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-slate-900 tracking-normal">
                {meta?.current_page || 1} / {meta?.last_page || 1}
              </span>
              <button
                disabled={meta?.current_page === meta?.last_page}
                onClick={() => refreshData({ page: meta.current_page + 1 })}
                className="p-1.5 rounded-lg border border-slate-200 bg-white shadow-sm disabled:opacity-30 transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* FLOATING ACTION DOCK */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ y: 20, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 20, x: "-50%", opacity: 0 }}
              className="fixed bottom-6 left-1/2 z-50 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl flex items-center gap-6 border border-slate-700 backdrop-blur-md"
            >
              <span className="bg-indigo-600 px-2 py-0.5 rounded text-[9px] font-black">
                {selectedIds.length} Selected
              </span>
              <div className="flex gap-6 border-l border-slate-700 pl-6">
                <button
                  onClick={() => handleBulkStatusUpdate("active")}
                  className="text-[9px] font-black uppercase hover:text-emerald-400 flex items-center gap-2 tracking-widest"
                >
                  <ShieldCheck size={14} /> ACTIVATE
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate("inactive")}
                  className="text-[9px] font-black uppercase hover:text-rose-400 flex items-center gap-2 tracking-widest"
                >
                  <ShieldAlert size={14} /> HIDE
                </button>
                <button
                  onClick={() => {
                    setIdsToDelete(selectedIds);
                    setDeleteOpen(true);
                  }}
                  className="text-[9px] font-black uppercase hover:text-rose-400 flex items-center gap-2 tracking-widest"
                >
                  <Trash2 size={14} /> DELETE
                </button>
              </div>
              <button
                onClick={() => setSelectedSet(new Set())}
                className="p-1 hover:bg-slate-800 rounded-full"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        count={idsToDelete.length}
        loading={deleting}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-slate-50 text-slate-500 border-slate-200"
      }`}
    >
      <span
        className={`w-1 h-1 rounded-full ${
          isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
        }`}
      />
      {isActive ? "Active" : "Hidden"}
    </span>
  );
}
