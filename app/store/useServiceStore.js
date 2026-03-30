import { create } from "zustand";
import { serviceService } from "../services/serviceService";

export const useServiceStore = create((set, get) => ({
  services: [],
  activeServices: [],
  serviceStats: {},
  service: null,
  loading: false,

  // local setters for realtime
  setServices: (services) =>
    set({
      services,
    }),

  setActiveServices: (activeServices) =>
    set({
      activeServices,
    }),

  setServiceStats: (serviceStats) =>
    set({
      serviceStats,
    }),

  addService: (newService) =>
    set((state) => {
      const existsInServices = state.services.some(
        (s) => s.id === newService.id
      );
      const existsInActive = state.activeServices.some(
        (s) => s.id === newService.id
      );

      return {
        services: existsInServices
          ? state.services
          : [newService, ...state.services],
        activeServices:
          newService.status === "active"
            ? existsInActive
              ? state.activeServices
              : [newService, ...state.activeServices]
            : state.activeServices,
      };
    }),

  replaceService: (updatedService) =>
    set((state) => {
      const existsInServices = state.services.some(
        (s) => s.id === updatedService.id
      );
      const existsInActive = state.activeServices.some(
        (s) => s.id === updatedService.id
      );

      return {
        services: existsInServices
          ? state.services.map((s) =>
              s.id === updatedService.id ? updatedService : s
            )
          : [updatedService, ...state.services],

        activeServices:
          updatedService.status === "active"
            ? existsInActive
              ? state.activeServices.map((s) =>
                  s.id === updatedService.id ? updatedService : s
                )
              : [updatedService, ...state.activeServices]
            : state.activeServices.filter((s) => s.id !== updatedService.id),

        service:
          state.service?.id === updatedService.id
            ? updatedService
            : state.service,
      };
    }),

  removeService: (id) =>
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
      activeServices: state.activeServices.filter((s) => s.id !== id),
      service: state.service?.id === id ? null : state.service,
    })),

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
      console.error("Fetch services error:", error);
      set({ loading: false });
    }
  },

  // Get active services
  fetchActiveServices: async (params = {}) => {
    set({ loading: true });

    try {
      const res = await serviceService.getActive(params);

      set({
        activeServices: res.data.data,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch active services error:", error);
      set({ loading: false });
    }
  },

  // Get stats
  fetchCount: async () => {
    set({ loading: true });

    try {
      const res = await serviceService.getCount();

      set({
        serviceStats: res.data.data,
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
      const res = await serviceService.create(data);

      if (res.data?.data) {
        get().addService(res.data.data);
      }

      return res.data;
    } catch (error) {
      console.error("Create service error:", error);
      throw error;
    }
  },

  // Update service
  updateService: async (id, data) => {
    try {
      const res = await serviceService.update(id, data);

      if (res.data?.data) {
        get().replaceService(res.data.data);
      }

      return res.data;
    } catch (error) {
      console.error("Update service error:", error);
      throw error;
    }
  },

  // Delete service
  deleteService: async (id) => {
    try {
      await serviceService.remove(id);

      get().removeService(id);
    } catch (error) {
      console.error("Delete service error:", error);
      throw error;
    }
  },

  // Bulk delete
  deleteManyServices: async (ids) => {
    try {
      await serviceService.removeMany(ids);

      set((state) => ({
        services: state.services.filter((s) => !ids.includes(s.id)),
        activeServices: state.activeServices.filter((s) => !ids.includes(s.id)),
        service: ids.includes(state.service?.id) ? null : state.service,
      }));
    } catch (error) {
      console.error("Bulk delete error:", error);
      throw error;
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
        activeServices:
          status === "active"
            ? state.activeServices
            : state.activeServices.filter((s) => !ids.includes(s.id)),
        service:
          state.service && ids.includes(state.service.id)
            ? { ...state.service, status }
            : state.service,
      }));
    } catch (error) {
      console.error("Bulk status update error:", error);
      throw error;
    }
  },

  /////////////
  //public
  ///////////

  //Get service by category

  fetchServicesCategory: async (categoryId) => {
    set({ loading: true });

    try {
      const res = await serviceService.getServiesByCategory(categoryId);

      set({
        activeServices: res.data.data,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch active services error:", error);
      set({ loading: false });
    }
  },

  fetchServicesType: async (typeId) => {
    try {
      const res = await serviceService.getServicesByType(typeId);

      set({
        activeServices: res?.data?.data || [],
      });
    } catch (error) {
      console.error("Fetch services by type error:", error);
      set({ activeServices: [] });
    }
  },
}));
