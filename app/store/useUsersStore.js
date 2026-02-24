"use client";

import { create } from "zustand";
import api from "@/lib/api";

export const useUsersStore = create((set, get) => ({
  users: [],
  user: null,
  meta: null,
  counts: null, // ✅ { owners, customers, providers, total }
  isLoading: false,
  error: null,

  // UI state
  searchTerm: "",
  lastParams: {}, // ✅ remember last query params so refetch is easy


  

  setSearchTerm: (term) => set({ searchTerm: term }),

  withLoading: async (fn) => {
    set({ isLoading: true, error: null });
    try {
      return await fn();
    } catch (e) {
      set({ error: e?.response?.data || e });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  // ------------------
  // FETCH USERS (single source of truth)
  // params: { page, role, is_active, per_page, updated_after, search }
  // role supports: "all" | "owner" | "customer" | "provider"
  // ------------------
  fetchUsers: async (params = {}) =>
    get().withLoading(async () => {
      const { searchTerm } = get();

      const merged = {
        search: params.search ?? searchTerm ?? undefined,
        ...params,
      };

      // if role = "all" -> don't send role
      // backend should treat missing role as all allowed roles
      if (merged.role === "all") delete merged.role;

      const { data } = await api.get("/users", { params: merged });

      set({
        users: data.data || [],
        meta: data.meta || null,
        counts: data.counts || null,
        lastParams: merged,
      });

      return data;
    }),

  // ------------------
  // CREATE USER
  // ------------------
  createUser: async (payload) =>
    get().withLoading(async () => {
      const cleanPayload = {
        ...payload,
        email: payload.email || null,
        phone: payload.phone || null,
      };

      const { data } = await api.post("/users", cleanPayload);

      // Optional: refetch to keep counts/meta accurate
      await get().fetchUsers({ ...get().lastParams, page: 1 });

      return data.data;
    }),

  // ------------------
  // BULK DELETE
  // ------------------
  deleteMany: async (ids = []) =>
    get().withLoading(async () => {
      if (!ids.length) return;

      await api.delete("/users/bulk", { data: { ids } });

      // refetch to keep meta + counts correct
      const { meta, lastParams } = get();
      await get().fetchUsers({ ...lastParams, page: meta?.current_page || 1 });
    }),

  // ------------------
  // BULK STATUS UPDATE
  // payload: { ids: [], is_active: true|false }
  // ------------------
  updateManyStatus: async (payload) =>
    get().withLoading(async () => {
      await api.patch("/users/status/bulk", payload);

      const { meta, lastParams } = get();
      await get().fetchUsers({ ...lastParams, page: meta?.current_page || 1 });
    }),

  // ------------------
  // UPDATE USER
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

      // refetch to keep counts correct if role/status changed
      const { meta, lastParams } = get();
      await get().fetchUsers({ ...lastParams, page: meta?.current_page || 1 });

      return data.user;
    }),

  // ------------------
  // FETCH SINGLE USER
  // ------------------
  fetchUser: async (id) =>
    get().withLoading(async () => {
      const { data } = await api.get(`/users/${id}`);
      set({ user: data.user });
      return data.user;
    }),

  // ------------------
  // UPDATE AVATAR
  // ------------------
  updateAvatar: async (id, file) =>
    get().withLoading(async () => {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await api.post(`/users/${id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // optional: refresh list
      const { meta, lastParams } = get();
      await get().fetchUsers({ ...lastParams, page: meta?.current_page || 1 });

      return data.user;
    }),
}));
