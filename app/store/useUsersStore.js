"use client";

import { create } from "zustand";
import api from "@/lib/api"; // adjust path to your axios instance

export const useUsersStore = create((set, get) => ({
  users: [],
  user: null,
  meta: null,
  isLoading: false,
  error: null,
  searchTerm: "",

  // ------------------
  // State helpers
  // ------------------
  setSearchTerm: (term) => set({ searchTerm: term }),

  withLoading: async (fn) => {
    set({ isLoading: true, error: null });
    try {
      await fn();
    } catch (e) {
      set({ error: e.response?.data || e });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ------------------
  // Create user
  // ------------------
  createUser: async (payload) =>
    get().withLoading(async () => {
      const cleanPayload = {
        ...payload,
        email: payload.email || null,
        phone: payload.phone || null,
      };

      const { data } = await api.post("/users", cleanPayload);

      set((state) => ({
        users: [data.data, ...state.users],
      }));

      return data.data;
    }),

  // ------------------
  // Generic fetch by role
  // ------------------
  fetchUsersAll: async (params = {}) =>
    get().withLoading(async () => {
      const { searchTerm } = get();
  
      const { data } = await api.get("/users", {
        params: {
          search: searchTerm || undefined,
          ...params,
        },
      });
  
      set({
        users: data.data,
        meta: data.meta,
      });
    }),
  
  fetchUsersByRole: async (role, params = {}) =>
    get().withLoading(async () => {
      const { searchTerm } = get();
  
      const { data } = await api.get("/users", {
        params: {
          role,
          search: searchTerm || undefined,
          ...params,
        },
      });
  
      set({
        users: data.data,
        meta: data.meta,
      });
    }),
  
  // ------------------
  // Specific fetchers
  // ------------------
  fetchUsers: (params = {}) =>
    get().fetchUsersByRole("customer", params),

  fetchUsersOwner: (params = {}) =>
    get().fetchUsersByRole("owner", params),

  // ------------------
  // Filter inactive users
  // ------------------
  fetchFiltersIsActiveFalse: async (params = {}) =>
    get().withLoading(async () => {
      const { data } = await api.get("/users", {
        params: { ...params, is_active: false },
      });

      set({
        users: data.data,
        meta: data.meta,
      });
    }),

  // ------------------
  // Bulk delete
  // ------------------
  deleteMany: async (ids) =>
    get().withLoading(async () => {
      if (!ids || !ids.length) return;

      await api.delete("/users/bulk", {
        data: { ids },
      });

      set((state) => ({
        users: state.users.filter((u) => !ids.includes(u.id)),
      }));
    }),

  // ------------------
  // Bulk status update
  // ------------------
  updateManyStatus: async (payload) =>
    get().withLoading(async () => {
      await api.patch("/users/status/bulk", payload);
  
      // refetch current page to keep data consistent
      const { meta, searchTerm } = get();
  
      await get().fetchUsersOwner({
        page: meta?.current_page || 1,
        search: searchTerm || undefined,
      });
    }),
  
  

  // ------------------
  // Update single user
  // ------------------
  updateUser: async (id, payload) =>
    get().withLoading(async () => {
      const cleanPayload = {
        name: payload.name,
        email: payload.email || null,
        phone: payload.phone || null,
        role: payload.role,
        is_active: payload.is_active,
      };

      const { data } = await api.put(`/users/${id}`, cleanPayload);
      const updatedUser = data.user;

      set((state) => ({
        users: state.users.map((u) =>
          u.id === updatedUser.id ? updatedUser : u
        ),
        user:
          state.user && state.user.id === updatedUser.id
            ? updatedUser
            : state.user,
      }));

      return updatedUser;
    }),

  // ------------------
  // Fetch single user
  // ------------------
  fetchUser: async (id) =>
    get().withLoading(async () => {
      const { data } = await api.get(`/users/${id}`);

      set({
        user: data.user,
      });

      return data.user;
    }),

  // ------------------
  // Update avatar
  // ------------------
  updateAvatar: async (id, file) =>
    get().withLoading(async () => {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await api.post(
        `/users/${id}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data.user;
    }),
}));
