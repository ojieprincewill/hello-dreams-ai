import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { isNetworkError } from "../../../utils/networkError";
import { isCreditLimitError } from "../../../utils/creditErrors";
import { PaywallContext } from "../../../context/paywallContext";
import * as service from "../module-services/linkedinOptimizerService";

export const useLinkedInOptimizer = () => {
  const paywallCtx = useContext(PaywallContext);
  const showPaywall = paywallCtx?.showPaywall;

  const [profile, setProfile] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [hasGenerated, setHasGenerated] = useState(false);

  // ======================
  // GENERATE FROM RESUME
  // ======================
  const generateProfile = async () => {
    try {
      setIsGenerating(true);

      const res = await service.generateProfile();

      setProfile(res);
      setHasGenerated(true);

      toast.success("LinkedIn profile generated");
    } catch (err) {
      if (isCreditLimitError(err)) { showPaywall?.(err.apiError); return; }
      console.error(err);
      if (!isNetworkError(err)) toast.error("Failed to generate profile");
    } finally {
      setIsGenerating(false);
    }
  };

  // ======================
  // FETCH EXISTING PROFILE
  // ======================
  const fetchProfile = async () => {
    try {
      setIsFetching(true);

      const res = await service.getProfile();

      if (res) {
        setProfile(res);
        setHasGenerated(true);
      }
    } catch (err) {
      console.error(err);
      if (!isNetworkError(err)) toast.error("Failed to load profile");
    } finally {
      setIsFetching(false);
    }
  };

  // ======================
  // REPLACE PROFILE
  // ======================
  const replaceProfile = async (payload) => {
    try {
      setIsUpdating(true);

      const res = await service.replaceProfile(payload);

      setProfile(res);
      toast.success("Profile replaced");
    } catch (err) {
      console.error(err);
      if (!isNetworkError(err)) toast.error("Failed to replace profile");
    } finally {
      setIsUpdating(false);
    }
  };

  // ======================
  // PARTIAL UPDATE
  // ======================
  const updateProfile = async (payload) => {
    try {
      setIsUpdating(true);

      const res = await service.updateProfile(payload);

      setProfile(res);
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      if (!isNetworkError(err)) toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  // ======================
  // SECTION UPDATE
  // ======================
  const updateSection = async (section, payload) => {
    try {
      setIsUpdating(true);

      const res = await service.updateSection(section, payload);

      setProfile(res);
      toast.success(`${section} updated`);
    } catch (err) {
      console.error(err);
      if (!isNetworkError(err)) toast.error(`Failed to update ${section}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // ======================
  // DELETE PROFILE
  // ======================
  const deleteProfile = async () => {
    try {
      setIsUpdating(true);

      await service.deleteProfile();

      setProfile(null);
      setHasGenerated(false);

      toast.success("Profile deleted");
    } catch (err) {
      console.error(err);
      if (!isNetworkError(err)) toast.error("Failed to delete profile");
    } finally {
      setIsUpdating(false);
    }
  };

  // ======================
  // INIT LOAD
  // ======================
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,

    isGenerating,
    isFetching,
    isUpdating,

    hasGenerated,

    generateProfile,
    fetchProfile,
    replaceProfile,
    updateProfile,
    updateSection,
    deleteProfile,
  };
};
