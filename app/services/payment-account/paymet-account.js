import api from "@/lib/api";

const paymentAccountService = {
  getAll: (params) => api.get("/owner/payment-accounts", { params }),

  getById: (id) => api.get(`/owner/payment-accounts/${id}`),

  getByUserId: (userId) => api.get(`/payment-accounts/user/${userId}`),

  create: (data) => api.post("/owner/payment-accounts", data),

  update: (id, data) => api.put(`/owner/payment-accounts/${id}`, data),

  patch: (id, data) => api.patch(`/owner/payment-accounts/${id}`, data),

  delete: (id) => api.delete(`/owner/payment-accounts/${id}`),

  checkCompanyBankAccount: (userId) =>
    api.get(`/owner/payment-accounts/check-company/${userId}`),
};

export default paymentAccountService;
