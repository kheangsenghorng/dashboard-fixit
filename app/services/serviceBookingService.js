import api from "@/lib/api";

export const serviceBookingService = {
  // Get all service bookings
  getAll: (params) => api.get("/service-bookings", { params }),

  // Get single service booking
  getOne: (id) => api.get(`/service-bookings/${id}`),

  // Get service bookings by owner ID
  getByOwnerId: (ownerId, params) =>
    api.get(`/owner/service-bookings/owner/${ownerId}`, { params }),

  // Get service booking history by owner ID
  getHistoryByOwnerId: (ownerId, params) =>
    api.get(`/owner/service-bookings/owner/${ownerId}/history`, { params }),

  // Create service booking
  create: (data) =>
    api.post("/service-bookings", data, {
      headers: { Accept: "application/json" },
    }),
  cancelRefundBooking: (bookingId, payload) =>
    api.post(
      `/owner/service-bookings/${bookingId}/owner-cancel-refund`,
      payload
    ),

  //display by admin all refunded
  getRefundByadmin: (params = {}) =>
    api.get("/service-bookings/refunded-cancelled", {
      params,
    }),
  //display refunded-cancelled by owner
  // serviceBookingService.js

  getRefundedCancelled: (ownerId, params = {}) =>
    api.get(`/owner/service-bookings/${ownerId}/refunded-cancelled`, {
      params,
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
