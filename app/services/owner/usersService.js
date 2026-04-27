import api from "@/lib/api";

export const usersService = {


  /*|--------------------------------------------------------------------------
  | Get users by authenticated owner
  |--------------------------------------------------------------------------
  */
  getByOwner: (params) =>
    api.get("/owner/users", {
      params,
    }),

  /*
  /*
  |--------------------------------------------------------------------------
  | Create owner user
  |--------------------------------------------------------------------------
  */
  create: (data) =>
    api.post("/owner/users", data, {
      headers: { Accept: "application/json" },
    }),

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
  update: (id, data) =>
    api.put(`/owner/users/${id}`, data, {
      headers: { Accept: "application/json" },
    }),

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
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });
  },
};