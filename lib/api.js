import axios from "axios";
import { getToken, setToken, clearToken } from "./token";
import { useAuthStore } from "../app/store/useAuthStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach JWT
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

// ✅ SINGLE response interceptor
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
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
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        setToken(data.token);
        processQueue(null, data.token);

        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch (e) {
        processQueue(e, null);
        clearToken();
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(e);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
