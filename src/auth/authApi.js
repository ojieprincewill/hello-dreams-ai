import { getRefreshToken, setTokens, clearTokens } from "./authStorage";
import toast from "react-hot-toast";

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
  setTokens(data); // expects { access_token, refresh_token }
  return data.access_token;
};

export const logout = async (navigate) => {
  try {
    const refresh_token = getRefreshToken();

    if (!refresh_token) {
      console.warn("No refresh token found, clearing local storage.");
      clearTokens();
      if (navigate) navigate("/signin");
      return;
    }

    const res = await fetch(
      "https://hello-dreams-ai.onrender.com/auth/logout",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message || "Logged out successfully");
    } else {
      toast.error(data.message || "Logout failed");
    }

    // Always clear local tokens
    clearTokens();

    // Redirect to login
    if (navigate) navigate("/signin");
  } catch (err) {
    toast.error("Error logging out");
    console.error("Error logging out:", err);
    clearTokens();
    if (navigate) navigate("/signin");
  }
};
