"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  UserPlus,
  Trash2,
  Pencil,
  Mail,
  ChevronRight,
  Activity,
  Clock,
  Phone,
  Users,
  MapPin,
  Building2 as Company,
  FileText,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import { toast } from "react-toastify";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useOwnerStore } from "../../../app/store/ownerStore";
import ContentLoader from "../../ContentLoader";
import { formatPhoneNumber } from "../../../app/utils/phoneUtils";
import OwnerFilterSystem from "./OwnerFilterSystem";
import SearchCompany from "./SecrchCompany";
import LastDaysOptions from "./LastDaysOptions";

export default function OwnersPage() {
  const { user: authUser } = useAuthGuard();
  const router = useRouter();

  const { 
    owners = [], 
    meta, 
    loading, 
    fetchOwners, 
    deleteOwner, 
    deleteMany 
  } = useOwnerStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // "completed" | "pending" | ""
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    created_date: "",
    created_from: "",
    created_to: "",
    created_hour: "",
    updated_date: "",
    updated_from: "",
    updated_to: "",
    last_days: "",
    this_month: false,
  });

  // ✅ Calculate active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (status) count++;
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== false) count++;
    });
    return count;
  }, [filters, status]);

  const stats = useMemo(() => {
    const approved = owners.filter((o) => o.status === "approved").length;
    const pending = owners.filter((o) => o.status === "pending").length;
    const rejected = owners.filter((o) => o.status === "rejected").length;
  
    return {
      total: meta?.total ?? owners.length,
      approved,
      pending,
      rejected,
    };
  }, [owners, meta]);


  

  // ✅ Unified param builder
  const buildParams = useCallback((overrides = {}) => {
    const p = {
      page: 1,
      search,
      status,
      ...filters,
      ...overrides,
    };

    // Clean up empty values
    Object.keys(p).forEach(key => {
      if (p[key] === "" || p[key] === null || p[key] === false) {
        delete p[key];
      }
    });

    if (p.this_month) p.this_month = "true";
    return p;
  }, [search, status, filters]);

  // ✅ Initial fetch
  useEffect(() => {
    const initFetch = async () => {
      await fetchOwners(buildParams({ page: 1 }));
      setIsFirstLoad(false);
    };
    if (authUser) initFetch();
  }, [fetchOwners, authUser]); // Removed buildParams from deps to avoid loop

  

  const handleSearch = (value) => {
    setSearch(value);
    fetchOwners(buildParams({ page: 1, search: value }));
  };

  const handleQuickFilter = (newStatus) => {
    setStatus(newStatus);
    fetchOwners(buildParams({ page: 1, status: newStatus }));
  };

  const handlePageChange = (page) => {
    if (!page || page < 1 || page > (meta?.last_page || 1)) return;
    fetchOwners(buildParams({ page }));
  };

  const setFilterValue = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = async () => {
    await fetchOwners(buildParams({ page: 1 }));
    setFiltersOpen(false);
  };

  const resetFilters = async () => {
    const cleared = {
      created_date: "",
      created_from: "",
      created_to: "",
      created_hour: "",
      updated_date: "",
      updated_from: "",
      updated_to: "",
      last_days: "",
      this_month: false,
    };
    setFilters(cleared);
    setStatus("");
    setSearch("");
    await fetchOwners({ page: 1 });
    setFiltersOpen(false);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const success =
        idsToDelete.length === 1
          ? await deleteOwner(idsToDelete[0])
          : await deleteMany(idsToDelete);

      if (!success) throw new Error("Deletion failed");

      toast.success("Record(s) removed successfully");
      setDeleteOpen(false);
      setIdsToDelete([]);
      fetchOwners(buildParams({ page: meta?.current_page || 1 }));
    } catch (e) {
      toast.error(e.message || "Operation failed");
    } finally {
      setDeleting(false);
    }
  };

  if (!authUser) return null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#F8FAFC] p-4 lg:p-8 space-y-8 font-sans antialiased text-slate-900">
      {isFirstLoad && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
          <ContentLoader title="Company Registry" subtitle="Loading companies..." Icon={Company} />
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1 w-6 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              Administrative Core
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Company Registry</h1>
          <p className="text-slate-500 text-sm">Review and audit business entities.</p>
        </div>

        <button
          onClick={() => router.push("/admin/create/company")}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
        >
          <UserPlus size={18} />
          ADD COMPANY
        </button>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
  {[
    { key: "", label: "Total", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { key: "approved", label: "Approved", value: stats.approved, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { key: "pending", label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { key: "rejected", label: "Rejected", value: stats.rejected, icon: Trash2, color: "text-rose-600", bg: "bg-rose-50" },
  ].map((stat) => (
    <button
      key={stat.label}
      onClick={() => handleQuickFilter(stat.key)}
      className={`group text-left bg-white p-6 rounded-2xl border transition-all ${
        status === stat.key
          ? "border-indigo-500 ring-2 ring-indigo-50"
          : "border-slate-200 hover:border-indigo-200 shadow-sm"
      }`}
    >
      <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <stat.icon size={20} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
      <h3 className="text-3xl font-black mt-1 text-slate-900">{stat.value}</h3>
    </button>
  ))}
</div>

      <OwnerFilterSystem
      model={{
        search: { value: search, onChange: handleSearch },
        drawer: { open: filtersOpen, setOpen: setFiltersOpen },
        filters: { values: filters, setValue: setFilterValue },
        actions: { apply: applyFilters, reset: resetFilters },
        loading,
        activeCount: activeFilterCount,
        ownersUsers: [],
      }}
    />


    {/* TABLE - CONDENSED VERSION */}
<div className="max-w-7xl mx-auto relative">
  <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-opacity duration-300 ${loading && !isFirstLoad ? "opacity-60" : "opacity-100"}`}>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100 font-sans">
            <th className="px-4 py-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">CP NO</th>
            <th className="px-4 py-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">Business & Owner</th>
            <th className="px-4 py-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">Contact</th>
            <th className="px-4 py-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">Location</th>
            <th className="px-4 py-3 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">Status</th>
            <th className="px-6 py-3 text-right text-[9px] font-black uppercase text-slate-400 tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {owners.map((item, index) => (
            <tr key={item.id} className="hover:bg-indigo-50/20 transition-colors group">
              {/* CP NO */}
              <td className="px-4 py-2.5 font-mono text-[11px] text-slate-400">
                #{String(index + 1).padStart(3, '0')}
              </td>

              {/* BUSINESS & OWNER */}
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    {item.logo ? (
                      <Image src={item.logo} alt="logo" fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-[10px] font-black">
                        {item.business_name?.charAt(0) || "B"}
                      </div>
                    )}
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold text-slate-900 text-xs truncate max-w-[120px]">{item.business_name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.user?.name}</p>
                  </div>
                </div>
              </td>

              {/* CONTACT */}
              <td className="px-4 py-2.5">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                    <Mail size={10} className="text-slate-300" />
                    {item.user?.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                    <Phone size={10} className="text-slate-300" />
                    {formatPhoneNumber(item.user?.phone)}
                  </div>
                </div>
              </td>

              {/* LOCATION */}
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                  <MapPin size={10} className="text-slate-300 flex-shrink-0" />
                  <span className="truncate max-w-[130px]">{item.address}</span>
                </div>
              </td>

              {/* STATUS */}
              <td className="px-4 py-2.5 text-center">
                <StatusBadge status={item.status} isSmall={true} />
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-2.5 text-right">
                <div className="flex justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => router.push(`/admin/company/${item.id}`)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-md border border-transparent hover:border-slate-100 shadow-sm"
                    title="View Profile"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => router.push(`/admin/company/owner-documents/owner_id=${item.id}`)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-md border border-transparent hover:border-slate-100 shadow-sm"
                    title="Documents"
                  >
                    <FileText size={14} />
                  </button>
                  <button
                    onClick={() => router.push(`/admin/edit/company/${item.id}`)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md border border-transparent hover:border-slate-100 shadow-sm"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => { setIdsToDelete([item.id]); setDeleteOpen(true); }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-md border border-transparent hover:border-slate-100 shadow-sm"
                    title="Delete"
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

    {/* COMPACT PAGINATION */}
    <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        Total: <span className="text-slate-900">{meta?.total || 0}</span>
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => handlePageChange((meta?.current_page || 1) - 1)}
          disabled={(meta?.current_page || 1) === 1 || loading}
          className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-all"
        >
          <ChevronRight size={14} className="rotate-180" />
        </button>

        <span className="text-[10px] font-black text-slate-900">
          {meta?.current_page || 1} / {meta?.last_page || 1}
        </span>

        <button
          onClick={() => handlePageChange((meta?.current_page || 1) + 1)}
          disabled={meta?.current_page === meta?.last_page || loading}
          className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-all"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  </div>
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
  const s = (status || "pending").toLowerCase();

  const config = {
    pending: {
      label: "Pending",
      wrap: "bg-amber-50 text-amber-700 border-amber-100",
      dot: "bg-amber-500",
    },
    approved: {
      label: "Approved",
      wrap: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dot: "bg-emerald-500 animate-pulse",
    },
    rejected: {
      label: "Rejected",
      wrap: "bg-rose-50 text-rose-700 border-rose-100",
      dot: "bg-rose-500",
    },

    // Optional: if your DB still uses "completed"
    completed: {
      label: "Completed",
      wrap: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dot: "bg-emerald-500 animate-pulse",
    },
  };

  const c = config[s] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${c.wrap}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}