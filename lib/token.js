const BUFFER = 60 * 1000; // refresh 60 seconds early

export const getToken = () => localStorage.getItem("token");

export const getTokenExpiry = () =>
  Number(localStorage.getItem("token_expiry"));

export const setToken = (token, expiresIn) => {
  const expiry = Date.now() + expiresIn * 1000 - BUFFER;

  localStorage.setItem("token", token);
  localStorage.setItem("token_expiry", expiry.toString());
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expiry");
};

export const isTokenValid = () => {
  const token = getToken();
  const expiry = getTokenExpiry();

  return !!token && Date.now() < expiry;
};
