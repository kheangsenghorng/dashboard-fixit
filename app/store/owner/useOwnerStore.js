"use client";

import { create } from "zustand";
import { ownersService } from "../../services/owner/ownersService";

export const useOwnerStore = create((set, get) => ({
  owners: [],
  owner: null,
  meta: null,
  loading: false,
  error: null,
  lastParams: {},

  /*
  |--------------------------------------------------------------------------
  | Helper loader
  |--------------------------------------------------------------------------
  */

  withLoading: async (fn) => {
    set({ loading: true, error: null });

    try {
      return await fn();
    } catch (err) {
      set({ error: err?.response?.data || err });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Fetch owners list
  |--------------------------------------------------------------------------
  */

  fetchOwners: async (params = {}) =>
    get().withLoading(async () => {
      const { data } = await ownersService.getAll(params);

      set({
        owners: data.data || data,
        meta: data.meta || null,
        lastParams: params,
      });

      return data;
    }),

  /*
  |--------------------------------------------------------------------------
  | Fetch single owner
  |--------------------------------------------------------------------------
  */

  fetchOwner: async (id) =>
    get().withLoading(async () => {
      const { data } = await ownersService.getOne(id);

      set({
        owner: data.owner || data.data,
      });

      return data.owner || data.data;
    }),

  /*
  |--------------------------------------------------------------------------
  | Update owner
  |--------------------------------------------------------------------------
  */

  updateOwner: async (id, payload) =>
    get().withLoading(async () => {
      const { data } = await ownersService.update(id, payload);

      const updatedOwner = data.owner || data.data;

      // update owner in list
      set({
        owners: get().owners.map((o) => (o.id === id ? updatedOwner : o)),
        owner: updatedOwner,
      });

      return updatedOwner;
    }),

  /*
  |--------------------------------------------------------------------------
  | Delete owner
  |--------------------------------------------------------------------------
  */

  deleteOwner: async (id) =>
    get().withLoading(async () => {
      await ownersService.remove(id);

      set({
        owners: get().owners.filter((o) => o.id !== id),
      });
    }),

  deleteImage: async (ownerId, path) =>
    get().withLoading(async () => {
      await ownersService.deleteImage(ownerId, path);

      set((state) => ({
        owner: {
          ...state.owner,
          images: state.owner.images.filter((img) => img.path !== path),
        },
      }));
    }),
}));
