import { create } from "zustand";
import couponService from "../services/couponService";

const defaultQueryParams = {
  page: 1,
  search: "",
  status: "",
  owner_id: "",
};

const useCouponStore = create((set, get) => ({
  coupons: [],
  coupon: null,
  loading: false,
  error: null,
  meta: null,
  countCoupon: null,
  lastParams: defaultQueryParams,

  fetchCoupons: async (params = {}) => {
    const mergedParams = {
      ...get().lastParams,
      ...params,
    };

    set({
      loading: true,
      error: null,
      lastParams: mergedParams,
    });

    try {
      const res = await couponService.getAll(mergedParams);
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

  refreshCoupons: async () => {
    const params = get().lastParams;
    await get().fetchCoupons(params);
  },

  fetchCouponsByOwner: async (owner_id) => {
    set({ loading: true, error: null });

    try {
      const res = await couponService.getbyOwner(owner_id);
      const payload = res.data;

      set({
        coupons: payload.data ?? [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch owner coupons",
        loading: false,
      });
    }
  },

  fetchCouponStatsByOwner: async (owner_id) => {
    set({ loading: true, error: null });

    try {
      const res = await couponService.getStatsByOwner(owner_id);

      set({
        countCoupon: res.data.data,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch owner coupon stats",
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
        loading: false,
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

  applyRealtimeCouponUsage: (payload) => {
    const usage = payload?.data;
    const coupon = usage?.coupon;

    if (!coupon) return;

    set((state) => ({
      coupons: state.coupons.map((item) =>
        item.id === coupon.id
          ? {
              ...item,
              ...coupon,
            }
          : item
      ),
      coupon:
        state.coupon?.id === coupon.id
          ? {
              ...state.coupon,
              ...coupon,
            }
          : state.coupon,
    }));
  },
}));

export default useCouponStore;
