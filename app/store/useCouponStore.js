import { create } from "zustand";
import couponService from "../services/couponService";

const useCouponStore = create((set) => ({
  coupons: [],
  coupon: null,
  loading: false,
  error: null,
  meta: null,
  countCoupon: null,

  fetchCoupons: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const res = await couponService.getAll(params);
      const payload = res.data;

      set({
        coupons: payload.data ?? [],
        meta: {
          current_page: payload.current_page,
          last_page: payload.last_page,
          per_page: payload.per_page,
          total: payload.total,
          from: payload.from,
          to: payload.to,
          next_page_url: payload.next_page_url,
          prev_page_url: payload.prev_page_url,
          links: payload.links ?? [],
        },
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch coupons",
        loading: false,
      });
    }
  },

  fetchCouponsStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await couponService.getStats();
      set({
        countCoupon: res.data.data || res.data,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch coupons",
        loading: false,
      });
    }
  },

  fetchCouponById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await couponService.getById(id);
      set({
        coupon: res.data.data || res.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch coupon",
        loading: false,
      });
    }
  },

  createCoupon: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await couponService.create(data);
      set((state) => ({
        coupons: [res.data.data || res.data, ...state.coupons],
        loading: false,
      }));
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create coupon",
        loading: false,
      });
      throw error;
    }
  },

  updateCoupon: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await couponService.update(id, data);
      const updatedCoupon = res.data.data || res.data;

      set((state) => ({
        coupons: state.coupons.map((item) =>
          item.id === id ? updatedCoupon : item
        ),
        coupon: updatedCoupon,
        loading: false,
      }));

      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update coupon",
        loading: false,
      });
      throw error;
    }
  },

  deleteCoupon: async (id) => {
    set({ loading: true, error: null });
    try {
      await couponService.delete(id);
      set((state) => ({
        coupons: state.coupons.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete coupon",
        loading: false,
      });
      throw error;
    }
  },
}));

export default useCouponStore;
