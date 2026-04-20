import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listResumeConversations,
  createResumeConversation,
  getResumeConversation,
  updateResumeConversation,
  deleteResumeConversation,
  sendResumeMessage,
  generateResume,
  getGeneratedResume,
  updateResume,
  patchResume,
  deleteResume,
} from "../../api/resumeBuilderService";
import { PaywallContext } from "../../context/paywallContext";
import { isCreditLimitError } from "../../utils/creditErrors";

export const useResumeConversations = () => {
  return useQuery({
    queryKey: ["resumeBuilder", "conversations"],
    queryFn: listResumeConversations,
  });
};

export const useResumeConversation = (conversationId) => {
  return useQuery({
    queryKey: ["resumeBuilder", "conversation", conversationId],
    queryFn: () => getResumeConversation(conversationId),
    enabled: Boolean(conversationId),
  });
};

export const useCreateResumeConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload }) => createResumeConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumeBuilder", "conversations"] });
    },
  });
};

export const useSendResumeMessage = () => {
  const paywallCtx = useContext(PaywallContext);
  const showPaywall = paywallCtx?.showPaywall;
  return useMutation({
    mutationFn: ({ conversationId, content }) =>
      sendResumeMessage(conversationId, content),
    onError: (err) => {
      if (isCreditLimitError(err)) showPaywall?.(err.apiError);
    },
  });
};

export const useUpdateResumeConversation = () => {
  return useMutation({
    mutationFn: ({ conversationId, updates }) =>
      updateResumeConversation(conversationId, updates),
  });
};

export const useDeleteResumeConversation = () => {
  return useMutation({
    mutationFn: ({ conversationId }) =>
      deleteResumeConversation(conversationId),
  });
};

export const useGenerateResume = () => {
  const paywallCtx = useContext(PaywallContext);
  const showPaywall = paywallCtx?.showPaywall;
  return useMutation({
    mutationFn: ({ conversationId }) => generateResume(conversationId),
    onError: (err) => {
      if (isCreditLimitError(err)) showPaywall?.(err.apiError);
    },
  });
};

export const useFetchGeneratedResume = () => {
  return useMutation({
    mutationFn: ({ conversationId }) => getGeneratedResume(conversationId),
  });
};

export const useUpdateResume = () => {
  return useMutation({
    mutationFn: ({ conversationId, updatedResume }) =>
      updateResume(conversationId, updatedResume),
  });
};

export const usePatchResume = () => {
  return useMutation({
    mutationFn: ({ conversationId, partialUpdates }) =>
      patchResume(conversationId, partialUpdates),
  });
};

export const useDeleteResume = () => {
  return useMutation({
    mutationFn: ({ conversationId }) => deleteResume(conversationId),
  });
};

