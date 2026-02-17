import axios from "axios";
import {
  getToken,
  setToken,
  clearToken,
  isTokenValid,
} from "./token";
import { useAuthStore } from "../app/store/useAuthStore";

// --------------------
// Axios instance
// --------------------
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
  },
});

// --------------------
// Refresh state
// --------------------
let refreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

// --------------------
// Refresh token
// --------------------
const refreshToken = async () => {
  const token = getToken();

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  setToken(data.access_token, data.expires_in);
  return data.access_token;
};

// --------------------
// REQUEST interceptor
// (Proactive refresh)
// --------------------
api.interceptors.request.use(async (config) => {
  let token = getToken();

  if (token && !isTokenValid()) {
    if (!refreshing) {
      refreshing = true;

      try {
        token = await refreshToken();
        processQueue(null, token);
      } catch (e) {
        processQueue(e, null);
        clearToken();
        useAuthStore.setState({ user: null });
        window.location.href = "/login";
        throw e;
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
});

// --------------------
// RESPONSE interceptor
// (401 fallback)
// --------------------
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (
      err.response?.status !== 401 ||
      original?._retry ||
      original?.url?.includes("/login")
    ) {
      return Promise.reject(err);
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
    } catch (e) {
      processQueue(e, null);
      clearToken();
      useAuthStore.setState({ user: null });
      window.location.href = "/login";
      return Promise.reject(e);
    } finally {
      refreshing = false;
    }
  }
);

export default api;
