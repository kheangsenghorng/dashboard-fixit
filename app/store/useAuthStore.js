"use client";

import { create } from "zustand";
import api from "../../lib/api";
import { setToken, clearToken } from "../../lib/token";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // ------------------
  // Helpers
  // ------------------
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // ------------------
  // Actions
  // ------------------

  login: async (login, password) => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.post("/login", {
        login,
        password,
      });

      /**
       * Expected API response:
       * {
       *   access_token: "xxxx",
       *   user: {
       *     id: 1,
       *     name: "Admin",
       *     role: "admin"
       *   }
       * }
       */

      const token = data.access_token;
      const user = data.user;

      // Save token + role for middleware
      setToken(token, user.role);

      set({
        user,
        loading: false,
      });

      return user;
    } catch (e) {
      const message =
        e.response?.data?.message ||
        e.response?.data ||
        "Login failed";

      set({
        loading: false,
        error: message,
      });

      throw e;
    }
  },

  loadUser: async () => {
    try {
      const { data } = await api.get("/me");
      set({ user: data });
      return data;
    } catch {
      clearToken();
      set({ user: null });
    }
  },

  logout: async () => {
    set({ loading: true });

    try {
      await api.post("/logout");
    } catch (e) {
      console.warn("Logout API failed, clearing local session");
    } finally {
      clearToken();
      set({
        user: null,
        loading: false,
      });
    }
  },
}));
