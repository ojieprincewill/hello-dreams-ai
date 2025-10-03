import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing-page/landing-page.component";
import SigninForm from "./components/sign-in/sign-in.component";
import SignUpFlow from "./components/sign-up/sign-up-flow.component";
import AIDashboard from "./components/AI-portions/ai-dashboard.component";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SigninForm />} />
      <Route path="/signup" element={<SignUpFlow />} />
      <Route path="/ai-dashboard" element={<AIDashboard />} />
    </Routes>
  );
}

export default App;
