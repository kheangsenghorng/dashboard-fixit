import api from "@/lib/api";

export const providerService = {
  // Get all providers
  getAll: (params) => api.get("/providers", { params }),

  // Get single provider
  getOne: (id) => api.get(`/providers/${id}`),

  // Find providers by owner
  getByOwner: (ownerId) => api.get(`/providers/owner/${ownerId}`),

  // Create provider
  create: (data) =>
    api.post("/providers", data, {
      headers: { Accept: "application/json" },
    }),

  // Update provider
  update: (id, data) =>
    api.put(`/providers/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Partially update provider
  patch: (id, data) =>
    api.patch(`/providers/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete provider
  remove: (id) => api.delete(`/providers/${id}`),
};
