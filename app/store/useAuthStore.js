import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../../lib/api";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,

      login: async (email, password) => {
        const res = await api.post("/login", {
          login: email,
          password,
        });

        localStorage.setItem("token", res.data.token);

        const { data } = await api.get("/me");

        set({ user: data.user });
      },

      loadUser: async () => {
        try {
          const res = await api.get("/me");
          localStorage.setItem("token", res.data.token);
          set({ user: res.data.user });
        } catch {
          set({ user: null });
        }
      },

      logout: async () => {
        localStorage.removeItem("token");
        set({ user: null });
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // only persist user
    }
  )
);
