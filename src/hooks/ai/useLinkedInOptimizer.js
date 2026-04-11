import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as linkedInService from "../../api/linkedInService";

export const useLinkedInProfile = () => {
  return useQuery({
    queryKey: ["linkedInProfile"],
    queryFn: linkedInService.getLinkedInProfile,
  });
};

export const useGenerateLinkedInProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linkedInService.generateLinkedInProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["linkedInProfile"], data);
      toast.success("LinkedIn profile generated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate LinkedIn profile");
    },
  });
};

export const usePatchLinkedInProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linkedInService.patchLinkedInProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["linkedInProfile"], data);
      toast.success("Profile updated");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile");
    },
  });
};

export const useUpdateLinkedInSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ section, data }) =>
      linkedInService.updateLinkedInSection(section, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["linkedInProfile"], data);
      toast.success("Section updated");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update section");
    },
  });
};

export const useDeleteLinkedInProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linkedInService.deleteLinkedInProfile,
    onSuccess: () => {
      queryClient.setQueryData(["linkedInProfile"], null);
      toast.success("LinkedIn profile deleted");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete profile");
    },
  });
};
