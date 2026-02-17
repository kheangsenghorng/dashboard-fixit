"use client";

import { create } from "zustand";
import { ownerService } from "../services/ownerService";


const pickList = (res) => res?.data?.data?.data || res?.data?.data || [];
const pickMeta = (res) => res?.data?.data?.meta || res?.data?.meta || null;

export const useOwnerStore = create((set, get) => ({
  owners: [],
  owner: null,
  meta: null,
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
        owners: state.owners.map((o) =>
          o.id === Number(id) ? res.data.data : o
        ),
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

  // ✅ BULK DELETE
  deleteMany: async (ids = []) => {
    // If your backend doesn't have bulk delete endpoint,
    // we do multiple delete requests.
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
