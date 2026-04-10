import api from "@/lib/api";

const couponUsageService = {
  getAll: (params) => api.get("/v1/coupon-usages", { params }),
  getTopPerformingCoupons:() => api.get('/v1/coupon-usages/top-performing'),
  getById: (id) => api.get(`/v1/coupon-usages/${id}`),
  create: (data) => api.post("/v1/coupon-usages", data),
  update: (id, data) => api.put(`/v1/coupon-usages/${id}`, data),
  patch: (id, data) => api.patch(`/v1/coupon-usages/${id}`, data),
  delete: (id) => api.delete(`/v1/coupon-usages/${id}`),
};

export default couponUsageService;