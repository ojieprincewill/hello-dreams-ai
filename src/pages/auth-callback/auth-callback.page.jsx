import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../../auth/authStorage";
import { getUserProfile } from "../../api/authService";
import { setUser as cacheUser } from "../../auth/authStorage";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      setTokens({ access_token: accessToken, refresh_token: refreshToken });
      window.location.hash = "";
      getUserProfile()
        .then((profile) => cacheUser(profile))
        .catch(() => {})
        .finally(() => navigate("/ai-dashboard", { replace: true }));
    } else {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in…</p>
    </div>
  );
};

export default AuthCallbackPage;
