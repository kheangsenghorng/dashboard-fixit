"use client";

import { create } from "zustand";
import api from "../../lib/api";
import { setToken, clearToken } from "../../lib/token";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  login: async (login, password) => {
    set({ loading: true });
  
    try {
      const { data } = await api.post("/login", {
        login,
        password,
      });
  
  
  
      const token = data.access_token;
      const user = data.user;
      setToken(token, data.expires_in);

  
      set({
        user,
        loading: false,
      });
      return user;
    } catch (e) {
      set({ loading: false });
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

  logout: () => {
    clearToken();
    set({ user: null });
  },
}));
