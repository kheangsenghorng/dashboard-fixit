import { create } from "zustand";
import { ownerService } from "../services/ownerService";

const pickList = (res) => res?.data?.data?.data || res?.data?.data || [];
const pickMeta = (res) => res?.data?.data?.meta || res?.data?.meta || null;

export const useOwnerStore = create((set) => ({
  owners: [],
  owner: null,
  meta: null,

  eligibleUsers: [],
  fetchingEligibleUsers: false,

  loading: false,
  error: null,

  fetchOwners: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const res = await ownerService.getAll(params);

      set({
        owners: pickList(res),
        meta: pickMeta(res),
        loading: false,
      });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to fetch owners",
        loading: false,
      });
    }
  },

  fetchOwner: async (userId) => {
    set({ loading: true, error: null });

    try {
      const res = await ownerService.getByUserId(userId);

      set({
        owner: res?.data?.data?.[0] || null,
        loading: false,
      });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to fetch owner",
        loading: false,
      });
    }
  },

  createOwner: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await ownerService.create(data);

      set({
        loading: false,
      });

      return res;
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to create owner",
        loading: false,
      });
      return null;
    }
  },

  updateOwner: async (id, data) => {
    set({ loading: true, error: null });

    try {
      const res = await ownerService.update(id, data);
      const updatedOwner = res?.data?.data;

      set((state) => ({
        owner:
          Number(state.owner?.id) === Number(id) ? updatedOwner : state.owner,
        owners: state.owners.map((o) =>
          Number(o.id) === Number(id) ? updatedOwner : o
        ),
        loading: false,
      }));

      return res;
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to update owner",
        loading: false,
      });
      return null;
    }
  },

  deleteOwner: async (id) => {
    set({ loading: true, error: null });

    try {
      await ownerService.remove(id);

      set((state) => ({
        owners: state.owners.filter((o) => Number(o.id) !== Number(id)),
        owner: Number(state.owner?.id) === Number(id) ? null : state.owner,
        loading: false,
      }));

      return true;
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to delete owner",
        loading: false,
      });
      return false;
    }
  },

  deleteMany: async (ids = []) => {
    set({ loading: true, error: null });

    try {
      const numericIds = ids.map(Number);

      await Promise.all(ids.map((id) => ownerService.remove(id)));

      set((state) => ({
        owners: state.owners.filter((o) => !numericIds.includes(Number(o.id))),
        owner: numericIds.includes(Number(state.owner?.id))
          ? null
          : state.owner,
        loading: false,
      }));

      return true;
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to delete owners",
        loading: false,
      });
      return false;
    }
  },

  realtimeAddOwner: (owner) =>
    set((state) => ({
      owners: state.owners.some((o) => Number(o.id) === Number(owner.id))
        ? state.owners
        : [owner, ...state.owners],
      meta: state.meta
        ? {
            ...state.meta,
            total: Number(state.meta.total || 0) + 1,
          }
        : state.meta,
    })),

  realtimeUpdateOwner: (owner) =>
    set((state) => {
      const exists = state.owners.some(
        (o) => Number(o.id) === Number(owner.id)
      );

      return {
        owners: exists
          ? state.owners.map((o) =>
              Number(o.id) === Number(owner.id) ? owner : o
            )
          : [owner, ...state.owners],
        owner:
          Number(state.owner?.id) === Number(owner.id) ? owner : state.owner,
      };
    }),

  realtimeRemoveOwner: (ownerId) =>
    set((state) => ({
      owners: state.owners.filter((o) => Number(o.id) !== Number(ownerId)),
      owner: Number(state.owner?.id) === Number(ownerId) ? null : state.owner,
      meta: state.meta
        ? {
            ...state.meta,
            total: Math.max(0, Number(state.meta.total || 0) - 1),
          }
        : state.meta,
    })),
}));
