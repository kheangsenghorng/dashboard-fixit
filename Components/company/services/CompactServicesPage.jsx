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
  Eye,
  Tag,
  FilterX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Store & Hooks
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useServiceStoreCompany } from "../../../app/store/owner/useServiceStore";

// Custom Components
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import ContentLoader from "../../ContentLoader";

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

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category_id: "",
    type_id: "",
  });

  // --- Data Fetching ---
  const refreshData = async (overrides = {}) => {
    const params = {
      page: overrides.page ?? meta?.current_page ?? 1,
      search: filters.search.trim(),
      status: filters.status,
      category_id: filters.category_id,
      type_id: filters.type_id,
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === "" || params[key] === null) delete params[key];
    });

    await fetchServices(params);
    await fetchStats();
  };

  useEffect(() => {
    if (isFirstLoad) {
      refreshData().finally(() => setIsFirstLoad(false));
      return;
    }
    const timer = setTimeout(() => refreshData({ page: 1 }), 500);
    return () => clearTimeout(timer);
  }, [filters]);

  // Extract Categories and Types from current services for filtering
  const dropDownData = useMemo(() => {
    const cats = new Map();
    const typs = new Map();
    services.forEach((s) => {
      if (s.category) cats.set(s.category.id, s.category);
      if (s.type) typs.set(s.type.id, s.type);
    });
    return {
      categories: Array.from(cats.values()),
      types: Array.from(typs.values()),
    };
  }, [services]);

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

  const handleBulkStatusUpdate = async (status) => {
    try {
      await updateManyStatus(selectedIds, status);
      toast.success(`Records successfully set to ${status}`);
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
      toast.success("Services removed from registry");
      setDeleteOpen(false);
      setSelectedSet(new Set());
      refreshData();
    } catch {
      toast.error("Failed to delete records");
    } finally {
      setDeleting(false);
    }
  };

  // Helper: Price Range from JSON
  const getPriceDisplay = (packages) => {
    if (!packages || packages.length === 0) return "No Pricing";
    const prices = packages.map((p) => parseFloat(p.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max
      ? `$${min.toFixed(2)}`
      : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  };

  if (!authUser) return null;

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 lg:p-6 space-y-6 pb-24 font-sans antialiased text-slate-900">
      {isFirstLoad && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
          <ContentLoader
            title="Service Management"
            subtitle="Accessing your registry..."
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
            My Service Registry
          </h1>
        </div>
        <button
          onClick={() => router.push("/owner/create/services")}
          className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-[10px] tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          <Plus size={16} /> ADD NEW SERVICE
        </button>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Registry",
            value: serviceStats?.total_services || 0,
            icon: Briefcase,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            id: "",
          },
          {
            label: "Active Services",
            value: serviceStats?.active_services || 0,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            id: "active",
          },
          {
            label: "Paused/Draft",
            value:
              (serviceStats?.total_services || 0) -
              (serviceStats?.active_services || 0),
            icon: ShieldAlert,
            color: "text-amber-600",
            bg: "bg-amber-50",
            id: "paused",
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
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search your catalog..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <select
            value={filters.category_id}
            onChange={(e) => handleFilterChange("category_id", e.target.value)}
            className="px-4 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black outline-none cursor-pointer"
          >
            <option value="">CATEGORY: ALL</option>
            {dropDownData.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.toUpperCase()}
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
          </select>

          <button
            onClick={() =>
              setFilters({
                search: "",
                status: "",
                category_id: "",
                type_id: "",
              })
            }
            className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[10px] font-black transition-all"
          >
            <FilterX size={14} /> RESET
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="max-w-7xl mx-auto">
        <div
          className={`bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 w-10 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Service Profile
                  </th>
                  <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Classification
                  </th>
                  <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">
                    Pricing Range
                  </th>
                  <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-6 py-5 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Controls
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {services.map((item) => (
                  <tr
                    key={item.id}
                    className={`group ${
                      selectedSet.has(item.id)
                        ? "bg-indigo-50/40"
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
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
                          {item.images?.[0]?.url ? (
                            <Image
                              src={item.images[0].url}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <ImageIcon
                              className="m-auto mt-3 text-slate-200"
                              size={18}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-[13px] leading-tight mb-0.5">
                            {item.title}
                          </p>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            {item.owner?.business_name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.category?.icon}
                            className="w-3.5 h-3.5 object-contain"
                            alt=""
                          />
                          <span className="text-[10px] font-black text-slate-700 uppercase">
                            {item.category?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          <Tag size={10} className="text-indigo-400" />{" "}
                          {item.type?.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-900">
                          {getPriceDisplay(item.service_packages)}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          {item.packages_count} Packages
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() =>
                            router.push(`/owner/services/${item.id}`)
                          }
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-transparent hover:border-emerald-100 shadow-sm transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/owner/edit/services/${item.id}`)
                          }
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-transparent hover:border-indigo-100 shadow-sm transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setIdsToDelete([item.id]);
                            setDeleteOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 shadow-sm transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-black uppercase tracking-widest">
              Catalog Items:{" "}
              <span className="text-indigo-600">{meta?.total || 0}</span>
            </span>
            <div className="flex items-center gap-3">
              <button
                disabled={meta?.current_page === 1}
                onClick={() => refreshData({ page: meta.current_page - 1 })}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center px-5 h-10 bg-white border border-slate-200 rounded-xl text-slate-900 font-black text-xs shadow-sm">
                {meta?.current_page || 1}{" "}
                <span className="mx-2 text-slate-300">/</span>{" "}
                {meta?.last_page || 1}
              </div>
              <button
                disabled={meta?.current_page === meta?.last_page}
                onClick={() => refreshData({ page: meta.current_page + 1 })}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
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
              className="fixed bottom-8 left-1/2 z-50 px-8 py-4 bg-slate-900 text-white rounded-3xl shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 pr-8 border-r border-slate-700">
                <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black">
                  {selectedIds.length}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Selected
                </span>
              </div>
              <div className="flex gap-8">
                <button
                  onClick={() => handleBulkStatusUpdate("active")}
                  className="text-[10px] font-black uppercase hover:text-emerald-400 flex items-center gap-2 transition-colors"
                >
                  <CheckCircle2 size={16} /> ACTIVATE
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate("paused")}
                  className="text-[10px] font-black uppercase hover:text-amber-400 flex items-center gap-2 transition-colors"
                >
                  <PauseCircle size={16} /> PAUSE
                </button>
                <button
                  onClick={() => {
                    setIdsToDelete(selectedIds);
                    setDeleteOpen(true);
                  }}
                  className="text-[10px] font-black uppercase hover:text-rose-400 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={16} /> DELETE
                </button>
              </div>
              <button
                className="p-2 hover:bg-slate-800 rounded-full"
                onClick={() => setSelectedSet(new Set())}
              >
                <X size={16} className="text-slate-500" />
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
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm transition-all ${config.styles}`}
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
