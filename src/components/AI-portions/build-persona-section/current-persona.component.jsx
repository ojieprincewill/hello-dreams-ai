import React from "react";
import { ArrowRight } from "lucide-react";

const CurrentPersona = ({ onNext, persona }) => {
  const personaName = persona?.professionalVoice || "Your Persona";

  const description =
    persona?.communicationStyle || "How you typically communicate";

  const strengths = persona?.personalityTraits || [];

  const growth = [
    "May need more strategic visibility",
    "Could improve executive presence",
    "Opportunity to lead more initiatives",
    "Expand influence across teams",
  ];

  return (
    <div className="min-h-screen px-[5%] py-10 ">
      <div className="bg-[#e6e6e6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-6 md:p-10 ">
        <div className="bg-gradient-to-r from-[#8a2be2] to-[#ff00e6] py-1 px-2 w-max rounded-2xl text-[12px] text-[#fff] font-bold mb-1 ">
          {personaName}
        </div>
        <p className="text-[18px] md:text-[24px] font-bold capitalize ">
          {description}
        </p>
        <p className="text-[14px] md:text-[16px] mb-5 ">
          You're known for getting things done consistently and thoroughly.
          People trust you with important tasks.
        </p>
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-[#17a34a40] border border-[#17a34a] rounded-md p-2 flex space-x-2 h-[250px]">
            <div className="w-[38px] h-[38px] rounded-sm bg-[#2ad062]"></div>
            <div className="w-max">
              <p className="text-[18px] md:text-[24px] font-bold capitalize mb-1 ">
                Your Strengths
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[14px] md:text-[16px]">
                {strengths.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-[#fd8f6793] dark:bg-[#f3794d5e] border border-[#ff7f50] rounded-md p-2 flex space-x-2 h-[250px]">
            <div className="w-[38px] h-[38px] rounded-sm bg-[#ff7f50]"></div>
            <div className="w-max">
              <p className="text-[18px] md:text-[24px] font-bold capitalize mb-1 ">
                Growth Opportunities
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[14px] md:text-[16px]">
                {growth.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-8">
        <button
          onClick={onNext}
          className="w-[476px] text-center py-3 border border-[#eaecf0] bg-gradient-to-b from-[#1342ff] to-[#ff00e6] text-[#fff] text-[24px] font-bold rounded-xl tracking-tighter disabled:opacity-60 cursor-pointer"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Discover your ideal persona
          <span>
            <ArrowRight size={24} strokeWidth={2.5} className="inline ml-2" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default CurrentPersona;
