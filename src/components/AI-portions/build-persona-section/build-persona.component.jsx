import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import SelectableCard from "../reusable-components/selectable-card.component";
import { UserIcon } from "@heroicons/react/24/outline";
import { ArrowRight } from "lucide-react";
import GradientIcon from "../reusable-components/gradient-icon.component";
import CurrentPersona from "./current-persona.component";
import IdealPersona from "./ideal-persona.component";
import TransformationPlan from "./transformation-plan.component";
import {
  useGeneratePersona,
  usePersona,
  useSubmitPersonaAnswers,
} from "../../../hooks/ai/usePersonaBuilder";

const STEPS = [
  {
    id: "question-1",
    title: "Question 1 of 6",
    question: "When presenting ideas in meetings, you typically...",
    options: [
      { optionId: "q1-a", label: "Wait to be asked your opinion" },
      { optionId: "q1-b", label: "Build on others ideas supportively" },
      { optionId: "q1-c", label: "Present your ideas clearly and concisely" },
      {
        optionId: "q1-d",
        label: "Challenge assumptions and build for better solutions",
      },
    ],
  },
  {
    id: "question-2",
    title: "Question 2 of 6",
    question: "Your colleagues would describe your work approach as...",
    options: [
      { optionId: "q2-a", label: "Steady, reliable and detail-oriented" },
      { optionId: "q2-b", label: "Creative, innovative and flexible" },
      { optionId: "q2-c", label: "Results-driven and goal-focused" },
      {
        optionId: "q2-d",
        label: "People-focused and relationship-building",
      },
    ],
  },
  {
    id: "question-3",
    title: "Question 3 of 6",
    question: "Your colleagues would describe your work approach as...",
    options: [
      { optionId: "q3-a", label: "Focus on executing tasks efficiently" },
      { optionId: "q3-b", label: "Bring people together to find solutions" },
      {
        optionId: "q3-c",
        label: "Step back and develop a strategic approach",
      },
      {
        optionId: "q3-d",
        label: "Look for creative, unconventional solutions",
      },
    ],
  },
  {
    id: "question-4",
    title: "Question 4 of 6",
    question: "At work, you prefer to...",
    options: [
      {
        optionId: "q4-a",
        label: "Work behind the scenes and let results speak",
      },
      {
        optionId: "q4-b",
        label: "Share credit with the team and celebrate together",
      },
      {
        optionId: "q4-c",
        label: "Present your work to stakeholders when appropriate",
      },
      {
        optionId: "q4-d",
        label: "Take the spotlight and lead high-profile initiatives",
      },
    ],
  },
  {
    id: "question-5",
    title: "Question 5 of 6",
    question: "Your primary career aspiration is...",
    options: [
      {
        optionId: "q5-a",
        label: "Become a recognized expert in your field",
      },
      {
        optionId: "q5-b",
        label: "Lead teams and drive organizational change",
      },
      {
        optionId: "q5-c",
        label: "Create innovative solutions and lead projects",
      },
      {
        optionId: "q5-d",
        label: "Build influence and shape strategic decisions",
      },
    ],
  },
  {
    id: "question-6",
    title: "Question 6 of 6",
    question: "The area you most want to develop is...",
    options: [
      {
        optionId: "q6-a",
        label: "Speaking up with more confidence and authority",
      },
      {
        optionId: "q6-b",
        label: "Building stronger professional relationships",
      },
      {
        optionId: "q6-c",
        label: "Thinking and communicating more strategically",
      },
      {
        optionId: "q6-d",
        label: "Commanding more respect and executive presence",
      },
    ],
  },
];

/** Map legacy localStorage values (plain label strings) to { optionId, label }. */
const normalizeStepSelection = (step, raw) => {
  if (raw == null) return null;
  if (typeof raw === "object" && raw.optionId && raw.label) return raw;
  if (typeof raw === "string") {
    const match = step.options.find((o) => o.label === raw);
    return match ? { optionId: match.optionId, label: match.label } : null;
  }
  return null;
};

const STORAGE_KEY = "personaSelections";
const STARTED_KEY = "personaStarted";
const PERSONA_FETCH_ATTEMPTS = 4;
const PERSONA_FETCH_RETRY_DELAY_MS = 700;

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const BuildPersona = () => {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(false);

  const personaQuery = usePersona(false);
  const submitAnswersMutation = useSubmitPersonaAnswers();
  const generatePersonaMutation = useGeneratePersona();

  const handleStart = () => setStarted(true);

  const handleFinish = async () => {
    try {
      setLoading(true);

      // Backend expects optionId (non-empty string) per answer; keep text fields for context.
      const formattedAnswers = STEPS.map((step) => {
        const sel = selections[step.id];
        if (!sel?.optionId) return null;
        return {
          questionId: step.id,
          optionId: sel.optionId,
          question: step.question,
          answer: sel.label,
        };
      }).filter(Boolean);

      // Step 1: Submit answers
      await submitAnswersMutation.mutateAsync({ answers: formattedAnswers });

      // Step 2: Trigger persona generation
      const generatedPersona = await generatePersonaMutation.mutateAsync();
      if (generatedPersona) {
        setPersona(generatedPersona);
        return;
      }

      // Step 3: Fetch persona with bounded retries (generation can be eventually consistent).
      let resolvedPersona = null;
      for (let attempt = 0; attempt < PERSONA_FETCH_ATTEMPTS; attempt += 1) {
        const personaResult = await personaQuery.refetch();
        if (personaResult.data) {
          resolvedPersona = personaResult.data;
          break;
        }
        if (attempt < PERSONA_FETCH_ATTEMPTS - 1) {
          await wait(PERSONA_FETCH_RETRY_DELAY_MS);
        }
      }

      if (resolvedPersona) {
        setPersona(resolvedPersona);
      } else {
        console.error("Failed to fetch a complete persona after retries.");
        toast.error(
          "We couldn't generate your persona yet. Please try again in a moment.",
        );
      }
    } catch (err) {
      if (err?.apiError != null) {
        console.error("Persona API error body:", err.apiError);
      }
      console.error("Error generating persona:", err);
      toast.error(
        typeof err?.message === "string" && err.message
          ? err.message
          : "Error generating persona.",
      );
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
        const rawSelections = parsed.selections || {};
        const migrated = {};
        for (const step of STEPS) {
          migrated[step.id] = normalizeStepSelection(step, rawSelections[step.id]);
        }
        setSelections(migrated);
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
      JSON.stringify({ selections, stepIndex }),
    );
  }, [selections, stepIndex]);

  useEffect(() => {
    localStorage.setItem(STARTED_KEY, String(started));
  }, [started]);

  const current = useMemo(() => STEPS[stepIndex], [stepIndex]);
  const isLast = stepIndex === STEPS.length - 1;

  const selectOption = (option) => {
    setSelections((prev) => ({
      ...prev,
      [current.id]: { optionId: option.optionId, label: option.label },
    }));
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
    return (
      <div className="min-h-screen px-[5%] py-10">
        <div className="flex items-center gap-3 mb-8 p-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
          <UserIcon className="h-6 w-6" />
          <p className="text-[24px] font-extrabold">
            Your Professional Persona
          </p>
        </div>

        <div className="bg-[#f6f6f6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-6 md:p-10">
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
            {Array.isArray(persona.personalityTraits)
              ? persona.personalityTraits.join(", ")
              : (persona.personalityTraits ?? "—")}
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
              key={opt.optionId}
              isSelected={selections[current.id]?.optionId === opt.optionId}
              onClick={() => selectOption(opt)}
            >
              <div className="flex items-center space-x-3">
                <GradientIcon />
                <div className="flex-1">
                  <p className="text-[20px] font-medium mt-1">{opt.label}</p>
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
            disabled={!selections[current.id]?.optionId}
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
