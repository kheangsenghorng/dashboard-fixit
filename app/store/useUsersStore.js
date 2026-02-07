"use client";

import { create } from "zustand";
import api from "@/lib/api"; // adjust path to your axios instance

export const useUsersStore = create((set, get) => ({
  users: [],
  user: null,
  meta: null,
  loading: false,
  error: null,
  searchTerm: "",

  setSearchTerm: (term) => set({ searchTerm: term }),

  withLoading: async (fn) => {
    set({ loading: true, error: null });
    try {
      await fn();
    } catch (e) {
      set({ error: e.response?.data || e });
      throw e;
    } finally {
      set({ loading: false });
    }
  },
  // ------------------
  // Actions create users
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
  

  fetchUsers: async (params = {}) =>
    get().withLoading(async () => {
      const { searchTerm, lastSyncAt } = get();

      const { data } = await api.get("/users", {
        params: {
          role: "customer",
          search: searchTerm || undefined,
          updated_after: lastSyncAt || undefined,
          ...params,
        },
      });

      set({
        users: params.updated_after
          ? [...get().users, ...data.data] // append updates
          : data.data,
        meta: data.meta,
        lastSyncAt: data.meta?.last_sync_at ?? lastSyncAt,
      });
    }),

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
    

  updateManyStatus: async (payload) =>
    get().withLoading(async () => {
      const { data } = await api.patch("/users/status/bulk", payload);

      set((state) => ({
        users: state.users.map(
          (u) => data.users.find((x) => x.id === u.id) || u
        ),
      }));
    }),
}));
