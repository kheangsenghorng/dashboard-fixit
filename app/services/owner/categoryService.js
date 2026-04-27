import api from "@/lib/api";

export const categoryService = {
  // Get all categories
  getAll: (params) => api.get("/categories", { params }),

  // Get active owner categories
  getActiveByOwner: (params) =>
    api.get("/owner/categories/active", { params }),

  // Get single category
  getOne: (id) => api.get(`/categories/${id}`),
};