import { apiFetch } from "../auth/apiClient";
import { getAccessToken, getRefreshToken, setTokens } from "../auth/authStorage";
import { API_BASE_URL } from "../config/apiConfig";

const readJsonSafely = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return {};
  return response.json().catch(() => ({}));
};

const throwApiError = (fallbackMessage, status, data = {}) => {
  const err = new Error(data?.message || fallbackMessage);
  err.status = status;
  err.apiError = data;
  err.kind = status === 401 ? "AUTH_EXPIRED" : status >= 500 ? "SERVER_ERROR" : "CLIENT_ERROR";
  throw err;
};

export const register = async ({ email, password, name }) => {
  const response = await apiFetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });

  const data = await readJsonSafely(response);
  if (!response.ok) {
    throwApiError("Registration failed", response.status, data);
  }

  if (data?.access_token || data?.refresh_token) {
    setTokens(data);
  }

  return data;
};

/** Coalesce concurrent profile requests (e.g. React Strict Mode double mount + login). */
let profileRequestInFlight = null;

export const getUserProfile = async () => {
  if (profileRequestInFlight) return profileRequestInFlight;
  profileRequestInFlight = (async () => {
    const res = await apiFetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
    });
    return res.json();
  })().finally(() => {
    profileRequestInFlight = null;
  });
  return profileRequestInFlight;
};

export const updateUserProfile = async (userId, updates) => {
  // Preserve existing request/response shape.
  const res = await apiFetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return res.json();
};

export const logout = async () => {
  const refresh_token = getRefreshToken();

  const res = await apiFetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });

  const data = await readJsonSafely(res);
  if (!res.ok) throwApiError("Logout failed", res.status, data);
  return data;
};

export const login = async (credentials) => {
  const res = await apiFetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  const data = await readJsonSafely(res);
  if (!res.ok) throwApiError("Login failed", res.status, data);
  if (data?.access_token || data?.refresh_token) {
    setTokens(data);
  }
  return data;
};

export const getStoredAccessToken = () => getAccessToken();

