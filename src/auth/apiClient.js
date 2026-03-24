import { getAccessToken, clearTokens } from "./authStorage";
import { refreshAccessToken } from "./authApi";

let isRefreshing = false;
let refreshPromise = null;

export const apiFetch = async (url, options = {}) => {
  const token = getAccessToken();

  const request = {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": options.headers?.["Content-Type"] || "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  try {
    let res = await fetch(url, request);

    // Handle non-401 errors
    if (!res.ok && res.status !== 401) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message: errorData.message || `Request failed with ${res.status}`,
      };
    }

    // If not 401 → return parsed data directly
    if (res.status !== 401) {
      return await res.json().catch(() => null);
    }

    // 🔄 Handle token refresh (with lock)
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken()
        .then((newToken) => newToken)
        .finally(() => {
          isRefreshing = false;
        });
    }

    const newToken = await refreshPromise;

    const retryRequest = {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": options.headers?.["Content-Type"] || "application/json",
        Authorization: `Bearer ${newToken}`,
      },
    };

    res = await fetch(url, retryRequest);

    if (res.status === 401) {
      clearTokens();
      throw { status: 401, message: "Unauthorized" };
    }

    return await res.json().catch(() => null);
  } catch (error) {
    console.error("API Error:", error);

    // 🚫 Only clear tokens on actual auth failure
    if (error.status === 401) {
      clearTokens();
    }

    throw error;
  }
};
