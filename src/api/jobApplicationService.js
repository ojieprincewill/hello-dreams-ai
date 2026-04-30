import { apiFetch } from "../auth/apiClient";
import { API_BASE_URL } from "../config/apiConfig";

const parseResponseBody = async (res, fallback = {}) => {
  if (res.status === 204) return fallback;
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return fallback;
  try {
    return await res.json();
  } catch {
    const err = new Error("Invalid JSON response from server");
    err.kind = "INVALID_RESPONSE";
    throw err;
  }
};

const toQueryString = (params) => {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  return new URLSearchParams(filtered).toString();
};

// ── Search ────────────────────────────────────────────────────────────────

export const searchJobs = async (params) => {
  const res = await apiFetch(
    `${API_BASE_URL}/jobs/search?${toQueryString(params)}`,
    { method: "GET" },
  );
  return parseResponseBody(res, { data: [], meta: {} });
};

export const getJobListing = async (id) => {
  const res = await apiFetch(`${API_BASE_URL}/jobs/listings/${id}`, {
    method: "GET",
  });
  return parseResponseBody(res);
};

// ── Applications CRUD ─────────────────────────────────────────────────────

export const listApplications = async (params = {}) => {
  const res = await apiFetch(
    `${API_BASE_URL}/jobs/applications?${toQueryString(params)}`,
    { method: "GET" },
  );
  return parseResponseBody(res, { data: [], meta: {} });
};

export const saveJob = async (payload) => {
  const res = await apiFetch(`${API_BASE_URL}/jobs/applications`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseResponseBody(res);
};

export const getApplication = async (id) => {
  const res = await apiFetch(`${API_BASE_URL}/jobs/applications/${id}`, {
    method: "GET",
  });
  return parseResponseBody(res);
};

export const updateApplication = async (id, payload) => {
  const res = await apiFetch(`${API_BASE_URL}/jobs/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return parseResponseBody(res);
};

export const deleteApplication = async (id) => {
  await apiFetch(`${API_BASE_URL}/jobs/applications/${id}`, {
    method: "DELETE",
  });
};

// ── Documents ─────────────────────────────────────────────────────────────

export const generateDocuments = async (applicationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/jobs/applications/${applicationId}/generate-documents`,
    { method: "POST" },
  );
  return parseResponseBody(res);
};

export const getDocuments = async (applicationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/jobs/applications/${applicationId}/documents`,
    { method: "GET" },
  );
  return parseResponseBody(res, { resume: null, coverLetter: null, hasDocuments: false });
};

// ── Apply ─────────────────────────────────────────────────────────────────

export const applyToJob = async (applicationId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/jobs/applications/${applicationId}/apply`,
    { method: "POST" },
  );
  return parseResponseBody(res);
};
