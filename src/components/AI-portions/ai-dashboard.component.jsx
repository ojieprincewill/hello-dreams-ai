import React, { useState, useEffect } from "react";
import SidebarNavigation from "./sidebar-navigation.component";
import WelcomeContent from "./welcome-content.component";
import GetToKnowYou from "./get-to-know-you-section/get-to-know-you.component";
import BuildPersona from "./build-persona-section/build-persona.component";
import CvBuilder from "./cv-builder-section/cv-builder.component";
import CoverLetter from "./cover-letter-section/cover-letter.component";
import ProfessionalHeadshot from "./professional-headshot.component";
import LinkedInOptimizer from "./linkedin-optimizer-section/linkedin-optimizer.component";
import UserIconDropdown from "../user-icon-dropdown/user-icon-dropdown.component";
import { careerModules } from "../../data/career-modules.data";
import ThemeToggle from "./theme-toggle/theme-toggle.component";
import ProgressIndicator from "./progress-indicator.component";
import { DashboardActionsContext } from "../../context/DashboardActionsContext";
import { ResumeProvider } from "../../context/ResumeContext";
import { PaywallProvider, usePaywall } from "../../context/paywallContext";
import PaywallModal from "../paywall-modal/paywall-modal.component";

const MODULE_COMPONENTS = {
  "get-to-know": GetToKnowYou,
  "build-persona": BuildPersona,
  "cv-builder": CvBuilder,
  "cover-letter": CoverLetter,
  "professional-headshot": ProfessionalHeadshot,
  "linkedin-optimizer": LinkedInOptimizer,
};

const AiDashboardInner = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [newChatAction, setNewChatAction] = useState(null);
  const [requestedConversationId, setRequestedConversationId] = useState(null);

  // Restore active module on mount
  useEffect(() => {
    const saved = localStorage.getItem("activeModule");
    if (saved) setActiveModule(saved);
  }, []);

  // Persist active module whenever it changes
  useEffect(() => {
    if (activeModule) {
      localStorage.setItem("activeModule", activeModule);
    } else {
      localStorage.removeItem("activeModule");
    }
  }, [activeModule]);

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId);
  };

  const handleStartAssessment = () => {
    setActiveModule("get-to-know");
  };

  const ActiveComponent = activeModule ? MODULE_COMPONENTS[activeModule] : null;

  return (
    <ResumeProvider>
      <DashboardActionsContext.Provider
        value={{
          registerNewChat: (fn) => setNewChatAction(() => fn),
          navigateToConversation: (moduleId, conversationId) => {
            setActiveModule(moduleId);
            if (conversationId) setRequestedConversationId(conversationId);
          },
        }}
      >
        <div
          className="bg-white text-[#010413] dark:bg-[#212121] dark:text-white transition-colors ease-in-out"
          style={{ fontFamily: "Darker Grotesque, sans-serif" }}
        >
          <div className="flex">
            {/* Left Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-[25%] overflow-auto sidebar border-r-2 border-r-[#eaecf0] dark:border-r-0 bg-[#f9f9f9] dark:bg-[#181818] z-50">
              <SidebarNavigation
                modules={careerModules}
                activeModule={activeModule}
                onModuleClick={handleModuleClick}
              />
            </div>

            {/* Right panel — fixed so the top bar never scrolls away */}
            <div className="fixed left-[25%] right-0 top-0 bottom-0 flex flex-col">
              {/* Top Bar */}
              <div className="flex justify-end items-center space-x-15 px-10 py-4 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121] z-40 shrink-0">
                {newChatAction && (
                  <button
                    onClick={newChatAction}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-[#2d2d2d] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#3d3d3d] transition-colors"
                  >
                    + New Chat
                  </button>
                )}
                <ThemeToggle />
                <ProgressIndicator />
                <UserIconDropdown />
              </div>

              {/* Main Content Area — scrollable */}
              <div className="flex-1 overflow-y-auto">
                {!activeModule ? (
                  <WelcomeContent onStartAssessment={handleStartAssessment} />
                ) : ActiveComponent ? (
                  <ActiveComponent
                    requestedConversationId={requestedConversationId}
                    onConversationLoaded={() => setRequestedConversationId(null)}
                  />
                ) : (
                  <div className="min-h-screen p-6">
                    <h2 className="text-2xl font-bold mb-4">
                      {careerModules.find((m) => m.id === activeModule)?.title}
                    </h2>
                    <p className="text-gray-400">
                      Module content will be implemented here...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardActionsContext.Provider>
    </ResumeProvider>
  );
};

const AiDashboardWithPaywall = () => (
  <PaywallProvider>
    <AiDashboardInner />
    <PaywallModalConnector />
  </PaywallProvider>
);

const PaywallModalConnector = () => {
  const { paywallVisible, creditInfo, hidePaywall } = usePaywall();
  return (
    <PaywallModal
      isOpen={paywallVisible}
      onClose={hidePaywall}
      used={creditInfo?.used ?? 5}
      limit={creditInfo?.limit ?? 5}
      resetsAt={creditInfo?.resetsAt}
    />
  );
};

export default AiDashboardWithPaywall;
