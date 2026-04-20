import { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  listCareerProfileConversations,
  createCareerProfileConversation,
  getCareerProfileConversation,
  sendCareerProfileMessage,
} from "../../api/careerProfileService";
import { PaywallContext } from "../../context/paywallContext";
import { isCreditLimitError } from "../../utils/creditErrors";

export const useCareerProfileConversations = () => {
  return useQuery({
    queryKey: ["careerProfile", "conversations"],
    queryFn: listCareerProfileConversations,
  });
};

export const useCareerProfileConversation = (conversationId) => {
  return useQuery({
    queryKey: ["careerProfile", "conversation", conversationId],
    queryFn: () => getCareerProfileConversation(conversationId),
    enabled: Boolean(conversationId),
  });
};

export const useCreateCareerProfileConversation = () => {
  return useMutation({
    mutationFn: ({ title }) => createCareerProfileConversation(title),
  });
};

export const useSendCareerProfileMessage = () => {
  const paywallCtx = useContext(PaywallContext);
  const showPaywall = paywallCtx?.showPaywall;
  return useMutation({
    mutationFn: ({ conversationId, content }) =>
      sendCareerProfileMessage(conversationId, content),
    onError: (err) => {
      if (isCreditLimitError(err)) showPaywall?.(err.apiError);
    },
  });
};

