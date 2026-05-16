"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  ChevronRight,
  ChevronLeft,
  X,
  ShieldAlert,
  ImageIcon,
  CheckCircle2,
  Briefcase,
  PauseCircle,
  FilterX,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Store & Hooks
import { useServiceStore } from "../../../app/store/useServiceStore";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useCategoryStore } from "../../../app/store/useCategoryStore";

// Custom Components
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import ContentLoader from "../../ContentLoader";

export default function CompactServicesRegistryPage() {
  const { user: authUser } = useAuthGuard();
  const router = useRouter();

  const {
    fetchServices,
    services = [],
    meta,
    loading: isLoading,
    deleteManyServices,
    updateManyStatus,
    fetchCount,
    serviceStats,
  } = useServiceStore();

  const { categories, fetchCategories } = useCategoryStore();

  // --- States ---
  const [selectedSet, setSelectedSet] = useState(new Set());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category_id: "",
    type_id: "",
    owner_id: "",
  });

  // --- Data Fetching ---
  const refreshData = async (overrides = {}) => {
    const params = {
      page: overrides.page ?? meta?.current_page ?? 1,
      search: filters.search.trim(),
      status: filters.status,
      category_id: filters.category_id,
      type_id: filters.type_id,
      owner_id: filters.owner_id,
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === "" || params[key] === null) delete params[key];
    });

    await fetchServices(params);
    await fetchCount();
  };

  useEffect(() => {
    fetchCategories({ all: true });
  }, [fetchCategories]);

  useEffect(() => {
    if (isFirstLoad) {
      refreshData().finally(() => setIsFirstLoad(false));
      return;
    }
    const timer = setTimeout(() => refreshData({ page: 1 }), 500);
    return () => clearTimeout(timer);
  }, [filters]);

  // --- Deriving Dropdown Options from Data ---
  const dropDownData = useMemo(() => {
    const typs = new Map();
    const ownrs = new Map();

    services.forEach((s) => {
      if (s.type) typs.set(s.type.id, s.type);
      if (s.owner) ownrs.set(s.owner.id, s.owner);
    });

    return {
      types: Array.from(typs.values()),
      owners: Array.from(ownrs.values()),
    };
  }, [services]);

  // --- Selection & Bulk Actions ---
  const selectedIds = useMemo(() => Array.from(selectedSet), [selectedSet]);
  const isAllSelected =
    services.length > 0 && services.every((s) => selectedSet.has(s.id));

  const toggleSelectOne = (id) => {
    const next = new Set(selectedSet);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedSet(next);
  };

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedSet(new Set());
    else setSelectedSet(new Set(services.map((s) => s.id)));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSelectedSet(new Set());
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      category_id: "",
      type_id: "",
      owner_id: "",
    });
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      await updateManyStatus(selectedIds, status);
      toast.success(`Updated ${selectedIds.length} services to ${status}`);
      setSelectedSet(new Set());
      refreshData();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteManyServices(idsToDelete);
      toast.success("Services deleted successfully");
      setDeleteOpen(false);
      setSelectedSet(new Set());
      refreshData();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  // Helper to calculate price range from JSON packages
  const getPriceRange = (packages) => {
    if (!packages || packages.length === 0) return "No price set";
    const prices = packages.map((p) => parseFloat(p.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max
      ? `$${min.toFixed(2)}`
      : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  };

  if (!authUser) return null;

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 lg:p-6 space-y-6 pb-24 font-sans antialiased">
      {isFirstLoad && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
          <ContentLoader
            title="Service Registry"
            subtitle="Loading services..."
            Icon={Briefcase}
          />
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2 tracking-tight">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-lg">
              <Briefcase size={18} />
            </div>
            Registry Catalog
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
            Manage your platform service offerings
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/create/services")}
          className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} className="inline mr-1" /> NEW SERVICE
        </button>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: "",
            label: "Total Registry",
            value: serviceStats?.total_services || 0,
            icon: Briefcase,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            id: "active",
            label: "Active Services",
            value: serviceStats?.active_services || 0,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            id: "paused",
            label: "Inactive/Draft",
            value:
              serviceStats?.total_services - serviceStats?.active_services || 0,
            icon: ShieldAlert,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => handleFilterChange("status", stat.id)}
            className={`flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all ${
              filters.status === stat.id
                ? "border-indigo-500 ring-2 ring-indigo-50 shadow-md"
                : "border-slate-100 shadow-sm hover:border-indigo-200"
            }`}
          >
            <div
              className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}
            >
              <stat.icon size={20} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                {stat.label}
              </p>
              <h3 className="text-xl font-black leading-none">{stat.value}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-3">
        <div className="flex-1 relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={filters.category_id}
            onChange={(e) => handleFilterChange("category_id", e.target.value)}
            className="px-4 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black outline-none cursor-pointer"
          >
            <option value="">CATEGORY: ALL</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={filters.owner_id}
            onChange={(e) => handleFilterChange("owner_id", e.target.value)}
            className="px-4 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black outline-none cursor-pointer"
          >
            <option value="">OWNER: ALL</option>
            {dropDownData.owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.business_name.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black outline-none cursor-pointer"
          >
            <option value="">STATUS: ALL</option>
            <option value="active">ACTIVE</option>
            <option value="paused">PAUSED</option>
            <option value="draft">DRAFT</option>
          </select>

          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 px-4 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[10px] font-black transition-all"
          >
            <FilterX size={14} /> CLEAR
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto">
        <div
          className={`bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm ${
            isLoading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 w-10 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Service & Provider
                  </th>
                  <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Classification
                  </th>
                  <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Pricing & Pkgs
                  </th>
                  <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-4 py-5 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {services.map((item) => (
                  <tr
                    key={item.id}
                    className={`group ${
                      selectedSet.has(item.id)
                        ? "bg-indigo-50/30"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                        checked={selectedSet.has(item.id)}
                        onChange={() => toggleSelectOne(item.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                          {item.images?.[0] ? (
                            <Image
                              src={item.images[0].url}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <ImageIcon
                              className="m-auto mt-3 text-slate-300"
                              size={20}
                            />
                          )}
                        </div>
                        <div className="max-w-[200px]">
                          <p className="font-black text-slate-900 text-xs truncate mb-1">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 font-bold text-[9px] text-indigo-600 uppercase">
                            <div className="w-4 h-4 rounded-full overflow-hidden bg-white border border-slate-200 relative">
                              <Image
                                src={item.owner?.logo}
                                alt="logo"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <span className="truncate">
                              {item.owner?.business_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.category?.icon}
                            alt=""
                            className="w-3.5 h-3.5 object-contain opacity-70"
                          />
                          <span className="text-[10px] font-black text-slate-700">
                            {item.category?.name}
                          </span>
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                          <Tag size={10} /> {item.type?.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900">
                          {getPriceRange(item.service_packages)}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          {item.packages_count} Active Packages
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() =>
                            router.push(`/admin/edit/services/${item.id}`)
                          }
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 shadow-sm transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setIdsToDelete([item.id]);
                            setDeleteOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 shadow-sm transition-all"
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

          {/* PAGINATION */}
          <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing <span className="text-indigo-600">{services.length}</span>{" "}
              of {meta?.total || 0} services
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={meta?.current_page === 1 || isLoading}
                onClick={() => refreshData({ page: meta.current_page - 1 })}
                className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black shadow-sm">
                {meta?.current_page} / {meta?.last_page}
              </div>
              <button
                disabled={meta?.current_page === meta?.last_page || isLoading}
                onClick={() => refreshData({ page: meta.current_page + 1 })}
                className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION DOCK */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 50, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 50, x: "-50%", opacity: 0 }}
            className="fixed bottom-8 left-1/2 z-[60] px-8 py-4 bg-slate-900 text-white rounded-3xl shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-xl"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Selected Items
              </span>
              <span className="text-xs font-black text-indigo-400">
                {selectedIds.length} Services
              </span>
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <div className="flex gap-6">
              <button
                onClick={() => handleBulkStatusUpdate("active")}
                className="text-[10px] font-black uppercase hover:text-emerald-400 flex items-center gap-2 transition-colors"
              >
                <CheckCircle2 size={16} /> Activate
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("paused")}
                className="text-[10px] font-black uppercase hover:text-amber-400 flex items-center gap-2 transition-colors"
              >
                <PauseCircle size={16} /> Pause
              </button>
              <button
                onClick={() => {
                  setIdsToDelete(selectedIds);
                  setDeleteOpen(true);
                }}
                className="text-[10px] font-black uppercase hover:text-rose-400 flex items-center gap-2 transition-colors"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>

            <button
              onClick={() => setSelectedSet(new Set())}
              className="ml-4 p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
  const configs = {
    active: {
      label: "Active",
      styles: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dot: "bg-emerald-500",
      ping: true,
    },
    paused: {
      label: "Paused",
      styles: "bg-amber-50 text-amber-700 border-amber-100",
      dot: "bg-amber-500",
      ping: false,
    },
    draft: {
      label: "Draft",
      styles: "bg-slate-100 text-slate-500 border-slate-200",
      dot: "bg-slate-400",
      ping: false,
    },
  };
  const config = configs[status] || configs.draft;
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-tighter shadow-sm ${config.styles}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {config.ping && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`}
        />
      </span>
      {config.label}
    </span>
  );
}
