import { getRefreshToken, setTokens, clearTokens } from "./authStorage";

const BASE_URL = "https://hello-dreams-ai.onrender.com";

export const refreshAccessToken = async () => {
  const refresh_token = getRefreshToken();

  if (!refresh_token) {
    throw { status: 401, message: "No refresh token available" };
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message: errorData.message || "Refresh failed",
      };
    }

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
