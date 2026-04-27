import { create } from "zustand";
import { serviceBookingService } from "../services/serviceBookingService";

export const useServiceBookingStore = create((set) => ({
  serviceBookings: [],
  serviceBooking: null,
  pagination: null,
  loading: false,
  error: null,

  fetchServiceBookings: async (params = {}) => {
    try {
      set({ loading: true, error: null });

      const response = await serviceBookingService.getAll(params);

      const bookings = response?.data?.data?.data || response?.data?.data || [];
      const pagination =
        response?.data?.data?.meta || response?.data?.meta || null;

      set({
        serviceBookings: bookings,
        pagination,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error?.response?.data?.message || "Failed to fetch service bookings",
        loading: false,
        serviceBookings: [],
      });
    }
  },

  fetchServiceBookingsByOwner: async (ownerId, params = {}) => {
    try {
      set({ loading: true, error: null });

      const response = await serviceBookingService.getByOwnerId(
        ownerId,
        params
      );

      const bookings = response?.data?.data || [];
      const pagination = response?.data?.pagination || null;

      set({
        serviceBookings: bookings,
        pagination,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to fetch owner service bookings",
        loading: false,
        serviceBookings: [],
        pagination: null,
      });

      throw error;
    }
  },
  fetchServiceBooking: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await serviceBookingService.getOne(id);

      set({
        serviceBooking: response?.data?.data || response?.data || null,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error?.response?.data?.message || "Failed to fetch service booking",
        loading: false,
      });
    }
  },

  createServiceBooking: async (data) => {
    try {
      set({ loading: true, error: null });

      const response = await serviceBookingService.create(data);
      const newBooking = response?.data?.data || response?.data;

      set((state) => ({
        serviceBookings: newBooking
          ? [newBooking, ...state.serviceBookings]
          : state.serviceBookings,
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message || "Failed to create service booking",
        loading: false,
      });

      throw error;
    }
  },

  updateServiceBooking: async (id, data) => {
    try {
      set({ loading: true, error: null });

      const response = await serviceBookingService.update(id, data);
      const updatedBooking = response?.data?.data || response?.data;

      set((state) => ({
        serviceBookings: state.serviceBookings.map((item) =>
          item.id === id ? updatedBooking : item
        ),
        serviceBooking: updatedBooking,
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message || "Failed to update service booking",
        loading: false,
      });

      throw error;
    }
  },

  patchServiceBooking: async (id, data) => {
    try {
      set({ loading: true, error: null });

      const response = await serviceBookingService.patch(id, data);
      const patchedBooking = response?.data?.data || response?.data;

      set((state) => ({
        serviceBookings: state.serviceBookings.map((item) =>
          item.id === id ? { ...item, ...patchedBooking } : item
        ),
        serviceBooking:
          state.serviceBooking?.id === id
            ? { ...state.serviceBooking, ...patchedBooking }
            : state.serviceBooking,
        loading: false,
      }));

      return response.data;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message || "Failed to patch service booking",
        loading: false,
      });

      throw error;
    }
  },
  fetchServiceBookingHistoryByOwner: async (ownerId, params = {}) => {
    try {
      set({ loading: true, error: null });

      const response = await serviceBookingService.getHistoryByOwnerId(
        ownerId,
        params
      );

      const bookings = response?.data?.data?.data || response?.data?.data || [];

      const pagination =
        response?.data?.data?.meta ||
        response?.data?.meta ||
        response?.data?.pagination ||
        null;

      set({
        serviceBookings: bookings,
        pagination,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Failed to fetch owner service booking history",
        loading: false,
        serviceBookings: [],
        pagination: null,
      });

      throw error;
    }
  },

  deleteServiceBooking: async (id) => {
    try {
      set({ loading: true, error: null });

      await serviceBookingService.remove(id);

      set((state) => ({
        serviceBookings: state.serviceBookings.filter((item) => item.id !== id),
        serviceBooking:
          state.serviceBooking?.id === id ? null : state.serviceBooking,
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error?.response?.data?.message || "Failed to delete service booking",
        loading: false,
      });

      throw error;
    }
  },

  addServiceBooking: (serviceBooking) =>
    set((state) => {
      const exists = state.serviceBookings.some(
        (item) => item.id === serviceBooking.id
      );

      if (exists) return state;

      return {
        serviceBookings: [serviceBooking, ...state.serviceBookings],
      };
    }),

  replaceServiceBooking: (serviceBooking) =>
    set((state) => ({
      serviceBookings: state.serviceBookings.map((item) =>
        item.id === serviceBooking.id ? serviceBooking : item
      ),
      serviceBooking:
        state.serviceBooking?.id === serviceBooking.id
          ? serviceBooking
          : state.serviceBooking,
    })),

  removeServiceBooking: (serviceBookingId) =>
    set((state) => ({
      serviceBookings: state.serviceBookings.filter(
        (item) => item.id !== serviceBookingId
      ),
      serviceBooking:
        state.serviceBooking?.id === serviceBookingId
          ? null
          : state.serviceBooking,
    })),
}));
