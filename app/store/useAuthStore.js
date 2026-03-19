"use client";

import { create } from "zustand";
import api from "../../lib/api";
import { setToken, clearToken, getToken } from "../../lib/token";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  otpLogin: null,
  otpChannel: null,
  otpRedirect: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setOtpContext: ({ login, channel, redirect = null }) =>
    set({
      otpLogin: login,
      otpChannel: channel,
      otpRedirect: redirect,
    }),

  clearOtpContext: () =>
    set({
      otpLogin: null,
      otpChannel: null,
      otpRedirect: null,
    }),

  register: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.post("/register", payload);

      set({
        loading: false,
        error: null,
        otpLogin: payload.email ?? payload.phone ?? null,
        otpChannel: payload.email ? "email" : "phone",
        otpRedirect: null,
      });

      return data;
    } catch (e) {
      const response = e?.response?.data;
      let message = "Registration failed";

      if (response?.errors) {
        message = Object.values(response.errors)?.[0]?.[0] || message;
      } else if (response?.message) {
        message = response.message;
      }

      set({
        loading: false,
        error: Array.isArray(message) ? message[0] : message,
      });

      throw e;
    }
  },

  login: async (login, password, redirect = null) => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.post("/login", {
        login,
        password,
      });

      set({
        loading: false,
        error: null,
        otpLogin: data.login || login,
        otpChannel: data.channel || null,
        otpRedirect: redirect,
      });

      return data;
    } catch (e) {
      const message = e?.response?.data?.message || "Login failed";

      set({
        loading: false,
        error: Array.isArray(message) ? message[0] : message,
      });

      throw e;
    }
  },

  verifyOtp: async (login, otp, channel) => {
    set({ loading: true, error: null });

    try {
      const endpoint =
        channel === "email" ? "/otp-email/verify" : "/otp/verify";

      const payload =
        channel === "email"
          ? { email: login, otp }
          : { phone: login, code: otp };

      const { data } = await api.post(endpoint, payload);

      const token = data.access_token;
      const user = data.user;

      setToken(token, data.expires_in, user?.role || null);

      get().clearOtpContext();
      set({
        user,
        loading: false,
        error: null,
        initialized: true,
      });

      return user;
    } catch (e) {
      const message = e?.response?.data?.message || "OTP verification failed";

      set({
        loading: false,
        error: Array.isArray(message) ? message[0] : message,
      });

      throw e;
    }
  },

  loadUser: async () => {
    if (typeof window === "undefined") {
      set({ user: null, initialized: true });
      return null;
    }

    const token = getToken();

    if (!token) {
      set({ user: null, initialized: true });
      return null;
    }

    try {
      const { data } = await api.get("/me");
      const user = data.user ?? data;

      set({
        user,
        error: null,
        initialized: true,
      });

      return user;
    } catch (e) {
      clearToken();
      set({
        user: null,
        initialized: true,
      });
      return null;
    }
  },

  resendOtp: async (login, channel) => {
    set({ loading: true, error: null });

    try {
      const endpoint = channel === "email" ? "/otp-email/resend" : "/otp/send";
      const payload =
        channel === "email" ? { email: login } : { phone: login };

      const { data } = await api.post(endpoint, payload);

      set({
        loading: false,
        error: null,
      });

      return data;
    } catch (e) {
      const message = e?.response?.data?.message || "Failed to resend OTP";

      set({
        loading: false,
        error: Array.isArray(message) ? message[0] : message,
      });

      throw e;
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
      get().clearOtpContext();

      set({
        user: null,
        error: null,
        loading: false,
        initialized: true,
      });
    }
  },
}));