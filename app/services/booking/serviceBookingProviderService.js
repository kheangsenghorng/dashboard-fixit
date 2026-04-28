import api from "@/lib/api";

export const serviceBookingProviderService = {
  // Get all service booking providers
  getAll: (params) => api.get("/owner/service-booking-providers", { params }),

  // Create service booking provider
  create: (data) =>
    api.post("/owner/service-booking-providers", data, {
      headers: { Accept: "application/json" },
    }),

  // Get single service booking provider
  getOne: (id) => api.get(`/owner/service-booking-providers/${id}`),

  // Get providers by booking ID
  getByBookingId: (bookingId) =>
    api.get(`/owner/service-booking-providers/booking/${bookingId}`),

  // Get bookings by provider ID
  getByProviderId: (providerId) =>
    api.get(`/owner/service-booking-providers/provider/${providerId}`),

  // Update service booking provider
  update: (id, data) =>
    api.put(`/owner/service-booking-providers/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Patch service booking provider
  patch: (id, data) =>
    api.patch(`/owner/service-booking-providers/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete service booking provider
  remove: (id) => api.delete(`/owner/service-booking-providers/${id}`),
};
