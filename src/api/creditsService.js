import { apiFetch } from "../auth/apiClient";
import { API_BASE_URL } from "../config/apiConfig";

const parseResponseBody = async (res, fallback = null) => {
  if (!res || res.status === 204) return fallback;
  const contentType = res.headers?.get("content-type") || "";
  if (!contentType.includes("application/json")) return fallback;
  return res.json().catch(() => fallback);
};

export const getCredits = async () => {
  const res = await apiFetch(`${API_BASE_URL}/users/credits`);
  return parseResponseBody(res, { used: 0, limit: 5, remaining: 5, exempt: false });
};
