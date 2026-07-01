import React, { useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import toast from "react-hot-toast";

import { AuthContext } from "../../auth/authContext";

import { getCredits } from "../../api/creditsService";

import {

  initializeSubscription,

  getSubscription,

  cancelSubscription,

  getPaymentHistory,

} from "../../api/paymentsService";



const TABS = [

  { id: "settings", label: "Settings" },

  { id: "subscription", label: "Subscription" },

];



const UserProfilePage = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const { user, updateUserProfile } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState(

    location.state?.active === "subscription" ? "subscription" : "settings",

  );

  const [credits, setCredits] = useState(null);

  const [subscription, setSubscription] = useState(null);

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [cancelLoading, setCancelLoading] = useState(false);

  const [profileName, setProfileName] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);

  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {

    if (user?.name) setProfileName(user.name);

  }, [user?.name]);



  const refreshBilling = async () => {

    const [c, s] = await Promise.all([

      getCredits().catch(() => null),

      getSubscription().catch(() => null),

    ]);

    if (c) setCredits(c);

    setSubscription(s);

    if (activeTab === "subscription") {

      const history = await getPaymentHistory().catch(() => []);

      setPaymentHistory(Array.isArray(history) ? history : []);

    }

  };



  useEffect(() => {

    if (location.state?.active === "subscription") {

      setActiveTab("subscription");

    } else if (location.state?.active === "settings") {

      setActiveTab("settings");

    }

  }, [location.state?.active]);



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



  const used = credits?.daily?.usedCredits ?? credits?.used ?? 0;

  const limit = credits?.daily?.limitCredits ?? credits?.limit ?? 5;

  const tokensPerCredit = credits?.tokensPerCredit ?? 800;

  const isPro = credits?.plan === "pro" || subscription?.status === "active";

  const isPending = subscription?.status === "pending";

  const handleSaveProfile = async (e) => {

    e.preventDefault();

    if (!profileName.trim()) return;

    setProfileSaving(true);

    try {

      await updateUserProfile({ name: profileName.trim() });

    } finally {

      setProfileSaving(false);

    }

  };



  return (

    <div

      className="min-h-screen bg-white dark:bg-[#212121] text-[#010413] dark:text-white"

      style={{ fontFamily: "Darker Grotesque, sans-serif" }}

    >

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        <button

          type="button"

          onClick={() => navigate("/ai-dashboard")}

          className="flex items-center gap-2 text-sm text-[#667085] dark:text-gray-400 hover:text-[#1342ff] dark:hover:text-[#7b96ff] mb-8 cursor-pointer"

        >

          <ArrowLeftIcon className="w-4 h-4" />

          Back to dashboard

        </button>



        <h1 className="text-2xl md:text-3xl font-extrabold mb-2">

          {user?.name ? `${user.name}'s Account` : "Your Account"}

        </h1>

        <p className="text-[#667085] dark:text-gray-400 mb-8">

          {user?.email || ""}

        </p>



        <div className="flex gap-2 mb-8 border-b border-[#eaecf0] dark:border-[#2d2d2d]">

          {TABS.map((tab) => (

            <button

              key={tab.id}

              type="button"

              onClick={() => setActiveTab(tab.id)}

              className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${

                activeTab === tab.id

                  ? "border-[#1342ff] text-[#1342ff] dark:text-[#7b96ff]"

                  : "border-transparent text-[#667085] dark:text-gray-400 hover:text-[#010413] dark:hover:text-white"

              }`}

            >

              {tab.label}

            </button>

          ))}

        </div>



        {activeTab === "settings" && (

          <div className="space-y-6">

            <div className="rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] bg-[#f9f9f9] dark:bg-[#1c1c1c] p-5">

              <h2 className="text-lg font-bold mb-4">Profile</h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">

              <div>

                <label className="block text-xs uppercase tracking-wide text-[#667085] dark:text-gray-400 mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={profileName}

                  onChange={(e) => setProfileName(e.target.value)}

                  className="w-full px-3 py-2 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121]"

                />

              </div>

              <div>

                <label className="block text-xs uppercase tracking-wide text-[#667085] dark:text-gray-400 mb-1">

                  Email

                </label>

                <p className="text-base font-medium text-[#667085]">{user?.email || "—"}</p>

              </div>

              <button

                type="submit"

                disabled={profileSaving}

                className="px-4 py-2 bg-[#1342ff] text-white rounded-lg font-semibold disabled:opacity-60 cursor-pointer"

              >

                {profileSaving ? "Saving…" : "Save changes"}

              </button>

            </form>

          </div>

          </div>

        )}



        {activeTab === "subscription" && (

          <div className="space-y-6">

            <div className="rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] bg-[#f9f9f9] dark:bg-[#1c1c1c] p-5">

              <div className="flex justify-between items-start mb-4">

                <div>

                  <h2 className="text-lg font-bold">Current plan</h2>

                  <p className="text-[#667085] dark:text-gray-400 text-sm mt-1">

                    {isPro ? "Pro plan" : isPending ? "Checkout pending" : "Free plan"}

                  </p>

                </div>

                <span className="bg-[#f0f4ff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff] text-xs font-bold px-3 py-1 rounded-lg">

                  {isPro ? "Pro" : "Free"}

                </span>

              </div>



              <div className="bg-[#efefef] dark:bg-[#272725] rounded-lg px-4 py-3">

                <div className="flex justify-between items-center mb-2">

                  <p className="font-semibold">Daily credits</p>

                  <span className="text-sm font-bold text-[#1342ff]">

                    {credits ? `${used}/${limit}` : "…/5"}

                  </span>

                </div>

                <div className="w-full h-2 bg-[#e0e0e0] dark:bg-[#444] rounded-full overflow-hidden">

                  <div

                    className="h-full bg-[#1342ff] rounded-full transition-all"

                    style={{

                      width: credits

                        ? `${Math.min((used / limit) * 100, 100)}%`

                        : "0%",

                    }}

                  />

                </div>

                <p className="text-xs text-[#667085] dark:text-gray-400 mt-2">

                  1 credit = {tokensPerCredit} tokens · Resets at midnight UTC

                </p>

                {credits?.balanceCredits > 0 && (

                  <p className="text-xs text-[#667085] dark:text-gray-400 mt-1">

                    Prepaid balance: {credits.balanceCredits} credits

                  </p>

                )}

              </div>

            </div>



            {!isPro ? (

              <button

                type="button"

                disabled={checkoutLoading}

                className="w-full bg-[#6b88fa] dark:bg-[#1342ff] border border-[#1342ff] rounded-lg py-3 text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"

                onClick={handleUpgrade}

              >

                {checkoutLoading

                  ? "Redirecting to checkout…"

                  : "Upgrade to Pro — 100 daily credits"}

              </button>

            ) : (

              <button

                type="button"

                disabled={cancelLoading}

                className="w-full border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg py-3 font-semibold hover:bg-[#f9f9f9] dark:hover:bg-[#1c1c1c] cursor-pointer disabled:opacity-60"

                onClick={handleCancel}

              >

                {cancelLoading ? "Cancelling…" : "Cancel subscription"}

              </button>

            )}

            {paymentHistory.length > 0 && (

              <div className="rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] bg-[#f9f9f9] dark:bg-[#1c1c1c] p-5">

                <h3 className="text-lg font-bold mb-3">Billing history</h3>

                <ul className="space-y-2 text-sm">

                  {paymentHistory.slice(0, 10).map((p) => (

                    <li

                      key={p.id}

                      className="flex justify-between gap-2 border-b border-[#eaecf0] dark:border-[#2d2d2d] pb-2"

                    >

                      <span>

                        {p.currency} {p.amount} · {p.status}

                      </span>

                      <span className="text-[#667085] dark:text-gray-400">

                        {p.createdAt

                          ? new Date(p.createdAt).toLocaleDateString()

                          : ""}

                      </span>

                    </li>

                  ))}

                </ul>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

};



export default UserProfilePage;

