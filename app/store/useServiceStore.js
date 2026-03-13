import { create } from "zustand";
import { serviceService } from "../services/serviceService";


export const useServiceStore = create((set) => ({
  services: [],
  serviceStats: {}, // add this
  service: null,
  loading: false,


  // Get all services
  fetchServices: async (params = {}) => {
    set({ loading: true });
  
    try {
      const res = await serviceService.getAll(params);
  
      set({
        services: res.data.data,
        loading: false,
      });
  
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  // Get all services
  fetchCount: async () => {
    set({ loading: true });
  
    try {
      const res = await serviceService.getCount();
  
      set({
        serviceStats: res.data.data, // store stats here
        loading: false,
      });
  
    } catch (error) {
      console.error("Fetch service stats error:", error);
      set({ loading: false });
    }
  },

  // Get single service
  fetchService: async (id) => {
    set({ loading: true });

    try {
      const res = await serviceService.getOne(id);

      set({
        service: res.data.data,
        loading: false,
      });

    } catch (error) {
      console.error("Fetch service error:", error);
      set({ loading: false });
    }
  },

  // Create service
  createService: async (data) => {
    try {
      await serviceService.create(data);
    } catch (error) {
      console.error("Create service error:", error);
    }
  },

  // Update service
  updateService: async (id, data) => {
    try {
      await serviceService.update(id, data);
    } catch (error) {
      console.error("Update service error:", error);
    }
  },

  // Delete service
  deleteService: async (id) => {
    try {
      await serviceService.remove(id);

      set((state) => ({
        services: state.services.filter((s) => s.id !== id),
      }));

    } catch (error) {
      console.error("Delete service error:", error);
    }
  },

  // Bulk delete
  deleteManyServices: async (ids) => {
    try {
      await serviceService.removeMany(ids);

      set((state) => ({
        services: state.services.filter((s) => !ids.includes(s.id)),
      }));

    } catch (error) {
      console.error("Bulk delete error:", error);
    }
  },

  // Bulk status update
  updateManyStatus: async (ids, status) => {
    try {
      await serviceService.updateManyStatus(ids, status);

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