import api from "@/lib/api";

export const serviceBookingService = {
  // Get all service bookings
  getAll: (params) => api.get("/service-bookings", { params }),

  // Get single service booking
  getOne: (id) => api.get(`/service-bookings/${id}`),

  getByOwnerId: (ownerId, params) =>
    api.get(`/owner/service-bookings/owner/${ownerId}`, { params }),

  // Create service booking
  create: (data) =>
    api.post("/service-bookings", data, {
      headers: { Accept: "application/json" },
    }),

  // Update service booking
  update: (id, data) =>
    api.put(`/service-bookings/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Partial update service booking
  patch: (id, data) =>
    api.patch(`/service-bookings/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete service booking
  remove: (id) => api.delete(`/service-bookings/${id}`),
};
