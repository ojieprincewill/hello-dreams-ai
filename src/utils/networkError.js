/**
 * Returns true when an error is caused by no internet connection.
 * In that case the global offline toast (App.jsx) already handles UX —
 * individual handlers should skip their own toast to avoid an avalanche.
 */
export const isNetworkError = (err) =>
  err?.kind === "NETWORK_ERROR" ||
  !navigator.onLine ||
  (err instanceof TypeError && err.message === "Failed to fetch");
