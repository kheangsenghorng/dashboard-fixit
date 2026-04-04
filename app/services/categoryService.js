import api from "@/lib/api";

export const categoryService = {
  // Get all categories
  getAll: (params) => api.get("/categories", { params }),

  // Get single category
  getOne: (id) => api.get(`/categories/${id}`),

  //Get category statistics.
  getStats:() => api.get("/categories/stats"),

  // Create category
  create: (data) =>
    api.post("/categories", data, {
      headers: { Accept: "application/json" },
    }),

  // Update category
  update: (id, data) =>
    api.post(`/categories/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete single category
  remove: (id) => api.delete(`/categories/${id}`),

  // Bulk delete categories
  removeMany: (ids) =>
    api.delete("/categories/bulk", {
      data: { ids },
      headers: { Accept: "application/json" },
    }),

  // Bulk update status
  updateManyStatus: (ids, status) =>
    api.patch(
      "/categories/status/bulk",
      { ids, status },
      {
        headers: { Accept: "application/json" },
      }
    ),

  // Restore soft-deleted category
  restore: (id) =>
    api.post(
      `/categories/${id}/restore`,
      {},
      {
        headers: { Accept: "application/json" },
      }
    ),
  categoryActive: () => api.get("/category/active"),

  // Force delete category
  forceDelete: (id) => api.delete(`/categories/${id}/force`),
};
