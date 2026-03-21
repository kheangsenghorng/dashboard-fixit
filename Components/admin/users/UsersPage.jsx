"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  UserPlus,
  Search,
  Trash2,
  Pencil,
  Phone,
  Users,
  Activity,
  ShieldHalf,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  X,
  ShieldCheck,
  ShieldAlert,
  Command,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Store & Hooks
import { useUsersStore } from "../../../app/store/useUsersStore";
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { formatPhoneNumber } from "../../../app/utils/phoneUtils";

// Custom Sub-Components
import DeleteConfirmModal from "../../../Components/admin/DeleteConfirmModal";
import ContentLoader from "../../ContentLoader";
import { encodeId } from "../../../app/utils/hashids";

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

  // Filtering State
  const [activeRole, setActiveRole] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [searchValue, setSearchValue] = useState(searchTerm || "");

  // Initial Fetch
  useEffect(() => {
    if (authUser) {
      refreshData().finally(() => setIsFirstLoad(false));
    }
  }, [authUser, activeRole, activeStatus]);

  const buildParams = useCallback(
    (overrides = {}) => {
      const params = {
        page: overrides.page ?? 1,
      };

      if (searchValue?.trim()) {
        params.search = searchValue.trim();
      }

      if (activeRole !== "all") {
        params.role = activeRole;
      }

      if (activeStatus !== "all") {
        params.is_active = activeStatus === "active";
      }

      return params;
    },
    [searchValue, activeRole, activeStatus]
  );

  const refreshData = async (overrides = {}) => {
    await fetchUsers(buildParams(overrides));
  };

  // Selection Logic
  const selectedIds = useMemo(() => Array.from(selectedSet), [selectedSet]);
  const isAllSelected = useMemo(
    () => users.length > 0 && users.every((u) => selectedSet.has(u.id)),
    [users, selectedSet]
  );

  const toggleSelectOne = (id) => {
    const next = new Set(selectedSet);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedSet(next);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!isFirstLoad) refreshData({ page: 1 });
    }, 500);

    return () => clearTimeout(delay);
  }, [searchValue]);

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedSet(new Set());
    else setSelectedSet(new Set(users.map((u) => u.id)));
  };

  const handleBulkStatusUpdate = async (isActive) => {
    try {
      await updateManyStatus({ ids: selectedIds, is_active: isActive });
      toast.success(isActive ? "Accounts activated" : "Accounts disabled");
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
      toast.success("Record(s) removed");
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
        label: "Total Users",
        value: counts?.total || 0,
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        id: "owner",
        label: "Owners",
        value: counts?.owners || 0,
        icon: Activity,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        id: "provider",
        label: "Providers",
        value: counts?.providers || 0,
        icon: ShieldHalf,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        id: "customer",
        label: "Customers",
        value: counts?.customers || 0,
        icon: UserCheck,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
    ],
    [counts]
  );

  if (!authUser) return null;

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] p-4 lg:p-8 space-y-8 font-sans antialiased text-slate-900 pb-24">
      {isFirstLoad && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
          <ContentLoader
            title="User Directory"
            subtitle="Loading registry..."
            Icon={Users}
          />
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            User Registry
          </h1>
          <p className="text-slate-500 text-sm">
            Review and audit account access.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/create/users")}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
        >
          <UserPlus size={18} />
          ADD USER
        </button>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <button
            key={index + 1}
            onClick={() => {
              setActiveRole(stat.id);
              setSelectedSet(new Set());
            }}
            className={`group text-left bg-white p-6 rounded-2xl border transition-all ${
              activeRole === stat.id
                ? "border-indigo-500 ring-2 ring-indigo-50"
                : "border-slate-200 hover:border-indigo-200 shadow-sm"
            }`}
          >
            <div
              className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {stat.label}
            </p>
            <h3 className="text-3xl font-black mt-1 text-slate-900">
              {stat.value}
            </h3>
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      {/* SEARCH + STATUS FILTER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
        {/* SEARCH */}
        <div className="relative group flex-1">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && refreshData({ page: 1 })}
            className="w-full pl-14 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-[14px] font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
          />
        </div>

        {/* STATUS DROPDOWN */}
        <select
          value={activeStatus}
          onChange={(e) => {
            setActiveStatus(e.target.value);
            setSelectedSet(new Set());
          }}
          className="px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto relative">
        <div
          className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm ${
            isLoading ? "opacity-60" : "opacity-100"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 font-sans">
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    CP NO
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    User Identity
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((item, index) => (
                  <tr
                    key={index + 1}
                    className={`hover:bg-indigo-50/20 transition-colors group ${
                      selectedSet.has(item.id) ? "bg-indigo-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={selectedSet.has(item.id)}
                        onChange={() => toggleSelectOne(item.id)}
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                      #{String(index + 1).padStart(3, "0")}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        {/* USER IDENTITY WITH AVATAR SUPPORT */}

                        {/* Avatar Container */}
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          {item.avatar ? (
                            <Image
                              src={item.avatar}
                              alt={item.name || "User"}
                              fill
                              className="object-cover"
                              unoptimized // Useful if loading from a local storage/IP address
                            />
                          ) : (
                            <span className="text-indigo-600 text-[10px] font-black">
                              {item.name?.charAt(0) || "U"}
                            </span>
                          )}
                        </div>

                        {/* Name and Email */}
                        <div className="leading-tight">
                          <p className="font-bold text-slate-900 text-xs truncate ">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium italic truncate ">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-tighter">
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                        <Phone size={10} className="text-slate-300" />
                        {formatPhoneNumber(item.phone) || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <StatusBadge isActive={item.is_active} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/edit/users/${encodeId(item.id)}`
                            )
                          }
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md border border-transparent hover:border-slate-100 shadow-sm"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setIdsToDelete([item.id]);
                            setDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-md border border-transparent hover:border-slate-100 shadow-sm"
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
                disabled={meta?.current_page === 1}
                onClick={() => refreshData({ page: meta.current_page - 1 })}
                className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[10px] font-black text-slate-900">
                {meta?.current_page || 1} / {meta?.last_page || 1}
              </span>
              <button
                disabled={meta?.current_page === meta?.last_page}
                onClick={() => refreshData({ page: meta.current_page + 1 })}
                className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50"
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
              initial={{ y: 50, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 50, x: "-50%", opacity: 0 }}
              className="fixed bottom-8 left-1/2 z-50 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl flex items-center gap-8 border border-slate-700"
            >
              <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
                <span className="bg-indigo-600 px-2 py-0.5 rounded text-[10px] font-black">
                  {selectedIds.length}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Selected
                </span>
              </div>

              <div className="flex gap-6">
                <button
                  onClick={() => handleBulkStatusUpdate(true)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-emerald-400 transition-colors"
                >
                  <ShieldCheck size={16} /> ACTIVATE
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate(false)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-amber-400 transition-colors"
                >
                  <ShieldAlert size={16} /> DISABLE
                </button>
                <button
                  onClick={() => {
                    setIdsToDelete(selectedIds);
                    setDeleteOpen(true);
                  }}
                  className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-rose-400 transition-colors"
                >
                  <Trash2 size={16} /> DELETE
                </button>
              </div>

              <button
                onClick={() => setSelectedSet(new Set())}
                className="p-1 hover:bg-slate-800 rounded-full transition-colors"
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

function StatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
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
      {isActive ? "Active" : "Disabled"}
    </span>
  );
}
