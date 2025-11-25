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

  let res = await fetch(url, withAuth);
  if (res.status !== 401) return res;

  try {
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
    }
    return res;
  } catch (e) {
    console.log("Error", e);
    clearTokens();
    if (navigate) navigate("/signin");
    return res;
  }
};
