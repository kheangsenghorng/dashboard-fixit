import { create } from "zustand";
import { ownerServiceService } from "../../services/owner/ownerServiceService";
import { fa } from "zod/v4/locales";

export const useServiceStoreCompany = create((set, get) => ({
  services: [],
  meta: null,
  serviceStats: null,
  loading: false,

  /*
  |--------------------------------------------------------------------------
  | Fetch Owner Services
  |--------------------------------------------------------------------------
  */
  fetchServices: async (params = {}) => {
    set({ loading: true });

    try {
      const res = await ownerServiceService.getAll(params);

      set({
        services: res.data.data,
        meta: res.data.meta,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch services error:", error);
      set({ loading: false });
    }
  },

  fetchOneService: async (id) => {
    try {
      const res = await ownerServiceService.getOne(id);
      return res.data.data;
    } catch (error) {
      console.error("Fetch service error:", error);
      throw error.response?.data || { message: "Failed to fetch service" };
    }
  },

  createService: async (data) => {
    try {
      const res = await ownerServiceService.create(data);

      set((state) => ({
        services: [res.data.data, ...state.services],
      }));

      return res.data;
    } catch (error) {
      console.error("Create service error:", error);
      throw error.response?.data || { message: "Failed to create service" };
    }
  },

  updateService: async (id, data) => {
    try {
      const res = await ownerServiceService.update(id, data);

      return res.data;
    } catch (error) {
      console.error("Update service error:", error);
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Fetch Owner Dashboard Stats
  |--------------------------------------------------------------------------
  */
  fetchStats: async () => {
    try {
      const res = await ownerServiceService.getCount();

      set({
        serviceStats: res.data.data,
      });
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Delete Multiple Services
  |--------------------------------------------------------------------------
  */
  deleteManyServices: async (ids) => {
    try {
      await Promise.all(ids.map((id) => ownerServiceService.remove(id)));

      set((state) => ({
        services: state.services.filter((s) => !ids.includes(s.id)),
      }));
    } catch (error) {
      console.error("Delete services error:", error);
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Bulk Status Update
  |--------------------------------------------------------------------------
  */
  updateManyStatus: async (ids, status) => {
    try {
      await ownerServiceService.updateManyStatus(ids, status);

      set((state) => ({
        services: state.services.map((s) =>
          ids.includes(s.id) ? { ...s, status } : s
        ),
      }));
    } catch (error) {
      console.error("Bulk status update error:", error);
    }
  },
}));
