import { create } from "zustand";
import ownerPayoutService from "../../services/owner/payout/ownerPayoutService";

const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error?.response?.data?.errors) {
    return Object.values(error.response.data.errors).flat().join(" ");
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
};

const defaultStats = {
  total_payouts: 0,
  total_amount: 0,

  pending_count: 0,
  paid_count: 0,
  failed_count: 0,

  pending_amount: 0,
  paid_amount: 0,
  failed_amount: 0,
};

const defaultPagination = {
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
};

const getPagination = (payload) => ({
  current_page: payload?.current_page ?? 1,
  last_page: payload?.last_page ?? 1,
  per_page: payload?.per_page ?? 15,
  total: payload?.total ?? 0,
});

const useOwnerPayoutStore = create((set, get) => ({
  payouts: [],
  selectedPayout: null,
  stats: defaultStats,
  pagination: defaultPagination,

  loading: false,
  statsLoading: false,
  detailLoading: false,
  error: null,

  /**
   * Fetch payouts by owner id
   * Example params:
   * {
   *   status: "pending",
   *   month: "2026-05",
   *   page: 1,
   *   per_page: 15
   * }
   */
  fetchPayoutsByOwnerId: async (ownerId, params = {}) => {
    if (!ownerId) {
      set({
        payouts: [],
        pagination: defaultPagination,
        loading: false,
        error: "Owner ID is required",
      });
      return;
    }

    set({
      loading: true,
      error: null,
    });

    try {
      const res = await ownerPayoutService.getByOwnerId(ownerId, params);

      const payload = res.data?.data;

      set({
        payouts: payload?.data ?? [],
        pagination: getPagination(payload),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        payouts: [],
        pagination: defaultPagination,
        loading: false,
        error: getErrorMessage(error, "Failed to fetch owner payouts"),
      });

      return null;
    }
  },

  /**
   * Fetch logged-in owner payouts
   */
  fetchMyPayouts: async (params = {}) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await ownerPayoutService.getMyPayouts(params);

      const payload = res.data?.data;

      set({
        payouts: payload?.data ?? [],
        pagination: getPagination(payload),
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        payouts: [],
        pagination: defaultPagination,
        loading: false,
        error: getErrorMessage(error, "Failed to fetch your payouts"),
      });

      return null;
    }
  },

  /**
   * Fetch payout stats by owner id
   * Example params:
   * {
   *   month: "2026-05"
   * }
   */
  fetchStatsByOwnerId: async (ownerId, params = {}) => {
    if (!ownerId) {
      set({
        stats: defaultStats,
        statsLoading: false,
        error: "Owner ID is required",
      });
      return;
    }

    set({
      statsLoading: true,
      error: null,
    });

    try {
      const res = await ownerPayoutService.getStatsByOwnerId(ownerId, params);

      set({
        stats: {
          ...defaultStats,
          ...(res.data?.data ?? {}),
        },
        statsLoading: false,
      });

      return res.data;
    } catch (error) {
      set({
        stats: defaultStats,
        statsLoading: false,
        error: getErrorMessage(error, "Failed to fetch payout stats"),
      });

      return null;
    }
  },

  /**
   * Fetch logged-in owner payout stats
   */
  fetchMyStats: async (params = {}) => {
    set({
      statsLoading: true,
      error: null,
    });

    try {
      const res = await ownerPayoutService.getMyStats(params);

      set({
        stats: {
          ...defaultStats,
          ...(res.data?.data ?? {}),
        },
        statsLoading: false,
      });

      return res.data;
    } catch (error) {
      set({
        stats: defaultStats,
        statsLoading: false,
        error: getErrorMessage(error, "Failed to fetch your payout stats"),
      });

      return null;
    }
  },

  /**
   * Fetch one payout by payout id
   */
  fetchPayoutDetail: async (id) => {
    if (!id) {
      set({
        selectedPayout: null,
        detailLoading: false,
        error: "Payout ID is required",
      });
      return;
    }

    set({
      detailLoading: true,
      error: null,
    });

    try {
      const res = await ownerPayoutService.getOne(id);

      set({
        selectedPayout: res.data?.data ?? null,
        detailLoading: false,
      });

      return res.data;
    } catch (error) {
      set({
        selectedPayout: null,
        detailLoading: false,
        error: getErrorMessage(error, "Failed to fetch payout detail"),
      });

      return null;
    }
  },

  /**
   * Change page by owner id
   */
  changePageByOwnerId: async (ownerId, page = 1, filters = {}) => {
    return await get().fetchPayoutsByOwnerId(ownerId, {
      ...filters,
      page,
    });
  },

  /**
   * Change page for logged-in owner
   */
  changeMyPage: async (page = 1, filters = {}) => {
    return await get().fetchMyPayouts({
      ...filters,
      page,
    });
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({
      error: null,
    });
  },

  /**
   * Reset store
   */
  resetOwnerPayoutStore: () => {
    set({
      payouts: [],
      selectedPayout: null,
      stats: defaultStats,
      pagination: defaultPagination,
      loading: false,
      statsLoading: false,
      detailLoading: false,
      error: null,
    });
  },
}));

export default useOwnerPayoutStore;
