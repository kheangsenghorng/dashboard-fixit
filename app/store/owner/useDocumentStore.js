import { create } from "zustand";
import { ownerService } from "../../services/ownerService";

export const useDocumentOwnerStore = create((set) => ({
  documents: [],
  document: null,
  meta: null,
  loading: false,

  // ✅ Fetch all owner documents
  fetchOwnerDocuments: async () => {
    set({ loading: true });
  
    try {
      const { data } = await ownerService.getDocuments();

    
      set({
        documents: data.data ?? [],
        meta: data.meta ?? null,
      });
  
    } catch (error) {
      console.error("Fetch documents error:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchDocumentsByStatus: async (status) => {
    set({ loading: true });
  
    try {
      const { data } = await ownerService.filterStatus(status);
      set({
        documents: data.data ?? [],
        meta: data.meta ?? null,
      });
  
    } catch (error) {
      console.error("Fetch documents by status error:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchDocumentById: async (id) => {
    set({ loading: true });
    try {
      const { data } = await ownerService.getOneDocument(id);
      set({ document: data.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Upload document
  uploadDocument: async (formData) => {
    try {
      const { data } = await ownerService.uploadDocument(formData);
      return data;
    } catch (error) {
      console.error("Upload document error:", error);
      throw error;
    }
  },

  // ✅ Update document
  updateDocument: async (id, formData) => {
    try {
      const { data } = await ownerService.updateDocument(id, formData);
      return data;
    } catch (error) {
      console.error("Update document error:", error);
      throw error;
    }
  },

  // ✅ Delete document
  deleteDocument: async (id) => {
    try {
      const { data } = await ownerService.deleteDocument(id);
      return data;
    } catch (error) {
      console.error("Delete document error:", error);
      throw error;
    }
  },
}));