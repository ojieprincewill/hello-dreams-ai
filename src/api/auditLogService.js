import { API_BASE_URL } from "../config/apiConfig";
import { apiFetch } from "../auth/apiClient";

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

export const listAuditLog = async (params = {}) => {
  const res = await apiFetch(
    `${API_BASE_URL}/admin/audit-log${buildQuery(params)}`,
  );
  return res.json();
};
