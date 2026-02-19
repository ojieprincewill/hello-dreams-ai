import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  const applyTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  };

  useEffect(() => {
    // Check if user has a saved preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      // Otherwise, use system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      applyTheme(prefersDark ? "dark" : "light");
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only update if user hasn’t manually chosen a theme
      const stored = localStorage.getItem("theme");
      if (!stored) {
        applyTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="relative group inline-block">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full shadow-md shadow-[#1342ff6f] dark:shadow-[rgba(255,215,0,0.5)] 
                   text-[#1342ff6f] dark:text-[rgba(255,215,0,0.5)] 
                   bg-gray-200 dark:bg-gray-800 
                   transition-colors duration-300 ease-in-out cursor-pointer"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Tooltip */}
      <span
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 
                   rounded px-2 py-1 text-xs whitespace-nowrap 
                   bg-[#1342ff6f] text-white dark:bg-[rgba(255,215,0,0.5)] dark:text-black 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 
             pointer-events-none shadow-lg"
      >
        {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </span>
    </div>
  );
};

export default ThemeToggle;
