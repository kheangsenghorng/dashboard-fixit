import api from "@/lib/api";

export const packageTaskGroupService = {
  // Get all package task groups
  getAll: (params) => api.get("/owner/package-task-groups", { params }),

  // Get single package task group
  getOne: (id) => api.get(`/owner/package-task-groups/${id}`),

  // Create package task group
  create: (data) =>
    api.post("/owner/package-task-groups", data, {
      headers: { Accept: "application/json" },
    }),

  // Update package task group
  update: (id, data) =>
    api.put(`/owner/package-task-groups/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete single package task group
  remove: (id) => api.delete(`/owner/package-task-groups/${id}`),
};
