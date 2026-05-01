import api from "@/lib/api";

const adminPaymentSplitService = {
  getAll: (params) => api.get("/payment-splits", { params }),

  getStats: () => api.get("/payment-splits/stats"),

  getById: (id) => api.get(`/payment-splits/${id}`),
};

export default adminPaymentSplitService;