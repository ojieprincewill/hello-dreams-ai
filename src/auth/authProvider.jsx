import React, { useState, useEffect } from "react";
import { getAccessToken, clearTokens, setTokens } from "./authStorage";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";

const API_BASE = "https://hello-dreams-ai.onrender.com";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAccessToken());
  const [user, setUser] = useState(null); // 🔹 no longer hydrate from localStorage
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

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
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const profile = await res.json();
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

      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        toast.success("Profile updated successfully");
        return data;
      } else {
        setError(data.message || "Profile update failed");
        toast.error(data.message || "Profile update failed");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Error updating profile");
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login flow
  const login = async (credentials, navigate) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (res.ok) {
        setTokens(data); // saves access + refresh
        setToken(data.access_token);
        toast.success("Logged in successfully");

        // ✅ Only fetch profile from backend
        await fetchUserProfile();

        navigate("/ai-dashboard");
      } else {
        setError(data.message || "Login failed");
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.log("Error", err);
      setError("Error logging in");
      toast.error("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  const logout = async (navigate) => {
    try {
      setLoading(true);
      setError(null);

      const refresh_token = localStorage.getItem("refreshToken");
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Logged out successfully");
      } else {
        setError(data.message || "Logout failed");
        toast.error(data.message || "Logout failed");
      }
    } catch (err) {
      console.log("Error", err);
      setError("Error logging out");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
