import api from "@/lib/api";

export const typesService = {
  // Get all types (filters + pagination)
  getAll: (params) => api.get("/types", { params }),

  // Get active types
  getActive: () => api.get("/types/active"),

  //Get action publis types
  getTypeAction:() => api.get("/type/active"),

  // Get one type
  getOne: (id) => api.get(`/types/${id}`),

  // Create type
  create: (data) =>
    api.post("/types", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }),

  // Update type
  updateType: async (id, data) => {
    const res = await api.post(`/types/${id}`, data, {
      headers: { Accept: "application/json" },
    });
  
    return res;
  },

  // Delete type
  remove: (id) => api.delete(`/types/${id}`),

  // Bulk delete
  deleteMany: (ids) =>
    api.delete("/types/bulk", {
      data: { ids },
    }),

  // Bulk status update
  updateManyStatus: (ids, status) =>
    api.patch("/types/status/bulk", {
      ids,
      status,
    }),
};