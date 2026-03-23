import api from "@/lib/api";

export const serviceService = {
  // Get all services
  getAll: (params) => api.get("/services", { params }),

  // Get all total services count
  getCount: () => api.get("/services/stats"),

  // Get active services
  getActive: (params) => api.get("/services/active", { params }),

  // Get single service
  getOne: (id) => api.get(`/services/${id}`),

  // Create service
  create: (data) =>
    api.post("/services", data, {
      headers: { Accept: "application/json" },
    }),

  // Update service
  update: (id, data) =>
    api.put(`/services/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete single service
  remove: (id) => api.delete(`/services/${id}`),

  // Bulk delete services
  removeMany: (ids) =>
    api.delete("/services/bulk", {
      data: { ids },
      headers: { Accept: "application/json" },
    }),

  // Bulk update status
  updateManyStatus: (ids, status) =>
    api.patch(
      "/services/status/bulk",
      { ids, status },
      {
        headers: { Accept: "application/json" },
      },
    ),

  /// Route public servive

  //Get by category by id servies
  getServiesByCategory: (categoryId) =>
    api.get("/service/active", {
      params: { category_id: categoryId },
    }),

  // Get services by type
  getServicesByType: (typeId) =>
    api.get("/service/active", {
      params: { type_id: typeId },
    }),
};
