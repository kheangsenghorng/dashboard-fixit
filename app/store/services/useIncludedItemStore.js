import { create } from "zustand";
import { includedItemService } from "../../services/services/includedItemService";

const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;

    return Object.values(errors).flat().join(" ");
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};

const getData = (res) => {
  return res.data?.data || res.data || [];
};

const getSingleData = (res) => {
  return res.data?.data || res.data || null;
};

export const useIncludedItemStore = create((set, get) => ({
  includedItems: [],
  includedItem: null,
  loading: false,
  error: null,

  getAll: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const res = await includedItemService.getAll(params);

      set({
        includedItems: getData(res),
        loading: false,
      });

      return res.data;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch included items");

      set({
        error: message,
        loading: false,
      });

      return null;
    }
  },

  getOne: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await includedItemService.getOne(id);

      set({
        includedItem: getSingleData(res),
        loading: false,
      });

      return res.data;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch included item");

      set({
        error: message,
        loading: false,
      });

      return null;
    }
  },

  create: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await includedItemService.create(data);

      await get().getAll();

      set({ loading: false });

      return res.data;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to create included item");

      set({
        error: message,
        loading: false,
      });

      return null;
    }
  },

  update: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const res = await includedItemService.update(id, data);

      await get().getAll();

      set({ loading: false });

      return res.data;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to update included item");

      set({
        error: message,
        loading: false,
      });

      return null;
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await includedItemService.remove(id);

      set({
        includedItems: get().includedItems.filter((item) => item.id !== id),
        loading: false,
      });

      return res.data;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to delete included item");

      set({
        error: message,
        loading: false,
      });

      return null;
    }
  },

  setIncludedItem: (includedItem) => {
    set({ includedItem });
  },

  clearIncludedItem: () => {
    set({ includedItem: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
