import api from "@/lib/api";

export const packageIncludedItemService = {
  // Get all package included items
  getAll: (params) => api.get("/owner/package-included-items", { params }),

  // Get single package included item
  getOne: (id) => api.get(`/owner/package-included-items/${id}`),

  // Create package included item
  create: (data) =>
    api.post("/owner/package-included-items", data, {
      headers: { Accept: "application/json" },
    }),

  // Update package included item
  update: (id, data) =>
    api.put(`/owner/package-included-items/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete single package included item
  remove: (id) => api.delete(`/owner/package-included-items/${id}`),
};
