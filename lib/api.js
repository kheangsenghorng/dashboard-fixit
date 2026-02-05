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

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // 🚫 DO NOT REFRESH ON LOGIN
    if (original.url.includes("/login")) {
      return Promise.reject(err);
    }

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

        const newToken = data.access_token;

        setToken(newToken, data.expires_in);

        processQueue(null, newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        console.error("❌ REFRESH FAILED:", e.response?.data || e);

        processQueue(e, null);
        clearToken();
        useAuthStore.setState({ user: null });

        // ❌ REMOVE hard reload
        window.location.href = "/login";

        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);


export default api;
