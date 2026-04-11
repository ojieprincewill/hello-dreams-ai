import { getAccessToken, clearTokens } from "./authStorage";
import { refreshAccessToken } from "./authApi";

/** Pull a human-readable message from common API error JSON shapes (e.g. NestJS ValidationPipe). */
export const formatApiErrorMessage = (errorData) => {
  if (!errorData || typeof errorData !== "object") return undefined;

  const { message, error: errorField, errors } = errorData;

  if (typeof message === "string" && message.trim()) return message.trim();
  if (Array.isArray(message) && message.length) {
    return message
      .map((m) => (typeof m === "string" ? m : JSON.stringify(m)))
      .join("; ");
  }
  if (message && typeof message === "object") {
    return JSON.stringify(message);
  }

  if (typeof errorField === "string" && errorField.trim()) return errorField;

  if (errors && typeof errors === "object") {
    const parts = Object.entries(errors).flatMap(([key, val]) => {
      if (Array.isArray(val)) return val.map((v) => `${key}: ${v}`);
      if (typeof val === "string") return [`${key}: ${val}`];
      return [];
    });
    if (parts.length) return parts.join("; ");
  }

  return undefined;
};

const buildHeaders = (optionsHeaders = {}, body, token) => {
  const headers = { ...optionsHeaders };
  const isFormDataBody = typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormDataBody && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const classifyErrorKind = (status) => {
  if (status === 401) return "AUTH_EXPIRED";
  if (status === 429) return "RATE_LIMITED";
  if (status >= 500) return "SERVER_ERROR";
  if (status >= 400) return "CLIENT_ERROR";
  return "UNKNOWN";
};

const attachErrorDetails = async (res) => {
  const status = res.status;
  const contentType = res.headers.get("content-type") || "";

  let errorData = {};
  if (contentType.includes("application/json")) {
    errorData = await res.json().catch(() => ({}));
  } else {
    const errorText = await res.text().catch(() => "");
    errorData = { message: errorText };
  }

  console.error("API error:", { status, errorData });

  const rawMessage = formatApiErrorMessage(errorData);

  let userMessage = "Request failed";
  if (status === 400 || status === 422) {
    userMessage = rawMessage || "Request failed";
  } else if (status === 403) {
    userMessage = "Access denied";
  } else if (status === 404) {
    userMessage = "Resource not found";
  } else if (status === 429) {
    userMessage = rawMessage || "Too many requests. Please wait a moment and try again.";
  } else if (status >= 500) {
    userMessage = "Server error. Please try again.";
  } else if (rawMessage) {
    userMessage = rawMessage;
  }

  const err = new Error(userMessage);
  err.status = status;
  err.apiError = errorData;
  err.kind = classifyErrorKind(status);
  if (status === 429) {
    const ra = res.headers.get("Retry-After");
    if (ra != null && ra !== "") {
      const n = Number.parseInt(ra, 10);
      err.retryAfterSeconds = Number.isFinite(n) ? n : undefined;
    }
  }
  return err;
};

export const apiFetch = async (url, options = {}, navigate) => {
  void navigate;
  const token = getAccessToken();

  const request = {
    ...options,
    headers: buildHeaders(options.headers || {}, options.body, token),
  };

  try {
    let res = await fetch(url, request);

    if (res.ok) return res;
    if (res.status !== 401) throw await attachErrorDetails(res);

    // 🔄 Handle expired token
    const newToken = await refreshAccessToken();
    const retry = {
      ...options,
      headers: buildHeaders(options.headers || {}, options.body, newToken),
    };

    res = await fetch(url, retry);

    if (res.ok) return res;
    if (res.status === 401) {
      clearTokens();
      const err = new Error("Unauthorized after token refresh");
      err.status = 401;
      err.kind = "AUTH_EXPIRED";
      throw err;
    }

    throw await attachErrorDetails(res);
  } catch (e) {
    // Detect genuine network failures (no internet, DNS failure, etc.)
    if (e instanceof TypeError && e.message === "Failed to fetch") {
      e.kind = "NETWORK_ERROR";
    }

    console.error("Network/API error:", e);
    const message = typeof e?.message === "string" ? e.message : "";
    const isAuthError =
      e?.kind === "AUTH_EXPIRED" ||
      e?.status === 401 ||
      message.includes("Unauthorized") ||
      message.includes("No refresh token available");

    if (isAuthError) {
      clearTokens();
      if (!e.kind) e.kind = "AUTH_EXPIRED";
    }

    throw e; // bubble up so caller can show toast
  }
};
