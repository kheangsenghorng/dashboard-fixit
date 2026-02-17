"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  UserPlus,
  Search,
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
  Loader2, // Added for clean loading
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import { toast } from "react-toastify";
import UserFilterDropdown from "../../../Components/admin/UserFilterDropdown";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useOwnerStore } from "../../../app/store/ownerStore";
import ContentLoader from "../../ContentLoader";
import { formatPhoneNumber } from "../../../app/utils/phoneUtils";


export default function OwnersPage() {
  const { user: authUser } = useAuthGuard();
  const router = useRouter();

  const { owners, meta, loading, error, fetchOwners, deleteOwner, deleteMany } =
    useOwnerStore();

  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // ✅ TRACK INITIAL ENTRY
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const isActiveOwner = (o) => {
    return o.status === "completed" || o.user?.is_active === true;
  };

  const stats = useMemo(() => {
    const active = owners.filter(isActiveOwner).length;
    const inactive = owners.length - active;
    const total = meta?.total || owners.length;
    return { active, inactive, total };
  }, [owners, meta]);

  // ✅ INITIAL FETCH LOGIC
  useEffect(() => {
    const initFetch = async () => {
      await fetchOwners({ page: 1 });
      // After first fetch is done, hide the full loader forever
      setTimeout(() => setIsFirstLoad(false), 800);
    };
    initFetch();
  }, [fetchOwners]);

  const handleSearch = (value) => {
    setSearch(value);
    fetchOwners({ page: 1, search: value });
  };

  const handleClearFilter = () => fetchOwners({ page: 1, search });
  const handleFilterActive = () => fetchOwners({ page: 1, search, status: "completed" });
  const handleFilterInactive = () => fetchOwners({ page: 1, search, status: "pending" });

  const toggleSelectAll = () => {
    if (owners.length === 0) return;
    if (selectedIds.length === owners.length) setSelectedIds([]);
    else setSelectedIds(owners.map((o) => o.id));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page) => {
    if (!page || page < 1) return;
    if (meta?.last_page && page > meta.last_page) return;
    fetchOwners({ page, search });
    setSelectedIds([]);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const success =
        idsToDelete.length === 1
          ? await deleteOwner(idsToDelete[0])
          : await deleteMany(idsToDelete);

      if (!success) throw new Error("fail");

      toast.success("Record(s) removed successfully");
      setDeleteOpen(false);
      setSelectedIds([]);
      setIdsToDelete([]);
      fetchOwners({ page: meta?.current_page || 1, search });
    } catch (e) {
      toast.error("Operation failed");
    } finally {
      setDeleting(false);
    }
  };

  if (!authUser) return null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#F8FAFC] p-4 lg:p-8 space-y-8 font-sans antialiased text-slate-900">
      
      {/* ✅ ONLY SHOW FULL LOADER ON FIRST PAGE OPEN */}
       {isFirstLoad &&  <ContentLoader 
                title="System Users" 
                subtitle="Loading user directory..." 
                Icon={Company} 
       />}

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
          onClick={() => router.push("/admin/owners/create")}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
        >
          <UserPlus size={18} />
          ADD COMPANY
        </button>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Owners", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50", action: handleClearFilter },
          { label: "Completed", value: stats.active, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", action: handleFilterActive },
          { label: "Pending", value: stats.inactive, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", action: handleFilterInactive },
        ].map((stat, i) => (
          <button key={i} onClick={stat.action} className="group text-left bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            <h3 className="text-3xl font-black mt-1 text-slate-900">{stat.value}</h3>
          </button>
        ))}
      </div>

      {/* SEARCH & FILTER */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search business or owner name..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {/* ✅ SUBTLE SPINNER: Show only when staying on page and loading */}
          {loading && !isFirstLoad && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            </div>
          )}
        </div>
        <UserFilterDropdown isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} onFilterAll={handleClearFilter} onFilterActive={handleFilterActive} onFilterInactive={handleFilterInactive} />
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto relative">
        <div className={`bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm transition-opacity duration-300 ${loading && !isFirstLoad ? 'opacity-60' : 'opacity-100'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                
                  <th className="px-4 py-5 text-[10px] font-black uppercase text-slate-400">Business & Owner</th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase text-slate-400">Contact Details</th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase text-slate-400">Location</th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase text-slate-400">Status</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {owners.map((item) => (
                  <tr key={item.id} className={`${selectedIds.includes(item.id) ? "bg-indigo-50/50" : "hover:bg-indigo-50/30"} transition-colors group`}>
                    {/* <td className="pl-8 py-5">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600" checked={selectedIds.includes(item.id)} onChange={() => toggleSelectOne(item.id)} />
                    </td> */}
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          {item.logo ? (
                            <Image src={item.logo} alt="logo" fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold uppercase">
                              {item.business_name?.charAt(0) || "B"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.business_name}</p>
                          <p className="text-xs text-slate-500 font-medium">{item.user?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                          <Mail size={12} className="text-slate-400" />
                          {item.user?.email || "No Email"}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                          <Phone size={12} className="text-slate-400" />
                  
                         {formatPhoneNumber(item.user?.phone)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <MapPin size={14} className="text-slate-400" />
                        {item.address}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => router.push(`/admin/edit/company/${item.id}`)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 shadow-sm">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => { setIdsToDelete([item.id]); setDeleteOpen(true); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Records: <span className="text-slate-900">{meta?.total || 0}</span>
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePageChange((meta?.current_page || 1) - 1)}
                disabled={(meta?.current_page || 1) === 1}
                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <span className="text-xs font-black text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200">
                {meta?.current_page || 1} / {meta?.last_page || 1}
              </span>
              <button
                onClick={() => handlePageChange((meta?.current_page || 1) + 1)}
                disabled={meta?.current_page === meta?.last_page}
                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} count={idsToDelete.length} loading={deleting} />
    </div>
  );
}


function StatusBadge({ status }) {
  const isCompleted = status === "completed";
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
      isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
      {isCompleted ? "Active" : status || "Pending"}
    </span>
  );
}