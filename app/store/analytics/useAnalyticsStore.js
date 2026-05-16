import { create } from "zustand";
import analyticsService from "../../services/analytics/analyticsServices";


const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).flat().join(" ");
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};

const defaultCards = {
  total_revenue: {
    label: "Total Revenue",
    value: 0,
    formatted: "$0.00",
    change_percent: 0,
  },
  active_users: {
    label: "Active Users",
    value: 0,
    change_percent: 0,
  },
  services_completed: {
    label: "Services Completed",
    value: 0,
    change_percent: 0,
  },
  provider_growth: {
    label: "Provider Growth",
    value: 0,
    change_percent: 0,
  },
};

export const useAnalyticsStore = create((set) => ({
  analytics: null,
  cards: defaultCards,
  revenueForecast: {
    this_year: [],
    last_year: [],
  },
  topServices: [],
  period: null,

  loading: false,
  error: null,

  fetchAnalyticsOverview: async (params = { days: 30 }) => {
    set({ loading: true, error: null });

    try {
      const res = await analyticsService.getOverview(params);

      const data = res.data?.data || {};

      set({
        analytics: data,
        cards: data.cards || defaultCards,
        revenueForecast: data.revenue_forecast || {
          this_year: [],
          last_year: [],
        },
        topServices: data.top_services || [],
        period: data.period || null,
        loading: false,
        error: null,
      });

      return res.data;
    } catch (error) {
      set({
        analytics: null,
        cards: defaultCards,
        revenueForecast: {
          this_year: [],
          last_year: [],
        },
        topServices: [],
        period: null,
        loading: false,
        error: getErrorMessage(error, "Failed to fetch analytics overview"),
      });

      return null;
    }
  },

  clearAnalyticsError: () => {
    set({ error: null });
  },
}));
