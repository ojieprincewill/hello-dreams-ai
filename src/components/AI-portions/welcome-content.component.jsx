import React from "react";
import { ArrowRight } from "lucide-react";

const WelcomeContent = ({ onStartAssessment }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Welcome Message */}
      <div className="text-center mb-12">
        <h1 className="text-[32px] font-extrabold mb-3">
          Welcome to your career transformation journey
        </h1>
        <p className="text-[20px]">
          Let's build your dreams together. Start by selecting any section from
          the menu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* What We'll Help You With */}
        <div className="border border-[#ccc] dark:border-[#2d2d2d] p-6 rounded-lg">
          <h3 className="text-[32px] font-extrabold mb-3 leading-[1.3]">
            What We'll Help You With:
          </h3>
          <ul className="space-y-2 list-disc pl-3">
            <li className="text-[20px] ">
              Understand your unique strengths and goals
            </li>
            <li className="text-[20px] ">
              Build your professional persona and brand
            </li>
            <li className="text-[20px] ">
              Create compelling, ATS-friendly resumes
            </li>
            <li className="text-[20px] ">
              Optimize your LinkedIn for maximum visibility
            </li>
            <li className="text-[20px] ">
              Generate professional AI-powered headshots
            </li>
            <li className="text-[20px] ">Build a professional portfolio</li>
            <li className="text-[20px] ">
              Find and apply to relevant job opportunities
            </li>
          </ul>
        </div>

        {/* Quick Video Section */}
        <div className="border border-[#ccc] dark:border-[#2d2d2d] p-6 rounded-lg">
          <h3 className="text-[32px] font-extrabold mb-3 leading-[1.3]">
            Quick video to help you understand how it works
          </h3>
          <div className="relative bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
            <video
              className="w-full h-full rounded-lg object-cover"
              autoPlay
              loop
              muted
              controls
              playsInline
            >
              <source
                src="https://res.cloudinary.com/dganx8kmn/video/upload/v1759447136/Hello%20dreams%20%20AI/4832291_Headache_Migraine_3840x2160_frguuo.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>

      {/* Quick Start Tip */}
      <div className="text-center mb-8 w-[564px] mx-auto">
        <h3 className="text-[32px] font-extrabold mb-3 leading-[1.3]">
          Quick start tip
        </h3>
        <p className=" text-[20px]">
          We recommend starting with 'Let's Get to Know You' to help our AI
          understand your background and career goals.
        </p>
      </div>

      {/* Start Assessment Button */}
      <div className="flex justify-center items-center">
        <button
          onClick={onStartAssessment}
          className="w-[476px] text-center py-3 border border-[#eaecf0] bg-gradient-to-b from-[#748ffc] to-[#1342ff]
 text-[#fff] text-[24px] font-bold rounded-xl tracking-tighter dark:shadow-[0_30px_80px_-10px_rgba(255,215,0,0.5),_0_-30px_80px_-10px_rgba(255,215,0,0.5)] mt-6 mb-12 cursor-pointer"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Start Assessment{" "}
          <span>
            <ArrowRight size={24} strokeWidth={2.5} className="inline ml-2" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeContent;
