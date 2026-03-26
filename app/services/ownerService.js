import api from "@/lib/api";

const OWNER_BASE = "/owner";
const OWNER_DOC_BASE = "/owner/document";

export const ownerService = {
  /* =========================
     Owners
  ========================= */

  getAll(params) {
    return api.get("/owners", { params });
  },

  getByUserId(userId) {
    return api.get("/owners", {
      params: { user_id: userId },
    });
  },

  create(data) {
    return api.post(OWNER_BASE, data);
  },

  update(id, data) {
    return api.put(`/owners/${id}`, data);
  },

  remove(id) {
    return api.delete(`/owners/${id}`);
  },

  /* =========================
     Owner Documents
  ========================= */

  getDocuments(params) {
    return api.get(`${OWNER_BASE}/owner-documents`, { params });
  },

  getOneDocument(id) {
    return api.get(`${OWNER_BASE}/owner-documents/${id}`);
  },

  uploadDocument(data) {
    return api.post(`${OWNER_DOC_BASE}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateDocument(id, data) {
    return api.put(`${OWNER_DOC_BASE}/${id}`, data);
  },

  deleteDocument(id) {
    return api.delete(`${OWNER_DOC_BASE}/${id}`);
  },

  filterStatus(status) {
    return api.get(`${OWNER_BASE}/owner-documents`, {
      params: { status },
    });
  },
};
