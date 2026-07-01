import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import ProtectedRoute from "./auth/protectedRoute";
import AdminRoute from "./auth/adminRoute";
import SuperuserRoute from "./auth/superuserRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import LandingPage from "./pages/landing-page/landing-page.component";
import SigninForm from "./components/sign-in/sign-in.component";
import SignUpFlow from "./components/sign-up/sign-up-flow.component";
import AiDashboard from "./components/AI-portions/ai-dashboard.component";
import UserProfilePage from "./pages/user-profile/user-profile.page";
import PaymentsCallbackPage from "./pages/payments-callback/payments-callback.page";
import AuthCallbackPage from "./pages/auth-callback/auth-callback.page";
import ResetPasswordPage from "./pages/reset-password/reset-password.page";
import VerifyEmailPage from "./pages/verify-email/verify-email.page";

import AdminLayout from "./admin/layout/AdminLayout";
import OverviewPage from "./admin/pages/OverviewPage";
import UsersListPage from "./admin/pages/UsersListPage";
import UserDetailPage from "./admin/pages/UserDetailPage";
import RevenuePage from "./admin/pages/RevenuePage";
import AdminManagementPage from "./admin/pages/AdminManagementPage";
import AuditLogPage from "./admin/pages/AuditLogPage";
import CostsPage from "./admin/pages/CostsPage";

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
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/payments/callback"
          element={
            <ProtectedRoute>
              <PaymentsCallbackPage />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/userprofile"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <UserProfilePage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <ErrorBoundary>
                <AdminLayout />
              </ErrorBoundary>
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="users" element={<UsersListPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="costs" element={<CostsPage />} />
          <Route
            path="admins"
            element={
              <SuperuserRoute>
                <AdminManagementPage />
              </SuperuserRoute>
            }
          />
          <Route path="audit-log" element={<AuditLogPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
