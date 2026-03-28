"use client";

import { create } from "zustand";
import { profileService } from "../../services/customer/profieService";


export const useProfileStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  setProfile: (profile) => set({ profile }),

  clearProfile: () =>
    set({
      profile: null,
      error: null,
    }),

  getProfile: async (userId) => {
    set({ loading: true, error: null });

    try {
      const { data } = await profileService.getProfile(userId);

      const profile = data.user ?? data.profile ?? data;

      set({
        profile,
        loading: false,
        error: null,
      });

      return profile;
    } catch (e) {
      const message = e?.response?.data?.message || "Failed to load profile";

      set({
        loading: false,
        error: Array.isArray(message) ? message[0] : message,
      });

      throw e;
    }
  },

  updateProfile: async (userId, payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await profileService.updateProfile(userId, payload);

      const updatedProfile = data.user ?? data.profile ?? data;

      set((state) => ({
        profile: {
          ...state.profile,
          ...updatedProfile,
        },
        loading: false,
        error: null,
      }));

      return updatedProfile;
    } catch (e) {
      const response = e?.response?.data;
      let message = "Failed to update profile";

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

  updateAvatar: async (userId, file) => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await profileService.updateAvatar(userId, formData);

      const updatedProfile = data.user ?? data.profile ?? data;

      set((state) => ({
        profile: {
          ...state.profile,
          ...updatedProfile,
        },
        loading: false,
        error: null,
      }));

      return updatedProfile;
    } catch (e) {
      const response = e?.response?.data;
      let message = "Failed to update avatar";

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
}));
