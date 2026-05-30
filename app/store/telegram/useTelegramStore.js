import { create } from "zustand";
import { telegramService } from "../../services/telegram/telegramService";

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

const normalizeTelegramData = (response) => {
  const payload = response?.data?.data || response?.data || response || {};

  return {
    ...payload,

    groupLink: payload?.groupLink || {},
    status: payload?.status || {},

    telegram_connected:
      payload?.telegram_connected ||
      payload?.is_added ||
      payload?.status?.is_added ||
      payload?.groupLink?.telegram_connected ||
      false,
  };
};

export const useTelegramStore = create((set, get) => ({
  telegramData: null,
  webhookData: null,

  loading: false,
  syncing: false,
  checking: false,

  error: null,

  showPopup: false,

  setLoading: (loading) => set({ loading }),

  setShowPopup: (showPopup) => set({ showPopup }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      telegramData: null,
      webhookData: null,
      loading: false,
      syncing: false,
      checking: false,
      error: null,
      showPopup: false,
    }),

  fetchGroupLink: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await telegramService.getGroupLink();

      const data = normalizeTelegramData(res);

      set({
        telegramData: data,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  checkStatus: async () => {
    try {
      set({
        checking: true,
        error: null,
      });

      const res = await telegramService.status();

      const data = normalizeTelegramData(res);

      set((state) => ({
        telegramData: {
          ...state.telegramData,
          ...data,
        },
        checking: false,
      }));

      return data;
    } catch (error) {
      set({
        checking: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  syncGroupId: async () => {
    try {
      set({
        syncing: true,
        error: null,
      });

      const res = await telegramService.syncGroupId();

      const data = normalizeTelegramData(res);

      set((state) => ({
        telegramData: {
          ...state.telegramData,
          ...data,
        },
        syncing: false,
      }));

      return data;
    } catch (error) {
      set({
        syncing: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  setWebhook: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await telegramService.setWebhook();

      set({
        webhookData: res?.data || res,
        loading: false,
      });

      return res?.data || res;
    } catch (error) {
      set({
        loading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  getWebhookInfo: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await telegramService.webhookInfo();

      set({
        webhookData: res?.data || res,
        loading: false,
      });

      return res?.data || res;
    } catch (error) {
      set({
        loading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  checkAllTelegram: async () => {
    try {
      const groupData = await get().fetchGroupLink();

      const connected =
        groupData?.telegram_connected || groupData?.is_added || false;

      if (!connected) {
        try {
          await get().syncGroupId();
        } catch (e) {
          console.log("Waiting for Telegram group...");
        }
      }

      const latest = get().telegramData;

      set({
        showPopup: !latest?.telegram_connected,
      });

      return latest;
    } catch (error) {
      throw error;
    }
  },

  refreshTelegram: async () => {
    try {
      await get().checkStatus();

      const current = get().telegramData;

      const connected =
        current?.telegram_connected || current?.is_added || false;

      if (!connected) {
        try {
          await get().syncGroupId();
        } catch (e) {
          console.log("Telegram not connected yet");
        }
      }

      const latest = get().telegramData;

      set({
        showPopup: !latest?.telegram_connected,
      });

      return latest;
    } catch (error) {
      throw error;
    }
  },

  isConnected: () => {
    const data = get().telegramData;

    return (
      data?.telegram_connected ||
      data?.is_added ||
      data?.status?.is_added ||
      data?.groupLink?.telegram_connected ||
      false
    );
  },
}));
