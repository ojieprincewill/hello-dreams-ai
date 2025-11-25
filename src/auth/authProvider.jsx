import React, { useState, useEffect } from "react";
import { getAccessToken, clearTokens, setTokens } from "./authStorage";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAccessToken());
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // 👈 new error state

  useEffect(() => {
    setToken(getAccessToken());
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (credentials, navigate) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "https://hello-dreams-ai.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setTokens(data); // saves access + refresh
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.access_token);
        setUser(data.user);
        toast.success("Logged in successfully");

        navigate("/ai-dashboard");
      } else {
        setError(data.message || "Login failed"); // 👈 set error
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.log("Error", err);
      setError("Error logging in"); // 👈 set error
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
        setError(data.message || "Logout failed"); // 👈 set error
        toast.error(data.message || "Logout failed");
      }
    } catch (err) {
      console.log("Error", err);
      setError("Error logging out"); // 👈 set error
      toast.error("Error logging out");
    } finally {
      clearTokens();
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setLoading(false);
      if (navigate) navigate("/signin");
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, user, setToken, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
