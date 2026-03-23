"use client";

import { create } from "zustand";
import { categoryService } from "../services/categoryService";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  currentCategory: null,
  meta: null,
  isLoading: false,
  error: null,

  // FETCH ALL
  fetchCategories: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await categoryService.getAll(params);
      set({
        categories: res?.data?.data ?? [],
        meta: res?.data?.meta ?? null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch categories",
        isLoading: false,
      });
    }
  },

  // FETCH ACTIVE CATEGORIES
  FetchActiveCategories: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await categoryService.categoryActive();

      set({
        categories: res?.data?.data ?? [],
        meta: res?.data?.meta ?? null,
        isLoading: false,
      });
    } catch (error) {
      console.log("ACTIVE CATEGORY ERROR:", error?.response || error);
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch active categories",
        isLoading: false,
      });
    }
  },

  // FETCH SINGLE
  fetchCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await categoryService.getOne(id);
      const category = res?.data?.data ?? res?.data ?? null;
      set({ currentCategory: category, isLoading: false });
      return category;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch category",
        isLoading: false,
      });
      throw error;
    }
  },

  // CREATE — optimistic
  createCategory: async (data) => {
    const tempId = `temp_${Date.now()}`;
    const optimistic = { id: tempId, ...data, status: data.status ?? "active" };
    const snapshot = get().categories;

    if (optimistic.status === "active") {
      set((state) => ({ categories: [optimistic, ...state.categories] }));
    }

    try {
      const res = await categoryService.create(data);
      const category = res?.data?.data ?? res?.data;
      if (!category) return null;

      set((state) => ({
        categories:
          category.status === "active"
            ? state.categories.map((item) =>
                item.id === tempId ? category : item
              )
            : state.categories.filter((item) => item.id !== tempId),
        currentCategory: category,
      }));

      return category;
    } catch (error) {
      // Revert
      set({
        categories: snapshot,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create category",
      });
      throw error;
    }
  },

  // UPDATE — optimistic
  updateCategory: async (id, data) => {
    const snapshot = {
      categories: get().categories,
      currentCategory: get().currentCategory,
    };

    set((state) => ({
      categories:
        (data.status ?? state.categories.find((c) => c.id === id)?.status) ===
        "active"
          ? state.categories.map((cat) =>
              cat.id === id ? { ...cat, ...data } : cat
            )
          : state.categories.filter((cat) => cat.id !== id),
      currentCategory:
        state.currentCategory?.id === id
          ? { ...state.currentCategory, ...data }
          : state.currentCategory,
    }));

    try {
      const res = await categoryService.update(id, data);
      const updated = res?.data?.data ?? res?.data;
      if (!updated) return null;

      // Reconcile with server truth
      set((state) => ({
        categories:
          updated.status === "active"
            ? state.categories.some((cat) => cat.id === id)
              ? state.categories.map((cat) => (cat.id === id ? updated : cat))
              : [updated, ...state.categories]
            : state.categories.filter((cat) => cat.id !== id),
        currentCategory:
          state.currentCategory?.id === id ? updated : state.currentCategory,
      }));

      return updated;
    } catch (error) {
      // Revert
      set({
        ...snapshot,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update category",
      });
      throw error;
    }
  },

  // DELETE SINGLE — optimistic
  deleteCategory: async (id) => {
    const snapshot = {
      categories: get().categories,
      currentCategory: get().currentCategory,
    };

    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
      currentCategory:
        state.currentCategory?.id === id ? null : state.currentCategory,
    }));

    try {
      await categoryService.remove(id);
    } catch (error) {
      // Revert
      set({
        ...snapshot,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete category",
      });
      throw error;
    }
  },

  // BULK DELETE — optimistic
  deleteMany: async (ids) => {
    const snapshot = {
      categories: get().categories,
      currentCategory: get().currentCategory,
    };

    set((state) => ({
      categories: state.categories.filter((cat) => !ids.includes(cat.id)),
      currentCategory:
        state.currentCategory && ids.includes(state.currentCategory.id)
          ? null
          : state.currentCategory,
    }));

    try {
      await categoryService.removeMany(ids);
    } catch (error) {
      // Revert
      set({
        ...snapshot,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete categories",
      });
      throw error;
    }
  },

  // BULK STATUS UPDATE — optimistic
  updateManyStatus: async ({ ids, status }) => {
    const snapshot = {
      categories: get().categories,
      currentCategory: get().currentCategory,
    };

    set((state) => ({
      categories:
        status === "active"
          ? state.categories.map((cat) =>
              ids.includes(cat.id) ? { ...cat, status } : cat
            )
          : state.categories.filter((cat) => !ids.includes(cat.id)),
      currentCategory:
        state.currentCategory && ids.includes(state.currentCategory.id)
          ? { ...state.currentCategory, status }
          : state.currentCategory,
    }));

    try {
      await categoryService.updateManyStatus(ids, status);
    } catch (error) {
      // Revert
      set({
        ...snapshot,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update category status",
      });
      throw error;
    }
  },

  // REALTIME — unchanged
  applyCategoryChange: ({ action, category }) =>
    set((state) => {
      if (!category?.id) return state;
      const exists = state.categories.some((item) => item.id === category.id);

      if (action === "deleted" || action === "force_deleted") {
        return {
          categories: state.categories.filter(
            (item) => item.id !== category.id
          ),
          currentCategory:
            state.currentCategory?.id === category.id
              ? null
              : state.currentCategory,
        };
      }

      if (
        action === "created" ||
        action === "updated" ||
        action === "restored"
      ) {
        if (category.status !== "active") {
          return {
            categories: state.categories.filter(
              (item) => item.id !== category.id
            ),
            currentCategory:
              state.currentCategory?.id === category.id
                ? { ...state.currentCategory, ...category }
                : state.currentCategory,
          };
        }
        if (exists) {
          return {
            categories: state.categories.map((item) =>
              item.id === category.id ? { ...item, ...category } : item
            ),
            currentCategory:
              state.currentCategory?.id === category.id
                ? { ...state.currentCategory, ...category }
                : state.currentCategory,
          };
        }
        return {
          categories: [category, ...state.categories],
          currentCategory:
            state.currentCategory?.id === category.id
              ? { ...state.currentCategory, ...category }
              : state.currentCategory,
        };
      }

      return state;
    }),

  // RESET
  clearCurrentCategory: () => set({ currentCategory: null }),
  clearCategoryError: () => set({ error: null }),
}));
