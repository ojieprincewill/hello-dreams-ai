import { getRefreshToken, setTokens, clearTokens } from "./authStorage";
import { API_BASE_URL } from "../config/apiConfig";

export const refreshAccessToken = async () => {
  const refresh_token = getRefreshToken();
  if (!refresh_token) {
    const err = new Error("No refresh token available");
    err.kind = "AUTH_EXPIRED";
    throw err;
  }

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  if (!res.ok) {
    const err = new Error("Refresh failed");
    err.status = res.status;
    // Only treat as a real auth failure when the server explicitly rejects the token.
    // A 500 (e.g. Render cold-start) should NOT log the user out.
    err.kind = (res.status === 401 || res.status === 403 || res.status === 400)
      ? "AUTH_EXPIRED"
      : "SERVER_ERROR";
    throw err;
  }
  try {
    const data = await res.json();

    // 🔥 Always overwrite both tokens (rotation-safe)
    setTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    return data.access_token;

  } catch (error) {
    console.error("Refresh token error:", error);

    // 🚫 If refresh fails → session is invalid
    clearTokens();

    throw error;
  }
};
