import { getAccessToken, clearTokens } from "./authStorage";
import { refreshAccessToken } from "./authApi";

export const apiFetch = async (url, options = {}, navigate) => {
  const token = getAccessToken();
  const withAuth = {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": options.headers?.["Content-Type"] || "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  let res;
  try {
    res = await fetch(url, withAuth);

    // ✅ Handle non-401 errors gracefully
    if (!res.ok && res.status !== 401) {
      // Example: show toast or log structured error
      const errorData = await res.json().catch(() => ({}));
      console.error("API error:", res.status, errorData);
      throw new Error(errorData.message || `Request failed with ${res.status}`);
    }

    if (res.status !== 401) return res;

    // 🔄 Handle expired token
    const newToken = await refreshAccessToken();
    const retry = {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": options.headers?.["Content-Type"] || "application/json",
        Authorization: `Bearer ${newToken}`,
      },
    };
    res = await fetch(url, retry);

    if (res.status === 401) {
      clearTokens();
      if (navigate) navigate("/signin"); // 👈 auto redirect
      throw new Error("Unauthorized after token refresh");
    }

    return res;
  } catch (e) {
    console.error("Network/API error:", e);
    clearTokens();
    if (navigate) navigate("/signin");
    throw e; // 👈 bubble up so caller can show toast
  }
};
