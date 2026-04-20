// useCareerProfile.js
import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { isNetworkError } from "../../../utils/networkError";
import { isCreditLimitError } from "../../../utils/creditErrors";
import { PaywallContext } from "../../../context/paywallContext";
import * as service from "../module-services/careerProfileService";

// =====================
// QUESTIONS CONFIG
// Used as fallback text if the backend AI doesn't return a response
// =====================

const QUESTIONS = [
  { field: "name", question: "Hi Dreamer, what's your full name?" },
  {
    field: "email",
    question: "What email should I use for your career documents?",
  },
  { field: "phone", question: "What's your phone number?" },
  { field: "country", question: "Which country do you currently live in?" },
  { field: "location", question: "What state or city are you based in?" },
  {
    field: "targetJob",
    question: "What job title or position are you targeting next?",
  },
  {
    field: "careerGoal",
    question:
      "What's your next career goal? Promotion? Career switch? New field?",
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

// =====================
// HELPERS
// =====================

const extractAiContent = (res) => {
  if (!res) return null;
  if (typeof res.content === "string" && res.content) return res.content;
  if (Array.isArray(res.messages)) {
    const aiMsg = res.messages.find((m) => m.role !== "user");
    return aiMsg?.content || res.messages[res.messages.length - 1]?.content || null;
  }
  return null;
};

export const useCareerProfile = () => {
  const paywallCtx = useContext(PaywallContext);
  const showPaywall = paywallCtx?.showPaywall;

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [profile, setProfile] = useState({});
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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
      } catch (err) {
        console.error("Error: ", err);
        if (!isNetworkError(err)) toast.error("Failed to initialize profile");
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

  const sendAndDisplay = async (answer, fallback) => {
    if (!conversationId) {
      pushAIMessage(fallback);
      return;
    }
    setIsTyping(true);
    try {
      const res = await service.sendMessage(conversationId, answer);
      const aiContent = extractAiContent(res) || fallback;
      pushAIMessage(aiContent);
    } catch (err) {
      if (isCreditLimitError(err)) {
        showPaywall?.(err.apiError);
        return;
      }
      console.error(err);
      pushAIMessage(fallback);
    } finally {
      setIsTyping(false);
    }
  };

  // =====================
  // MAIN FLOW
  // =====================

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    if (!conversationId) {
      toast.error("Please wait for the conversation to initialize.");
      return;
    }

    const answer = userInput;
    pushUserMessage(answer);
    setUserInput("");

    // 🚀 FIRST MESSAGE → START FLOW
    if (!hasStarted) {
      setHasStarted(true);
      setTimeout(() => sendAndDisplay(answer, QUESTIONS[0].question), 400);
      return;
    }

    if (currentQuestion.field === "cvUpload") {
      const normalized = answer.toLowerCase();

      if (normalized.includes("no")) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setTimeout(
          () => sendAndDisplay(answer, QUESTIONS[nextStep]?.question || ""),
          400,
        );
        return;
      }

      if (normalized.includes("yes")) {
        setUploading(true);
        setUploadProgress(0);
        setTimeout(
          () =>
            sendAndDisplay(
              answer,
              "Great — go ahead and upload your CV below 📄",
            ),
          400,
        );
        return;
      }
    }

    setProfile((prev) => ({
      ...prev,
      [currentQuestion.field]: answer,
    }));

    const nextStep = currentStep + 1;

    if (nextStep < QUESTIONS.length) {
      setCurrentStep(nextStep);
      setTimeout(
        () => sendAndDisplay(answer, QUESTIONS[nextStep].question),
        400,
      );
    } else {
      // Last step — get AI response then fetch summary
      setIsTyping(true);
      try {
        const res = conversationId
          ? await service.sendMessage(conversationId, answer)
          : null;
        const aiContent =
          extractAiContent(res) || "Perfect. I've gathered everything I need 🎉";
        pushAIMessage(aiContent);
      } catch (err) {
        console.error(err);
        pushAIMessage("Perfect. I've gathered everything I need 🎉");
      } finally {
        setIsTyping(false);
      }

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

  const handleLoadMessages = async (id) => {
    try {
      setLoading(true);
      const data = await service.getConversation(id);
      setConversationId(id);
      if (data.messages?.length) {
        setMessages(
          data.messages.map((m, i) => ({
            id: i + 1,
            sender: m.role === "user" ? "user" : "ai",
            content: m.content,
            timestamp: new Date(m.createdAt).toLocaleTimeString("en-GB"),
          })),
        );
      }
    } catch (err) {
      console.error(err);
      if (!isNetworkError(err)) toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      const data = await service.getSummary(conversationId);
      setSummary(data);
    } catch (err) {
      console.error(err);
      if (!isNetworkError(err)) toast.error("Failed to generate profile");
    } finally {
      setLoading(false);
    }
  };

  const handleGetConfirmation = async () => {
    try {
      const data = await service.getConfirmation(conversationId);
      setConfirmation(data);
    } catch (err) {
      console.error("Error: ", err);
      if (!isNetworkError(err)) toast.error("Failed to fetch confirmation");
    }
  };

  const handleUploadCV = async (file) => {
    try {
      pushUserMessage(`📎 Uploaded CV: ${file.name}`);

      setUploading(true);
      setUploadProgress(0);

      let percent = 0;
      const interval = setInterval(() => {
        percent = Math.min(percent + Math.random() * 15, 90);
        setUploadProgress(Math.floor(percent));
      }, 200);

      await service.uploadCV(conversationId, file);

      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);

        pushAIMessage(
          "Nice, I've reviewed your CV and will tailor everything accordingly ✨",
        );

        const nextStep = currentStep + 1;
        if (nextStep < QUESTIONS.length) {
          setCurrentStep(nextStep);
          setTimeout(() => sendAndDisplay("", QUESTIONS[nextStep].question), 500);
        }
      }, 500);
    } catch (err) {
      setUploading(false);
      if (!isNetworkError(err)) toast.error("CV upload failed");
    }
  };

  const handleVoiceMessage = async (blob) => {
    try {
      const res = await service.sendVoiceMessage(conversationId, blob);

      if (res?.transcription) {
        pushUserMessage(res.transcription);
        setUserInput(res.transcription);

        setTimeout(() => {
          handleSendMessage();
        }, 200);
      }
    } catch (err) {
      if (!isNetworkError(err)) toast.error("Voice message failed");
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
    isTyping,
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

    handleLoadMessages,
    handleGenerateSummary,
    handleGetConfirmation,
    handleUploadCV,
    handleVoiceMessage,
  };
};
