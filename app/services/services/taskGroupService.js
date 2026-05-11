import api from "@/lib/api";


export const taskGroupService = {
  // Get all task groups
  getAll: (params) => api.get("/owner/task-groups", { params }),

  // Get single task group
  getOne: (id) => api.get(`/owner/task-groups/${id}`),

  // Get task groups by service  ID
  getByServiceId: (serviceId) =>
    api.get(`/owner/task-groups/service/${serviceId}`),

  // Create task group
  create: (data) =>
    api.post("/owner/task-groups", data, {
      headers: { Accept: "application/json" },
    }),

  // Update task group
  update: (id, data) =>
    api.put(`/owner/task-groups/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete single task group
  remove: (id) => api.delete(`/owner/task-groups/${id}`),
};
