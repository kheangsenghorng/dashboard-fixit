import api from "@/lib/api";

const adminOwnerPayoutService = {
  getAll: (params) => api.get("/owner-payouts", { params }),

  getStats: () => api.get("/owner-payouts/stats"),

  getAmountByOwner: (params) =>
    api.get("/owner-payouts/amount-by-owner", { params }),

  payMultipleAndSendEmail: (data) =>
    api.post("/owner-payouts/pay-multiple-send-email", data),

  updateStatus: (id, data) =>
    api.patch(`/owner-payouts/${id}/status`, data),

  getById: (id) => api.get(`/owner-payouts/${id}`),
};

export default adminOwnerPayoutService;