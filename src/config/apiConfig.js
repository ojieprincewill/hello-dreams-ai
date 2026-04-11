const rawApiBaseUrl =
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.REACT_APP_API_BASE_URL ||
  "http://localhost:3000";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

