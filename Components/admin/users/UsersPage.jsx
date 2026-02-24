"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { 
  UserPlus, Search, Trash2, Shield, Pencil, Mail, ChevronRight,
  ShieldCheck, ShieldAlert, ChevronLeft, X, Command 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

// Store & Hooks
import { useUsersStore } from "../../../app/store/useUsersStore";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { formatPhoneNumber } from "../../../app/utils/phoneUtils";

// Custom Sub-Components
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import UserFilterDropdown from "../../../Components/admin/UserFilterDropdown";
import ContentLoader from "../../ContentLoader";
import UserRoleDropdown from "./UserRoleDropdown";
import UserStatsGrid from "./UserStatsGrid";
import UserTable from "./UserTable";

/**
 * Hook for debouncing search input
 */
function useDebouncedValue(value, delay = 450) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function UsersPage() {
  const { user: authUser } = useAuthGuard();
  const router = useRouter();

  const {
    fetchUsers,
    users = [],
    meta,
    counts,
    isLoading,
    deleteMany,
    updateManyStatus,
    setSearchTerm,
    searchTerm,
  } = useUsersStore();

  // Selection & UI State
  const [selectedSet, setSelectedSet] = useState(new Set());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  
  // Filtering State
  const [activeRole, setActiveRole] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Search Logic
  const [searchValue, setSearchValue] = useState(searchTerm || "");
  const debouncedSearch = useDebouncedValue(searchValue, 450);

  useEffect(() => {
    setSearchTerm(debouncedSearch);
  }, [debouncedSearch, setSearchTerm]);

  // Derived Data
  const visibleUsers = useMemo(() => users.filter((u) => u.role !== "admin"), [users]);
  const selectedIds = useMemo(() => Array.from(selectedSet), [selectedSet]);
  const allVisibleIds = useMemo(() => visibleUsers.map((u) => u.id), [visibleUsers]);
  const isAllSelected = useMemo(() => 
    visibleUsers.length > 0 && visibleUsers.every((u) => selectedSet.has(u.id)), 
  [visibleUsers, selectedSet]);

  const stats = useMemo(() => ({
    total: counts?.total ?? meta?.total ?? 0,
    owners: counts?.owners ?? 0,
    customers: counts?.customers ?? 0,
    providers: counts?.providers ?? 0,
  }), [counts, meta]);

  // Actions
  const buildParams = useCallback(({ page, role, status } = {}) => {
    const params = {
      page: page ?? 1,
      search: debouncedSearch || undefined,
      role: (role ?? activeRole) === "all" ? undefined : (role ?? activeRole),
    };
    const s = status ?? activeStatus;
    if (s === "active") params.is_active = "true";
    if (s === "inactive") params.is_active = "false";
    return params;
  }, [activeRole, activeStatus, debouncedSearch]);

  const refreshData = useCallback(async (overrides = {}) => {
    if (!authUser) return;
    await fetchUsers(buildParams(overrides));
  }, [authUser, fetchUsers, buildParams]);

  useEffect(() => {
    if (!authUser) return;
    refreshData({ page: 1 }).finally(() => {
      setTimeout(() => setIsFirstLoad(false), 600);
    });
  }, [authUser, refreshData, activeRole, activeStatus, debouncedSearch]);

  const clearSelection = useCallback(() => setSelectedSet(new Set()), []);

  const toggleSelectOne = (id) => {
    const next = new Set(selectedSet);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedSet(next);
  };

  const toggleSelectAll = () => {
    if (isAllSelected) clearSelection();
    else setSelectedSet(new Set(allVisibleIds));
  };

  const handleBulkStatusUpdate = async (isActive) => {
    if (!selectedIds.length) return;
    try {
      await updateManyStatus({ ids: selectedIds, is_active: isActive });
      toast.success(isActive ? "Accounts activated" : "Accounts deactivated");
      clearSelection();
      refreshData();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteMany(idsToDelete);
      toast.success(idsToDelete.length === 1 ? "User removed" : "Users removed");
      setDeleteOpen(false);
      clearSelection();
      refreshData();
    } catch {
      toast.error("Failed to delete users");
    } finally {
      setDeleting(false);
    }
  };
 

  if (!authUser) return null;

  return (
    <div className="relative min-h-screen bg-[#FDFDFD] p-4 lg:p-8 space-y-10 font-sans antialiased text-slate-900 pb-32">
      {isFirstLoad && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
          <ContentLoader title="Company Registry" subtitle="Loading companies..." Icon={UserPlus} />
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Command size={16} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Access Control</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Directory</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Managing {stats.total} global accounts.</p>
        </div>

        <button
          onClick={() => router.push("/admin/create/users")}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <UserPlus size={18} />
          CREATE ACCOUNT
        </button>
      </div>

      {/* STATS BENTO GRID */}
      <UserStatsGrid
        stats={stats} 
        activeRole={activeRole} 
        onRoleChange={(roleId) => {
           setActiveRole(roleId);
           clearSelection();
        }} 
      />

      {/* SEARCH & FILTERS BAR */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search name, email, or identifier..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-14 pr-10 py-4.5 bg-white border border-slate-200 rounded-[1.5rem] text-[15px] font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <UserRoleDropdown
            isOpen={isRoleOpen}
            setIsOpen={setIsRoleOpen}
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            onSelect={clearSelection}
          />

          <UserFilterDropdown
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            activeStatus={activeStatus}
            onFilterAll={() => { setActiveStatus("all"); clearSelection(); }}
            onFilterActive={() => { setActiveStatus("active"); clearSelection(); }}
            onFilterInactive={() => { setActiveStatus("inactive"); clearSelection(); }}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="max-w-7xl mx-auto relative">
        <UserTable
          users={visibleUsers}
          selectedSet={selectedSet}
          isAllSelected={isAllSelected}
          toggleSelectAll={toggleSelectAll}
          toggleSelectOne={toggleSelectOne}
          onEdit={(id) => router.push(`/admin/edit/users/${id}`)}
          onDelete={(id) => { setIdsToDelete([id]); setDeleteOpen(true); }}
          isLoading={isLoading}
          formatPhoneNumber={formatPhoneNumber}
        />

        {/* PAGINATION */}
        <div className="mt-6 px-8 py-5 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">{visibleUsers.length}</span> of {meta?.total || 0}
          </p>
          <div className="flex items-center gap-3">
            <button
              disabled={meta?.current_page === 1}
              onClick={() => refreshData({ page: meta.current_page - 1 })}
              className="p-2.5 rounded-xl border border-slate-100 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            ><ChevronLeft size={20}/></button>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-2 text-xs font-black tracking-tighter">
              PAGE {meta?.current_page || 1} <span className="text-slate-300 px-1">/</span> {meta?.last_page || 1}
            </div>

            <button
              disabled={meta?.current_page === meta?.last_page}
              onClick={() => refreshData({ page: meta.current_page + 1 })}
              className="p-2.5 rounded-xl border border-slate-100 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            ><ChevronRight size={20}/></button>
          </div>
        </div>

        {/* FLOATING ACTION DOCK */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ y: 100, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 100, x: "-50%", opacity: 0 }}
              className="fixed bottom-10 left-1/2 z-50 w-full max-w-fit px-8 py-4 bg-slate-900 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-10"
            >
              <div className="flex items-center gap-4 pr-10 border-r border-slate-800">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black">
                  {selectedIds.length}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Selected</span>
              </div>
              
              <div className="flex gap-8">
                <button onClick={() => handleBulkStatusUpdate(true)} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-emerald-400 transition-colors">
                  <ShieldCheck size={20} className="text-slate-500 group-hover:text-emerald-400" /> Activate
                </button>
                <button onClick={() => handleBulkStatusUpdate(false)} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-amber-400 transition-colors">
                  <ShieldAlert size={20} className="text-slate-500 group-hover:text-amber-400" /> Disable
                </button>
                <button onClick={() => { setIdsToDelete(selectedIds); setDeleteOpen(true); }} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-red-400 transition-colors">
                  <Trash2 size={20} className="text-slate-500 group-hover:text-red-400" /> Remove
                </button>
              </div>

              <button onClick={clearSelection} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X size={18} className="text-slate-500" />
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