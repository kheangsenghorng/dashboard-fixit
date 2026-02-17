import api from "@/lib/api";

export const ownerService = {
  getAll: (params) => api.get("/owners", { params }),
  getOne: (id) => api.get(`/owners/${id}`),
  create: (data) => api.post("/owners", data),

  // ✅ IMPORTANT: use POST because you're sending FormData + _method=PUT
  update: (id, data) =>
    api.post(`/owners/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

  remove: (id) => api.delete(`/owners/${id}`),
};
