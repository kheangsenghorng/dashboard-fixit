import { create } from "zustand";
import { providerService } from "../../services/provider/providerServce";

export const useProviderStore = create((set, get) => ({
  providers: [],
  provider: null,
  loading: false,
  error: null,

  // Get all providers
  fetchProviders: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await providerService.getAll(params);

      set({
        providers: response.data.data || response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch providers",
        loading: false,
      });

      throw error;
    }
  },

  // Get single provider
  fetchProvider: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await providerService.getOne(id);

      set({
        provider: response.data.data || response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch provider",
        loading: false,
      });

      throw error;
    }
  },
   // Find providers by owner
   fetchProvidersByOwner: async (ownerId) => {
    set({ loading: true, error: null });

    try {
      const response = await providerService.getByOwner(ownerId);

      set({
        providers: response.data.data || response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch providers by owner",
        loading: false,
      });

      throw error;
    }
  },

  // Create provider
  createProvider: async (data) => {
    set({ loading: true, error: null });

    try {
      const response = await providerService.create(data);
      const newProvider = response.data.data || response.data;

      set((state) => ({
        providers: [newProvider, ...state.providers],
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create provider",
        loading: false,
      });

      throw error;
    }
  },

  // Update provider
  updateProvider: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const response = await providerService.update(id, data);
      const updatedProvider = response.data.data || response.data;

      set((state) => ({
        providers: state.providers.map((provider) =>
          provider.id === id ? updatedProvider : provider
        ),
        provider: updatedProvider,
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update provider",
        loading: false,
      });

      throw error;
    }
  },

  // Patch provider
  patchProvider: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const response = await providerService.patch(id, data);
      const updatedProvider = response.data.data || response.data;

      set((state) => ({
        providers: state.providers.map((provider) =>
          provider.id === id ? updatedProvider : provider
        ),
        provider: updatedProvider,
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update provider",
        loading: false,
      });

      throw error;
    }
  },

  // Delete provider
  deleteProvider: async (id) => {
    set({ loading: true, error: null });

    try {
      await providerService.remove(id);

      set((state) => ({
        providers: state.providers.filter((provider) => provider.id !== id),
        provider: state.provider?.id === id ? null : state.provider,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete provider",
        loading: false,
      });

      throw error;
    }
  },

  clearProvider: () => set({ provider: null }),

  clearError: () => set({ error: null }),
}));