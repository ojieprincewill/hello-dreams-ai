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

export const getCostSummary = async (params = {}) => {
  const res = await apiFetch(
    `${API_BASE_URL}/admin/costs/summary${buildQuery(params)}`,
  );
  return res.json();
};

export const getCostTrend = async (params = {}) => {
  const res = await apiFetch(
    `${API_BASE_URL}/admin/costs/trend${buildQuery(params)}`,
  );
  return res.json();
};

export const getCostLedger = async (params = {}) => {
  const res = await apiFetch(
    `${API_BASE_URL}/admin/costs/ledger${buildQuery(params)}`,
  );
  return res.json();
};

export const exportCostCsv = async (params = {}) => {
  const token = getAccessToken();
  const res = await fetch(
    `${API_BASE_URL}/admin/costs/export${buildQuery(params)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error("Export failed");
  return res.blob();
};
