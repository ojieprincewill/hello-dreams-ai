import React from "react";
import { ArrowRight } from "lucide-react";

const IdealPersona = ({ onNext, persona }) => {
  return (
    <div className="min-h-[100svh] px-4 sm:px-[5%] py-6 md:py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-[#efefef] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-4 sm:p-6 md:p-10">
          {/* Badge */}
          <div className="bg-gradient-to-r from-[#8a2be2] to-[#ff00e6] py-1 px-3 w-max rounded-2xl text-[12px] text-white font-bold mb-2">
            Your Ideal Persona
          </div>

          {/* Title */}
          <p className="text-lg sm:text-xl md:text-2xl font-bold capitalize">
            {persona?.idealPersona?.title ||
              persona?.idealPersona ||
              "Executive Presence"}
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg mb-5">
            {persona?.idealPersona?.description ||
              "A confident professional who commands respect through authoritative communication and decisive leadership"}
          </p>

          {/* Section heading */}
          <p className="text-lg sm:text-xl md:text-2xl font-bold">
            Why this Persona is career gold
          </p>

          {/* Section text */}
          <p className="text-sm sm:text-base md:text-lg mb-5">
            {persona?.idealPersona?.careerAdvantage ||
              "Those with executive presence are natural choices for board presentations, client meetings and leadership roles because they project confidence and competence"}
          </p>
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
            Get your Transformation Plan
            <ArrowRight size={20} className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdealPersona;
