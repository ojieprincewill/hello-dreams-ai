import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { ArrowRight } from "lucide-react";
import GradientIcon from "../reusable-components/gradient-icon.component";
import SelectableCard from "../reusable-components/selectable-card.component";

import CurrentPersona from "./current-persona.component";
import IdealPersona from "./ideal-persona.component";
import TransformationPlan from "./transformation-plan.component";

import { usePersonaBuilder } from "../custom-hooks/usePersonaBuilder";

const BuildPersona = () => {
  const {
    current,
    isLast,
    started,
    stepIndex,
    selections,
    persona,
    loading,
    resultStep,

    goToIdeal,
    goToPlan,

    selectOption,
    goNext,
    goPrev,
    handleStart,
    handleApplyPersona,
    handleFinish,
    handleRestart,
  } = usePersonaBuilder();

  // =====================
  // START SCREEN
  // =====================

  if (!started) {
    return (
      <div className="px-[5%] py-10">
        <div className="flex items-center space-x-3 mb-6 p-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
          <UserIcon className="h-6 w-6" />
          <div>
            <h2 className="text-[24px] font-extrabold ">
              Build your persona & workplace identity
            </h2>
            <p className="text-[20px]">
              Transform your photo into a professional headshot with AI
            </p>
          </div>
        </div>

        <div className="bg-[#e6e6e6] dark:bg-[#2d2d2d] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-6 md:p-10 ">
          <p className="text-[24px] font-bold ">
            Your Professional Headshot is Ready
          </p>
          <p className="text-[20px] font-medium">
            Discover the professional version of yourself that will accelerate
            your career
          </p>

          <div className="pl-5 my-5">
            <p className="text-[20px] md:text-[32px] font-extrabold mb-4">
              Here's your transformation journey:
            </p>
            <ul className="list-disc pl-5 space-y-6 text-[14px] md:text-[20px] marker:text-sm">
              <li>
                <span className="font-bold">
                  Mirror: See Your Curent Persona
                </span>
                <br />
                Understand how you're perceived at work right now
              </li>
              <li>
                <span className="font-bold">Target: Your Ideal Persona</span>
                <br />
                Discover the persona that will accelerate your career
              </li>
              <li>
                <span className="font-bold">
                  Transform: Practical Action Plan
                </span>
                <br />
                Get specific guidance on how to embody your new persona
              </li>
            </ul>
          </div>

          <div className="flex justify-center items-center">
            <button
              onClick={handleStart}
              className="w-[476px] text-center py-3 border border-[#eaecf0] bg-gradient-to-b from-[#748ffc] to-[#1342ff]
         text-[#fff] text-[24px] font-bold rounded-xl tracking-tighter dark:shadow-[0_30px_80px_-10px_rgba(255,215,0,0.5),_0_-30px_80px_-10px_rgba(255,215,0,0.5)] mt-6 mb-12 cursor-pointer"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Start your persona journey
              <span>
                <ArrowRight
                  size={24}
                  strokeWidth={2.5}
                  className="inline ml-2"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================
  // LOADING
  // =====================

  if (loading) {
    return (
      <div className="min-h-screen px-[5%] py-10 flex justify-center items-center">
        <div className="bg-[#e6e6e6] border-[#eaecf0] dark:bg-[#181818] border dark:border-[#2d2d2d] rounded-xl p-6 md:p-10 flex flex-col justify-center items-center space-y-3">
          <GradientIcon />
          <p className="text-[18px] md:text-[24px] font-bold">
            Analysing your persona...
          </p>
          <p className="text-[18px] md:text-[24px]">
            Identifying your current workplace persona and career transformation
            path
          </p>
        </div>
      </div>
    );
  }

  // =====================
  // RESULT
  // =====================

  if (persona) {
    if (resultStep === "current") {
      return <CurrentPersona onNext={goToIdeal} persona={persona} />;
    }

    if (resultStep === "ideal") {
      return <IdealPersona onNext={goToPlan} persona={persona} />;
    }

    if (resultStep === "plan") {
      return (
        <TransformationPlan
          persona={persona}
          onApply={handleApplyPersona}
          onRestart={handleRestart}
        />
      );
    }
  }

  // =====================
  // QUESTIONS
  // =====================

  return (
    <div className="min-h-screen px-[5%] py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 p-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <UserIcon className="h-6 w-6" />
        <p className="text-[24px] font-extrabold">{current.title}</p>
      </div>

      {/* Card Group */}
      <div className="bg-[#f6f6f6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-6 md:p-10 ">
        <p className="text-[18px] md:text-[24px] font-bold mb-5">
          {current.question}
        </p>

        <div className="space-y-3">
          {current.options.map((opt) => (
            <SelectableCard
              key={opt}
              isSelected={selections[current.id] === opt}
              onClick={() => selectOption(opt)}
            >
              <div className="flex items-center space-x-3">
                <GradientIcon />
                <div className="flex-1">
                  <p className="text-[20px] font-medium mt-1">{opt}</p>
                </div>
              </div>
            </SelectableCard>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goPrev}
            disabled={stepIndex === 0}
            className="px-5 py-2 text-[16px] font-medium rounded-md border border-[#ccc] dark:border-[#2d2d2d] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={isLast ? handleFinish : goNext}
            disabled={!selections[current.id]}
            className="px-5 py-2 text-[16px] font-medium rounded-md text-[#fff] bg-gradient-to-b from-[#748ffc] to-[#1342ff] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed "
          >
            {isLast ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildPersona;
