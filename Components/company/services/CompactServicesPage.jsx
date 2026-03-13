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
  Clock,
  DollarSign,
  Store,
  Tag,
  Briefcase,
  Loader2,
  PauseCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Store & Hooks

import { useAuthGuard } from "../../../app/hooks/useAuthGuard";

// Custom Components
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import ContentLoader from "../../ContentLoader";
import { useServiceStoreCompany } from "../../../app/store/owner/useServiceStore";

export default function CompactServicesPage() {
  const { user: authUser } = useAuthGuard();
  const router = useRouter();

  const {
    fetchServices,
    services = [],
    meta,
    loading: isLoading,
    deleteManyServices,
    updateManyStatus,
    fetchStats,
    serviceStats,
  } = useServiceStoreCompany();

  // --- States ---
  const [selectedSet, setSelectedSet] = useState(new Set());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Unified Filter State (Matching Laravel Controller Keys)
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category_id: "",
    type_id: "",
    owner_id: "",
    price_min: "",
    price_max: "",
  });

  // --- Data Fetching Logic ---
  const refreshData = async (overrides = {}) => {
    const params = {
      page: overrides.page ?? 1,
      search: filters.search.trim(),
      status: filters.status,
      category_id: filters.category_id,
      type_id: filters.type_id,
      owner_id: filters.owner_id,
      price_min: filters.price_min,
      price_max: filters.price_max,
    };

    // Clean empty values before sending to Laravel
    Object.keys(params).forEach((key) => {
      if (params[key] === "" || params[key] === null) delete params[key];
    });

    await fetchServices(params);
    await fetchStats();
  };

  // Debounced search/filter effect
  useEffect(() => {
    if (isFirstLoad) {
      refreshData().finally(() => setIsFirstLoad(false));
      return;
    }

    const timer = setTimeout(() => {
      refreshData({ page: 1 });
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  // --- Deriving Dropdown Options from Data ---
  const dropDownData = useMemo(() => {
    const cats = new Map();
    const typs = new Map();
    const ownrs = new Map();

    services.forEach((s) => {
      if (s.category) cats.set(s.category.id, s.category);
      if (s.type) typs.set(s.type.id, s.type);
      if (s.owner) ownrs.set(s.owner.id, s.owner);
    });

    return {
      categories: Array.from(cats.values()),
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
    setSelectedSet(new Set()); // Reset selection when filters change
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      await updateManyStatus(selectedIds, status);
      toast.success(`Records updated to ${status}`);
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
      toast.success("Services purged permanently");
      setDeleteOpen(false);
      setSelectedSet(new Set());
      refreshData();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (!authUser) return null;

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 lg:p-6 space-y-6 pb-24 font-sans antialiased text-slate-900">
      {isFirstLoad && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
          <ContentLoader
            title="Service Registry"
            subtitle="Synchronizing data..."
            Icon={Briefcase}
          />
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-black flex items-center gap-2 tracking-tight">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-lg">
            <Briefcase size={18} />
          </div>
          Registry Catalog
        </h1>
        <button
          onClick={() => router.push("/owner/create/services")}
          className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} className="inline mr-1" /> NEW SERVICE
        </button>
      </div>

      {/* STATS CARDS (Clicking these filters the table) */}
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
            label: "Paused/Draft",
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

      {/* COMPACT FILTER BAR */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="xl:col-span-2 relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600"
            size={18}
          />
          <input
            type="text"
            placeholder="Search title, desc, category..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
          />
          {filters.search && (
            <X
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer"
              onClick={() => handleFilterChange("search", "")}
            />
          )}
        </div>

        {/* Status Select */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="appearance-none w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none cursor-pointer"
          >
            <option value="">STATUS: ALL</option>
            <option value="active">ACTIVE</option>
            <option value="paused">PAUSED</option>
            <option value="draft">DRAFT</option>
          </select>
          <ChevronRight
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none"
          />
        </div>

        {/* Category Select */}
        <div className="relative">
          <select
            value={filters.category_id}
            onChange={(e) => handleFilterChange("category_id", e.target.value)}
            className="appearance-none w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none cursor-pointer"
          >
            <option value="">CATEGORY: ALL</option>
            {dropDownData.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.toUpperCase()}
              </option>
            ))}
          </select>
          <ChevronRight
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none"
          />
        </div>
      </div>

      {/* REGISTRY TABLE */}
      <div className="max-w-7xl mx-auto">
        <div
          className={`bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm transition-opacity ${
            isLoading ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 py-4 w-10 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Service Profile
                  </th>
                  <th className="px-4 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Category & Type
                  </th>
                  <th className="px-4 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Pricing & Time
                  </th>
                  <th className="px-4 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-4 py-4 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Control
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {services.map((item) => (
                  <tr
                    key={item.id}
                    className={`group transition-colors ${
                      selectedSet.has(item.id)
                        ? "bg-indigo-50/40"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        checked={selectedSet.has(item.id)}
                        onChange={() => toggleSelectOne(item.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-xs">
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
                              className="m-auto text-slate-200"
                              size={16}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs tracking-tight leading-none mb-1">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                            <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-slate-100 bg-slate-50 relative">
                              <Image
                                src={item.owner?.logo}
                                alt="logo"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <span className="truncate max-w-[100px]">
                              {item.owner?.business_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.category?.icon}
                            className="w-4 h-4 object-contain"
                          />
                          <span className="text-[10px] font-bold text-slate-600 truncate max-w-[80px]">
                            {item.category?.name}
                          </span>
                        </div>
                        <span className="text-[9px] font-black text-indigo-500 border-l-2 border-indigo-100 pl-2 uppercase tracking-widest">
                          {item.type?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900">
                          ${parseFloat(item.base_price).toFixed(2)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tighter">
                          <Clock size={10} /> {item.duration}m duration
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() =>
                            router.push(`/owner/edit/services/${item.id}`)
                          }
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 shadow-sm"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setIdsToDelete([item.id]);
                            setDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 shadow-sm"
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

          {/* FOOTER PAGINATION */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            <span className="text-slate-900 tracking-normal text-[11px] font-black">
              Showing <span className="text-indigo-600">{services.length}</span>{" "}
              of {meta?.total || 0} Records
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={meta?.current_page === 1 || isLoading}
                onClick={() => refreshData({ page: meta.current_page - 1 })}
                className="p-2 rounded-xl border border-slate-200 bg-white shadow-sm disabled:opacity-30 hover:bg-slate-50 hover:border-indigo-300 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center px-4 h-9 bg-white border border-slate-200 rounded-xl text-slate-900 tracking-normal font-black shadow-sm">
                {meta?.current_page || 1} / {meta?.last_page || 1}
              </div>
              <button
                disabled={meta?.current_page === meta?.last_page || isLoading}
                onClick={() => refreshData({ page: meta.current_page + 1 })}
                className="p-2 rounded-xl border border-slate-200 bg-white shadow-sm disabled:opacity-30 hover:bg-slate-50 hover:border-indigo-300 transition-all"
              >
                <ChevronRight size={16} />
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
              <span className="bg-indigo-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase">
                {selectedIds.length} SELECTED
              </span>
              <div className="flex gap-6 border-l border-slate-700 pl-6">
                <button
                  onClick={() => handleBulkStatusUpdate("active")}
                  className="text-[9px] font-black uppercase hover:text-emerald-400 flex items-center gap-2 tracking-widest transition-colors"
                >
                  <CheckCircle2 size={14} /> ACTIVATE
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate("paused")}
                  className="text-[9px] font-black uppercase hover:text-amber-400 flex items-center gap-2 tracking-widest transition-colors"
                >
                  <PauseCircle size={14} /> PAUSE
                </button>
                <button
                  onClick={() => {
                    setIdsToDelete(selectedIds);
                    setDeleteOpen(true);
                  }}
                  className="text-[9px] font-black uppercase hover:text-rose-400 flex items-center gap-2 tracking-widest transition-colors"
                >
                  <Trash2 size={14} /> DELETE
                </button>
              </div>
              <X
                size={14}
                className="text-slate-500 cursor-pointer hover:text-white"
                onClick={() => setSelectedSet(new Set())}
              />
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

// Sub-Component: Status Badge
function StatusBadge({ status }) {
  const configs = {
    active: {
      label: "Active",
      styles:
        "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-100/20",
      dot: "bg-emerald-500",
      ping: true,
    },
    paused: {
      label: "Paused",
      styles: "bg-amber-50 text-amber-700 border-amber-100 shadow-amber-100/20",
      dot: "bg-amber-500",
      ping: false,
    },
    draft: {
      label: "Draft",
      styles:
        "bg-slate-100 text-slate-500 border-slate-200 shadow-slate-100/10",
      dot: "bg-slate-400",
      ping: false,
    },
  };
  const config = configs[status] || configs.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border shadow-sm transition-all ${config.styles}`}
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
