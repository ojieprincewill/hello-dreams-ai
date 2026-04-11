import React, { useState, useEffect, useCallback } from "react";
import { getAccessToken, clearTokens } from "./authStorage";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";
import {
  login as authLogin,
  logout as authLogout,
  getUserProfile,
  updateUserProfile as authUpdateUserProfile,
} from "../api/authService";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAccessToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);
  const handleAuthExpired = () => {
    clearTokens();
    setToken(null);
    setUser(null);
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 🔹 Fetch current user profile (retries on rate limits from dev / Strict Mode / burst traffic)
  const fetchUserProfile = useCallback(async () => {
    const maxAttempts = 4;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const profile = await getUserProfile();
        setUser(profile);
        return;
      } catch (err) {
        const is429 = err?.status === 429;
        if (is429 && attempt < maxAttempts) {
          const fromHeader = err.retryAfterSeconds;
          const backoffMs = Number.isFinite(fromHeader)
            ? fromHeader * 1000
            : Math.min(800 * 2 ** (attempt - 1), 5000);
          await sleep(backoffMs);
          continue;
        }
        if (err?.kind === "AUTH_EXPIRED") {
          handleAuthExpired();
          return;
        }
        console.error("Error fetching profile:", err);
        return;
      }
    }
  }, []);

  useEffect(() => {
    const boot = async () => {
      const existingToken = getAccessToken();
      setToken(existingToken);

      if (existingToken) {
        // Race the profile fetch against a 5-second timeout so the app never
        // hangs on a slow network. The user can still see the dashboard; the
        // profile will re-fetch on the next request that needs it.
        const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
        await Promise.race([fetchUserProfile(), timeout]);
      }

      setInitializing(false);
    };

    boot().catch((err) => {
      console.error("Auth boot error:", err);
      setInitializing(false);
    });
  }, [fetchUserProfile]);

  // 🔹 Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) throw new Error("No user ID available");
      const data = await authUpdateUserProfile(user.id, updates);
      setUser(data);
      toast.success("Profile updated successfully");
      return data;
    } catch (err) {
      console.error("Error updating profile:", err);
      const message = err?.message || "Error updating profile";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login flow
  const login = async (credentials, navigate) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authLogin(credentials);
      setToken(data.access_token);
      toast.success("Logged in successfully");

      // ✅ Only fetch profile from backend
      await fetchUserProfile();
      navigate("/ai-dashboard");
    } catch (err) {
      if (err?.kind === "AUTH_EXPIRED") {
        handleAuthExpired();
      }
      const message = err?.message || "Error logging in";
      console.log("Error", err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout flow (DO NOT use apiFetch here)
  const logout = async (navigate) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authLogout();
      toast.success(data.message || "Logged out successfully");
    } catch (err) {
      console.log("Error", err);
      const message = err?.message || "Error logging out";
      setError(message);
      toast.error(message);
    } finally {
      clearTokens();
      setToken(null);
      setUser(null);
      setLoading(false);

      if (navigate) navigate("/signin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        setToken,
        login,
        logout,
        updateUserProfile,
        initializing,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
