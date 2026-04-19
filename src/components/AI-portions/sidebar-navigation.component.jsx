import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SelectableCard from "./reusable-components/selectable-card.component";
import GradientIcon from "./reusable-components/gradient-icon.component";
import { useDashboardActions } from "../../context/DashboardActionsContext";
import { useConversationHistory } from "../../hooks/useConversationHistory";

/* ─── Helpers ─── */

const MODULE_BADGE_COLORS = {
  "get-to-know":
    "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300",
  "cv-builder":
    "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  "cover-letter":
    "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

/* ─── History view ─── */

const HistoryView = ({ activeModule, onSelect }) => {
  const { conversations, isLoading } = useConversationHistory();

  if (isLoading) {
    return (
      <div className="space-y-3 mt-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-14 bg-[#e5e5e5] dark:bg-[#2d2d2d] rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="text-center py-10 text-sm text-[#999]">
        <p>No conversations yet.</p>
        <p className="mt-1">Start a module to begin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4">
      {conversations.map((conv) => (
        <button
          key={`${conv.moduleId}-${conv.id}`}
          onClick={() => onSelect(conv.moduleId, conv.id)}
          className={`w-full text-left p-3 rounded-lg border transition-colors ${
            activeModule === conv.moduleId
              ? "border-[#1342ff] bg-blue-50 dark:bg-[#0a1033]"
              : "border-[#eaecf0] dark:border-[#2d2d2d] hover:bg-[#f0f0f0] dark:hover:bg-[#252525]"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                MODULE_BADGE_COLORS[conv.moduleId] ??
                "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {conv.moduleLabel}
            </span>
            <span className="text-xs text-[#999]">
              {formatDate(conv.updatedAt)}
            </span>
          </div>
          <p className="text-sm font-medium truncate">
            {conv.title || "Untitled"}
          </p>
        </button>
      ))}
    </div>
  );
};

/* ─── Main component ─── */

const SidebarNavigation = ({ modules, activeModule, onModuleClick }) => {
  const [view, setView] = useState("modules");
  const { navigateToConversation } = useDashboardActions();

  const handleHistorySelect = (moduleId, conversationId) => {
    navigateToConversation(moduleId, conversationId);
    setView("modules");
  };

  return (
    <div className="p-6">
      <Link
        to="/"
        className="block text-[20px] md:text-[32px] font-extrabold tracking-tight pt-3 pb-6 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d] transition-colors duration-100 text-center"
      >
        Hello Dreams A<span className="text-[#1342ff]">I</span>
      </Link>

      {/* Journey / History toggle */}
      <div className="flex mt-5 mb-4 bg-[#efefef] dark:bg-[#2d2d2d] rounded-lg p-1">
        <button
          onClick={() => setView("modules")}
          className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${
            view === "modules"
              ? "bg-white dark:bg-[#3d3d3d] shadow-sm text-[#010413] dark:text-white"
              : "text-[#666] dark:text-[#999] hover:text-[#010413] dark:hover:text-white"
          }`}
        >
          Journey
        </button>
        <button
          onClick={() => setView("history")}
          className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${
            view === "history"
              ? "bg-white dark:bg-[#3d3d3d] shadow-sm text-[#010413] dark:text-white"
              : "text-[#666] dark:text-[#999] hover:text-[#010413] dark:hover:text-white"
          }`}
        >
          History
        </button>
      </div>

      {view === "modules" ? (
        <>
          <p className="text-[24px] font-extrabold text-center my-6">
            Your career journey
          </p>
          <div className="space-y-3">
            {modules.map((module) => (
              <SelectableCard
                key={module.id}
                isSelected={activeModule === module.id}
                onClick={() => onModuleClick(module.id)}
              >
                <div className="flex items-start space-x-3">
                  <GradientIcon />
                  <div className="flex-1">
                    <h4 className="text-[16px] font-extrabold">
                      {module.title}
                    </h4>
                    <p className="text-[#010413] dark:text-[#f7f7f7] text-[16px] mt-1">
                      {module.description}
                    </p>
                  </div>
                  <ArrowRight size={16} strokeWidth={1.5} />
                </div>
              </SelectableCard>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-[20px] font-extrabold text-center my-4">
            Past Conversations
          </p>
          <HistoryView
            activeModule={activeModule}
            onSelect={handleHistorySelect}
          />
        </>
      )}
    </div>
  );
};

export default SidebarNavigation;
