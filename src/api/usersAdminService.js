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

export const listUsers = async (params = {}) => {
  const res = await apiFetch(`${API_BASE_URL}/users${buildQuery(params)}`);
  return res.json();
};

export const getUser = async (id) => {
  const res = await apiFetch(`${API_BASE_URL}/users/${id}`);
  return res.json();
};

export const updateUserStatus = async (id, isActive) => {
  const res = await apiFetch(`${API_BASE_URL}/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
  return res.json();
};

export const promoteUser = async (id, role) => {
  const res = await apiFetch(`${API_BASE_URL}/users/${id}/promote`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  return res.json();
};

export const createAdmin = async (data) => {
  const res = await apiFetch(`${API_BASE_URL}/users/admins`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const removeAdmin = async (id) => {
  await apiFetch(`${API_BASE_URL}/users/admins/${id}`, { method: "DELETE" });
};

export const deleteUser = async (id) => {
  await apiFetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" });
};

export const getUserStats = async () => {
  const res = await apiFetch(`${API_BASE_URL}/users/stats`);
  return res.json();
};
