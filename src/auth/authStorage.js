export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = ({ access_token, refresh_token }) => {
  if (access_token) {
    localStorage.setItem("accessToken", access_token);
  }
  if (refresh_token) {
    // Always overwrite with the new rotated refresh token
    localStorage.setItem("refreshToken", refresh_token);
  }
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};
