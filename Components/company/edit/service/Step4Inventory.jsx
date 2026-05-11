"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  Box,
  Upload,
  AlertCircle,
  Loader2,
  Search,
  PackageCheck,
  Image as ImageIcon,
  Save,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { useServicePackageStore } from "../../../../app/store/services/useServicePackageStore";
import { usePackageIncludedItemStore } from "../../../../app/store/services/usePackageIncludedItemStore";
import { useIncludedItemStore } from "../../../../app/store/services/useIncludedItemStore";

const InventorySkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="h-32 w-full bg-slate-100 animate-pulse rounded-3xl" />
      <div className="h-72 w-full bg-white border border-slate-100 rounded-3xl p-8" />
    </div>
  );
};

const createEmptyItem = (serviceId, sortOrder) => ({
  id: null,
  service_id: Number(serviceId),
  name: "",
  description: "",
  status: "active",
  sort_order: sortOrder,
  image: null,
  preview: null,
  image_url: null,
});

const getItemKey = (item, index) => item.id || `temp-${index}`;

const normalizeItems = (items = [], serviceId) => {
  return items.map((item, index) => ({
    ...item,
    id: item.id || null,
    service_id: item.service_id || serviceId,
    name: item.name || "",
    description: item.description || "",
    image_url: item.image_url || null,
    status: item.status || "active",
    sort_order: item.sort_order || index + 1,
    preview: null,
    image: null,
  }));
};

const buildIncludedItemPayload = ({ item, serviceId, index }) => {
  const payload = new FormData();

  payload.append("service_id", Number(serviceId));
  payload.append("name", item.name);
  payload.append("description", item.description || "");
  payload.append("status", item.status || "active");
  payload.append("sort_order", index + 1);

  if (item.image instanceof File) {
    payload.append("image", item.image);
  }

  return payload;
};

export default function Step4Inventory({
  formData,
  setFormData,
  isLoading = false,
}) {
  const params = useParams();
  const serviceId = params?.id;

  const {
    items: packageData = [],
    loading: servicePackageLoading,
    error,
    clearError,
    getByServiceIdInventory,
  } = useServicePackageStore();

  const {
    create: createIncludedItem,
    update: updateIncludedItem,
    remove: removeIncludedItem,
  } = useIncludedItemStore();

  const {
    create: attachIncludedItemToPackage,
    loading: packageIncludedItemLoading,
  } = usePackageIncludedItemStore();

  const [savingItemKey, setSavingItemKey] = useState(null);
  const [deletingItemKey, setDeletingItemKey] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const includedItems = Array.isArray(formData.included_items)
    ? formData.included_items
    : [];

  const activePackage = useMemo(() => {
    return packageData.find(
      (pkg) => Number(pkg.id) === Number(formData.package_id)
    );
  }, [packageData, formData.package_id]);

  const setActivePackageToForm = useCallback(
    (activePkg) => {
      if (!activePkg) return;

      setFormData((prev) => ({
        ...prev,
        package_id: activePkg.id,
        selected_package: activePkg,
        included_items: normalizeItems(
          activePkg.included_items || [],
          serviceId
        ),
      }));
    },
    [setFormData, serviceId]
  );

  const refreshInventoryStore = useCallback(
    async (packageId = formData.package_id) => {
      if (!serviceId) return null;

      setRefreshing(true);

      try {
        const res = await getByServiceIdInventory(serviceId);
        const freshPackages = res?.data || [];

        const activePkg =
          freshPackages.find((pkg) => Number(pkg.id) === Number(packageId)) ||
          freshPackages[0];

        if (activePkg) {
          setActivePackageToForm(activePkg);
        }

        return activePkg || null;
      } finally {
        setRefreshing(false);
      }
    },
    [
      serviceId,
      formData.package_id,
      getByServiceIdInventory,
      setActivePackageToForm,
    ]
  );

  useEffect(() => {
    refreshInventoryStore();
  }, [refreshInventoryStore]);

  useEffect(() => {
    if (!packageData.length || formData.package_id) return;

    setActivePackageToForm(packageData[0]);
  }, [packageData, formData.package_id, setActivePackageToForm]);

  const switchPackage = (pkgId) => {
    const selectedPackage = packageData.find(
      (pkg) => Number(pkg.id) === Number(pkgId)
    );

    if (!selectedPackage) return;

    setActivePackageToForm(selectedPackage);
    setSearchTerm("");
    setStatusFilter("all");
  };

  const filteredItems = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return includedItems
      .map((item, originalIndex) => ({ ...item, originalIndex }))
      .filter((item) => {
        const matchesSearch =
          !keyword ||
          item.name?.toLowerCase().includes(keyword) ||
          item.description?.toLowerCase().includes(keyword);

        const matchesStatus =
          statusFilter === "all" || item.status === statusFilter;

        return matchesSearch && matchesStatus;
      });
  }, [includedItems, searchTerm, statusFilter]);

  const addItem = () => {
    if (!formData.package_id) {
      toast.error("Please select a package first");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      included_items: [
        ...(prev.included_items || []),
        createEmptyItem(serviceId, (prev.included_items?.length || 0) + 1),
      ],
    }));
  };

  const updateItem = (index, key, value) => {
    setFormData((prev) => {
      const newItems = [...(prev.included_items || [])];

      newItems[index] = {
        ...newItems[index],
        [key]: value,
      };

      return {
        ...prev,
        included_items: newItems,
      };
    });
  };

  const handleItemImage = (index, file) => {
    if (!file) return;

    setFormData((prev) => {
      const newItems = [...(prev.included_items || [])];

      newItems[index] = {
        ...newItems[index],
        image: file,
        preview: URL.createObjectURL(file),
      };

      return {
        ...prev,
        included_items: newItems,
      };
    });
  };

  const handleSaveItem = async (item, index) => {
    if (!formData.package_id) {
      toast.error("Please select a package first");
      return;
    }

    if (!item.name?.trim()) {
      toast.error("Item name is required");
      return;
    }

    const itemKey = getItemKey(item, index);
    setSavingItemKey(itemKey);

    try {
      const payload = buildIncludedItemPayload({
        item,
        serviceId,
        index,
      });

      const res = item.id
        ? await updateIncludedItem(item.id, payload)
        : await createIncludedItem(payload);

      if (!res) return;

      const newItemId = item.id || res?.data?.id || res?.id;

      if (!item.id && newItemId) {
        await attachIncludedItemToPackage({
          package_id: Number(formData.package_id),
          included_item_id: Number(newItemId),
          sort_order: index + 1,
        });
      }

      toast.success(item.id ? "Item updated" : "Item created");
      await refreshInventoryStore(formData.package_id);
    } catch (error) {
      toast.error("Failed to save item");
    } finally {
      setSavingItemKey(null);
    }
  };

  const handleRemoveItem = async (item, index) => {
    if (!item.id) {
      setFormData((prev) => ({
        ...prev,
        included_items: (prev.included_items || []).filter(
          (_, itemIndex) => itemIndex !== index
        ),
      }));

      return;
    }

    setDeletingItemKey(item.id);

    try {
      const res = await removeIncludedItem(item.id);

      if (!res) return;

      toast.success("Item deleted");
      await refreshInventoryStore(formData.package_id);
    } catch (error) {
      toast.error("Failed to delete item");
    } finally {
      setDeletingItemKey(null);
    }
  };

  if (isLoading || servicePackageLoading) {
    return <InventorySkeleton />;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-10 pb-24 px-4"
    >
      {/* Package Selector */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 ml-2">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-indigo-600 rounded-full" />

            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
              Select Package to Manage
            </h3>
          </div>

          <button
            type="button"
            onClick={() => refreshInventoryStore(formData.package_id)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-100 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packageData.map((pkg) => {
            const isActive = Number(formData.package_id) === Number(pkg.id);

            return (
              <button
                type="button"
                key={pkg.id}
                onClick={() => switchPackage(pkg.id)}
                className={`relative group p-6 rounded-3xl border transition-all text-left overflow-hidden ${
                  isActive
                    ? "bg-white border-indigo-200 shadow-xl shadow-indigo-100"
                    : "bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-200"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
                )}

                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-2xl ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-white border text-slate-400"
                    }`}
                  >
                    <PackageCheck size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-bold text-base truncate ${
                        isActive ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {pkg.title}
                    </h4>

                    <span className="text-[11px] font-black text-indigo-500 uppercase tracking-tighter">
                      {pkg.included_items?.length || 0} Items linked
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {packageData.length === 0 && (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <PackageCheck className="mx-auto text-slate-200 mb-4" size={50} />

            <h3 className="text-slate-400 font-black uppercase tracking-widest text-sm">
              No packages found
            </h3>
          </div>
        )}
      </div>

      {/* Header + Filters */}
      <div className="bg-slate-900 rounded-[3rem] p-8 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {activePackage?.title || "Package"}{" "}
            <span className="text-indigo-400">Inventory</span>
          </h2>

          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
            Showing {filteredItems.length} items
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />

            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-indigo-400 transition-all"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-xs font-black text-white uppercase outline-none"
          >
            <option className="text-slate-900" value="all">
              All Status
            </option>
            <option className="text-slate-900" value="active">
              Active
            </option>
            <option className="text-slate-900" value="inactive">
              Inactive
            </option>
          </select>

          <button
            type="button"
            onClick={addItem}
            disabled={!formData.package_id}
            className="w-full sm:w-auto bg-indigo-500 disabled:bg-slate-600 disabled:text-slate-400 hover:bg-indigo-400 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            New Item
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={22} className="text-red-500 mt-0.5" />

            <div>
              <h4 className="font-black text-red-700 uppercase text-xs tracking-widest">
                Failed to load inventory
              </h4>

              <p className="text-red-600 text-sm font-bold mt-1">{error}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearError}
            className="text-red-500 font-black text-xs uppercase"
          >
            Close
          </button>
        </div>
      )}

      {/* Item List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const itemKey = getItemKey(item, item.originalIndex);
            const isSaving = savingItemKey === itemKey;
            const isDeleting = deletingItemKey === item.id;

            return (
              <motion.div
                layout
                key={itemKey}
                className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <label className="relative w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-400 cursor-pointer overflow-hidden shrink-0">
                  {item.preview || item.image_url ? (
                    <Image
                      src={item.preview || item.image_url}
                      fill
                      className="object-cover"
                      alt={item.name || "included item"}
                      unoptimized
                    />
                  ) : (
                    <Upload size={20} className="text-slate-300" />
                  )}

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(event) =>
                      handleItemImage(
                        item.originalIndex,
                        event.target.files?.[0]
                      )
                    }
                  />
                </label>

                <div className="flex-1 space-y-2 w-full">
                  <input
                    className="w-full text-lg font-black text-slate-800 bg-transparent outline-none border-b border-transparent focus:border-indigo-500"
                    value={item.name || ""}
                    placeholder="Item Name"
                    onChange={(event) =>
                      updateItem(item.originalIndex, "name", event.target.value)
                    }
                  />

                  <input
                    className="w-full text-sm font-medium text-slate-500 bg-transparent outline-none"
                    value={item.description || ""}
                    placeholder="Description or specs..."
                    onChange={(event) =>
                      updateItem(
                        item.originalIndex,
                        "description",
                        event.target.value
                      )
                    }
                  />

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <Box size={13} />
                    Sort order: {item.originalIndex + 1}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={item.status || "active"}
                    onChange={(event) =>
                      updateItem(
                        item.originalIndex,
                        "status",
                        event.target.value
                      )
                    }
                    className="bg-slate-50 text-[10px] font-black uppercase px-4 py-2 rounded-xl outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleSaveItem(item, item.originalIndex)}
                    disabled={
                      isSaving ||
                      packageIncludedItemLoading ||
                      servicePackageLoading
                    }
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item, item.originalIndex)}
                    disabled={isDeleting}
                    className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <ImageIcon className="mx-auto text-slate-200 mb-4" size={50} />

            <h3 className="text-slate-400 font-black uppercase tracking-widest text-sm">
              {formData.package_id
                ? "No items found in this package"
                : "Select package first"}
            </h3>

            {formData.package_id && (
              <button
                type="button"
                onClick={addItem}
                className="mt-5 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Add First Item
              </button>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
