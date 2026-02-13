import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  return (
    <div className="relative group inline-block">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full shadow-md shadow-[#1342ff6f] dark:shadow-[rgba(255,215,0,0.5)] 
                   text-[#1342ff6f] dark:text-[rgba(255,215,0,0.5)] 
                   bg-gray-200 dark:bg-gray-800 
                   transition-all ease-in-out cursor-pointer"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Tooltip */}
      <span
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 
                   rounded px-2 py-1 text-xs whitespace-nowrap 
                   bg-[#1342ff6f] text-white dark:bg-[rgba(255,215,0,0.5)] dark:text-black 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                   pointer-events-none shadow-md"
      >
        {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </span>
    </div>
  );
};

export default ThemeToggle;
