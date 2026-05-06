import api from "@/lib/api";

export const taskItemService = {
  // Get all task items
  getAll: (params) => api.get("/owner/task-items", { params }),

  // Get single task item
  getOne: (id) => api.get(`/owner/task-items/${id}`),

  // Create task item
  create: (data) =>
    api.post("/owner/task-items", data, {
      headers: { Accept: "application/json" },
    }),

  // Update task item
  update: (id, data) =>
    api.put(`/owner/task-items/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  // Delete single task item
  remove: (id) => api.delete(`/owner/task-items/${id}`),
};
