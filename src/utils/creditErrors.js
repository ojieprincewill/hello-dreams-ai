/**
 * Returns true if the API error is a daily credit limit error.
 * The backend returns HTTP 403 with body: { code: 'CREDIT_LIMIT_REACHED', ... }
 */
export const isCreditLimitError = (err) =>
  err?.status === 403 && err?.apiError?.code === 'CREDIT_LIMIT_REACHED';
