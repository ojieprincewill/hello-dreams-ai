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

export const getPaymentStats = async (params = {}) => {
  const res = await apiFetch(
    `${API_BASE_URL}/admin/payments/stats${buildQuery(params)}`,
  );
  return res.json();
};

export const listPayments = async (params = {}) => {
  const res = await apiFetch(
    `${API_BASE_URL}/admin/payments${buildQuery(params)}`,
  );
  return res.json();
};

export const listSubscriptions = async (params = {}) => {
  const res = await apiFetch(
    `${API_BASE_URL}/admin/payments/subscriptions${buildQuery(params)}`,
  );
  return res.json();
};
