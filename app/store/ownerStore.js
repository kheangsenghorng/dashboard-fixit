"use client";

import { create } from "zustand";
import { ownerService } from "../services/ownerService";

const pickList = (res) => res?.data?.data?.data || res?.data?.data || [];
const pickMeta = (res) => res?.data?.data?.meta || res?.data?.meta || null;

export const useOwnerStore = create((set, get) => ({
  owners: [],
  owner: null,
  meta: null,

  // ✅ for your "eligible owners/users" dropdown
  eligibleUsers: [],
  fetchingEligibleUsers: false,

  loading: false,
  error: null,

  fetchOwners: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await ownerService.getAll(params);
      set({
        owners: pickList(res),
        meta: pickMeta(res),
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch owners",
        loading: false,
      });
    }
  },

  // ✅ NEW: fetch eligible users/owners
// ownerStore.js (or userStore.js)
fetchEligibleUsers: async (params = {}) => {
  set({ fetchingEligibleUsers: true, error: null });

  try {
    const { data } = await api.get("/users", {
      params: { per_page: 1000, ...params },
    });

    // if your API returns paginated: { data: { data: [...] } }
    const list = (data?.data?.data || data?.data || []).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
    }));

    set({ eligibleUsers: list, fetchingEligibleUsers: false });
    return data;
  } catch (err) {
    set({
      error: err.response?.data?.message || "Failed to load users",
      fetchingEligibleUsers: false,
    });
    throw err;
  }
},
  fetchOwner: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await ownerService.getOne(id);
      set({ owner: res.data.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch owner",
        loading: false,
      });
    }
  },

  createOwner: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await ownerService.create(data);
      set((state) => ({
        owners: [res.data.data, ...state.owners],
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create owner",
        loading: false,
      });
      return false;
    }
  },

  updateOwner: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await ownerService.update(id, data);
      set((state) => ({
        owner: res.data.data,
        owners: state.owners.map((o) => (o.id === Number(id) ? res.data.data : o)),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update owner",
        loading: false,
      });
      return false;
    }
  },

  deleteOwner: async (id) => {
    set({ loading: true, error: null });
    try {
      await ownerService.remove(id);
      set((state) => ({
        owners: state.owners.filter((o) => o.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete owner",
        loading: false,
      });
      return false;
    }
  },

  deleteMany: async (ids = []) => {
    set({ loading: true, error: null });
    try {
      await Promise.all(ids.map((id) => ownerService.remove(id)));
      set((state) => ({
        owners: state.owners.filter((o) => !ids.includes(o.id)),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete owners",
        loading: false,
      });
      return false;
    }
  },
}));