import Cookies from "js-cookie";

const BUFFER = 60 * 1000; // refresh 60 seconds early

export const getToken = () => Cookies.get("token");

export const getRole = () => Cookies.get("role");

export const getTokenExpiry = () =>
  Number(localStorage.getItem("token_expiry"));

export const setToken = (token, role, expiresIn) => {
  const expiry = Date.now() + expiresIn * 1000 - BUFFER;

  // Cookies for middleware
  Cookies.set("token", token);
  Cookies.set("role", role);

  // Local storage for refresh logic
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

  return !!token && Date.now() < expiry;
};
