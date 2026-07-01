import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../../api/paymentsService";
import { getCredits } from "../../api/creditsService";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PaymentsCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    if (!reference) {
      setStatus("missing");
      return;
    }

    const verify = async () => {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        try {
          const result = await verifyPayment(reference);
          if (result?.status === "success") {
            await getCredits().catch(() => null);
            setStatus("success");
            setTimeout(() => {
              navigate("/userprofile", {
                state: { active: "subscription" },
                replace: true,
              });
            }, 2000);
            return;
          }
          if (result?.status === "failed") {
            setStatus("error");
            return;
          }
        } catch {
          if (attempt === 5) {
            setStatus("error");
            return;
          }
        }
        await sleep(2000);
      }
      setStatus("error");
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white dark:bg-[#212121] text-[#010413] dark:text-white px-4"
      style={{ fontFamily: "Darker Grotesque, sans-serif" }}
    >
      <div className="max-w-md text-center">
        {status === "loading" && (
          <>
            <p className="text-2xl font-bold mb-2">Processing payment…</p>
            <p className="text-[#667085] dark:text-gray-400">
              Please wait while we confirm your subscription.
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <p className="text-2xl font-bold mb-2 text-[#1342ff]">Payment successful!</p>
            <p className="text-[#667085] dark:text-gray-400">
              Redirecting to your account…
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-2xl font-bold mb-2">Something went wrong</p>
            <p className="text-[#667085] dark:text-gray-400 mb-4">
              We could not verify your payment. If you were charged, contact support.
            </p>
            <button
              type="button"
              onClick={() =>
                navigate("/userprofile", { state: { active: "subscription" } })
              }
              className="px-4 py-2 bg-[#1342ff] text-white rounded-lg cursor-pointer"
            >
              Go to account
            </button>
          </>
        )}
        {status === "missing" && (
          <>
            <p className="text-2xl font-bold mb-2">Invalid callback</p>
            <button
              type="button"
              onClick={() => navigate("/ai-dashboard")}
              className="mt-4 px-4 py-2 bg-[#1342ff] text-white rounded-lg cursor-pointer"
            >
              Back to dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentsCallbackPage;
