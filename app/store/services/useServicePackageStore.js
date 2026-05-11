import { create } from "zustand";
import { servicePackageService } from "../../services/services/servicePackageService";

const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).flat().join(" ");
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};

const getListData = (res) => {
  return res.data?.data || res.data || [];
};

const getSingleData = (res) => {
  return res.data?.data || res.data || null;
};

export const useServicePackageStore = create((set, get) => ({
  items: [],
  item: null,

  // for included_items only
  inventoryItems: [],

  loading: false,
  error: null,

  getAll: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const res = await servicePackageService.getAll(params);

      set({
        items: getListData(res),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to fetch service packages"),
        loading: false,
      });

      return null;
    }
  },

  getOne: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await servicePackageService.getOne(id);

      set({
        item: getSingleData(res),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to fetch service package"),
        loading: false,
      });

      return null;
    }
  },

  getByServiceId: async (serviceId) => {
    set({ loading: true, error: null });

    try {
      const res = await servicePackageService.getByServiceId(serviceId);

      set({
        items: getListData(res),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(
          error,
          "Failed to fetch service packages by service"
        ),
        loading: false,
      });

      return null;
    }
  },

  // ✅ New: get only included_items by service id
  getByServiceIdInventory: async (serviceId) => {
    set({ loading: true, error: null });

    try {
      const res = await servicePackageService.getByServiceIdInventory(
        serviceId
      );

      const packages = res.data?.data || [];

      // API returns packages, so extract included_items from all packages
      const inventoryItems = packages
        .flatMap((pkg) => pkg.included_items || [])
        .map((item) => ({
          ...item,
          image: null,
          preview: item.image_url || null,
        }));

      set({
        inventoryItems,
        loading: false,
      });

      return inventoryItems;
    } catch (error) {
      set({
        inventoryItems: [],
        error: getErrorMessage(
          error,
          "Failed to fetch included items by service"
        ),
        loading: false,
      });

      return [];
    }
  },
  create: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await servicePackageService.create(data);

      await get().getAll();

      set({ loading: false });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to create service package"),
        loading: false,
      });

      return null;
    }
  },

  update: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const res = await servicePackageService.update(id, data);

      await get().getAll();

      set({ loading: false });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to update service package"),
        loading: false,
      });

      return null;
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await servicePackageService.remove(id);

      set({
        items: get().items.filter((item) => item.id !== id),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to delete service package"),
        loading: false,
      });

      return null;
    }
  },

  removeMany: async (ids) => {
    set({ loading: true, error: null });

    try {
      const res = await servicePackageService.removeMany(ids);

      set({
        items: get().items.filter((item) => !ids.includes(item.id)),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(
          error,
          "Failed to delete selected service packages"
        ),
        loading: false,
      });

      return null;
    }
  },

  updateManyStatus: async (ids, status) => {
    set({ loading: true, error: null });

    try {
      const res = await servicePackageService.updateManyStatus(ids, status);

      set({
        items: get().items.map((item) =>
          ids.includes(item.id) ? { ...item, status } : item
        ),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(
          error,
          "Failed to update selected service packages status"
        ),
        loading: false,
      });

      return null;
    }
  },

  setItem: (item) => {
    set({ item });
  },

  clearItem: () => {
    set({ item: null });
  },

  clearInventoryItems: () => {
    set({ inventoryItems: [] });
  },

  clearError: () => {
    set({ error: null });
  },
}));
