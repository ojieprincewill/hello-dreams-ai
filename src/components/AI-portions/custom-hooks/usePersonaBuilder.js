import { useState, useEffect, useMemo, useContext } from "react";
import toast from "react-hot-toast";
import { isNetworkError } from "../../../utils/networkError";
import { isCreditLimitError } from "../../../utils/creditErrors";
import { PaywallContext } from "../../../context/paywallContext";
import * as service from "../module-services/personaBuilderService";

const STORAGE_KEY = "personaSelections";
const STARTED_KEY = "personaStarted";

// ✅ QUESTIONS MOVED HERE
const QUESTIONS = [
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
    question: "When facing challenges, you usually...",
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
      "Work behind the scenes",
      "Share credit with the team",
      "Present to stakeholders",
      "Lead high-profile initiatives",
    ],
  },
  {
    id: "question-5",
    title: "Question 5 of 6",
    question: "Your primary career aspiration is...",
    options: [
      "Become an expert",
      "Lead teams",
      "Create innovative solutions",
      "Shape strategic decisions",
    ],
  },
  {
    id: "question-6",
    title: "Question 6 of 6",
    question: "The area you most want to develop is...",
    options: [
      "Confidence",
      "Relationships",
      "Strategic thinking",
      "Executive presence",
    ],
  },
];

export const usePersonaBuilder = () => {
  const paywallCtx = useContext(PaywallContext);
  const showPaywall = paywallCtx?.showPaywall;

  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultStep, setResultStep] = useState("current");

  const current = useMemo(() => QUESTIONS[stepIndex], [stepIndex]);
  const isLast = stepIndex === QUESTIONS.length - 1;

  // =====================
  // STORAGE
  // =====================

  useEffect(() => {
    try {
      const startedRaw = localStorage.getItem(STARTED_KEY);
      if (startedRaw) setStarted(startedRaw === "true");

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSelections(parsed.selections || {});
        setStepIndex(parsed.stepIndex || 0);
      }
    } catch {
      setStarted(false);
      setSelections({});
      setStepIndex(0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selections, stepIndex }),
    );
  }, [selections, stepIndex]);

  useEffect(() => {
    localStorage.setItem(STARTED_KEY, String(started));
  }, [started]);

  // =====================
  // ACTIONS
  // =====================

  const selectOption = (option) => {
    setSelections((prev) => ({
      ...prev,
      [current.id]: option,
    }));
  };

  const goNext = () => {
    if (!isLast) setStepIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const handleStart = () => {
    setStarted(true);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);

      const formattedAnswers = QUESTIONS.map((q, index) => ({
        questionId: String(index + 1),
        question: q.question,
        answer: selections[q.id],
      })).filter((a) => a.answer);

      await service.submitAnswers(formattedAnswers);
      await service.generatePersona();

      const data = await service.getPersona();
      setPersona(data.persona);
      setResultStep("current");
    } catch (err) {
      if (isCreditLimitError(err)) { showPaywall?.(err.apiError); return; }
      console.error(err);
      if (!isNetworkError(err)) toast.error("Failed to generate persona");
    } finally {
      setLoading(false);
    }
  };

  const goToIdeal = () => setResultStep("ideal");
  const goToPlan = () => setResultStep("plan");

  const handleApplyPersona = async () => {
    try {
      await service.applyPersona();
      toast.success("Persona applied successfully ✨");
    } catch {
      if (!isNetworkError(err)) toast.error("Failed to apply persona");
    }
  };

  const handleRestart = async () => {
    try {
      await service.restartPersona();

      setPersona(null);
      setSelections({});
      setStepIndex(0);
      setStarted(false);
      setResultStep("current");
    } catch {
      if (!isNetworkError(err)) toast.error("Failed to restart");
    }
  };

  return {
    QUESTIONS,
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

    setStarted,
    selectOption,
    goNext,
    goPrev,
    handleStart,
    handleApplyPersona,
    handleFinish,
    handleRestart,
  };
};
