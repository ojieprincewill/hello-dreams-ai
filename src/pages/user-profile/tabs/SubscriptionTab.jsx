import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../auth/authContext";
import toast from "react-hot-toast";
import { getCredits } from "../../../api/creditsService";
import {
  initializeSubscription,
  getSubscription,
  cancelSubscription,
  getPaymentHistory,
} from "../../../api/paymentsService";

const SubscriptionTab = () => {
  const { user } = useContext(AuthContext);
  const [credits, setCredits] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const refreshBilling = async () => {
    const [c, s] = await Promise.all([
      getCredits().catch(() => null),
      getSubscription().catch(() => null),
    ]);
    if (c) setCredits(c);
    setSubscription(s);
    const history = await getPaymentHistory().catch(() => []);
    setPaymentHistory(Array.isArray(history) ? history : []);
  };

  useEffect(() => {
    if (!user) return;
    refreshBilling();
  }, [user]);

  const handleUpgrade = async () => {
    try {
      setCheckoutLoading(true);
      const result = await initializeSubscription("monthly");
      const url = result?.authorizationUrl;
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url;
    } catch (err) {
      toast.error(err.message || "Could not start checkout");
      setCheckoutLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription?.id) return;
    try {
      setCancelLoading(true);
      await cancelSubscription(subscription.id);
      toast.success("Subscription cancelled");
      await refreshBilling();
    } catch (err) {
      toast.error(err.message || "Failed to cancel subscription");
    } finally {
      setCancelLoading(false);
    }
  };

  const used = credits?.used ?? 0;
  const limit = credits?.limit ?? 5;
  const tokensPerCredit = credits?.tokensPerCredit ?? 800;
  const isPro = credits?.plan === "pro" || subscription?.status === "active";
  const isPending = subscription?.status === "pending";

  return (
    <div className="space-y-5">
      {/* Current plan */}
      <div className="rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] bg-[#f9f9f9] dark:bg-[#1c1c1c] p-5 md:p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-base md:text-lg font-bold">Current plan</h2>
            <p className="text-sm text-[#667085] dark:text-gray-400 mt-0.5">
              {isPro ? "Pro plan — unlimited daily AI actions" : isPending ? "Checkout pending" : "Free plan — 5 AI actions per day"}
            </p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${isPro ? "bg-[#e8edff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff]" : "bg-[#f2f2f2] dark:bg-[#2d2d2d] text-[#667085] dark:text-gray-400"}`}>
            {isPro ? "Pro" : "Free"}
          </span>
        </div>

        <div className="bg-[#efefef] dark:bg-[#272725] rounded-lg px-4 py-3.5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold">Daily AI credits</p>
            <span className="text-sm font-bold text-[#1342ff]">
              {credits ? `${used}/${limit}` : "…/5"}
            </span>
          </div>
          <div className="w-full h-2 bg-[#e0e0e0] dark:bg-[#444] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1342ff] rounded-full transition-all duration-500"
              style={{ width: credits ? `${Math.min((used / limit) * 100, 100)}%` : "0%" }}
            />
          </div>
          <p className="text-xs text-[#667085] dark:text-gray-400 mt-2">
            1 credit ≈ {tokensPerCredit} tokens · Resets at midnight UTC
          </p>
          {credits?.balanceCredits > 0 && (
            <p className="text-xs text-[#667085] dark:text-gray-400 mt-1">
              Prepaid balance: {credits.balanceCredits} credits
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      {!isPro ? (
        <button
          type="button"
          disabled={checkoutLoading}
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-b from-[#748ffc] to-[#1342ff] rounded-xl py-3.5 text-white text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
        >
          {checkoutLoading ? "Redirecting to checkout…" : "Upgrade to Pro — 100 daily credits"}
        </button>
      ) : (
        <button
          type="button"
          disabled={cancelLoading}
          onClick={handleCancel}
          className="w-full border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl py-3.5 text-sm font-semibold hover:bg-[#f9f9f9] dark:hover:bg-[#1c1c1c] cursor-pointer disabled:opacity-60 transition-colors"
        >
          {cancelLoading ? "Cancelling…" : "Cancel subscription"}
        </button>
      )}

      {/* Billing history */}
      {paymentHistory.length > 0 && (
        <div className="rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] bg-[#f9f9f9] dark:bg-[#1c1c1c] p-5 md:p-6">
          <h3 className="text-base md:text-lg font-bold mb-4">Billing history</h3>
          <ul className="space-y-2">
            {paymentHistory.slice(0, 10).map((p) => (
              <li
                key={p.id}
                className="flex justify-between gap-2 text-sm border-b border-[#eaecf0] dark:border-[#2d2d2d] pb-2 last:border-0"
              >
                <span className="text-[#010413] dark:text-[#f7f7f7]">
                  {p.currency} {p.amount} · {p.status}
                </span>
                <span className="text-[#667085] dark:text-gray-400 shrink-0">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTab;
