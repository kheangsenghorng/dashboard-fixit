import { create } from "zustand";
import { typesService } from "../services/typesService";

export const useTypeStore = create((set, get) => ({
  types: [],
  activeTypes: [],
  typeCategory: [], // ✅ separate state for category-scoped types
  type: null,
  meta: null,
  loading: false,

  // local setters for realtime
  setTypes: (types, meta = null) => set({ types, meta }),

  setActiveTypes: (activeTypes) => set({ activeTypes }),

  // ✅ NEW: setter for category-scoped types (used by realtime listeners)
  setTypeCategory: (typeCategory) => set({ typeCategory }),

  addType: (newType) =>
    set((state) => {
      const existsInTypes = state.types.some((t) => t.id === newType.id);
      const existsInActive = state.activeTypes.some((t) => t.id === newType.id);
      const existsInCategory = state.typeCategory.some(
        (t) => t.id === newType.id
      );

      return {
        types: existsInTypes ? state.types : [newType, ...state.types],
        activeTypes:
          newType.status === "active"
            ? existsInActive
              ? state.activeTypes
              : [newType, ...state.activeTypes]
            : state.activeTypes,
        // ✅ only add to typeCategory if it belongs to the same category
        typeCategory:
          newType.status === "active" && !existsInCategory
            ? [newType, ...state.typeCategory]
            : state.typeCategory,
      };
    }),

  replaceType: (updatedType) =>
    set((state) => {
      const existsInTypes = state.types.some((t) => t.id === updatedType.id);
      const existsInActive = state.activeTypes.some(
        (t) => t.id === updatedType.id
      );
      const existsInCategory = state.typeCategory.some(
        (t) => t.id === updatedType.id
      );

      return {
        types: existsInTypes
          ? state.types.map((t) => (t.id === updatedType.id ? updatedType : t))
          : [updatedType, ...state.types],

        activeTypes:
          updatedType.status === "active"
            ? existsInActive
              ? state.activeTypes.map((t) =>
                  t.id === updatedType.id ? updatedType : t
                )
              : [updatedType, ...state.activeTypes]
            : state.activeTypes.filter((t) => t.id !== updatedType.id),

        // ✅ update typeCategory independently — no global reset
        typeCategory:
          updatedType.status === "active"
            ? existsInCategory
              ? state.typeCategory.map((t) =>
                  t.id === updatedType.id ? updatedType : t
                )
              : state.typeCategory
            : state.typeCategory.filter((t) => t.id !== updatedType.id),

        type: state.type?.id === updatedType.id ? updatedType : state.type,
      };
    }),

  removeType: (id) =>
    set((state) => ({
      types: state.types.filter((t) => t.id !== id),
      activeTypes: state.activeTypes.filter((t) => t.id !== id),
      typeCategory: state.typeCategory.filter((t) => t.id !== id), // ✅
      type: state.type?.id === id ? null : state.type,
    })),

  // Fetch all
  fetchTypes: async (filters = {}) => {
    set({ loading: true });
    try {
      const res = await typesService.getAll(filters);
      set({
        types: res.data.data,
        meta: res.data.meta,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch types error:", error);
      set({ loading: false });
    }
  },

  // Fetch active
  fetchActiveTypes: async () => {
    try {
      const res = await typesService.getActive();
      set({ activeTypes: res.data.data });
    } catch (error) {
      console.error("Fetch active types error:", error);
    }
  },

  // Fetch action publish types
  fatchTypeAction: async () => {
    try {
      const res = await typesService.getTypeAction();
      set({ activeTypes: res?.data?.data || [] });
    } catch (error) {
      console.error("Fetch action public types error:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        url: error?.config?.url,
      });
      set({ activeTypes: [] });
    }
  },

  // ✅ FIXED: Fetch by category — now uses typeCategory instead of activeTypes
  // This prevents the realtime listener from wiping activeTypes globally
  fetchTypesCategory: async (categoryId) => {
    if (!categoryId) {
      set({ typeCategory: [] });
      return;
    }

    try {
      const res = await typesService.getTypesByCategory(categoryId);
      set({
        typeCategory: res?.data?.data || [], // ✅ isolated — won't affect activeTypes
      });
    } catch (error) {
      console.error("Fetch types by category error:", error);
      set({ typeCategory: [] });
    }
  },

  // Fetch single
  fetchType: async (id) => {
    try {
      const res = await typesService.getOne(id);
      set({ type: res.data.data });
    } catch (error) {
      console.error("Fetch type error:", error);
    }
  },

  // Create
  createType: async (data) => {
    try {
      const res = await typesService.create(data);
      if (res.data?.data) {
        get().addType(res.data.data);
      }
      return res.data;
    } catch (error) {
      console.error("Create type error:", error);
      throw error;
    }
  },

  // Update
  updateType: async (id, payload) => {
    try {
      const res = await typesService.updateType(id, payload);
      if (res.data?.data) {
        get().replaceType(res.data.data);
      }
      return res.data;
    } catch (error) {
      console.error("Update type error:", error);
      throw error;
    }
  },

  // Delete
  deleteType: async (id) => {
    try {
      await typesService.remove(id);
      get().removeType(id);
    } catch (error) {
      console.error("Delete type error:", error);
      throw error;
    }
  },

  // Bulk delete
  deleteManyTypes: async (ids) => {
    try {
      await typesService.deleteMany(ids);
      set((state) => ({
        types: state.types.filter((t) => !ids.includes(t.id)),
        activeTypes: state.activeTypes.filter((t) => !ids.includes(t.id)),
        typeCategory: state.typeCategory.filter((t) => !ids.includes(t.id)), // ✅
        type: ids.includes(state.type?.id) ? null : state.type,
      }));
    } catch (error) {
      console.error("Bulk delete error:", error);
      throw error;
    }
  },

  // Bulk status
  updateManyStatus: async (ids, status) => {
    try {
      await typesService.updateManyStatus(ids, status);
      set((state) => ({
        types: state.types.map((t) =>
          ids.includes(t.id) ? { ...t, status } : t
        ),
        activeTypes:
          status === "active"
            ? state.activeTypes
            : state.activeTypes.filter((t) => !ids.includes(t.id)),
        typeCategory:
          status === "active"
            ? state.typeCategory
            : state.typeCategory.filter((t) => !ids.includes(t.id)), // ✅
        type:
          state.type && ids.includes(state.type.id)
            ? { ...state.type, status }
            : state.type,
      }));
    } catch (error) {
      console.error("Bulk status update error:", error);
      throw error;
    }
  },
}));
