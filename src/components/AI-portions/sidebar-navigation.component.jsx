import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SidebarNavigation = ({ modules, activeModule, onModuleClick }) => {
  return (
    <div className="p-6">
      <Link
        to="/"
        className="block text-[20px] md:text-[32px] font-extrabold tracking-tight pt-3 pb-10 border-b border-[#2d2d2d] text-center"
      >
        Hello Dreams A<span className="text-[#1342ff]">I</span>
      </Link>
      <p className="text-[24px] font-extrabold text-center my-6 ">
        Your career journey
      </p>

      <div className="space-y-3">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => onModuleClick(module.id)}
            className={`relative cursor-pointer transition-all duration-300 ${
              activeModule === module.id
                ? "bg-gradient-to-br from-[#1342ff] to-[#ff00e6] p-[2px] rounded-md"
                : "border border-[#2d2d2d] rounded-md"
            }`}
          >
            <div className="bg-[#181818] rounded-md p-4 hover:bg-[#151515] transition-all duration-200">
              <div className="flex items-start space-x-3">
                {/* Module Icon */}
                <div className="w-[38px] h-[38px] rounded-sm bg-gradient-to-br from-[#1342ff] to-[#ff00e6]"></div>

                {/* Module Content */}
                <div className="flex-1">
                  <h4 className="text-[16px] font-extrabold">{module.title}</h4>
                  <p className="text-[#f7f7f7] text-[16px] mt-1">
                    {module.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <ArrowRight size={16} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarNavigation;
