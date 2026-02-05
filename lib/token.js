export const getToken = () => localStorage.getItem("token");

export const setToken = (token, expiresIn) => {
  const expiry = Date.now() + expiresIn * 1000;

  localStorage.setItem("token", token);
  localStorage.setItem("token_expiry", expiry.toString());

  document.cookie = `token=${token}; path=/`;
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expiry");
  document.cookie = "token=; Max-Age=0; path=/";
};

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("token_expiry");

  if (!token || !expiry) return false;

  return Date.now() < Number(expiry);
};
