import { create } from "zustand";
import { typesService } from "../../services/owner/typesService";

export const useTypeStoreCompany = create((set) => ({
  types: [],
  activeTypes: [],
  categories: [],

  type: null,
  meta: null,
  loading: false,

  /*
  |--------------------------------------------------------------------------
  | Fetch All Types
  |--------------------------------------------------------------------------
  */

  fetchTypes: async (filters = {}) => {
    set({ loading: true });

    try {
      const res = await typesService.getAll(filters);

      set({
        types: res.data.data,
        meta: res.data.meta,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch types error:", error);
      set({ loading: false });
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Fetch Active Types
  |--------------------------------------------------------------------------
  */
  fetchActiveTypes: async (categoryId) => {

    try {
  
      const res = await typesService.getActiveTypes(categoryId);
  
      set({
        activeTypes: res.data.data
      });
  
    } catch (error) {
  
      console.error("Fetch active types error:", error);
  
    }
  
  },

  fetchActiveCategories: async () => {
    set({ loading: true });

    try {
      const res = await typesService.getCategoryActive();
    

      set({
        categories: res.data.data,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch categories error:", error);

      set({ loading: false });
    }
  },
}));
