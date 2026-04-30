import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaywallContext } from "../../../context/paywallContext";
import { isCreditLimitError } from "../../../utils/creditErrors";
import * as service from "../module-services/careerProfileService";

export const useCareerConversations = () =>
  useQuery({
    queryKey: ["careerProfile", "conversations"],
    queryFn: service.getConversations,
  });

export const useCareerConversation = (conversationId) =>
  useQuery({
    queryKey: ["careerProfile", "conversation", conversationId],
    queryFn: () => service.getConversation(conversationId),
    enabled: Boolean(conversationId),
  });

export const useCreateCareerConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => service.createConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careerProfile", "conversations"] });
    },
  });
};

export const useSendCareerMessage = () => {
  const paywallCtx = useContext(PaywallContext);
  const showPaywall = paywallCtx?.showPaywall;
  return useMutation({
    mutationFn: ({ conversationId, content }) => service.sendMessage(conversationId, content),
    onError: (err) => {
      if (isCreditLimitError(err)) showPaywall?.(err.apiError);
    },
  });
};

export const useGenerateCareerSummary = () =>
  useMutation({
    mutationFn: (conversationId) => service.getSummary(conversationId),
  });

export const useCompleteCareerConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId) => service.completeConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careerProfile"] });
    },
  });
};

export const useDeleteCareerConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId) => service.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careerProfile", "conversations"] });
    },
  });
};
