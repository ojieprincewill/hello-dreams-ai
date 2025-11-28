import { getRefreshToken, setTokens } from "./authStorage";

export const refreshAccessToken = async () => {
  const refresh_token = getRefreshToken();
  if (!refresh_token) throw new Error("No refresh token available");

  const res = await fetch("https://hello-dreams-ai.onrender.com/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();

  // Backend returns both tokens → overwrite them
  setTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

  return data.access_token;
};
