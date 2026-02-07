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
      const { data } = await api.post("/login", { login, password });

      setToken(data.access_token, data.expires_in);

      set({
        user: data.user,
        loading: false,
      });

      return data.user;
    } catch (e) {
      set({
        loading: false,
        error: e.response?.data || "Login failed",
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
