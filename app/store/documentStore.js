import { create } from "zustand";
import { documentService } from "../services/documentService";


export const useDocumentStore = create((set) => ({
  documents: [],
  meta: null,
  loading: false,

  fetchDocuments: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await documentService.getAll(params);

      set({
        documents: data.data,
        meta: data.meta,
      });
    } catch (error) {
      console.error("Fetch documents error:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchDocumentsIdOwner: async (ownerId) => {
    set({ loading: true });
    try {
      const res = await documentService.filterByOwner(ownerId);
      const data = res.data;
      set({
        documents: data.data ?? data ?? [],
        meta: data.meta ?? null,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch document by ownerId error:", error);
      set({ loading: false });
      throw error;
    }
  },
  // Send notify missing documents email
  sendMissingDocumentEmail: async (payload) => {
    set({ emailLoading: true });

    try {
      const { data } = await documentService.sendEmail(payload);
      return data;
    } catch (error) {
      console.error("Send missing document email error:", error);
      throw error;
    } finally {
      set({ emailLoading: false });
    }
  },

  sendOtp: async (id) => {
    const { data } = await documentService.sendOtp(id);
    return data;
  },

  verifyOtp: async (id, otp) => {
    const { data } = await documentService.verifyOtp(id, otp);
    return data;
  },

  reviewDocument: async (id, payload) => {
    const { data } = await documentService.review(id, payload);
    return data;
  },
}));