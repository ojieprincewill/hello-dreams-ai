import { API_BASE_URL } from "../config/apiConfig";
import { apiFetch } from "../auth/apiClient";
import { getAccessToken } from "../auth/authStorage";

const buildQuery = (params) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

export const getDashboardStats = async (params = {}) => {
  const res = await apiFetch(
    `${API_BASE_URL}/admin/dashboard/stats${buildQuery(params)}`,
  );
  return res.json();
};

export const getUserDailyStats = async (userId, params = {}) => {
  const res = await apiFetch(
    `${API_BASE_URL}/admin/dashboard/users/${userId}/stats${buildQuery(params)}`,
  );
  return res.json();
};

export const connectDashboardStream = (onEvent, onError) => {
  const controller = new AbortController();
  const token = getAccessToken();

  fetch(`${API_BASE_URL}/admin/dashboard/stream`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Stream connection failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              onEvent(JSON.parse(line.slice(6)));
            } catch {
              /* ignore malformed */
            }
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== "AbortError") onError?.(err);
    });

  return () => controller.abort();
};
