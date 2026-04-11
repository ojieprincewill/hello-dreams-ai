import { useMutation, useQuery } from "@tanstack/react-query";
import {
  listCareerProfileConversations,
  createCareerProfileConversation,
  getCareerProfileConversation,
  sendCareerProfileMessage,
} from "../../api/careerProfileService";

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
  return useMutation({
    mutationFn: ({ conversationId, content }) =>
      sendCareerProfileMessage(conversationId, content),
  });
};

