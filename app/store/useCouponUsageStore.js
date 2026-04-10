import { create } from "zustand";
import couponUsageService from "../services/couponUsageService";

const useCouponUsageStore = create((set) => ({
  couponUsages: [],
  couponUsage: null,
  loading: false,
  error: null,
  meta: null,
  topPerformingCoupons: [],

  fetchCouponUsageById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await couponUsageService.getById(id);
      set({
        couponUsage: res.data.data || res.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch coupon usage",
        loading: false,
      });
    }
  },

  fetchTopPerformingCoupons: async () => {
    try {
      const response = await couponUsageService.getTopPerformingCoupons();

      const data = response.data?.data;

      set({
        topPerformingCoupons: [data?.top_1, data?.top_2, data?.top_3].filter(
          Boolean
        ),
      });
    } catch (error) {
      console.error("Failed to fetch top performing coupons:", error);
    }
  },

  createCouponUsage: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await couponUsageService.create(data);
      set((state) => ({
        couponUsages: [res.data.data || res.data, ...state.couponUsages],
        loading: false,
      }));
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create coupon usage",
        loading: false,
      });
      throw error;
    }
  },

  updateCouponUsage: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await couponUsageService.update(id, data);
      const updatedCouponUsage = res.data.data || res.data;

      set((state) => ({
        couponUsages: state.couponUsages.map((item) =>
          item.id === id ? updatedCouponUsage : item
        ),
        couponUsage: updatedCouponUsage,
        loading: false,
      }));

      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update coupon usage",
        loading: false,
      });
      throw error;
    }
  },

  deleteCouponUsage: async (id) => {
    set({ loading: true, error: null });
    try {
      await couponUsageService.delete(id);
      set((state) => ({
        couponUsages: state.couponUsages.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete coupon usage",
        loading: false,
      });
      throw error;
    }
  },
}));

export default useCouponUsageStore;
