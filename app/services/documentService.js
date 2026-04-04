import api from "@/lib/api";
import { filter } from "framer-motion/client";

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

  // Send notify missing documents email
  sendEmail: (data) => api.post("/owner-documents/notify-missing", data),

  filterByOwner: (ownerId) =>
    api.get(`/owner-documents`, { params: { owner_id: ownerId } }),

  // 👀 Review document
  review: (id, payload) =>
    api.patch(`/owner-documents/${id}/review`, payload),
};