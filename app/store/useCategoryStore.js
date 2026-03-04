"use client";

import { create } from "zustand";
import { categoryService } from "../services/categoryService";

export const useCategoryStore = create((set) => ({
  categories: [],
  currentCategory: null,
  meta: null,
  isLoading: false,
  error: null,

  // FETCH ALL
  fetchCategories: async (params = {}) => {
    try {
      set({ isLoading: true });

      const res = await categoryService.getAll(params);

      set({
        categories: res.data.data ?? [],
        meta: res.data.meta ?? null,
        isLoading: false,
      });

    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  // FETCH SINGLE
  fetchCategory: async (id) => {
    try {
      set({ isLoading: true });

      const res = await categoryService.getOne(id);

      const category = res.data.data ?? res.data;

      set({
        currentCategory: category,
        isLoading: false,
      });

      return category;

    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // CREATE
  createCategory: async (data) => {
    try {
      const res = await categoryService.create(data);

      const category = res.data.data ?? res.data;

      set((state) => ({
        categories: [category, ...state.categories],
      }));

      return category;

    } catch (error) {
      throw error;
    }
  },

  // UPDATE
  updateCategory: async (id, data) => {
    try {
      const res = await categoryService.update(id, data);

      const updated = res.data.data ?? res.data;

      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? updated : cat
        ),
        currentCategory: updated,
      }));

      return updated;

    } catch (error) {
      throw error;
    }
  },

  // DELETE SINGLE
  deleteCategory: async (id) => {
    try {
      await categoryService.remove(id);

      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
      }));

    } catch (error) {
      throw error;
    }
  },

  // BULK DELETE
  deleteMany: async (ids) => {
    try {
      await categoryService.removeMany(ids);

      set((state) => ({
        categories: state.categories.filter((cat) => !ids.includes(cat.id)),
      }));

    } catch (error) {
      throw error;
    }
  },

  // BULK STATUS UPDATE
  updateManyStatus: async ({ ids, status }) => {
    try {
      await categoryService.updateManyStatus(ids, status);

      set((state) => ({
        categories: state.categories.map((cat) =>
          ids.includes(cat.id) ? { ...cat, status } : cat
        ),
      }));

    } catch (error) {
      throw error;
    }
  },
}));