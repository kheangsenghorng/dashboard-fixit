"use client";

import React, { useEffect, useState } from "react";
import { 
  UserPlus, Search, MoreVertical, Mail, 
  CheckCircle2, Clock, Trash2, Phone, ChevronLeft, ChevronRight, 
  ShieldCheck, ShieldAlert, Shield,
  Filter,
  ChevronDown,
  Pencil,
} from "lucide-react";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useUsersStore } from "../../store/useUsersStore";
import { createUserTableController } from "@/app/controllers/userTableController";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import { toast } from "react-toastify";
import UserFilterDropdown from "../../../Components/admin/UserFilterDropdown";

export default function UsersPage() {
  const { user } = useAuthGuard();
  const router = useRouter();

  const {
    fetchUsers,
    fetchFiltersIsActiveFalse,
    setSearchTerm,
    users,
    meta,
    isLoading,
    deleteMany,
    updateManyStatus,
  } = useUsersStore();

  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initialize the controller
  const controller = createUserTableController({
    users,
    meta,
    setSelectedIds,
    fetchUsers,
    deleteMany,
    updateManyStatus,
    setSearchTerm,
    fetchFiltersIsActiveFalse,
  });

  const activeCount = users.filter(u => u.is_active).length;
  const inactiveCount = users.filter(u => !u.is_active).length;

  // Handles the actual API call after modal confirmation
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteMany(idsToDelete);
      toast.success(
        idsToDelete.length === 1
          ? "User deleted successfully"
          : `${idsToDelete.length} users deleted successfully`
      );
      setDeleteOpen(false);
      setSelectedIds([]); // Clear checkboxes
      setIdsToDelete([]); // Clear deletion queue
      fetchUsers({ page: meta?.current_page || 1 }); // Refresh data
    } catch (error) {
      toast.error("Failed to delete users");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchUsers({ page: 1 });
  }, [fetchUsers]);

  if (isLoading && users.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#002B5B] z-50">
        <div className="w-20 h-20 border-4 border-[#FF6B00]/10 border-t-[#FF6B00] rounded-full animate-spin"></div>
        <p className="mt-8 text-[#FF6B00] text-xs font-black tracking-[0.4em] uppercase">Initializing Engine</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-[#FF6B00] rounded-full"></span>
            <span className="text-[10px] font-black tracking-[0.2em] text-[#FF6B00] uppercase">System Administration</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Users</h1>
        </div>
        <button
          onClick={() => router.push("/admin/create/users")}
          className="group flex items-center justify-center gap-3 bg-[#0056D2] hover:bg-[#0047b3] text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
        >
          <UserPlus size={18} /> ADD NEW USER
        </button>
      </header>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={controller.handleClearFilter} className="cursor-pointer bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Shield size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Records</p>
            <p className="text-3xl font-black text-slate-900">{meta?.total || users.length}</p>
          </div>
        </div>
        <div onClick={controller.handleFilterActive} className="cursor-pointer bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-emerald-200 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Now</p>
            <p className="text-3xl font-black text-slate-900">{activeCount}</p>
          </div>
        </div>
        <div onClick={controller.handleFilterInactive} className="cursor-pointer bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-amber-200 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inactive</p>
            <p className="text-3xl font-black text-slate-900">{inactiveCount}</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Search directory..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-transparent rounded-[2rem] text-sm font-medium outline-none focus:bg-white focus:border-slate-200 transition-all"
            onChange={(e) => controller.handleSearchNameEmail(e.target.value)}
          />
        </div>
        <UserFilterDropdown
    isOpen={isFilterOpen}
    setIsOpen={setIsFilterOpen}
    onFilterAll={controller.handleClearFilter}
    onFilterActive={controller.handleFilterActive}
    onFilterInactive={controller.handleFilterInactive}
  />
      </div>

      {/* TABLE CONTAINER */}
      <div className="relative bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-200">
        
        {/* CONTEXTUAL BULK ACTIONS BAR */}
        {selectedIds.length > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/20 animate-in slide-in-from-top-4">
            <span className="text-xs font-bold border-r border-white/20 pr-4 mr-2">{selectedIds.length} Selected</span>
            <button onClick={() => controller.handleBulkStatusUpdate(selectedIds, true)} className="p-2 hover:text-green-400"><ShieldCheck size={20}/></button>
            <button onClick={() => controller.handleBulkStatusUpdate(selectedIds, false)} className="p-2 hover:text-amber-400"><ShieldAlert size={20}/></button>
            {/* FIXED LINE BELOW: We call the local state setters, not a missing controller function */}
            <button 
              onClick={() => {
                setIdsToDelete(selectedIds); 
                setDeleteOpen(true);
              }} 
              className="p-2 hover:text-red-400"
            >
              <Trash2 size={20}/>
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-8 py-6 w-10">
                  <input type="checkbox" className="w-5 h-5 rounded-lg accent-[#0056D2]" checked={users.length > 0 && selectedIds.length === users.length} onChange={controller.toggleSelectAll} />
                </th>
                <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Access</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((item) => (
                <tr key={item.id} className={`${selectedIds.includes(item.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50/80'} transition-all group`}>
                  <td className="px-8 py-5">
                    <input type="checkbox" className="w-5 h-5 rounded-lg accent-[#0056D2]" checked={selectedIds.includes(item.id)} onChange={() => controller.toggleSelectOne(item.id)} />
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center text-white font-bold">
                        {item.avatar ? <Image src={item.avatar} alt="u" fill sizes="48px" className="object-cover" unoptimized /> : item.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.name || "User"}</p>
                        <p className="text-xs text-slate-400">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase">{item.role}</span>
                  </td>
                  <td className="px-6 py-5"><StatusBadge isActive={item.is_active} /></td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      {/* Edit Button */}
                      <button
                      onClick={() => router.push(`/admin/edit/users/${item.id}`)}
                      className="p-2.5 hover:bg-indigo-50 text-indigo-400 rounded-xl transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>


                      {/* Delete Button */}
                      <button 
                        onClick={() => { setIdsToDelete([item.id]); setDeleteOpen(true); }}
                        className="p-2.5 hover:bg-red-50 text-red-400 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-8 py-6 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total: {meta?.total}</p>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => controller.handlePageChange(meta?.current_page - 1)}
              disabled={meta?.current_page === 1}
              className="px-5 py-2.5 bg-white border rounded-xl text-[11px] font-bold disabled:opacity-30"
            >PREVIOUS</button>
            <span className="w-8 h-8 flex items-center justify-center bg-[#0056D2] text-white rounded-lg text-xs font-bold">{meta?.current_page}</span>
            <button 
              onClick={() => controller.handlePageChange(meta?.current_page + 1)}
              disabled={meta?.current_page === meta?.last_page}
              className="px-5 py-2.5 bg-[#0056D2] text-white rounded-xl text-[11px] font-bold disabled:opacity-30 shadow-lg"
            >NEXT</button>
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

function StatusBadge({ isActive }) {
  return isActive ? (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-gray-100 text-gray-400 border border-gray-200">
      <Clock size={12} /> Inactive
    </span>
  );
}