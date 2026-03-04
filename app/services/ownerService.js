import api from "@/lib/api";

export const ownerService = {
  // Owners
  getAll: (params) => api.get("/owners", { params }),
  getOne: (id) => api.get(`/owners/${id}`),
  create: (data) => api.post("/owners", data),

  update: (id, data) =>
    api.post(`/owners/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  remove: (id) => api.delete(`/owners/${id}`),

  // ✅ Owner Documents (Owner Only)
  getDocuments: () => api.get(`/owner/owner-documents`),

  getOneDocument: (id) => api.get(`/owner/owner-documents/${id}`),

  uploadDocument: (data) =>
    api.post(`/owner/owner-documents`, data, {
      headers: { Accept: "application/json" },
    }),

  filterStatus: (status) => api.get(`/owner/owner-documents`, { params: { status } }),  
  updateDocument: (id, data) =>
    api.post(`/owner/owner-documents/${id}`, data, {
      headers: { Accept: "application/json" },
    }),
  deleteDocument: (id) =>
    api.delete(`/owner/owner-documents/${id}`),
};