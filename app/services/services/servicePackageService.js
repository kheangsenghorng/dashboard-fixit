import api from "@/lib/api";

export const servicePackageService = {
  // Get all service packages
  getAll: (params) => api.get("/owner/service-packages", { params }),

  // Get single service package
  getOne: (id) => api.get(`/owner/service-packages/${id}`),

  // Get service packages by service  ID
  getByServiceId: (serviceId) =>
    api.get(`/owner/service-packages/service/${serviceId}`),

  getByServiceIdInventory: (serviceId) =>
    api.get(`/owner/service-packages/service/${serviceId}/included-items`),

  // Get service packages by service ID
  getByServiceId: (serviceId) =>
    api.get(`/owner/service-packages/service/${serviceId}`),

  // Create service package
  create: (data) =>
    api.post("/owner/service-packages", data, {
      headers: { Accept: "application/json" },
    }),

  // Update service package
  update: (id, data) =>
    api.put(`/owner/service-packages/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete single service package
  remove: (id) => api.delete(`/owner/service-packages/${id}`),

  // Bulk delete service packages
  removeMany: (ids) =>
    api.delete("/owner/service-packages/bulk", {
      data: { ids },
      headers: { Accept: "application/json" },
    }),

  // Bulk update status
  updateManyStatus: (ids, status) =>
    api.patch(
      "/owner/service-packages/status/bulk",
      { ids, status },
      {
        headers: { Accept: "application/json" },
      }
    ),
};
