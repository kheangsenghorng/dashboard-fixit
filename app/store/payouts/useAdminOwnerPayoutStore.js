import { create } from "zustand";
import adminOwnerPayoutService from "../../services/payouts/adminOwnerPayoutService";

const getErrorMessage = (error, fallback = "Something went wrong") =>
  error.response?.data?.message || error.message || fallback;

const getPaginationData = (payload) => {
  if (!payload || Array.isArray(payload)) return null;

  return {
    current_page: payload.current_page ?? 1,
    last_page: payload.last_page ?? 1,
    per_page: payload.per_page ?? null,
    total: payload.total ?? 0,
    from: payload.from ?? null,
    to: payload.to ?? null,
    links: payload.links ?? [],
  };
};

const extractListData = (payload) => {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.data)) return payload.data;

  return [];
};

const useAdminOwnerPayoutStore = create((set, get) => ({
  payouts: [],
  payoutsPagination: null,
  payoutsLoading: false,
  payoutsError: null,
  payoutsEmpty: false,

  stats: null,
  amountByOwner: [],
  selectedPayout: null,

  loading: false,
  error: null,

  amountByOwnerLoading: false,
  amountByOwnerError: null,
  amountByOwnerEmpty: false,

  fetchAmountByOwner: async (params = {}) => {
    set({
      amountByOwnerLoading: true,
      amountByOwnerError: null,
      amountByOwnerEmpty: false,
    });

    try {
      const res = await adminOwnerPayoutService.getAmountByOwner(params);
      const data = res.data?.data ?? [];

      set({
        amountByOwner: data,
        amountByOwnerLoading: false,
        amountByOwnerError: null,
        amountByOwnerEmpty: data.length === 0,
      });

      return res.data;
    } catch (error) {
      set({
        amountByOwner: [],
        amountByOwnerLoading: false,
        amountByOwnerError: getErrorMessage(
          error,
          "Failed to fetch amount by owner"
        ),
        amountByOwnerEmpty: true,
      });

      throw error;
    }
  },

  fetchPayouts: async (params = {}) => {
    set({
      payoutsLoading: true,
      payoutsError: null,
      payoutsEmpty: false,
    });

    try {
      const res = await adminOwnerPayoutService.getAll(params);

      const payload = res.data?.data;
      const data = extractListData(payload);
      const pagination = getPaginationData(payload);

      set({
        payouts: data,
        payoutsPagination: pagination,
        payoutsLoading: false,
        payoutsError: null,
        payoutsEmpty: data.length === 0,
      });

      return res.data;
    } catch (error) {
      set({
        payouts: [],
        payoutsPagination: null,
        payoutsLoading: false,
        payoutsError: getErrorMessage(error, "Failed to fetch payouts"),
        payoutsEmpty: true,
      });

      throw error;
    }
  },

  fetchStats: async () => {
    set({ loading: true, error: null });

    try {
      const res = await adminOwnerPayoutService.getStats();

      set({
        stats: res.data?.data ?? null,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to fetch stats"),
        loading: false,
      });

      throw error;
    }
  },

  fetchPayoutById: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await adminOwnerPayoutService.getById(id);

      set({
        selectedPayout: res.data?.data ?? null,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to fetch payout"),
        loading: false,
      });

      throw error;
    }
  },

  payMultipleAndSendEmail: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await adminOwnerPayoutService.payMultipleAndSendEmail(data);

      await Promise.all([get().fetchAmountByOwner(), get().fetchPayouts()]);

      set({ loading: false });

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to pay payouts"),
        loading: false,
      });

      throw error;
    }
  },

  updateStatus: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const res = await adminOwnerPayoutService.updateStatus(id, data);
      const updated = res.data?.data;

      set((state) => ({
        payouts: state.payouts.map((item) =>
          item.id === id ? { ...item, ...updated } : item
        ),
        selectedPayout:
          state.selectedPayout?.id === id
            ? { ...state.selectedPayout, ...updated }
            : state.selectedPayout,
        loading: false,
      }));

      return res.data;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to update payout status"),
        loading: false,
      });

      throw error;
    }
  },

  clearSelectedPayout: () => set({ selectedPayout: null }),
  clearError: () => set({ error: null }),

  clearPayoutsError: () => set({ payoutsError: null }),
  clearAmountByOwnerError: () => set({ amountByOwnerError: null }),
}));

export default useAdminOwnerPayoutStore;
