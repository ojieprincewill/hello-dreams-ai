import React, { useState, useEffect } from "react";
import SidebarNavigation from "./sidebar-navigation.component";
import WelcomeContent from "./welcome-content.component";
import GetToKnowYou from "./get-to-know-you.component";
import BuildPersona from "./build-persona-section/build-persona.component";
import CvBuilder from "./cv-builder-section/cv-builder.component";
import CoverLetter from "./cover-letter.component";
import ProfessionalHeadshot from "./professional-headshot.component";
import UserIconDropdown from "../user-icon-dropdown/user-icon-dropdown.component";
import { careerModules } from "../../data/career-modules.data";
import ThemeToggle from "./theme-toggle/theme-toggle.component";

const AiDashboard = () => {
  const [activeModule, setActiveModule] = useState(null);
  // const [progress, setProgress] = useState(0);

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

  return (
    <div
      className="bg-white text-[#010413] dark:bg-[#212121] dark:text-white transition-all ease-in-out"
      style={{ fontFamily: "Darker Grotesque, sans-serif" }}
    >
      <div className="flex ">
        {/* Left Sidebar */}
        <div className="fixed top-0 left-0 h-screen w-[25%] overflow-auto sidebar border-r-2 border-r-[#eaecf0] dark:border-r-0 bg-[#f9f9f9] dark:bg-[#181818] z-50">
          <SidebarNavigation
            modules={careerModules}
            activeModule={activeModule}
            onModuleClick={handleModuleClick}
          />
        </div>

        <div className="relative ml-[25%] flex flex-col w-full">
          {/* Top Bar */}
          <div className="flex justify-end items-center space-x-15 px-10 py-4 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
            <ThemeToggle />
            <div className="text-[20px] text-[#222] dark:text-white font-extrabold">
              Progress: 0%
            </div>
            <UserIconDropdown />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {!activeModule ? (
              <WelcomeContent onStartAssessment={handleStartAssessment} />
            ) : activeModule === "get-to-know" ? (
              <GetToKnowYou />
            ) : activeModule === "build-persona" ? (
              <BuildPersona />
            ) : activeModule === "cv-builder" ? (
              <CvBuilder />
            ) : activeModule === "cover-letter" ? (
              <CoverLetter />
            ) : activeModule === "professional-headshot" ? (
              <ProfessionalHeadshot />
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
  );
};

export default AiDashboard;
