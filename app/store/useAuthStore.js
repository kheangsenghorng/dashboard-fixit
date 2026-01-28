import { create } from "zustand";
import api from "../../lib/api";
import { setToken, clearToken } from "../../lib/token";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  login: async (email, password) => {
    try {
      set({ loading: true });

      const { data } = await api.post("/login", {
        login: email,
        password,
      });

      setToken(data.token);
      set({ user: data.user, loading: false });

      return data.user;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  loadUser: async () => {
    try {
      set({ loading: true });

      const { data } = await api.get("/me");

      set({ user: data.user, loading: false });
      return data.user;
    } catch {
      clearToken();
      set({ user: null, loading: false });
      return null;
    }
  },

  logout: async () => {
    try {
      await api.post("/logout");
    } finally {
      clearToken();
      set({ user: null });
    }
  },
}));
