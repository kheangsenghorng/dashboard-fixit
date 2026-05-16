import api from "@/lib/api";

const analyticsService = {
  getOverview: (params = {}) =>
    api.get("/analytics/overview", { params }),

  getOverviewByDays: (days = 30) =>
    api.get("/analytics/overview", {
      params: { days },
    }),

  exportOverview: (params = {}) =>
    api.get("/analytics/overview/export", {
      params,
      responseType: "blob",
    }),
};

export default analyticsService;