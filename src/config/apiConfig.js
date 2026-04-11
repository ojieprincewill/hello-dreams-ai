const rawApiBaseUrl = import.meta.env.PROD
  ? "https://hello-dreams-ai.onrender.com"
  : import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

