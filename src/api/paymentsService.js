import { apiFetch } from "../auth/apiClient";
import { API_BASE_URL } from "../config/apiConfig";

const parseResponseBody = async (res, fallback = null) => {
  if (!res || res.status === 204) return fallback;
  const contentType = res.headers?.get("content-type") || "";
  if (!contentType.includes("application/json")) return fallback;
  return res.json().catch(() => fallback);
};

export const initializeSubscription = async (billingCycle = "monthly") => {
  const res = await apiFetch(
    `${API_BASE_URL}/payments/subscription/initialize`,
    {
      method: "POST",
      body: JSON.stringify({ billingCycle }),
    },
  );
  if (!res.ok) {
    const err = await parseResponseBody(res, {});
    throw new Error(err?.message || "Failed to start subscription checkout");
  }
  return parseResponseBody(res, {});
};

export const initializePayment = async (amount, currency = "NGN") => {
  const res = await apiFetch(`${API_BASE_URL}/payments/initialize`, {
    method: "POST",
    body: JSON.stringify({ amount, currency }),
  });
  if (!res.ok) {
    const err = await parseResponseBody(res, {});
    throw new Error(err?.message || "Failed to start payment");
  }
  return parseResponseBody(res, {});
};

export const getSubscription = async () => {
  const res = await apiFetch(`${API_BASE_URL}/payments/subscription`, {
    method: "GET",
  });
  return parseResponseBody(res, null);
};

export const cancelSubscription = async (subscriptionId) => {
  const res = await apiFetch(
    `${API_BASE_URL}/payments/subscription/${subscriptionId}`,
    { method: "DELETE" },
  );
  if (!res.ok && res.status !== 204) {
    const err = await parseResponseBody(res, {});
    throw new Error(err?.message || "Failed to cancel subscription");
  }
};

export const getPaymentHistory = async () => {
  const res = await apiFetch(`${API_BASE_URL}/payments/history`, {
    method: "GET",
  });
  return parseResponseBody(res, []);
};

export const verifyPayment = async (reference) => {
  const res = await apiFetch(
    `${API_BASE_URL}/payments/verify?reference=${encodeURIComponent(reference)}`,
    { method: "GET" },
  );
  if (!res.ok) {
    const err = await parseResponseBody(res, {});
    throw new Error(err?.message || "Payment verification failed");
  }
  return parseResponseBody(res, {});
};
