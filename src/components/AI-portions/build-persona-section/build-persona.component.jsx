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
import {
  getPersonaQuestions,
  applyPersona,
  restartPersona,
} from "../../../api/personaBuilderService";

const PersonaSuccessScreen = ({ onRestart }) => (
  <div className="min-h-[100svh] px-4 sm:px-[5%] py-8 md:py-10 flex justify-center items-center">
    <div className="bg-[#efefef] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-6 sm:p-10 max-w-lg w-full text-center space-y-5">
      <div className="w-16 h-16 bg-gradient-to-b from-[#1342ff] to-[#ff00e6] rounded-full flex items-center justify-center mx-auto">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-[22px] md:text-[28px] font-extrabold">Persona Applied!</h2>
      <p className="text-[15px] md:text-[18px] text-[#667085] dark:text-gray-400">
        Your professional persona has been saved to your profile.
        It will power your CV, cover letters, and LinkedIn optimisation.
      </p>
      <button
        onClick={onRestart}
        className="w-full px-6 py-3 text-base font-bold text-white bg-gradient-to-b from-[#748ffc] to-[#1342ff] rounded-xl tracking-tight cursor-pointer"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Redo my persona journey
      </button>
    </div>
  </div>
);

const mapApiQuestionsToSteps = (questions) =>
  (questions || []).map((q, index) => ({
    id: q.id,
    title: `Question ${index + 1} of ${questions.length}`,
    question: q.question,
    options: (q.options || []).map((opt) => ({
      optionId: opt.id,
      label: opt.text,
    })),
  }));

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
  const [personaStep, setPersonaStep] = useState("current");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [applied, setApplied] = useState(false);

  const personaQuery = usePersona(false);
  const submitAnswersMutation = useSubmitPersonaAnswers();
  const generatePersonaMutation = useGeneratePersona();

  const handleStart = () => setStarted(true);

  const handleFinish = async () => {
    try {
      setLoading(true);

      // Backend expects optionId (non-empty string) per answer; keep text fields for context.
      const formattedAnswers = steps.map((step) => {
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

  useEffect(() => {
    getPersonaQuestions()
      .then((questions) => setSteps(mapApiQuestionsToSteps(questions)))
      .catch(() => toast.error("Failed to load persona questions"))
      .finally(() => setLoadingQuestions(false));
  }, []);

  // load persisted
  useEffect(() => {
    if (!steps.length) return;
    try {
      const startedRaw = localStorage.getItem(STARTED_KEY);
      if (startedRaw) setStarted(startedRaw === "true");
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const rawSelections = parsed.selections || {};
        const migrated = {};
        for (const step of steps) {
          migrated[step.id] = normalizeStepSelection(
            step,
            rawSelections[step.id],
          );
        }
        setSelections(migrated);
        if (parsed.stepIndex != null) setStepIndex(parsed.stepIndex);
      }
    } catch (error) {
      console.error("Failed to load persona state from storage:", error);
      setStarted(false);
      setSelections({});
      setStepIndex(0);
    }
  }, [steps]);

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

  const current = useMemo(() => steps[stepIndex], [steps, stepIndex]);
  const isLast = steps.length > 0 && stepIndex === steps.length - 1;

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

  const handleApplyPersona = async () => {
    try {
      await applyPersona();
      toast.success("Persona applied to your profile");
      setApplied(true);
    } catch (err) {
      toast.error(err?.message || "Failed to apply persona");
    }
  };

  const handleRestart = async () => {
    try {
      await restartPersona();
      setPersona(null);
      setSelections({});
      setStepIndex(0);
      setStarted(false);
      setPersonaStep("current");
      setApplied(false);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STARTED_KEY);
    } catch (err) {
      toast.error(err?.message || "Failed to restart");
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen px-4 sm:px-[5%] py-6 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 pb-4 sm:pb-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
          <div className="flex items-center space-x-3">
            <UserIcon className="h-5 w-5 md:h-6 md:w-6" />
            <div>
              <h2 className="text-[20px] md:text-[24px] font-extrabold leading-tight">
                Build your persona & workplace identity
              </h2>
              <p className="text-sm md:text-[18px] text-[#667085] dark:text-gray-400">
                Transform your photo into a professional headshot with AI
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#efefef] dark:bg-[#2d2d2d] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-4 sm:p-6 md:p-10 ">
          <p className="text-[20px] md:text-[24px] font-bold leading-tight ">
            Your Professional Headshot is Ready
          </p>
          <p className="text-[16px] md:text-[20px] font-medium">
            Discover the professional version of yourself that will accelerate
            your career
          </p>

          <div className="md:pl-5 my-5">
            <p className="text-[20px] md:text-[32px] font-extrabold mb-4 leading-tight">
              Here's your transformation journey:
            </p>
            <ul className="list-disc pl-5 space-y-3 md:space-y-6 text-[14px] md:text-[20px] marker:text-sm">
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
              className="w-full sm:w-auto sm:min-w-[320px]
px-6 py-3 sm:py-4
 text-center border border-[#eaecf0] bg-gradient-to-b from-[#748ffc] to-[#1342ff]
         text-[#fff] text-[16px] md:text-[20px] lg:text-[24px] font-bold rounded-xl tracking-tighter dark:shadow-[0_30px_80px_-10px_rgba(255,215,0,0.5),_0_-30px_80px_-10px_rgba(255,215,0,0.5)] mt-6 mb-10 cursor-pointer"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Start your persona journey
              <span>
                <ArrowRight
                  size={20}
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
      <div className="min-h-[100svh] px-4 sm:px-[5%] py-8 md:py-10 flex justify-center items-center">
        <div className="bg-[#efefef] border border-[#eaecf0] dark:bg-[#181818] dark:border-[#2d2d2d] rounded-xl p-5 sm:p-6 md:p-10 flex flex-col items-center text-center space-y-3 max-w-md w-full">
          <GradientIcon />
          <p className="text-[16px] md:text-[18px] lg:text-[24px] font-bold">
            Analysing your persona...
          </p>
          <p className="text-[14px] md:text-[16px] lg:text-[24px]">
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
    if (applied) {
      return <PersonaSuccessScreen onRestart={handleRestart} />;
    }

    return (
      <div className="min-h-[100svh] px-4 sm:px-[5%] py-6 md:py-10 flex flex-col items-center justify-center">
        {personaStep === "current" && (
          <div className="w-full max-w-4xl">
            <CurrentPersona
              persona={persona}
              onNext={() => setPersonaStep("ideal")}
            />
          </div>
        )}

        {personaStep === "ideal" && (
          <div className="w-full max-w-4xl">
            <IdealPersona
              persona={persona}
              onNext={() => setPersonaStep("transformation")}
            />
          </div>
        )}

        {personaStep === "transformation" && (
          <div className="w-full max-w-4xl">
            <TransformationPlan
              persona={persona}
              onRestart={handleRestart}
              onApply={handleApplyPersona}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-[5%] py-6 md:py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8 pb-4 md:pb-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <UserIcon className="h-5 w-5 md:h-6 md:w-6" />
        <p className="text-[20px] md:text-[24px] font-extrabold">
          {current.title}
        </p>
      </div>

      {/* Card Group */}
      <div className="bg-[#f6f6f6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-4 md:p-6 lg:p-10">
        <p className="text-[16px] md:text-[20px] md:text-[24px] font-bold mb-5 leading-tight">
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
                  <p className="text-[16px] sm:text-[18px] md:text-[20px] font-medium">
                    {opt.label}
                  </p>
                </div>
              </div>
            </SelectableCard>
          ))}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between sm:items-center mt-6">
          <button
            onClick={goPrev}
            disabled={stepIndex === 0}
            className="w-full sm:w-auto
px-5 py-2.5
text-[15px] md:text-[16px]
font-medium
rounded-md border border-[#ccc] dark:border-[#2d2d2d] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={isLast ? handleFinish : goNext}
            disabled={!selections[current.id]?.optionId}
            className="w-full sm:w-auto
px-5 py-2.5
text-[15px] md:text-[16px]
font-medium
rounded-md text-[#fff] bg-gradient-to-b from-[#748ffc] to-[#1342ff] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed "
          >
            {isLast ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildPersona;
