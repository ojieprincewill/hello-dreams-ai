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
  return useMutation({
    mutationFn: ({ conversationId, content }) =>
      sendResumeMessage(conversationId, content),
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
  return useMutation({
    mutationFn: ({ conversationId }) => generateResume(conversationId),
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

