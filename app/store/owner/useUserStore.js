"use client";

import { create } from "zustand";
import { usersService } from "../../services/owner/usersService";

export const useUserStore = create((set, get) => ({
  users: [],
  user: null,
  meta: null,
  loading: false,
  error: null,

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
    | Fetch single user
    |--------------------------------------------------------------------------
    */

  fetchUser: async (id) =>
    get().withLoading(async () => {
      const { data } = await usersService.getOne(id);

      set({ user: data.user || data.data });

      return data.user || data.data;
    }),

  /*
    |--------------------------------------------------------------------------
    | Update user
    |--------------------------------------------------------------------------
    */

  updateUser: async (id, payload) =>
    get().withLoading(async () => {
      const { data } = await usersService.update(id, payload);

      const users = get().users.map((u) =>
        u.id === id ? data.user || data.data : u
      );

      set({ users });

      return data.user || data.data;
    }),

  updateAvatar: async (id, file) =>
    get().withLoading(async () => {
      const { data } = await usersService.uploadImage(id, file);

      const updatedUser = data.user || data.data;

      // update this store
      set({ user: updatedUser });

      // sync auth store so Navbar updates instantly
      const { useAuthStore } = await import("@/app/store/useAuthStore");
      useAuthStore.setState({ user: updatedUser });

      return updatedUser;
    }),
}));
