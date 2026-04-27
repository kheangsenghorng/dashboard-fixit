"use client";

import { create } from "zustand";
import { usersService } from "../../services/owner/usersService";

export const useUserStore = create((set, get) => ({
  users: [],
  user: null,
  meta: null,
  loading: false,
  error: null,
  successMessage: null,

  /*
    |--------------------------------------------------------------------------
    | Helper loader
    |--------------------------------------------------------------------------
    */

  withLoading: async (fn) => {
    set({
      loading: true,
      error: null,
      successMessage: null,
    });

    try {
      return await fn();
    } catch (err) {
      const error = err?.response?.data || err;

      set({ error });

      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchUsersByOwner: async (params = {}) =>
    get().withLoading(async () => {
      const { data } = await usersService.getByOwner(params);

      set({
        users: data.data?.data || data.data || [],
        meta: data.meta || null,
      });

      return data.data?.data || data.data || [];
    }),

  /*
    |--------------------------------------------------------------------------
    | Create single user by owner
    |--------------------------------------------------------------------------
    */

  createUserByOwner: async (payload) =>
    get().withLoading(async () => {
      const { data } = await usersService.create(payload);

      const createdUser = data.user || data.data;

      set((state) => ({
        users: createdUser ? [createdUser, ...state.users] : state.users,
        user: createdUser,
        successMessage: data.message || "User created successfully.",
      }));

      return createdUser;
    }),
  /*
    |--------------------------------------------------------------------------
    | Fetch single user
    |--------------------------------------------------------------------------
    */

  fetchUser: async (id) =>
    get().withLoading(async () => {
      const { data } = await usersService.getOne(id);

      const fetchedUser = data.user || data.data;

      set({ user: fetchedUser });

      return fetchedUser;
    }),

  /*
    |--------------------------------------------------------------------------
    | Update user
    |--------------------------------------------------------------------------
    */

  updateUser: async (id, payload) =>
    get().withLoading(async () => {
      const { data } = await usersService.update(id, payload);

      const updatedUser = data.user || data.data;

      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        user: updatedUser,
        successMessage: data.message || "User updated successfully.",
      }));

      return updatedUser;
    }),

  /*
    |--------------------------------------------------------------------------
    | Update avatar
    |--------------------------------------------------------------------------
    */

  updateAvatar: async (id, file) =>
    get().withLoading(async () => {
      const { data } = await usersService.uploadImage(id, file);

      const updatedUser = data.user || data.data;

      set((state) => ({
        user: updatedUser,
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        successMessage: data.message || "Avatar updated successfully.",
      }));

      // Sync auth store so Navbar updates instantly
      const { useAuthStore } = await import("@/app/store/useAuthStore");
      useAuthStore.setState({ user: updatedUser });

      return updatedUser;
    }),

  /*
    |--------------------------------------------------------------------------
    | Clear state
    |--------------------------------------------------------------------------
    */

  clearUserState: () =>
    set({
      user: null,
      error: null,
      successMessage: null,
      loading: false,
    }),
}));
