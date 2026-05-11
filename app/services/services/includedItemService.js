import api from "@/lib/api";

export const includedItemService = {
  // Get all included items
  getAll: (params) => api.get("/owner/included-items", { params }),

  // Get single included item
  getOne: (id) => api.get(`/owner/included-items/${id}`),

  // Get included items by service  ID
  getByServiceId: (serviceId) =>
    api.get(`/owner/included-items/service/${serviceId}`),

  // Create included item
  create: (data) =>
    api.post("/owner/included-items", data, {
      headers: { Accept: "application/json" },
    }),

  // Update included item
  update: (id, data) =>
    api.put(`/owner/included-items/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete single included item
  remove: (id) => api.delete(`/owner/included-items/${id}`),
};
