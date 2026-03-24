const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const USER_KEY = "user";

// 🔐 Tokens
export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setTokens = ({ access_token, refresh_token }) => {
  if (access_token) {
    localStorage.setItem(ACCESS_KEY, access_token);
  }
  if (refresh_token) {
    localStorage.setItem(REFRESH_KEY, refresh_token);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};

// 👤 User (optional but important for auth context)
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

// ✅ Helper (VERY useful everywhere)
export const isAuthenticated = () => {
  return !!getAccessToken();
};
