import { create } from "zustand";
import { servicePaymentKhqrService } from "../../services/khqr/servicePaymentKhqrService";


const useServicePaymentKhqrStore = create((set) => ({
  loading: false,
  error: null,
  transactionResult: null,
  khqrResult: null,

  generateIndividualKhqr: async (data) => {
    try {
      set({ loading: true, error: null });

      const response =
        await servicePaymentKhqrService.generateIndividualKhqr(data);

      set({
        khqrResult: response.data,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to generate individual KHQR",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  generateMerchantKhqr: async (data) => {
    try {
      set({ loading: true, error: null });

      const response =
        await servicePaymentKhqrService.generateMerchantKhqr(data);

      set({
        khqrResult: response.data,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to generate merchant KHQR",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  generateKhqrImage: async (data) => {
    try {
      set({ loading: true, error: null });

      const response =
        await servicePaymentKhqrService.generateKhqrImage(data);

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to generate KHQR image",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  generateDeeplink: async (data) => {
    try {
      set({ loading: true, error: null });

      const response =
        await servicePaymentKhqrService.generateDeeplink(data);

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to generate deeplink",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  checkTransactionByMd5: async (md5) => {
    try {
      set({ loading: true, error: null });

      const response =
        await servicePaymentKhqrService.checkTransactionByMd5(md5);

      set({
        transactionResult: response.data,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to check transaction by MD5",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  checkTransactionByHash: async (hash) => {
    try {
      set({ loading: true, error: null });

      const response =
        await servicePaymentKhqrService.checkTransactionByHash(hash);

      set({
        transactionResult: response.data,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to check transaction by hash",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  checkBakongAccount: async (accountId) => {
    try {
      set({ loading: true, error: null });

      const response =
        await servicePaymentKhqrService.checkBakongAccount(accountId);

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to check Bakong account",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  checkTransactionByExternalRef: async (externalRef) => {
    try {
      set({ loading: true, error: null });
  
      const response =
        await servicePaymentKhqrService.checkTransactionByExternalRef(
          externalRef
        );
  
      const result = response?.data?.data;
  
      set({
        transactionResult: result,
      });
  
      return result;
    } catch (error) {
      console.log("KHQR check error:", error.response?.data);
  
      set({
        error:
          error?.response?.data?.data?.responseMessage ||
          error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to check transaction by external reference",
      });
  
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearKhqrResult: () => {
    set({
      khqrResult: null,
    });
  },

  clearTransactionResult: () => {
    set({
      transactionResult: null,
      error: null,
    });
  },
}));

export default useServicePaymentKhqrStore;