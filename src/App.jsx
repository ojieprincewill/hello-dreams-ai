import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./auth/protectedRoute";

import LandingPage from "./pages/landing-page/landing-page.component";
import SigninForm from "./components/sign-in/sign-in.component";
import SignUpFlow from "./components/sign-up/sign-up-flow.component";
import AiDashboard from "./components/AI-portions/ai-dashboard.component";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SigninForm />} />
        <Route path="/signup" element={<SignUpFlow />} />
        <Route
          path="/ai-dashboard"
          element={
            // <ProtectedRoute>
            <AiDashboard />
            // </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
