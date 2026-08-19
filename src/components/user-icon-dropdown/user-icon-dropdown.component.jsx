import React, { useState, useEffect, useContext, useRef } from "react";
import { createPortal } from "react-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/authContext";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import { getCredits } from "../../api/creditsService";
import { useTheme } from "../AI-portions/theme-toggle/useTheme";
import { ChevronDown } from "lucide-react";
import { isAdmin } from "../../auth/roleUtils";

const UserIconDropdown = () => {
  const [open, setOpen] = useState(false);
  const [credits, setCredits] = useState(null);
  const navigate = useNavigate();
  const { logout, loading, user } = useContext(AuthContext);
  const { setTheme } = useTheme();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(
    localStorage.getItem("theme") || "system",
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Keep isMobile in sync with viewport width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setActiveTheme(stored);
  }, []);

  const handleThemeChange = (value) => {
    setActiveTheme(value);
    setTheme(value);
    localStorage.setItem("theme", value);
  };

  useEffect(() => {
    if (!user) return;
    getCredits()
      .then(setCredits)
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!open) setAppearanceOpen(false);
  }, [open]);

  // Close on outside click (covers both desktop and mobile)
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e) => {
      const insideTrigger = triggerRef.current?.contains(e.target);
      const insideDropdown = dropdownRef.current?.contains(e.target);
      if (!insideTrigger && !insideDropdown) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((prev) => !prev);
  };

  const goToProfile = (active) => {
    navigate("/userprofile", { state: { active } });
    setOpen(false);
  };

  const mobileVariants = {
    initial: { opacity: 0, x: 300 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 300 },
  };

  const desktopVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const variants = isMobile ? mobileVariants : desktopVariants;

  return (
    <>
      {loading && <LoadingSpinner />}

      {/* Trigger */}
      <div
        ref={triggerRef}
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] bg-gray-700 rounded-full overflow-hidden">
          <img
            src="https://res.cloudinary.com/dganx8kmn/image/upload/v1759449140/Hello%20dreams%20%20AI/26d3a9db798a4cc8725cb83dcbf5cf7966ae74dc_jifjis.png"
            alt="user-image"
            className="w-full h-full object-cover"
          />
        </div>
        <span
          className="hidden md:inline text-sm font-medium text-[#222] dark:text-[#fff]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {user ? user.name : "Guest"}
        </span>
      </div>

      {/* Portal — renders directly under document.body, above all stacking contexts */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Mobile backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 md:hidden"
                style={{ zIndex: 9998 }}
                onClick={() => setOpen(false)}
              />

              {/* Dropdown panel */}
              <motion.div
                key="panel"
                ref={dropdownRef}
                initial={variants.initial}
                animate={variants.animate}
                exit={variants.exit}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{
                  zIndex: 9999,
                  fontFamily: "Darker Grotesque, sans-serif",
                  ...(isMobile
                    ? { top: 0, right: 0 }
                    : { top: dropdownPos.top, right: dropdownPos.right }),
                }}
                className="
                  fixed
                  mr-1 md:mr-0
                  w-[82%] max-w-[340px] sm:w-[333px]
                  max-h-[95vh] md:max-h-[80vh]
                  overflow-y-auto overflow-x-hidden
                  bg-[#f9f9f9] dark:bg-[#1c1c1c]
                  border-[0.4px] border-[#eaecf0] dark:border-[#565757]
                  rounded-none md:rounded-lg
                  shadow-md px-4 py-4 md:py-2 custom-scrollbar
                "
              >
                {/* User header */}
                <div className="flex items-center gap-3 px-2 py-3 border-b border-b-[#eaecf0] dark:border-b-[#272725]">
                  <div
                    className="bg-[#8aa1ff] dark:bg-gradient-to-b from-[#8aa1ff] via-[#becbff] to-[#ffffff]
                      w-10 h-10 sm:w-12 sm:h-12
                      text-[#fff] uppercase text-sm sm:text-base
                      font-bold flex justify-center items-center rounded-full"
                  >
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-[#010413] dark:text-[#f7f7f7] truncate">
                      {user?.name
                        ? `${user.name}'s Dream World`
                        : "Dream World"}
                    </p>
                    <p className="text-xs sm:text-sm text-[#010413] dark:text-[#f7f7f7] truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>

                {/* Credits */}
                <div className="bg-[#efefef] dark:bg-[#272725] rounded-lg px-3 sm:px-4 py-3 my-5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-base font-semibold text-[#010413] dark:text-[#f7f7f7]">
                      Credits
                    </p>
                    <span className="bg-[#fff] dark:bg-[#1c1c1c] rounded-lg px-2 py-0.5 text-xs font-bold text-[#1342ff]">
                      {credits ? `${credits.used}/${credits.limit}` : "…/5"}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-[#e0e0e0] dark:bg-[#444] rounded-full mb-2 overflow-hidden">
                    <div
                      className="h-full bg-[#1342ff] rounded-full transition-all"
                      style={{
                        width: credits
                          ? `${Math.min((credits.used / credits.limit) * 100, 100)}%`
                          : "0%",
                      }}
                    />
                  </div>

                  <p className="text-xs sm:text-sm text-[#010413] dark:text-[#f7f7f7]">
                    1 credit = {credits?.tokensPerCredit ?? 800} tokens · Resets
                    at midnight UTC
                  </p>
                </div>

                {/* Plan + upgrade */}
                <div
                  className="w-full flex flex-col items-center gap-2 py-5 border-b border-b-[#eaecf0] dark:border-b-[#272725]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <button
                    type="button"
                    className="w-full text-[#222] dark:text-[#fff] sm:w-[90%] bg-transparent border border-transparent rounded-md py-2 text-xs sm:text-sm font-medium"
                  >
                    You are on {credits?.plan === "pro" ? "Pro" : "Free"} plan
                  </button>

                  {credits?.plan !== "pro" && (
                    <button
                      type="button"
                      onClick={() => goToProfile("subscription")}
                      className="w-full sm:w-[90%] bg-[#6b88fa] dark:bg-[#1342ff] border border-[#1342ff] rounded-md py-2 text-xs sm:text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      Upgrade now!
                    </button>
                  )}
                </div>

                {/* Nav items */}
                <ul className="space-y-0.5">
                  {isAdmin(user) && (
                    <li>
                      <button
                        type="button"
                        className="w-full text-sm sm:text-base font-medium text-[#010413] dark:text-[#f7f7f7] p-2 sm:p-2.5 flex items-center cursor-pointer hover:bg-[#efefef] dark:hover:bg-[#212121]"
                        onClick={() => {
                          navigate("/admin/overview");
                          setOpen(false);
                        }}
                      >
                        Admin Panel
                      </button>
                    </li>
                  )}

                  <li>
                    <button
                      type="button"
                      className="w-full text-sm sm:text-base font-medium text-[#010413] dark:text-[#f7f7f7] p-2 sm:p-2.5 flex items-center cursor-pointer hover:bg-[#efefef] dark:hover:bg-[#212121]"
                      onClick={() => goToProfile("settings")}
                    >
                      Settings
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="w-full text-sm sm:text-base font-medium text-[#010413] dark:text-[#f7f7f7] p-2 sm:p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#efefef] dark:hover:bg-[#212121]"
                      onClick={() => setAppearanceOpen((v) => !v)}
                    >
                      Appearance
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          appearanceOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        appearanceOpen
                          ? "max-h-40 opacity-100 mt-2"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      <div className="ml-2 space-y-1 pt-1 text-[#222] dark:text-[#fff]">
                        <button
                          type="button"
                          onClick={() => handleThemeChange("light")}
                          className={`w-full text-left text-[14px] md:text-[15px] lg:text-[16px] px-3 py-2 rounded-lg transition-all cursor-pointer ${
                            activeTheme === "light"
                              ? "bg-[#f0f4ff] text-[#1342ff] dark:bg-[#1a2040] dark:text-[#7b96ff]"
                              : "hover:bg-[#efefef] dark:hover:bg-[#212121]"
                          }`}
                        >
                          Light Mode
                        </button>

                        <button
                          type="button"
                          onClick={() => handleThemeChange("dark")}
                          className={`w-full text-left text-[14px] md:text-[15px] lg:text-[16px] px-3 py-2 rounded-lg transition-all cursor-pointer ${
                            activeTheme === "dark"
                              ? "bg-[#f0f4ff] text-[#1342ff] dark:bg-[#1a2040] dark:text-[#7b96ff]"
                              : "hover:bg-[#efefef] dark:hover:bg-[#212121]"
                          }`}
                        >
                          Dark Mode
                        </button>

                        <button
                          type="button"
                          onClick={() => handleThemeChange("system")}
                          className={`w-full text-left text-[14px] md:text-[15px] lg:text-[16px] px-3 py-2 rounded-lg transition-all cursor-pointer ${
                            activeTheme === "system"
                              ? "bg-[#f0f4ff] text-[#1342ff] dark:bg-[#1a2040] dark:text-[#7b96ff]"
                              : "hover:bg-[#efefef] dark:hover:bg-[#212121]"
                          }`}
                        >
                          System Default
                        </button>
                      </div>
                    </div>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="w-full text-sm sm:text-base font-medium text-[#010413] dark:text-[#f7f7f7] p-2 sm:p-2.5 flex items-center cursor-pointer hover:bg-[#efefef] dark:hover:bg-[#212121]"
                      onClick={() => goToProfile("subscription")}
                    >
                      Subscriptions
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="w-full text-sm sm:text-base font-medium text-red-500 p-2 sm:p-2.5 flex items-center rounded-md hover:bg-[#efefef] dark:hover:bg-[#212121] mt-2 border-t border-[#eaecf0] dark:border-[#272725] pt-3 cursor-pointer"
                      onClick={async () => {
                        await logout(navigate);
                        setOpen(false);
                      }}
                      disabled={loading}
                    >
                      {loading ? "Signing out..." : "Sign out"}
                    </button>
                  </li>
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

export default UserIconDropdown;
