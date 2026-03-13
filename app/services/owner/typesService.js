import api from "@/lib/api";

export const typesService = {

  getActiveTypes: (categoryId) =>
    api.get(`/owner/types/active?category_id=${categoryId}`),

  getOne: (id) =>
    api.get(`/owner/types/${id}`),

  getCategoryActive: () =>
    api.get("/owner/categories/active"),
};