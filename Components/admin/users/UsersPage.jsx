"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  UserPlus, Search, Trash2, Clock, Shield, Pencil, Mail, ChevronRight,
  Activity, ShieldCheck, ShieldAlert, Loader2, ChevronLeft, Phone,
  Filter, Crown, User as UserIcon, X, CheckCircle2, MoreHorizontal
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Store & Controllers
import { useUsersStore } from "../../../app/store/useUsersStore";
import { createUserTableController } from "@/app/controllers/userTableController";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";

// Components & Utils
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import UserFilterDropdown from "../../../Components/admin/UserFilterDropdown";
import ContentLoader from "../../ContentLoader";
import { formatPhoneNumber } from "../../../app/utils/phoneUtils";

export default function UsersPage() {
  const { user: authUser } = useAuthGuard();
  const router = useRouter();

  // --- Store State ---
  const {
    fetchUsers,
    users = [],
    meta,
    isLoading,
    deleteMany,
    updateManyStatus,
    setSearchTerm,
    searchTerm
  } = useUsersStore();

  // --- Local UI State ---
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeRole, setActiveRole] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all"); // "all" | "active" | "inactive"
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // --- 1. Unified Data Fetching ---
  const refreshData = useCallback(async (overrides = {}) => {
    if (!authUser) return;

    // Build params object
    const params = {
      page: overrides.page || 1,
      search: searchTerm || undefined,
    };

    // Role Logic: 
    // If specific role selected, use it. 
    // If "all" is selected but current user isn't admin, restrict to current user's role.
    const roleToFetch = overrides.role !== undefined ? overrides.role : activeRole;
    if (roleToFetch !== "all") {
      params.role = roleToFetch;
    } else if (authUser.role !== "admin") {
      params.role = authUser.role;
    }

    // Status Logic: Map to API booleans
    const statusToFetch = overrides.status !== undefined ? overrides.status : activeStatus;
    if (statusToFetch === "active") params.is_active = "true";
    if (statusToFetch === "inactive") params.is_active = "false";

    await fetchUsers(params);
  }, [authUser, activeRole, activeStatus, searchTerm, fetchUsers]);

  // --- 2. Controller & Filtering Logic ---
  // Hide Admin accounts from the management table for security
  const visibleUsers = useMemo(() => users.filter((u) => u.role !== "admin"), [users]);

  const controller = createUserTableController({
    users: visibleUsers,
    meta,
    setSelectedIds,
    fetchUsers,
    deleteMany,
    updateManyStatus,
    setSearchTerm,
    currentUser: authUser,
  });

  // Calculate local stats based on visible users and meta
  const stats = useMemo(() => ({
    active: visibleUsers.filter((u) => u.is_active).length,
    inactive: visibleUsers.filter((u) => !u.is_active).length,
    total: meta?.total || visibleUsers.length,
  }), [visibleUsers, meta]);

  // --- 3. Initial Load ---
  useEffect(() => {
    if (authUser) {
      refreshData().finally(() => {
        setTimeout(() => setIsFirstLoad(false), 800);
      });
    }
  }, [authUser, refreshData]);

  // --- 4. Event Handlers ---
  const handleRoleChange = (roleId) => {
    setActiveRole(roleId);
    setSelectedIds([]);
    refreshData({ role: roleId, page: 1 });
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setSelectedIds([]);
    refreshData({ status, page: 1 });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteMany(idsToDelete);
      toast.success(idsToDelete.length === 1 ? "User removed" : "Users removed");
      setDeleteOpen(false);
      setSelectedIds([]);
      setIdsToDelete([]);
      refreshData({ page: meta?.current_page || 1 });
    } catch {
      toast.error("Operation failed");
    } finally {
      setDeleting(false);
    }
  };

  if (!authUser) return null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#F8FAFC] p-4 lg:p-8 space-y-8 font-sans antialiased text-slate-900 animate-in fade-in duration-700">
      
      {/* INITIAL FULL SCREEN LOADER */}
      {isFirstLoad && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
          <ContentLoader title="System Users" subtitle="Securing directory access..." Icon={UserPlus} />
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1 w-6 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 leading-none">Access Management</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Directory</h1>
          <p className="text-slate-500 text-sm">Manage platform accounts, roles, and security status.</p>
        </div>

        <button 
          onClick={() => router.push("/admin/create/users")}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <UserPlus size={18} />
          ADD NEW ACCOUNT
        </button>
      </div>

      {/* STATS & QUICK STATUS FILTERS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: "all", label: "Total Records", value: meta?.total || 0, icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
          { id: "active", label: "Active Now", value: stats.active, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
          { id: "inactive", label: "Inactive", value: stats.inactive, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat) => (
          <button 
            key={stat.id} 
            onClick={() => handleStatusChange(stat.id)}
            className={`group text-left bg-white p-6 rounded-[2rem] border transition-all relative overflow-hidden ${
              activeStatus === stat.id ? "border-indigo-600 ring-4 ring-indigo-50" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{stat.label}</p>
            <h3 className="text-3xl font-black mt-2 text-slate-900">{stat.value}</h3>
          </button>
        ))}
      </div>

      {/* SEARCH & ROLE FILTERS BAR */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none shadow-sm"
            onChange={(e) => controller.handleSearchNameEmail(e.target.value)}
          />
          {isLoading && !isFirstLoad && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-600 animate-spin">
              <Loader2 size={20} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter Pills */}
          <div className="flex items-center gap-1 p-1.5 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
            {[
              { id: "all", label: "All", icon: Filter },
              { id: "owner", label: "Owners", icon: Crown },
              { id: "customer", label: "Customers", icon: UserIcon },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeRole === role.id 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                <role.icon size={12} />
                <span className="hidden sm:inline">{role.label}</span>
              </button>
            ))}
          </div>

          <UserFilterDropdown
  isOpen={isFilterOpen}
  setIsOpen={setIsFilterOpen}
  activeStatus={activeStatus} // ✅ Pass the current state here
  onFilterAll={() => handleStatusChange("all")}
  onFilterActive={() => handleStatusChange("active")}
  onFilterInactive={() => handleStatusChange("inactive")}
/>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="max-w-7xl mx-auto relative">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="absolute -top-16 left-0 right-0 z-20 flex justify-center animate-in slide-in-from-top-4">
            <div className="bg-slate-900 text-white px-8 py-3.5 rounded-full flex items-center gap-6 shadow-2xl border border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-widest">{selectedIds.length} Selection Active</span>
              <div className="h-4 w-px bg-slate-700" />
              <div className="flex gap-5">
                <button onClick={() => controller.handleBulkStatusUpdate(selectedIds, true)} className="hover:text-emerald-400 transition-colors" title="Activate"><ShieldCheck size={20} /></button>
                <button onClick={() => controller.handleBulkStatusUpdate(selectedIds, false)} className="hover:text-amber-400 transition-colors" title="Deactivate"><ShieldAlert size={20} /></button>
                <button onClick={() => { setIdsToDelete(selectedIds); setDeleteOpen(true); }} className="hover:text-red-400 transition-colors" title="Delete"><Trash2 size={20} /></button>
              </div>
              <button onClick={() => setSelectedIds([])} className="ml-2 text-slate-500 hover:text-white"><X size={16} /></button>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="pl-8 py-5 w-12 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      checked={visibleUsers.length > 0 && selectedIds.length === visibleUsers.length}
                      onChange={controller.toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Details</th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Access Level</th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Account Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-slate-50 transition-opacity duration-200 ${isLoading && !isFirstLoad ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                {visibleUsers.map((item) => (
                  <tr key={item.id} className={`${selectedIds.includes(item.id) ? 'bg-indigo-50/50' : 'hover:bg-indigo-50/30'} transition-colors group`}>
                    <td className="pl-8 py-5 text-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => controller.toggleSelectOne(item.id)}
                      />
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center text-white font-black ring-4 ring-white shadow-sm transition-transform group-hover:scale-105">
                          {item.avatar ? <Image src={item.avatar} alt="avatar" fill sizes="48px" className="object-cover" unoptimized /> : item.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-none mb-1.5">{item.name || "User Account"}</p>
                          <p className="text-slate-400 text-[11px] font-medium flex items-center gap-1 italic">
                            <Mail size={10} /> {item.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                        <div className="flex items-center gap-2 text-slate-600 text-[11px] font-bold">
                            <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                <Phone size={12} />
                            </div>
                            {formatPhoneNumber(item.phone)}
                        </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        item.role === 'owner' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {item.role === 'owner' && <Crown size={10} className="mr-1.5" />}
                        {item.role}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <StatusBadge isActive={item.is_active} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => router.push(`/admin/edit/users/${item.id}`)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => { setIdsToDelete([item.id]); setDeleteOpen(true); }} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {visibleUsers.length === 0 && !isLoading && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Search size={40} className="mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">No matching records found</p>
                <button onClick={() => handleRoleChange('all')} className="mt-4 text-xs text-indigo-600 font-black uppercase underline decoration-2 underline-offset-4">Clear Filters</button>
              </div>
            )}
          </div>

          {/* PAGINATION FOOTER */}
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Total Directory Records: <span className="text-slate-900 ml-1">{meta?.total || 0}</span>
                  </p>
                  {isLoading && !isFirstLoad && <div className="text-indigo-600 animate-spin"><Loader2 size={18} /></div>}
              </div>
              
              <div className="flex items-center gap-3">
                  <button 
                      onClick={() => refreshData({ page: (meta?.current_page || 1) - 1 })}
                      disabled={meta?.current_page === 1 || isLoading}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                    <span className="text-[10px] font-black text-slate-900">PAGE {meta?.current_page || 1}</span>
                    <span className="text-slate-300 mx-2 text-[10px]">/</span>
                    <span className="text-[10px] font-black text-slate-400">{meta?.last_page || 1}</span>
                  </div>
                  
                  <button 
                      onClick={() => refreshData({ page: (meta?.current_page || 1) + 1 })}
                      disabled={meta?.current_page === meta?.last_page || isLoading}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <ChevronRight size={18} />
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

// Sub-component: Status Badge
function StatusBadge({ isActive }) {
  return isActive ? (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 tracking-widest">
       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
       Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200 tracking-widest">
       <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
       Disabled
    </span>
  );
}