import api from "@/lib/api";

export const documentService = {
  // 📄 Get all documents
  getAll: (params) =>
    api.get("/owner-documents", { params }),

  // 🔐 Send OTP
  sendOtp: (id) =>
    api.post(`/owner-documents/${id}/otp`),

  // ✅ Verify OTP
  verifyOtp: (id, otp) =>
    api.post(`/owner-documents/${id}/verify-otp`, { otp }),

  // 👀 Review document
  review: (id, payload) =>
    api.patch(`/owner-documents/${id}/review`, payload),
};