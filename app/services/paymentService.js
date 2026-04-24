import api from "@/lib/api";

export const paymentService = {
  // Get all payments
  getAll: (params) => api.get("/payments", { params }),

  // Get single payment
  getOne: (id) => api.get(`/payments/${id}`),

  // Create payment
  create: (data) =>
    api.post("/payments", data, {
      headers: { Accept: "application/json" },
    }),

  // Update payment
  update: (id, data) =>
    api.put(`/payments/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete payment
  remove: (id) => api.delete(`/payments/${id}`),
};