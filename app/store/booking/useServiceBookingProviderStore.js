import { create } from "zustand";
import { serviceBookingProviderService } from "../../services/booking/serviceBookingProviderService";

// FIX: toArray was used in createServiceBookingProvider and removeServiceBookingProvider
// but never defined — caused ReferenceError at runtime.
const toArray = (val) => (Array.isArray(val) ? val : []);

export const useServiceBookingProviderStore = create((set, get) => ({
  serviceBookingProviders: [],
  serviceBookingProvider: null,
  loading: false,
  error: null,

  // Add service booking provider from real-time event
  addServiceBookingProvider: (item) => {
    if (!item) return;

    set({
      serviceBookingProviders: [
        item,
        ...get().serviceBookingProviders.filter(
          (current) => current.id !== item.id
        ),
      ],
      serviceBookingProvider: item,
    });
  },

  // Replace service booking provider from real-time event
  replaceServiceBookingProvider: (item) => {
    if (!item) return;

    set({
      serviceBookingProviders: get().serviceBookingProviders.map((current) =>
        current.id === item.id ? item : current
      ),
      serviceBookingProvider:
        get().serviceBookingProvider?.id === item.id
          ? item
          : get().serviceBookingProvider,
    });
  },

  // Remove service booking provider from store only
  removeServiceBookingProviderFromStore: (id) => {
    if (!id) return;

    set({
      serviceBookingProviders: get().serviceBookingProviders.filter(
        (current) => current.id !== Number(id)
      ),
      serviceBookingProvider:
        get().serviceBookingProvider?.id === Number(id)
          ? null
          : get().serviceBookingProvider,
    });
  },

  // Get all service booking providers
  getAllServiceBookingProviders: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await serviceBookingProviderService.getAll(params);

      set({
        serviceBookingProviders: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to fetch service booking providers",
        loading: false,
      });

      throw error;
    }
  },

  // Get single service booking provider
  getServiceBookingProvider: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await serviceBookingProviderService.getOne(id);

      set({
        serviceBookingProvider: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to fetch service booking provider",
        loading: false,
      });

      throw error;
    }
  },

  // Get providers by booking ID
  getProvidersByBookingId: async (bookingId) => {
    set({ loading: true, error: null });

    try {
      const response = await serviceBookingProviderService.getByBookingId(
        bookingId
      );

      set({
        serviceBookingProviders: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to fetch providers by booking ID",
        loading: false,
      });

      throw error;
    }
  },

  // Get bookings by provider ID
  getBookingsByProviderId: async (providerId) => {
    set({ loading: true, error: null });

    try {
      const response = await serviceBookingProviderService.getByProviderId(
        providerId
      );

      set({
        serviceBookingProviders: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to fetch bookings by provider ID",
        loading: false,
      });

      throw error;
    }
  },

  // Create service booking provider
  createServiceBookingProvider: async (data) => {
    set({ loading: true, error: null });

    try {
      const response = await serviceBookingProviderService.create(data);

      const createdItem = response.data?.data || response.data;
      const currentItems = toArray(get().serviceBookingProviders);

      set({
        serviceBookingProviders: [
          createdItem,
          ...currentItems.filter(
            (item) => Number(item.id) !== Number(createdItem.id)
          ),
        ],
        serviceBookingProvider: createdItem,
        loading: false,
      });

      return createdItem;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to create service booking provider",
        loading: false,
      });

      throw error;
    }
  },

  // Update service booking provider
  updateServiceBookingProvider: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const response = await serviceBookingProviderService.update(id, data);

      // FIX: unwrap response consistently with createServiceBookingProvider
      const updatedItem = response.data?.data || response.data;

      set({
        serviceBookingProviders: get().serviceBookingProviders.map((item) =>
          Number(item.id) === Number(id) ? updatedItem : item
        ),
        serviceBookingProvider: updatedItem,
        loading: false,
      });

      return updatedItem;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to update service booking provider",
        loading: false,
      });

      throw error;
    }
  },

  // Patch service booking provider
  patchServiceBookingProvider: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const response = await serviceBookingProviderService.patch(id, data);

      // FIX: unwrap response consistently with createServiceBookingProvider
      const patchedItem = response.data?.data || response.data;

      set({
        serviceBookingProviders: get().serviceBookingProviders.map((item) =>
          Number(item.id) === Number(id) ? patchedItem : item
        ),
        serviceBookingProvider: patchedItem,
        loading: false,
      });

      return patchedItem;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to update service booking provider",
        loading: false,
      });

      throw error;
    }
  },

  // Delete service booking provider
  removeServiceBookingProvider: async (id) => {
    set({ loading: true, error: null });

    try {
      await serviceBookingProviderService.remove(id);

      const currentItems = toArray(get().serviceBookingProviders);

      set({
        serviceBookingProviders: currentItems.filter(
          (item) => Number(item.id) !== Number(id)
        ),
        serviceBookingProvider:
          Number(get().serviceBookingProvider?.id) === Number(id)
            ? null
            : get().serviceBookingProvider,
        loading: false,
      });

      return true;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to delete service booking provider",
        loading: false,
      });

      throw error;
    }
  },

  // Clear selected item
  clearServiceBookingProvider: () => {
    set({ serviceBookingProvider: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
