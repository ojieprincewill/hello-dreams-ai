import { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  submitPersonaAnswers,
  generatePersona,
  fetchPersona,
} from "../../api/personaBuilderService";
import { PaywallContext } from "../../context/paywallContext";
import { isCreditLimitError } from "../../utils/creditErrors";

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
  const paywallCtx = useContext(PaywallContext);
  const showPaywall = paywallCtx?.showPaywall;
  return useMutation({
    mutationFn: () => generatePersona(),
    onError: (err) => {
      if (isCreditLimitError(err)) showPaywall?.(err.apiError);
    },
  });
};

