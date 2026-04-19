import React, { createContext, useContext, useState, useCallback } from "react";
import { getLatestResume } from "../api/resumeBuilderService";

const STORAGE_KEY = "latestResume";

const ResumeContext = createContext({ resume: null, isLoading: false, refresh: async () => {} });

export const useResume = () => useContext(ResumeContext);

export const ResumeProvider = ({ children }) => {
  const [resume, setResume] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getLatestResume();
      if (data) {
        setResume(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        setResume(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // network error — keep stale cached value
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ResumeContext.Provider value={{ resume, isLoading, refresh }}>
      {children}
    </ResumeContext.Provider>
  );
};
