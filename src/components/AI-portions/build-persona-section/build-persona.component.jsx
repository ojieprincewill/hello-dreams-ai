import React, { useEffect, useMemo, useState } from "react";
import SelectableCard from "../reusable-customs/selectable-card.component";
import { UserIcon } from "@heroicons/react/24/outline";
import { ArrowRight } from "lucide-react";
import GradientIcon from "../reusable-customs/gradient-icon.component";
import { apiFetch } from "../../../auth/apiClient";
import CurrentPersona from "./current-persona.component";
import IdealPersona from "./ideal-persona.component";
import TransformationPlan from "./transformation-plan.component";

const STEPS = [
  {
    id: "question-1",
    title: "Question 1 of 6",
    question: "When presenting ideas in meetings, you typically...",
    options: [
      "Wait to be asked your opinion",
      "Build on others ideas supportively",
      "Present your ideas clearly and concisely",
      "Challenge assumptions and build for better solutions",
    ],
  },
  {
    id: "question-2",
    title: "Question 2 of 6",
    question: "Your colleagues would describe your work approach as...",
    options: [
      "Steady, reliable and detail-oriented",
      "Creative, innovative and flexible",
      "Results-driven and goal-focused",
      "People-focused and relationship-building",
    ],
  },
  {
    id: "question-3",
    title: "Question 3 of 6",
    question: "Your colleagues would describe your work approach as...",
    options: [
      "Focus on executing tasks efficiently",
      "Bring people together to find solutions",
      "Step back and develop a strategic approach",
      "Look for creative, unconventional solutions",
    ],
  },
  {
    id: "question-4",
    title: "Question 4 of 6",
    question: "At work, you prefer to...",
    options: [
      "Work behind the scenes and let results speak",
      "Share credit with the team and celebrate together",
      "Present your work to stakeholders when appropriate",
      "Take the spotlight and lead high-profile initiatives",
    ],
  },
  {
    id: "question-5",
    title: "Question 5 of 6",
    question: "Your primary career aspiration is...",
    options: [
      "Become a recognized expert in your field",
      "Lead teams and drive organizational change",
      "Create innovative solutions and lead projects",
      "Build influence and shape strategic decisions",
    ],
  },
  {
    id: "question-6",
    title: "Question 6 of 6",
    question: "The area you most want to develop is...",
    options: [
      "Speaking up with more confidence and authority",
      "Building stronger professional relationships",
      "Thinking and communicating more strategically",
      "Commanding more respect and executive presence",
    ],
  },
];

const STORAGE_KEY = "personaSelections";
const STARTED_KEY = "personaStarted";

const BuildPersona = () => {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    try {
      setLoading(true);

      // Format answers into array with questionId, question, and answer
      const formattedAnswers = STEPS.map((step, index) => {
        const answer = selections[step.id];
        return {
          questionId: String(index + 1), // or use step.id if backend accepts it
          question: step.question,
          answer,
        };
      }).filter((ans) => ans.answer); // only include answered questions

      // Step 1: Submit answers
      const answersRes = await apiFetch(
        "https://hello-dreams-ai.onrender.com/persona-builder/answers",
        {
          method: "POST",
          body: JSON.stringify({ answers: formattedAnswers }),
        }
      );

      if (!answersRes.ok) {
        console.error("Failed to submit answers:", answersRes.status);
        setLoading(false);
        return;
      }

      // Step 2: Trigger persona generation
      const genRes = await apiFetch(
        "https://hello-dreams-ai.onrender.com/persona-builder/generate",
        {
          method: "POST",
        }
      );

      if (!genRes.ok) {
        console.error("Failed to generate persona:", genRes.status);
        setLoading(false);
        return;
      }

      // Step 3: Fetch persona
      const personaRes = await apiFetch(
        "https://hello-dreams-ai.onrender.com/persona-builder/persona",
        {
          method: "GET",
        }
      );

      if (personaRes.ok) {
        const data = await personaRes.json();
        setPersona(data.persona);
      } else {
        console.error("Failed to fetch persona:", personaRes.status);
      }
    } catch (err) {
      console.error("Error generating persona:", err);
    } finally {
      setLoading(false);
    }
  };

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
              onClick={() => setStarted(true)}
              className="w-[476px] text-center py-3 border border-[#eaecf0] bg-[#1342ff]
 text-[#fff] text-[24px] font-bold rounded-xl tracking-tighter shadow-[0_30px_80px_-10px_rgba(255,215,0,0.5),_0_-30px_80px_-10px_rgba(255,215,0,0.5)] mt-6 mb-12 cursor-pointer"
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
        <CurrentPersona />
        <IdealPersona />
        <TransformationPlan />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen px-[5%] py-10 flex justify-center items-center">
        <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-6 md:p-10 flex flex-col justify-center items-center space-y-3">
          <GradientIcon />
          <p className="text-[18px] md:text-[24px] font-bold">
            Analysing your persona
          </p>
          <p className="text-[18px] md:text-[24px]">
            Identifying your current workplace persona and career transformation
            path
          </p>
        </div>
      </div>
    );
  }

  if (persona) {
    return (
      <div className="min-h-screen px-[5%] py-10">
        <div className="flex items-center gap-3 mb-8 p-5 border-b border-[#2d2d2d]">
          <UserIcon className="h-6 w-6" />
          <p className="text-[24px] font-extrabold">
            Your Professional Persona
          </p>
        </div>

        <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-6 md:p-10">
          <h3 className="text-[22px] font-bold mb-4">Persona Summary</h3>
          <p className="text-[18px] mb-2">
            <strong>Communication Style:</strong> {persona.communicationStyle}
          </p>
          <p className="text-[18px] mb-2">
            <strong>Tone:</strong> {persona.tone}
          </p>
          <p className="text-[18px] mb-2">
            <strong>Professional Voice:</strong> {persona.professionalVoice}
          </p>
          <p className="text-[18px] mb-2">
            <strong>Writing Style:</strong> {persona.writingStyle}
          </p>
          <p className="text-[18px] mb-2">
            <strong>Personality Traits:</strong>{" "}
            {persona.personalityTraits.join(", ")}
          </p>
        </div>

        {/* Restart Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              setPersona(null);
              setStarted(false);
              setSelections({});
              setStepIndex(0);
            }}
            className="px-6 py-3 text-[18px] font-bold rounded-lg bg-gradient-to-b from-[#748ffc] to-[#1342ff] text-white hover:opacity-90"
          >
            Restart Questionnaire
          </button>
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
            onClick={isLast ? handleFinish : goNext}
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
