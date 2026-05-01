import { create } from "zustand";
import adminPaymentSplitService from "@/services/adminPaymentSplitService";

const useAdminPaymentSplitStore = create((set) => ({
  paymentSplits: [],
  stats: null,
  selectedPaymentSplit: null,

  loading: false,
  error: null,

  // Fetch all payment splits with optional filters
  fetchPaymentSplits: async (params) => {
    set({ loading: true, error: null });

    try {
      const res = await adminPaymentSplitService.getAll(params);

      set({
        paymentSplits: res.data.data ?? [],
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });

      throw error;
    }
  },
 // Fetch payment split stats
  fetchStats: async () => {
    set({ loading: true, error: null });

    try {
      const res = await adminPaymentSplitService.getStats();

      set({
        stats: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });

      throw error;
    }
  },
 // Fetch a single payment split by ID
  fetchPaymentSplitById: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await adminPaymentSplitService.getById(id);

      set({
        selectedPaymentSplit: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });

      throw error;
    }
  },

  clearSelectedPaymentSplit: () => set({ selectedPaymentSplit: null }),
  clearError: () => set({ error: null }),
}));

export default useAdminPaymentSplitStore;