"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  HardHat,
  Search,
  Filter,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Pen,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

import { useProviderStore } from "../../../app/store/provider/providerStore";
import { useOwnerGuard } from "../../../app/hooks/useOwnerGuard";
import EditProviderModal from "../edit/provider/EditProviderModal";
import DeleteConfirmModal from "../../admin/DeleteConfirmModal";

export default function ProvidersPage() {
  const { ownerId, authUser, initialized } = useOwnerGuard();

  const { fetchProvidersByOwner, loading, error, providers, deleteProvider } =
    useProviderStore();

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (ownerId) {
      fetchProvidersByOwner(ownerId);
    }
  }, [ownerId, fetchProvidersByOwner]);

  console.log(providers);

  const filteredProviders = useMemo(() => {
    if (!searchTerm.trim()) return providers || [];

    const term = searchTerm.toLowerCase();

    return (providers || []).filter((provider) => {
      const userName = provider.user?.name || "";
      const businessName = provider.business_name || "";
      const categoryName = provider.category?.name || "";

      return (
        userName.toLowerCase().includes(term) ||
        businessName.toLowerCase().includes(term) ||
        categoryName.toLowerCase().includes(term)
      );
    });
  }, [providers, searchTerm]);

  const handleEditClick = (provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (provider) => {
    const providerId = provider.providerId || provider.id;

    if (!providerId) {
      toast.error("Provider ID not found.");
      return;
    }

    setIdsToDelete([providerId]);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!idsToDelete.length) {
      toast.warning("No provider selected.");
      return;
    }

    setDeleting(true);

    try {
      await Promise.all(idsToDelete.map((id) => deleteProvider(id)));

      toast.success(
        idsToDelete.length > 1
          ? "Providers deleted successfully!"
          : "Provider deleted successfully!"
      );

      setDeleteOpen(false);
      setIdsToDelete([]);

      if (ownerId) {
        await fetchProvidersByOwner(ownerId);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete provider.";

      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  if (!initialized || !authUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading providers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Service Providers
          </h1>
          <p className="text-slate-500 text-sm">
            Manage technicians, verify credentials, and monitor performance.
          </p>
        </div>

        <Link href="/owner/create/provider">
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95">
            <Plus size={18} />
            Register New Provider
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Providers",
            val: providers?.length || 0,
            icon: HardHat,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Active",
            val: providers?.filter((p) => p.status === "active").length || 0,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Inactive",
            val: providers?.filter((p) => p.status === "inactive").length || 0,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Avg Rating",
            val: "4.8",
            icon: Star,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>

              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className="text-xl font-bold text-slate-900">{stat.val}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search by name, business or specialty..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100">
                <th className="px-6 py-4">Provider / Business</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Total Jobs</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Status working</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => {
                  const providerId = provider.providerId || provider.id;
                  const providerName =
                    provider.user?.name || provider.name || "Provider";
                  const businessName =
                    provider.business_name || "No business name";
                  const categoryName = provider.category?.name || "No category";

                  return (
                    <tr
                      key={providerId}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                providerName
                              )}&background=6366f1&color=fff`}
                              alt="avatar"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {providerName}
                            </p>
                            <p className="text-[12px] text-slate-500 font-medium">
                              {businessName}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {categoryName}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span className="text-sm font-bold text-slate-900">
                            {provider.rating || 0}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {provider.total_jobs || 0} jobs
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            provider.status === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : provider.status === "inactive"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {provider.status === "active" && (
                            <CheckCircle2 size={12} />
                          )}
                          {provider.status === "inactive" && (
                            <Clock size={12} />
                          )}
                          {provider.status !== "active" &&
                            provider.status !== "inactive" && (
                              <AlertCircle size={12} />
                            )}
                          {provider.status || "unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {(() => {
                          const status =
                            provider?.bookingProviders?.[0]?.status ||
                            "unknown";

                          const statusConfig = {
                            assigned: {
                              label: "Assigned",
                              className: "bg-slate-50 text-slate-600",
                              icon: Clock,
                            },
                            accepted: {
                              label: "Accepted",
                              className: "bg-blue-50 text-blue-600",
                              icon: CheckCircle2,
                            },
                            on_the_way: {
                              label: "On the way",
                              className: "bg-indigo-50 text-indigo-600",
                              icon: Clock,
                            },
                            arrived: {
                              label: "Arrived",
                              className: "bg-cyan-50 text-cyan-600",
                              icon: CheckCircle2,
                            },
                            working: {
                              label: "Working",
                              className: "bg-amber-50 text-amber-600",
                              icon: Clock,
                            },
                            completed: {
                              label: "Completed",
                              className: "bg-emerald-50 text-emerald-600",
                              icon: CheckCircle2,
                            },
                            declined: {
                              label: "Declined",
                              className: "bg-rose-50 text-rose-600",
                              icon: AlertCircle,
                            },
                            unknown: {
                              label: "Unknown",
                              className: "bg-slate-50 text-slate-500",
                              icon: AlertCircle,
                            },
                          };

                          const config =
                            statusConfig[status] || statusConfig.unknown;
                          const StatusIcon = config.icon;

                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.className}`}
                            >
                              <StatusIcon size={12} />
                              {config.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 bg-transparent hover:bg-indigo-50 rounded-lg transition-all">
                            <ArrowUpRight size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(provider)}
                            className="p-2 text-slate-400 hover:text-indigo-600 bg-transparent hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <Pen size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteClick(provider)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No providers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditProviderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProvider(null);
        }}
        provider={selectedProvider}
      />

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
