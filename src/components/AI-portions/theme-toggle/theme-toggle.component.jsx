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
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full shadow-md shadow-[#1342ff6f] dark:shadow-[rgba(255,215,0,0.5)] hover:text-[#1342ff6f] dark:hover:text-[rgba(255,215,0,0.5)] bg-gray-200 dark:bg-gray-800 text-black dark:text-white transition-all ease-in-out cursor-pointer"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
