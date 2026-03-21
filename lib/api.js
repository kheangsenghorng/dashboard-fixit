import axios from "axios";
import { getToken, setToken, clearToken, isTokenValid } from "./token";
import { useAuthStore } from "../app/store/useAuthStore";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    Accept: "application/json",
  },
});

let refreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  queue = [];
};

const refreshToken = async () => {
  const token = getToken();

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  setToken(data.access_token, data.expires_in, data.user?.role || null);
  return data.access_token;
};

api.interceptors.request.use(
  async (config) => {
    let token = getToken();

    if (token && !isTokenValid()) {
      if (!refreshing) {
        refreshing = true;

        try {
          token = await refreshToken();
          processQueue(null, token);
        } catch (error) {
          processQueue(error, null);
          clearToken();
          useAuthStore.setState({ user: null });
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
          throw error;
        } finally {
          refreshing = false;
        }
      } else {
        token = await new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        });
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status !== 401 ||
      original?._retry ||
      original?.url?.includes("/login") ||
      original?.url?.includes("/refresh")
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (refreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    refreshing = true;

    try {
      const token = await refreshToken();
      processQueue(null, token);

      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearToken();
      useAuthStore.setState({ user: null });

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }

      return Promise.reject(refreshError);
    } finally {
      refreshing = false;
    }
  }
);

export default api;
