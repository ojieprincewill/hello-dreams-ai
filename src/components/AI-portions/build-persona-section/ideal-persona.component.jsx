import React from "react";
import { ArrowRight } from "lucide-react";

const IdealPersona = () => {
  return (
    <div className="min-h-screen px-[5%] py-10 ">
      <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-6 md:p-10 ">
        <div className="bg-gradient-to-r from-[#8a2be2] to-[#ff00e6] py-1 px-2 w-max rounded-2xl text-[12px] font-bold mb-1 ">
          Your Ideal Persona
        </div>
        <p className="text-[18px] md:text-[24px] font-bold capitalize ">
          the executive presence
        </p>
        <p className="text-[14px] md:text-[16px] mb-5 ">
          A confident professional who commands respect through authoritative
          communication and decisive leadership
        </p>
        <p className="text-[18px] md:text-[24px] font-bold ">
          Why this Persona is career gold
        </p>
        <p className="text-[14px] md:text-[16px] mb-5 ">
          Those with executive presence are natural choices for board
          presentations, client meetings and leadership roles because they
          project confidence and competence
        </p>
      </div>
      <div className="flex items-center justify-center mt-8">
        <button
          className="w-[476px] text-center py-3 border border-[#eaecf0] bg-gradient-to-b from-[#1342ff] to-[#ff00e6] text-[#fff] text-[24px] font-bold rounded-xl tracking-tighter disabled:opacity-60 cursor-pointer"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Get your Transformation Plan
          <span>
            <ArrowRight size={24} strokeWidth={2.5} className="inline ml-2" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default IdealPersona;
