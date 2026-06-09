import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setThemeState] = useState("light");

  const applyTheme = (newTheme) => {
    setThemeState(newTheme);

    const root = document.documentElement;

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else if (newTheme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.toggle("dark", prefersDark);
    }

    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");

    if (stored) {
      applyTheme(stored);
    } else {
      applyTheme("system");
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      const current = localStorage.getItem("theme");
      if (!current || current === "system") {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return {
    theme,
    setTheme: applyTheme,
  };
};
