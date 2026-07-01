import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../api/authService";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner.component";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res?.message || "Your email has been verified.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may have expired.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f6f6f8]">
      {status === "loading" && <LoadingSpinner />}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === "success" && (
          <>
            <p className="text-4xl mb-4">✅</p>
            <h1 className="text-2xl font-bold text-[#101828] mb-2">Email verified</h1>
            <p className="text-[#667085] mb-6">{message}</p>
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="w-full bg-[#1342ff] text-white py-2.5 rounded-lg font-medium"
            >
              Sign in
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-4xl mb-4">⚠️</p>
            <h1 className="text-2xl font-bold text-[#101828] mb-2">Verification failed</h1>
            <p className="text-[#667085] mb-6">{message}</p>
            <Link
              to="/signup"
              className="block w-full bg-[#1342ff] text-white py-2.5 rounded-lg font-medium"
            >
              Back to sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
