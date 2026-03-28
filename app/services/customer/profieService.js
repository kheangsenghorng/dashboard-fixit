import api from "@/lib/api";

export const profileService = {
  // Get customer profile
  getProfile: (userId) => api.get(`/customer/profile/${userId}`),

  // Update customer profile
  updateProfile: (userId, data) =>
    api.put(`/customer/profile/${userId}`, data, {
      headers: {
        Accept: "application/json",
      },
    }),

  // Update customer avatar
  updateAvatar: (userId, formData) =>
    api.post(`/customer/avatar/${userId}`, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }),
};
