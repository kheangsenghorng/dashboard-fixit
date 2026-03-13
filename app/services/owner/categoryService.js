import api from "@/lib/api";

export const categoryService = {
  // Get all categories
  getAll: (params) => api.get("/categories", { params }),

  // Get single category
  getOne: (id) => api.get(`/categories/${id}`),


};