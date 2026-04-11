import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const AppLoadingScreen = () => (
  <div className="fixed inset-0 bg-white dark:bg-[#212121] flex flex-col justify-center items-center gap-4">
    <img
      src="https://res.cloudinary.com/dganx8kmn/image/upload/f_webp,q_auto/v1749909159/forms/Loading_Screen_nquaic.png"
      alt="Loading..."
      className="w-14 h-14 object-contain animate-spin"
    />
    <p className="text-[#010413] dark:text-white text-[16px] opacity-60">
      Loading your session…
    </p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { token, loading, initializing, user } = useAuth();

  if (initializing || (loading && !user)) {
    return <AppLoadingScreen />;
  }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (token && !user) {
    return <AppLoadingScreen />;
  }

  return children;
};

export default ProtectedRoute;
