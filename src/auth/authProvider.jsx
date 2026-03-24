import React, { useState, useEffect } from "react";
import {
  getAccessToken,
  clearTokens,
  setTokens,
  getRefreshToken,
  isAuthenticated,
} from "./authStorage";
import { apiFetch } from "./apiClient";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";

const API_BASE = "https://hello-dreams-ai.onrender.com";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAccessToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Initialize auth state on app load
  useEffect(() => {
    const boot = async () => {
      const existingToken = getAccessToken();
      setToken(existingToken);

      // 🔹 If we already have a token, fetch the profile on app load
      if (existingToken) {
        await fetchUserProfile();
      }

      setInitializing(false);
    };

    boot().catch((err) => {
      console.error("Auth boot error:", err);
      setInitializing(false);
    });
  }, []);

  // 🔹 Fetch current user profile
  const fetchUserProfile = async () => {
    try {
      const profile = await apiFetch(`${API_BASE}/users/profile`);
      setUser(profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // 🔹 Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) throw new Error("No user ID available");

      const data = await apiFetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      setUser(data);
      toast.success("Profile updated successfully");
      return data;
    } catch (err) {
      setError(err.message || "Profile update failed");
      toast.error(err.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login flow
  const login = async (credentials, navigate) => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiFetch(`${API_BASE}/auth/login`, {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      // Save tokens
      setTokens(data);
      setToken(data.access_token);

      // Fetch user profile
      await fetchUserProfile();

      toast.success("Logged in successfully");
      navigate("/ai-dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout flow (DO NOT use apiFetch here)
  const logout = async (navigate) => {
    try {
      setLoading(true);
      setError(null);

      const refresh_token = getRefreshToken();

      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
      });

      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Error logging out");
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
        isAuthenticated: isAuthenticated(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
