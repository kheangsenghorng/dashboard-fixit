import { create } from "zustand";
import { serviceBookingService } from "../services/serviceBookingService";


const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error?.response?.data?.errors) {
    return Object.values(error.response.data.errors).flat().join(" ");
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
};

export const useServiceBookingStore = create((set) => ({
  serviceBookings: [],
  refundedBookings: [],
  serviceBooking: null,
  pagination: null,

  loading: false,
  error: null,
  successMessage: null,

  cancelRefundLoading: false,
  cancelRefundBookingId: null,

  clearMessages: () =>
    set({
      error: null,
      successMessage: null,
    }),

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

      return response.data;
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Failed to fetch service bookings"
      );

      set({
        error: message,
        loading: false,
        serviceBookings: [],
      });

      throw error;
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
      const message = getErrorMessage(
        error,
        "Failed to fetch owner service bookings"
      );

      set({
        error: message,
        loading: false,
        serviceBookings: [],
        pagination: null,
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
      const message = getErrorMessage(
        error,
        "Failed to fetch owner service booking history"
      );

      set({
        error: message,
        loading: false,
        serviceBookings: [],
        pagination: null,
      });

      throw error;
    }
  },

  // display by admin
  fetchRefundedCancelledByadmin: async (params = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });
  
      const res = await serviceBookingService.getRefundByadmin(params);
  
      const bookings = res?.data?.data || [];
      const pagination = res?.data?.pagination || {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: bookings.length,
      };
  
      set({
        refundedBookings: bookings,
        pagination,
        loading: false,
      });
  
    } catch (error) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch refunded bookings",
      });
    }
  },

  //display by owner refunded 
  fetchRefundedCancelledByOwner: async (ownerId, params = {}) => {
    try {
      set({ loading: true, error: null });

      const response = await serviceBookingService.getRefundedCancelled(
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
      const message = getErrorMessage(
        error,
        "Failed to fetch refunded cancelled bookings"
      );

      set({
        error: message,
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

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch service booking");

      set({
        error: message,
        loading: false,
      });

      throw error;
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
      const message = getErrorMessage(
        error,
        "Failed to create service booking"
      );

      set({
        error: message,
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
        serviceBooking:
          state.serviceBooking?.id === id
            ? updatedBooking
            : state.serviceBooking,
        loading: false,
      }));

      return response.data;
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Failed to update service booking"
      );

      set({
        error: message,
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
      const message = getErrorMessage(error, "Failed to patch service booking");

      set({
        error: message,
        loading: false,
      });

      throw error;
    }
  },

  cancelRefundBooking: async (bookingId, reason = "") => {
    try {
      set({
        cancelRefundLoading: true,
        cancelRefundBookingId: bookingId,
        error: null,
        successMessage: null,
      });

      const response = await serviceBookingService.cancelRefundBooking(
        bookingId,
        {
          reason,
        }
      );

      const updatedBooking = response?.data?.data || response?.data;
      const message =
        response?.data?.message ||
        "Booking cancelled and refund added to customer wallet successfully.";

      set((state) => ({
        serviceBookings: state.serviceBookings.map((item) =>
          item.id === bookingId ? updatedBooking : item
        ),
        serviceBooking:
          state.serviceBooking?.id === bookingId
            ? updatedBooking
            : state.serviceBooking,

        cancelRefundLoading: false,
        cancelRefundBookingId: null,
        successMessage: message,
      }));

      return {
        success: true,
        message,
        data: updatedBooking,
      };
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Failed to cancel and refund booking"
      );

      set({
        error: message,
        cancelRefundLoading: false,
        cancelRefundBookingId: null,
      });

      return {
        success: false,
        message,
      };
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
      const message = getErrorMessage(
        error,
        "Failed to delete service booking"
      );

      set({
        error: message,
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
