import api from "@/lib/api";

export const telegramService = {
  getGroupLink: async () => {
    const res = await api.get("/owner/telegram/group-link");
    return res.data;
  },

  syncGroupId: async () => {
    const res = await api.post("/owner/telegram/sync-group-id");
    return res.data;
  },

  setWebhook: async () => {
    const res = await api.get("/owner/telegram/set-webhook");
    return res.data;
  },

  webhookInfo: async () => {
    const res = await api.get("/owner/telegram/webhook-info");
    return res.data;
  },

  status: async () => {
    const res = await api.get("/owner/telegram/status");
    return res.data;
  },
};
