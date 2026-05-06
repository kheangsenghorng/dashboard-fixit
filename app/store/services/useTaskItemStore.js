import { create } from "zustand";
import { taskItemService } from "../../services/services/taskItemService";

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

export const useTaskItemStore = create((set, get) => ({
  items: [],
  item: null,
  loading: false,
  error: null,

  getAll: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const res = await taskItemService.getAll(params);

      set({
        items: getListData(res),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to fetch task items"),
        loading: false,
      });

      return null;
    }
  },

  getOne: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await taskItemService.getOne(id);

      set({
        item: getSingleData(res),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to fetch task item"),
        loading: false,
      });

      return null;
    }
  },

  create: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await taskItemService.create(data);

      await get().getAll();

      set({ loading: false });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to create task item"),
        loading: false,
      });

      return null;
    }
  },

  update: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const res = await taskItemService.update(id, data);

      await get().getAll();

      set({ loading: false });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to update task item"),
        loading: false,
      });

      return null;
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await taskItemService.remove(id);

      set({
        items: get().items.filter((item) => item.id !== id),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to delete task item"),
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

  clearError: () => {
    set({ error: null });
  },
}));
