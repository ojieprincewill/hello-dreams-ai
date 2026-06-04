import React from "react";
import { ArrowRight } from "lucide-react";

const CurrentPersona = ({ onNext, persona }) => {
  const description =
    persona?.communicationStyle || "How you typically communicate";

  return (
    <div className="px-4 sm:px-[5%] py-6 md:py-10">
      <div className="bg-[#efefef] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-4 sm:p-6 md:p-10">
        {/* Badge */}
        <div className="bg-gradient-to-r from-[#8a2be2] to-[#ff00e6] py-1 px-3 w-max rounded-2xl text-[12px] text-white font-bold mb-2">
          {persona?.currentPersona?.title ||
            persona?.currentPersona ||
            "The Friendly Collaborator"}
        </div>

        {/* Title */}
        <p className="text-lg sm:text-xl md:text-2xl font-bold capitalize">
          {description}
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg mb-5">
          {persona?.currentPersona?.description ||
            "You're known for getting things done consistently and thoroughly. People trust you with important tasks."}
        </p>

        {/* GRID → stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-[#17a34a40] border border-[#17a34a] rounded-md p-3 sm:p-4 flex gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 lg:w-[38px] lg:h-[38px] rounded-sm bg-[#2ad062] shrink-0"></div>

            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                Your Strengths
              </p>

              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base md:text-lg">
                {persona?.currentPersona?.strengths?.map((strength) => (
                  <li key={strength}>{strength}</li>
                )) || (
                  <>
                    <li>Highly dependable</li>
                    <li>Excellent at execution</li>
                    <li>Detail-oriented</li>
                    <li>Meets deadlines consistently</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Growth */}
          <div className="bg-[#fd8f6793] dark:bg-[#f3794d5e] border border-[#ff7f50] rounded-md p-3 sm:p-4 flex gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 lg:w-[38px] lg:h-[38px] rounded-sm bg-[#ff7f50] shrink-0"></div>

            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                Growth Opportunities
              </p>

              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base md:text-lg">
                {persona?.currentPersona?.growthOpportunities?.map((item) => (
                  <li key={item}>{item}</li>
                )) || (
                  <>
                    <li>May be seen as operational rather than strategic</li>
                    <li>Could be overlooked for big-picture roles</li>
                    <li>May not be first choice for innovation projects</li>
                    <li>Visibility might be limited</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-center mt-8">
        <button
          onClick={onNext}
          className="
            w-full sm:w-auto sm:min-w-[280px]
            px-6 py-3 sm:py-4
            text-base sm:text-lg md:text-xl
            font-bold text-white
            bg-gradient-to-b from-[#1342ff] to-[#ff00e6]
            rounded-xl
            tracking-tight
            disabled:opacity-60
          "
        >
          Discover your ideal persona
          <ArrowRight size={20} className="inline ml-2" />
        </button>
      </div>
    </div>
  );
};

export default CurrentPersona;
