import React, { useEffect, useMemo, useState } from "react";
import SelectableCard from "./components/selectable-card.component";
import { UserIcon } from "@heroicons/react/24/outline";
import { ArrowRight } from "lucide-react";
import GradientIcon from "./components/gradient-icon.component";

const STEPS = [
  {
    id: "how-seen-1",
    title: "How You're Seen • 1 of 4",
    question: "When your colleagues describe you, they say you're...",
    options: [
      "Calm and dependable",
      "Creative and bold",
      "Precise and detailed focus",
      "Friendly and approachable",
    ],
  },
  {
    id: "how-seen-2",
    title: "How You're Seen • 2 of 4",
    question: "In meetings, you tend to...",
    options: [
      "Take the lead in discussions",
      "Share when you have something valuable",
      "Listen, process and give input after",
      "Ask questions and support others' ideas",
    ],
  },
  {
    id: "how-seen-3",
    title: "How You're Seen • 3 of 4",
    question: "Your boss often says you should...",
    options: [
      "Speak up more",
      "Stay more focused",
      "Take more initiative",
      "Collaborate more",
    ],
  },
  {
    id: "how-seen-4",
    title: "How You're Seen • 4 of 4",
    question: "People come to you when they need...",
    options: [
      "Creative solutions to tough problems",
      "Someone to organise and execute plans",
      "Help resolve team conflicts",
      "Deep expertise in your area",
      "They rarely come to you",
    ],
  },
  {
    id: "where-to-be-1",
    title: "Where You Want to Be • 1 of 3",
    question: "What's your next career goal?",
    options: [
      "Getting promoted to leadership position",
      "Landing new role in my field",
      "Switching to a different career path",
      "Become recognised as a subject matter expert",
    ],
  },
  {
    id: "where-to-be-2",
    title: "Where You Want to Be • 2 of 3",
    question: "How do you want people to see you at work?",
    options: [
      "Confident leader who inspires others",
      "As the go to problem-solver for complex challenges",
      "As an innovator who brings fresh ideas",
      "As a connector who builds strong relationship",
    ],
  },
  {
    id: "where-to-be-3",
    title: "Where You Want to Be • 3 of 3",
    question: "One thing you wish people noticed more about you is...",
    options: [
      "My strategic thinking and long term vision",
      "How well i collaborate and support others",
      "The consistent result i deliver",
      "My creative approach to solving problems",
    ],
  },
];

const STORAGE_KEY = "personaSelections";
const STARTED_KEY = "personaStarted";

const BuildPersona = () => {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState({});

  // load persisted
  useEffect(() => {
    try {
      const startedRaw = localStorage.getItem(STARTED_KEY);
      if (startedRaw) setStarted(startedRaw === "true");
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSelections(parsed.selections || {});
        if (parsed.stepIndex != null) setStepIndex(parsed.stepIndex);
      }
    } catch (error) {
      // Persisted state might be malformed or inaccessible; reset gracefully
      console.error("Failed to load persona state from storage:", error);
      setStarted(false);
      setSelections({});
      setStepIndex(0);
    }
  }, []);

  // persist on change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selections, stepIndex })
    );
  }, [selections, stepIndex]);

  useEffect(() => {
    localStorage.setItem(STARTED_KEY, String(started));
  }, [started]);

  const current = useMemo(() => STEPS[stepIndex], [stepIndex]);
  const isLast = stepIndex === STEPS.length - 1;

  const selectOption = (option) => {
    setSelections((prev) => ({ ...prev, [current.id]: option }));
  };

  const goNext = () => {
    if (!isLast) setStepIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  if (!started) {
    return (
      <div className="px-[5%] py-10">
        <div className="flex items-center space-x-3 mb-6 p-5 border-b border-[#2d2d2d]">
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

        <div className="bg-[#2d2d2d] border border-[#2d2d2d] rounded-xl p-6 md:p-10 ">
          <p className="text-[24px] font-bold ">
            Your Professional Headshot is Ready
          </p>
          <p className="text-[20px] font-medium">
            Discover the professional version of yourself that will accelerate
            your career
          </p>

          <div className="pl-5 my-5">
            <p className="text-[20px] md:text-[32px] font-extrabold mb-4">
              Here's how it works:
            </p>
            <ul className="list-disc pl-5 space-y-6 text-[14px] md:text-[20px]">
              <li>
                <span className="font-bold">How You're Seen at Work</span>
                <br />4 quick questions about your current workplace reputation
              </li>
              <li>
                <span className="font-bold">Where You Want to Be</span>
                <br />3 questions about your career target and desired
                perception
              </li>
              <li>
                <span className="font-bold">
                  Get your personalized career persona
                </span>
                <br />
                plus a detailed playbook to embody it
              </li>
            </ul>
          </div>

          <div className="flex justify-center items-center">
            <button
              onClick={() => setStarted(true)}
              className="w-[476px] text-center py-3 border border-[#eaecf0] bg-[#1342ff]
 text-[#fff] text-[24px] font-bold rounded-xl tracking-tighter shadow-[0_30px_80px_-10px_rgba(255,215,0,0.5),_0_-30px_80px_-10px_rgba(255,215,0,0.5)] mt-6 mb-12 cursor-pointer"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Let's discover your persona
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

  return (
    <div className="min-h-screen px-[5%] py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 p-5 border-b border-[#2d2d2d]">
        <UserIcon className="h-6 w-6" />
        <p className="text-[24px] font-extrabold">{current.title}</p>
      </div>

      {/* Card Group */}
      <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-6 md:p-10 ">
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
            className="px-5 py-2 text-[16px] font-medium rounded-md border border-[#2d2d2d] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={goNext}
            disabled={!selections[current.id]}
            className="px-5 py-2 text-[16px] font-medium rounded-md bg-gradient-to-b from-[#748ffc] to-[#1342ff] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed "
          >
            {isLast ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildPersona;
