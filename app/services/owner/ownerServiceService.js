import api from "@/lib/api";
import { de } from "zod/v4/locales";

export const ownerServiceService = {
  getAll: (params) => api.get("/owner/services", { params }),

  getCount: () => api.get("/owner/services/stats"),

  getOne: (id) => api.get(`/owner/services/${id}`),

  create: (data) =>
    api.post("/owner/services", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }),

  update: (id, data) => api.post(`/owner/services/${id}`, data),

  remove: (id) => api.delete(`/owner/services/${id}`),

  updateManyStatus: (ids, status) =>
    api.patch("/owner/services/status/bulk", { ids, status }),

  deleteImage: (serviceId, image) =>
    api.delete(`/owner/services/${serviceId}/image`, {
      data: { image },
    }),
};
