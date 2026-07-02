import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../../auth/authContext";
import { getMyProfile } from "../../api/professionalProfileService";
import AccountTab from "./tabs/AccountTab";
import AiProfileTab from "./tabs/AiProfileTab";
import DocumentsTab from "./tabs/DocumentsTab";
import SubscriptionTab from "./tabs/SubscriptionTab";

/* ── Tab config ── */

const TABS = [
  { id: "account", label: "Account" },
  { id: "ai-profile", label: "My AI Profile" },
  { id: "documents", label: "My Documents" },
  { id: "subscription", label: "Subscription" },
];

/* ── Avatar ── */

const Avatar = ({ name, size = 64 }) => {
  const initials = name
    ? name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-extrabold shrink-0"
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: "linear-gradient(135deg, #8aa1ff 0%, #1342ff 100%)",
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  );
};

/* ── Profile completion bar ── */

const SECTION_KEYS = [
  "basicInfo",
  "careerGoals",
  "extractedData",
  "cvMetadata",
  "targetJob",
  "persona",
];

const getCompletion = (completedSections) => {
  if (!completedSections) return 0;
  const done = SECTION_KEYS.filter((k) => completedSections[k]).length;
  return Math.round((done / SECTION_KEYS.length) * 100);
};

/* ── Page ── */

const UserProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const resolveInitialTab = () => {
    const s = location.state?.active;
    if (s === "subscription") return "subscription";
    if (s === "settings") return "account";
    const p = new URLSearchParams(location.search).get("tab");
    if (TABS.some((t) => t.id === p)) return p;
    return "account";
  };

  const [activeTab, setActiveTab] = useState(resolveInitialTab);
  const [completedSections, setCompletedSections] = useState(null);

  useEffect(() => {
    const s = location.state?.active;
    if (s === "subscription") setActiveTab("subscription");
    else if (s === "settings") setActiveTab("account");
  }, [location.state?.active]);

  useEffect(() => {
    getMyProfile()
      .then((p) => setCompletedSections(p?.completedSections ?? {}))
      .catch(() => {});
  }, []);

  const pct = getCompletion(completedSections);
  const isPro = user?.plan === "pro";

  return (
    <div
      className="min-h-screen bg-white dark:bg-[#212121] text-[#010413] dark:text-white"
      style={{ fontFamily: "Darker Grotesque, sans-serif" }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/ai-dashboard")}
          className="flex items-center gap-2 text-sm text-[#667085] dark:text-gray-400 hover:text-[#1342ff] dark:hover:text-[#7b96ff] mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to dashboard
        </button>

        {/* Hero header */}
        <div className="rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] bg-[#f9f9f9] dark:bg-[#1c1c1c] p-5 md:p-6 mb-8">
          <div className="flex items-center gap-4">
            <Avatar name={user?.name} size={64} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <h1 className="text-lg md:text-xl font-extrabold truncate leading-tight">
                    {user?.name || "Your Account"}
                  </h1>
                  <p className="text-sm text-[#667085] dark:text-gray-400 truncate mt-0.5">
                    {user?.email || ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${
                    isPro
                      ? "bg-[#e8edff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff]"
                      : "bg-[#f2f2f2] dark:bg-[#2d2d2d] text-[#667085] dark:text-gray-400"
                  }`}
                >
                  {isPro ? "Pro" : "Free"}
                </span>
              </div>
              {completedSections !== null && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-[#667085] dark:text-gray-400">
                      AI profile {pct}% complete
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("ai-profile")}
                      className="text-xs text-[#1342ff] dark:text-[#7b96ff] hover:opacity-70 cursor-pointer"
                    >
                      {pct < 100 ? "Complete profile" : "View"}
                    </button>
                  </div>
                  <div className="w-full h-1.5 bg-[#e0e0e0] dark:bg-[#444] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1342ff] rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-8 bg-[#efefef] dark:bg-[#2d2d2d] rounded-xl p-1 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 shrink-0 py-2 px-3 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white dark:bg-[#3d3d3d] shadow-sm text-[#010413] dark:text-white"
                  : "text-[#667085] dark:text-[#999] hover:text-[#010413] dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active tab */}
        {activeTab === "account" && <AccountTab />}
        {activeTab === "ai-profile" && <AiProfileTab />}
        {activeTab === "documents" && <DocumentsTab />}
        {activeTab === "subscription" && <SubscriptionTab />}
      </div>
    </div>
  );
};

export default UserProfilePage;
