"use client";

import { create } from "zustand";
import { paymentService } from "../../services/paymentService";

export const usePaymentStore = create((set) => ({
  payments: [],
  payment: null,
  loading: false,
  error: null,
  meta: null,

  setPayments: (payments) => set({ payments }),
  setPayment: (payment) => set({ payment }),
  clearPayment: () => set({ payment: null }),
  clearError: () => set({ error: null }),

  addPayment: (payment) =>
    set((state) => {
      const exists = state.payments.some((item) => item.id === payment.id);
      if (exists) return state;

      return {
        payments: [payment, ...state.payments],
      };
    }),

  replacePayment: (payment) =>
    set((state) => ({
      payments: state.payments.map((item) =>
        item.id === payment.id ? payment : item
      ),
      payment: state.payment?.id === payment.id ? payment : state.payment,
    })),

  removePayment: (id) =>
    set((state) => ({
      payments: state.payments.filter((item) => item.id !== id),
      payment: state.payment?.id === id ? null : state.payment,
    })),

  fetchPayments: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const res = await paymentService.getAll(params);
      const payload = res.data;

      set({
        payments: payload?.data ?? payload ?? [],
        meta: payload?.meta ?? null,
        loading: false,
      });

      return payload;
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to fetch payments",
        loading: false,
      });
      throw error;
    }
  },

  fetchPayment: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await paymentService.getOne(id);
      const payload = res.data;
      const payment = payload?.data ?? payload;

      set({
        payment,
        loading: false,
      });

      return payment;
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to fetch payment",
        loading: false,
      });
      throw error;
    }
  },

  createPayment: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await paymentService.create(data);
      const payload = res.data;
      const payment = payload?.data ?? payload;

      set((state) => ({
        payments: [payment, ...state.payments],
        payment,
        loading: false,
      }));

      return payment;
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to create payment",
        loading: false,
      });
      throw error;
    }
  },

  updatePayment: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const res = await paymentService.update(id, data);
      const payload = res.data;
      const payment = payload?.data ?? payload;

      set((state) => ({
        payments: state.payments.map((item) =>
          item.id === payment.id ? payment : item
        ),
        payment: state.payment?.id === payment.id ? payment : state.payment,
        loading: false,
      }));

      return payment;
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to update payment",
        loading: false,
      });
      throw error;
    }
  },

  deletePayment: async (id) => {
    set({ loading: true, error: null });

    try {
      await paymentService.remove(id);

      set((state) => ({
        payments: state.payments.filter((item) => item.id !== id),
        payment: state.payment?.id === id ? null : state.payment,
        loading: false,
      }));

      return true;
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to delete payment",
        loading: false,
      });
      throw error;
    }
  },
}));