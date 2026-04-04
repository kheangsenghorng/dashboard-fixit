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
  ImageIcon,
  CheckCircle2,
  ShieldAlert,
  Shapes,
  MoreHorizontal,
  FolderTree,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

// Store & Hooks
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useTypeStore } from "../../../app/store/useTypeStore";
import { useCategoryStore } from "../../../app/store/useCategoryStore"; // Added

// Custom Components
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import ContentLoader from "../../ContentLoader";
import { encodeId } from "../../../app/utils/hashids";

export default function TypeTablePage() {
  const { user: authUser } = useAuthGuard();
  const router = useRouter();

  const {
    types = [],
    meta,
    loading: isLoading,
    fetchTypes,
    deleteManyTypes,
    updateManyStatus,
    fetchTypeStats,
    statsLoading,
    stats: typesStats,
  } = useTypeStore();

  // Category Store for Filter
  const { categories, fetchCategories } = useCategoryStore();

  const [selectedSet, setSelectedSet] = useState(new Set());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const [activeStatus, setActiveStatus] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all"); // Category State
  const [searchValue, setSearchValue] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Initial Fetch for Categories
  useEffect(() => {
    fetchCategories({ all: true });
  }, [fetchCategories]);

  useEffect(() => {
    fetchTypeStats();
  }, [fetchTypeStats]);

  // Helper to fetch data
  const refreshData = async (overrides = {}) => {
    const params = {
      page: overrides.page ?? 1,
      search: searchValue.trim(),
    };

    if (activeStatus !== "all") params.status = activeStatus;
    if (activeCategory !== "all") params.category_id = activeCategory;

    await fetchTypes(params);
  };

  // Effect for Search, Status & Category Filters
  useEffect(() => {
    if (isFirstLoad) {
      refreshData({ page: 1 }).finally(() => setIsFirstLoad(false));
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      refreshData({ page: 1 });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, activeStatus, activeCategory]); // Added activeCategory dependency

  // Selections
  const selectedIds = useMemo(() => Array.from(selectedSet), [selectedSet]);
  const isAllSelected = useMemo(
    () => types.length > 0 && types.every((t) => selectedSet.has(t.id)),
    [types, selectedSet]
  );

  const toggleSelectOne = (id) => {
    const next = new Set(selectedSet);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedSet(next);
  };

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedSet(new Set());
    else setSelectedSet(new Set(types.map((t) => t.id)));
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      await updateManyStatus(selectedIds, status);
      toast.success(`Types updated to ${status}`);
      setSelectedSet(new Set());
      refreshData();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteManyTypes(idsToDelete);
      toast.success("Types removed successfully");
      setDeleteOpen(false);
      setIdsToDelete([]);
      setSelectedSet(new Set());
      refreshData();
    } catch (error) {
      toast.error("Failed to delete types");
    } finally {
      setDeleting(false);
    }
  };

  const stats = useMemo(
    () => [
      {
        id: "all",
        label: "Total Types",
        value: typesStats?.total_types || 0,
        icon: Shapes,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
      {
        id: "active",
        label: "Active",
        value: typesStats?.active_types || 0,
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        id: "inactive",
        label: "Hidden",
        value: typesStats?.inactive_types || 0,
        icon: ShieldAlert,
        color: "text-rose-600",
        bg: "bg-rose-50",
      },
    ],
    [typesStats]
  );

  if (!authUser) return null;

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 lg:p-6 space-y-6 pb-24 font-sans antialiased text-slate-900">
      {isFirstLoad && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
          <ContentLoader
            title="Type Registry"
            subtitle="Loading Types..."
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
            Type Registry
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-9">
            Manage your product/service classifications
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/create/types")}
          className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] tracking-widest transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
        >
          <Plus size={16} /> ADD TYPE
        </button>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-2xl border border-slate-100 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100" />
                  <div className="space-y-2">
                    <div className="w-20 h-2 rounded bg-slate-100" />
                    <div className="w-12 h-6 rounded bg-slate-200" />
                  </div>
                </div>
              </div>
            ))
          : stats.map((stat) => (
              <button
                key={stat.id}
                onClick={() => setActiveStatus(stat.id)}
                className={`flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all ${
                  activeStatus === stat.id
                    ? "border-indigo-500 ring-4 ring-indigo-500/5 shadow-sm"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div
                  className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon size={24} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-black">{stat.value}</h3>
                </div>
              </button>
            ))}
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"
            size={18}
          />

          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300"
          />
        </div>

        {/* CATEGORY FILTER */}
        <div className="relative min-w-[220px]">
          <FolderTree
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={16}
          />
          <select
            value={activeCategory}
            onChange={(e) =>
              setActiveCategory(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-indigo-300 transition-all appearance-none"
          >
            <option value="all">ALL CATEGORIES</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <ChevronRight
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none"
            size={14}
          />
        </div>

        {/* STATUS FILTER */}
        <div className="relative min-w-[180px]">
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value)}
            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-indigo-300 transition-all appearance-none"
          >
            <option value="all">ALL STATUS</option>
            <option value="active">ACTIVE ONLY</option>
            <option value="inactive">INACTIVE</option>
          </select>
          <ChevronRight
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none"
            size={14}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Type Identity
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Parent Category
                </th>
                <th className="px-4 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                  Status
                </th>
                <th className="px-4 py-4 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {types.length > 0 ? (
                types.map((item) => (
                  <tr
                    key={item.id}
                    className={`group transition-colors ${
                      selectedSet.has(item.id)
                        ? "bg-indigo-50/40"
                        : "hover:bg-slate-50/30"
                    }`}
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedSet.has(item.id)}
                        onChange={() => toggleSelectOne(item.id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                          {item.icon ? (
                            <Image
                              src={item.icon}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            ID: #TY{item.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="inline-flex items-center gap-2 bg-slate-50/50 border border-slate-100 p-1 pr-3 rounded-lg">
                        <div className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200">
                          <FolderTree size={14} className="text-slate-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black uppercase tracking-tight text-slate-400 leading-none">
                            {item.category?.status || "N/A"}
                          </span>
                          <span className="text-sm font-semibold text-slate-600">
                            {item.category?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/edit/types/${encodeId(item.id)}`
                            )
                          }
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setIdsToDelete([item.id]);
                            setDeleteOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-400 font-bold text-sm">
                        No types found matching your criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {meta && meta.last_page > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Showing {meta.from}-{meta.to} of {meta.total} types
            </p>
            <div className="flex gap-2">
              <button
                disabled={meta.current_page === 1}
                onClick={() => refreshData({ page: meta.current_page - 1 })}
                className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={meta.current_page === meta.last_page}
                onClick={() => refreshData({ page: meta.current_page + 1 })}
                className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold">
              {selectedIds.length}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">
              Items Selected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusUpdate("active")}
              className="text-[10px] font-black uppercase tracking-widest hover:text-indigo-400 px-2 py-1 transition-colors"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("inactive")}
              className="text-[10px] font-black uppercase tracking-widest hover:text-indigo-400 px-2 py-1 transition-colors"
            >
              Hide
            </button>
            <button
              onClick={() => {
                setIdsToDelete(selectedIds);
                setDeleteOpen(true);
              }}
              className="ml-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
          <button
            onClick={() => setSelectedSet(new Set())}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setIdsToDelete([]);
        }}
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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-slate-50 text-slate-500 border-slate-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
        }`}
      />
      {isActive ? "Active" : "Hidden"}
    </span>
  );
}
