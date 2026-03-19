import Cookies from "js-cookie";

const BUFFER = 60 * 1000; // refresh 60 seconds early

export const getToken = () => Cookies.get("token") || null;

export const getRole = () => Cookies.get("role") || null;

export const getTokenExpiry = () => {
  const value = localStorage.getItem("token_expiry");
  return value ? Number(value) : 0;
};

export const setToken = (token, expiresIn, role = null) => {
  const expiry = Date.now() + Number(expiresIn || 0) * 1000 - BUFFER;

  Cookies.set("token", token);
  if (role) {
    Cookies.set("role", role);
  }

  localStorage.setItem("token_expiry", expiry.toString());
};

export const clearToken = () => {
  Cookies.remove("token");
  Cookies.remove("role");
  localStorage.removeItem("token_expiry");
};

export const isTokenValid = () => {
  const token = getToken();
  const expiry = getTokenExpiry();

  return !!token && !!expiry && Date.now() < expiry;
};