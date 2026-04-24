import { create } from "zustand";
import paymentAccountService from "../../services/payment-account/paymet-account";

const usePaymentAccountStore = create((set, get) => ({
  paymentAccounts: [],
  paymentAccount: null,

  hasBankAccount: false,
  canAddBankAccount: true,

  loading: false,
  error: null,
  message: null,

  fetchPaymentAccounts: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await paymentAccountService.getAll(params);

      set({
        paymentAccounts: response.data.data || response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch payment accounts",
        loading: false,
      });

      throw error;
    }
  },

  fetchPaymentAccountById: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await paymentAccountService.getById(id);

      set({
        paymentAccount: response.data.data || response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch payment account",
        loading: false,
      });

      throw error;
    }
  },
  getPaymentAccountByUserId: async (userId) => {
    set({ loading: true, error: null });

    try {
      const response = await paymentAccountService.getByUserId(userId);

      const result = response.data?.data || response.data;

      set({
        paymentAccount: Array.isArray(result) ? result[0] || null : result,
        loading: false,
      });

      return result;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch payment account by user ID.",
        loading: false,
      });

      throw error;
    }
  },
  createPaymentAccount: async (data) => {
    set({ loading: true, error: null, message: null });

    try {
      const response = await paymentAccountService.create(data);

      const newPaymentAccount = response.data.data;

      set({
        paymentAccounts: [...get().paymentAccounts, newPaymentAccount],
        paymentAccount: newPaymentAccount,
        message: response.data.message,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to create payment account",
        loading: false,
      });

      throw error;
    }
  },

  updatePaymentAccount: async (id, data) => {
    set({ loading: true, error: null, message: null });

    try {
      const response = await paymentAccountService.update(id, data);

      const updatedPaymentAccount = response.data.data;

      set({
        paymentAccounts: get().paymentAccounts.map((item) =>
          item.id === id ? updatedPaymentAccount : item
        ),
        paymentAccount: updatedPaymentAccount,
        message: response.data.message,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to update payment account",
        loading: false,
      });

      throw error;
    }
  },

  patchPaymentAccount: async (id, data) => {
    set({ loading: true, error: null, message: null });

    try {
      const response = await paymentAccountService.patch(id, data);

      const updatedPaymentAccount = response.data.data;

      set({
        paymentAccounts: get().paymentAccounts.map((item) =>
          item.id === id ? updatedPaymentAccount : item
        ),
        paymentAccount: updatedPaymentAccount,
        message: response.data.message,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to update payment account",
        loading: false,
      });

      throw error;
    }
  },

  deletePaymentAccount: async (id) => {
    set({ loading: true, error: null, message: null });

    try {
      const response = await paymentAccountService.delete(id);

      set({
        paymentAccounts: get().paymentAccounts.filter((item) => item.id !== id),
        paymentAccount: null,
        message: response.data.message,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to delete payment account",
        loading: false,
      });

      throw error;
    }
  },

  checkCompanyBankAccount: async (userId) => {
    set({ loading: true, error: null, message: null });

    try {
      const response = await paymentAccountService.checkCompanyBankAccount(
        userId
      );

      set({
        hasBankAccount: response.data.has_bank_account,
        canAddBankAccount: !response.data.has_bank_account,
        paymentAccount: response.data.data,
        message: response.data.message,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to check company bank account",
        loading: false,
      });

      throw error;
    }
  },

  clearPaymentAccountState: () => {
    set({
      paymentAccount: null,
      error: null,
      message: null,
      hasBankAccount: false,
      canAddBankAccount: true,
    });
  },
}));

export default usePaymentAccountStore;
