// useCareerProfile.js
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as service from "../module-services/careerProfileService";

// =====================
// QUESTIONS CONFIG
// =====================

const QUESTIONS = [
  { field: "name", question: "Hi Dreamer, what’s your full name?" },
  {
    field: "email",
    question: "What email should I use for your career documents?",
  },
  { field: "phone", question: "What’s your phone number?" },
  { field: "country", question: "Which country do you currently live in?" },
  { field: "location", question: "What state or city are you based in?" },
  {
    field: "targetJob",
    question: "What job title or position are you targeting next?",
  },
  {
    field: "careerGoal",
    question:
      "What’s your next career goal? Promotion? Career switch? New field?",
  },
  {
    field: "salary",
    question: "What salary range are you aiming for in your next role?",
  },
  {
    field: "cvUpload",
    question:
      "Would you like to upload your CV so I can personalize your journey?",
  },
  {
    field: "extra",
    question:
      "Is there anything else you want me to know about your career journey?",
  },
];

// =====================
// DEFAULT MESSAGE
// =====================

const WELCOME_MESSAGE = {
  id: 1,
  sender: "ai",
  content:
    "Hi Dreamer 👋 I'm here to help you discover and articulate your career goals and professional profile. Shall we begin?",
  timestamp: new Date().toLocaleTimeString("en-GB"),
};

export const useCareerProfile = () => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [profile, setProfile] = useState({});
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isComplete = currentStep >= QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentStep];

  // =====================
  // INIT
  // =====================

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const convs = await service.getConversations();

        if (convs.length) {
          const latest = convs.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          )[0];

          setConversationId(latest.id);
          setConversations(convs);
        } else {
          const newConv = await service.createConversation({
            title: "Career Profile",
          });

          setConversationId(newConv.id);
          setConversations([newConv]);
        }

        // Start first question
      } catch (err) {
        console.error("Error: ", err);
        toast.error("Failed to initialize profile");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // =====================
  // HELPERS
  // =====================

  const pushAIMessage = (content) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "ai",
        content,
        timestamp: new Date().toLocaleTimeString("en-GB"),
      },
    ]);
  };

  const pushUserMessage = (content) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "user",
        content,
        timestamp: new Date().toLocaleTimeString("en-GB"),
      },
    ]);
  };

  // =====================
  // MAIN FLOW
  // =====================

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const answer = userInput;
    pushUserMessage(answer);
    setUserInput("");

    // 🚀 FIRST MESSAGE → START FLOW
    if (!hasStarted) {
      setHasStarted(true);

      setTimeout(() => {
        pushAIMessage(QUESTIONS[0].question);
      }, 400);

      return;
    }

    if (currentQuestion.field === "cvUpload") {
      const normalized = answer.toLowerCase();

      if (normalized.includes("no")) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        setTimeout(() => {
          pushAIMessage(QUESTIONS[nextStep].question);
        }, 400);

        return;
      }

      // if yes → do nothing, wait for upload UI
      if (normalized.includes("yes")) {
        pushAIMessage("Great — go ahead and upload your CV below 📄");

        // Automatically show progress bar placeholder
        setUploading(true);
        setUploadProgress(0);

        return;
      }
    }

    setProfile((prev) => ({
      ...prev,
      [currentQuestion.field]: answer,
    }));

    try {
      await service.sendMessage(conversationId, answer);
    } catch (err) {
      console.error(err);
    }

    const nextStep = currentStep + 1;

    if (nextStep < QUESTIONS.length) {
      setCurrentStep(nextStep);

      setTimeout(() => {
        pushAIMessage(QUESTIONS[nextStep].question);
      }, 400);
    } else {
      pushAIMessage("Perfect. I’ve gathered everything I need 🎉");

      try {
        const data = await service.getSummary(conversationId);
        setSummary(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // =====================
  // EXTRA ACTIONS
  // =====================

  const handleGetConfirmation = async () => {
    try {
      const data = await service.getConfirmation(conversationId);
      setConfirmation(data);
    } catch (err) {
      console.error("Error: ", err);
      toast.error("Failed to fetch confirmation");
    }
  };

  const handleUploadCV = async (file) => {
    try {
      pushUserMessage(`📎 Uploaded CV: ${file.name}`);

      setUploading(true);
      setUploadProgress(0);

      // Fake progress
      let percent = 0;
      const interval = setInterval(() => {
        percent = Math.min(percent + Math.random() * 15, 90);
        setUploadProgress(Math.floor(percent));
      }, 200);

      await service.uploadCV(conversationId, file); // your existing fetch

      clearInterval(interval);
      setUploadProgress(100);

      // Small delay so user sees 100%
      setTimeout(() => {
        setUploading(false);

        pushAIMessage(
          "Nice, I’ve reviewed your CV and will tailor everything accordingly ✨",
        );

        // Auto move to next question
        const nextStep = currentStep + 1;
        if (nextStep < QUESTIONS.length) {
          setCurrentStep(nextStep);
          setTimeout(() => pushAIMessage(QUESTIONS[nextStep].question), 500);
        }
      }, 500);
    } catch {
      setUploading(false);
      toast.error("CV upload failed");
    }
  };

  const handleVoiceMessage = async (blob) => {
    try {
      const res = await service.sendVoiceMessage(conversationId, blob);

      // assume backend returns transcription
      if (res?.transcription) {
        pushUserMessage(res.transcription);

        // 👇 reuse same flow
        setUserInput(res.transcription);

        setTimeout(() => {
          handleSendMessage();
        }, 200);
      }
    } catch {
      toast.error("Voice message failed");
    }
  };

  // =====================
  // INPUT
  // =====================

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    messages,
    conversations,
    conversationId,
    userInput,
    loading,
    profile,
    isComplete,
    currentQuestion,
    summary,
    confirmation,
    uploading,
    uploadProgress,

    setUserInput,

    handleSendMessage,
    handleChange,
    handleKeyPress,

    handleGetConfirmation,
    handleUploadCV,
    handleVoiceMessage,
  };
};
