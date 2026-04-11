import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import ProtectedRoute from "./auth/protectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import LandingPage from "./pages/landing-page/landing-page.component";
import SigninForm from "./components/sign-in/sign-in.component";
import SignUpFlow from "./components/sign-up/sign-up-flow.component";
import AiDashboard from "./components/AI-portions/ai-dashboard.component";

const OFFLINE_TOAST_ID = "app-offline";

function App() {
  useEffect(() => {
    const handleOffline = () => {
      toast.error("No internet connection. Please check your network.", {
        id: OFFLINE_TOAST_ID,
        duration: Infinity,
      });
    };
    const handleOnline = () => {
      toast.dismiss(OFFLINE_TOAST_ID);
      toast.success("Back online.", { duration: 3000 });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Show immediately if already offline when the app loads
    if (!navigator.onLine) handleOffline();

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SigninForm />} />
        <Route path="/signup" element={<SignUpFlow />} />
        <Route
          path="/ai-dashboard"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <AiDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
