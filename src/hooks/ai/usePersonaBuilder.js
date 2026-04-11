import { useMutation, useQuery } from "@tanstack/react-query";
import {
  submitPersonaAnswers,
  generatePersona,
  fetchPersona,
} from "../../api/personaBuilderService";

export const usePersona = (enabled = false) => {
  return useQuery({
    queryKey: ["personaBuilder", "persona"],
    queryFn: fetchPersona,
    enabled,
  });
};

export const useSubmitPersonaAnswers = () => {
  return useMutation({
    mutationFn: ({ answers }) => submitPersonaAnswers(answers),
  });
};

export const useGeneratePersona = () => {
  return useMutation({
    mutationFn: () => generatePersona(),
  });
};

