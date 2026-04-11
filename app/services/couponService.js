import api from "@/lib/api";

const couponService = {
  getAll: (params) => api.get("/v1/coupons", { params }),
  getStats: () => api.get("/v1/coupons/stats"),
  getById: (id) => api.get(`/v1/coupons/${id}`),
  create: (data) => api.post("/v1/coupons", data),
  update: (id, data) => api.put(`/v1/coupons/${id}`, data),
  patch: (id, data) => api.patch(`/v1/coupons/${id}`, data),
  delete: (id) => api.delete(`/v1/coupons/${id}`),

  // by owner

  getbyOwner: (owner_id) => api.get(`/owner/coupons/show-by-owner/${owner_id}`),
  getStatsByOwner: (owner_id) =>
    api.get("/owner/coupons/stats-by-owner", {
      params: { owner_id },
    }),
};

export default couponService;
