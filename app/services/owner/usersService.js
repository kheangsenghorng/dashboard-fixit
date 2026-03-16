import api from "@/lib/api";

export const usersService = {
  /*
  |--------------------------------------------------------------------------
  | Get one user
  |--------------------------------------------------------------------------
  */
  getOne: (id) => api.get(`/owner/users/${id}`),

  /*
  |--------------------------------------------------------------------------
  | Update user
  |--------------------------------------------------------------------------
  */
  update: (id, data) => api.put(`/owner/users/${id}`, data),

  /*
  |--------------------------------------------------------------------------
  | Upload image user
  |--------------------------------------------------------------------------
  */
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return api.post(`/owner/users/${id}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
