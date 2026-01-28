export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => {
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/`;
};

export const clearToken = () => {
  localStorage.removeItem("token");
  document.cookie = "token=; Max-Age=0; path=/";
};
