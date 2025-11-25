import React, { useState } from "react";
import SidebarNavigation from "./sidebar-navigation.component";
import WelcomeContent from "./welcome-content.component";
import GetToKnowYou from "./get-to-know-you.component";
import BuildPersona from "./build-persona.component";
import CvBuilder from "./cv-builder.component";
import CoverLetter from "./cover-letter.component";
import ProfessionalHeadshot from "./professional-headshot.component";
import UserIconDropdown from "../user-icon-dropdown/user-icon-dropdown.component";

const AiDashboard = () => {
  const [activeModule, setActiveModule] = useState(null);
  // const [progress, setProgress] = useState(0);

  const careerModules = [
    {
      id: "get-to-know",
      title: "Let's get to know you",
      description: "Tell us about your background, skills, and career goals.",
      isActive: true,
      isCompleted: false,
    },
    {
      id: "build-persona",
      title: "Build your Persona",
      description: "Discover your professional persona & communication style",
      isActive: false,
      isCompleted: false,
    },
    {
      id: "cv-builder",
      title: "CV & Resume Builder",
      description: "Create a professional ATS friendly resume",
      isActive: false,
      isCompleted: false,
    },
    {
      id: "cover-letter",
      title: "Cover letter & Personal Statement",
      description: "Generate a compelling cover letter or statement",
      isActive: false,
      isCompleted: false,
    },
    {
      id: "linkedin-optimizer",
      title: "LinkedIn Optimiser",
      description: "Optimise your LinkedIn profile for maximum visibility",
      isActive: false,
      isCompleted: false,
    },
    {
      id: "professional-headshot",
      title: "Professional Headshot",
      description: "Generative AI-powered professional photos",
      isActive: false,
      isCompleted: false,
    },
    {
      id: "portfolio-creation",
      title: "Portfolio Creation",
      description: "Build a stunning portfolio to showcase your work",
      isActive: false,
      isCompleted: false,
    },
    {
      id: "job-application",
      title: "Job Application",
      description: "Find relevant jobs and get application assistance",
      isActive: false,
      isCompleted: false,
    },
  ];

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId);
  };

  const handleStartAssessment = () => {
    setActiveModule("get-to-know");
  };

  return (
    <div
      className="bg-[#212121] text-white"
      style={{ fontFamily: "Darker Grotesque, sans-serif" }}
    >
      <div className="flex ">
        {/* Left Sidebar */}
        <div className="fixed top-0 left-0 h-screen w-[25%] overflow-auto sidebar bg-[#181818] z-50">
          <SidebarNavigation
            modules={careerModules}
            activeModule={activeModule}
            onModuleClick={handleModuleClick}
          />
        </div>

        <div className="ml-[25%] flex flex-col w-full">
          {/* Top Bar */}
          <div className="flex justify-end items-center space-x-15 px-10 py-4 border-b border-[#2d2d2d]">
            <div className="text-[20px] font-extrabold">Progress: 0%</div>
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
