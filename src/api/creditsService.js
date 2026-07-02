import { apiFetch } from "../auth/apiClient";
import { API_BASE_URL } from "../config/apiConfig";

const parseResponseBody = async (res, fallback = null) => {
  if (!res || res.status === 204) return fallback;
  const contentType = res.headers?.get("content-type") || "";
  if (!contentType.includes("application/json")) return fallback;
  return res.json().catch(() => fallback);
};

const defaultCredits = {
  plan: "free",
  subscription: null,
  daily: {
    usedCredits: 0,
    limitCredits: 5,
    remainingCredits: 5,
    usedTokens: 0,
    limitTokens: 4000,
    resetsAt: new Date().toISOString(),
  },
  balanceCredits: 0,
  tokensPerCredit: 800,
  exempt: false,
  // Legacy fields for components not yet migrated
  used: 0,
  limit: 5,
  remaining: 5,
};

/** Normalize API response with backward-compatible used/limit fields */
export const normalizeCredits = (raw) => {
  if (!raw) return defaultCredits;
  const used = raw.daily?.usedCredits ?? raw.used ?? 0;
  const limit = raw.daily?.limitCredits ?? raw.limit ?? 5;
  const remaining = raw.daily?.remainingCredits ?? raw.remaining ?? 0;
  return { ...defaultCredits, ...raw, used, limit, remaining };
};

export const getCredits = async () => {
  const res = await apiFetch(`${API_BASE_URL}/credits`);
  const data = await parseResponseBody(res, defaultCredits);
  return normalizeCredits(data);
};
