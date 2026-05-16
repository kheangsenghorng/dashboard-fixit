import api from "@/lib/api";

export const ownerPayoutService = {
  /**
   * Get payouts by owner id
   * GET /api/owner/payouts/owner/{ownerId}
   */
  getByOwnerId: (ownerId, params = {}) =>
    api.get(`/owner/payouts/${ownerId}`, { params }),

  /**
   * Get payout stats by owner id
   * GET /api/owner/payouts/owner/{ownerId}/stats
   */
  getStatsByOwnerId: (ownerId, params = {}) =>
    api.get(`/owner/payouts/${ownerId}/stats`, { params }),

  /**
   * Get logged-in owner payouts
   * GET /api/owner/payouts
   */
  getMyPayouts: (params = {}) =>
    api.get("/owner/payouts", { params }),

  /**
   * Get logged-in owner payout stats
   * GET /api/owner/payouts/stats
   */
  getMyStats: (params = {}) =>
    api.get("/owner/payouts/stats", { params }),

  /**
   * Show one payout by payout id
   * GET /api/owner/payouts/{id}
   */
  getOne: (id) =>
    api.get(`/owner/payouts/${id}`),
};

export default ownerPayoutService;