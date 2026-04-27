import { create } from "zustand";

import { toast } from "react-toastify";
import { categoryService } from "../../services/owner/categoryService";

export const useOwnerCategoryStore = create((set) => ({
  categories: [],
  activeCategories: [],
  selectedCategory: null,
  loading: false,
  error: null,

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  clearSelectedCategory: () => {
    set({ selectedCategory: null });
  },

  fetchActiveCategoriesByOwner: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await categoryService.getActiveByOwner(params);

      const categories = response.data?.data?.data || response.data?.data || [];

      set({
        categories,
        activeCategories: categories,
      });

      return categories;
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;

      const errorMessage = validationErrors
        ? Object.values(validationErrors).flat().join(" ")
        : error?.response?.data?.message ||
          "Failed to fetch active categories.";

      set({ error: errorMessage });
      toast.error(errorMessage);

      return [];
    } finally {
      set({ loading: false });
    }
  },
}));
