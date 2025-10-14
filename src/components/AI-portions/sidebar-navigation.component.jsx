import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SelectableCard from "./components/selectable-card.component";
import GradientIcon from "./components/gradient-icon.component";

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
          <SelectableCard
            key={module.id}
            isSelected={activeModule === module.id}
            onClick={() => onModuleClick(module.id)}
          >
            <div className="flex items-start space-x-3">
              <GradientIcon />
              <div className="flex-1">
                <h4 className="text-[16px] font-extrabold">{module.title}</h4>
                <p className="text-[#f7f7f7] text-[16px] mt-1">
                  {module.description}
                </p>
              </div>
              <ArrowRight size={16} strokeWidth={1.5} />
            </div>
          </SelectableCard>
        ))}
      </div>
    </div>
  );
};

export default SidebarNavigation;
