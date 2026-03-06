import { create } from "zustand";
import { typesService } from "../services/typesService";

export const useTypeStore = create((set, get) => ({
  types: [],
  activeTypes: [],
  type: null,
  meta: null,
  loading: false,

  // Fetch all
  fetchTypes: async (filters = {}) => {
    set({ loading: true });

    try {
      const res = await typesService.getAll(filters);

      set({
        types: res.data.data,
        meta: res.data.meta,
        loading: false,
      });

    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  // Fetch active
  fetchActiveTypes: async () => {
    try {
      const res = await typesService.getActive();
      set({ activeTypes: res.data.data });
    } catch (error) {
      console.error("Fetch active types error:", error);
    }
  },

  // Fetch single
  fetchType: async (id) => {
    try {
      const res = await typesService.getOne(id);
      set({ type: res.data.data });
    } catch (error) {
      console.error("Fetch type error:", error);
    }
  },
  createType: async (data) => {
    try {
      const res = await typesService.create(data);
      await get().fetchTypes();
      return res.data;
    } catch (error) {
        console.error("Create type error:", error);
      throw error;
    }
  },

  // Update
  updateType: async (id, payload) => {
    try {
     await typesService.updateType(id, payload);

      await get().fetchTypes();
    } catch (error) {
      console.error("Update type error:", error);
    }
  },

  // Delete
  deleteType: async (id) => {
    try {
      await typesService.remove(id);

      set((state) => ({
        types: state.types.filter((t) => t.id !== id),
      }));

    } catch (error) {
      console.error("Delete type error:", error);
    }
  },

  // Bulk delete
  deleteManyTypes: async (ids) => {
    try {
      await typesService.deleteMany(ids);
      await get().fetchTypes();
    } catch (error) {
      console.error("Bulk delete error:", error);
    }
  },

  // Bulk status
  updateManyStatus: async (ids, status) => {
    try {
      await typesService.updateManyStatus(ids, status);
      await get().fetchTypes();
    } catch (error) {
      console.error("Bulk status update error:", error);
    }
  },
}));