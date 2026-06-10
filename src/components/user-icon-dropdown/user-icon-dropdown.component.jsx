import React, { useState, useEffect, useContext } from "react";
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

  const isMobile = window.innerWidth < 768;

  const variants = {
    desktop: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    mobile: {
      initial: { opacity: 0, x: 300 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 300 },
    },
  };
  const menuItems = [
    ...(isAdmin(user)
      ? [{ key: "admin", label: "Admin Panel" }]
      : []),
    { key: "settings", label: "Settings" },
    { key: "appearance", label: "Appearance" },
    { key: "subscription", label: "Subscriptions" },
    { key: "logout", label: "Sign out" },
  ];

  return (
    <div className="relative">
      {loading && <LoadingSpinner />}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
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
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={
                isMobile ? variants.mobile.initial : variants.desktop.initial
              }
              animate={
                isMobile ? variants.mobile.animate : variants.desktop.animate
              }
              exit={isMobile ? variants.mobile.exit : variants.desktop.exit}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="
  fixed md:absolute right-0 mr-1 md:mt-2 
  top-0 md:top-auto

  w-[82%] max-w-[340px] sm:w-[333px]

  max-h-[95vh] md:max-h-[80vh]
  overflow-y-auto overflow-x-hidden

  bg-[#f9f9f9] dark:bg-[#1c1c1c]
  border-[0.4px] border-[#eaecf0] dark:border-[#565757]
  rounded-none md:rounded-lg
  shadow-md z-50 px-4 py-4 md:py-2 custom-scrollbar
"
            >
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
                    {user?.name ? `${user.name}'s Dream World` : "Dream World"}
                  </p>
                  <p className="text-xs sm:text-sm text-[#010413] dark:text-[#f7f7f7] truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              <div className="bg-[#efefef] dark:bg-[#272725] rounded-lg px-3 sm:px-4 py-3 my-5">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-base sm:text-lg font-semibold text-[#010413] dark:text-[#f7f7f7]">
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
                  Daily credits, reset at midnight
                </p>
              </div>

              <div
                className="w-full flex flex-col items-center gap-2 py-5 border-b border-b-[#eaecf0] dark:border-b-[#272725]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <button className="w-full sm:w-[90%] bg-transparent border border-transparent rounded-md py-2 text-xs sm:text-sm font-medium">
                  You are on Free plan
                </button>

                <button className="w-full sm:w-[90%] bg-[#6b88fa] dark:bg-[#1342ff] border border-[#1342ff] rounded-md py-2 text-xs sm:text-sm font-medium">
                  Upgrade now!
                </button>
              </div>

              <ul className="space-y-0.5">
                {/* Settings */}
                <li>
                  <button
                    className=" w-full text-sm sm:text-base
  font-medium text-[#010413] dark:text-[#f7f7f7]
  p-2 sm:p-2.5 font-medium text-[#010413] dark:text-[#f7f7f7] flex items-center cursor-pointer hover:bg-[#efefef] dark:hover:bg-[#212121]"
                    onClick={() => {
                      navigate("/userprofile", {
                        state: { active: "settings" },
                      });
                      setOpen(false);
                    }}
                  >
                    Settings
                  </button>
                </li>

                {/* Appearance (nested dropdown) */}
                <li>
                  <button
                    className=" w-full text-sm sm:text-base
  font-medium text-[#010413] dark:text-[#f7f7f7]
  p-2 sm:p-2.5 font-medium text-[#010413] dark:text-[#f7f7f7] flex items-center justify-between cursor-pointer hover:bg-[#efefef] dark:hover:bg-[#212121]"
                    onClick={() => setAppearanceOpen((v) => !v)}
                  >
                    Appearance
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        appearanceOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Animated dropdown */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      appearanceOpen
                        ? "max-h-40 opacity-100 mt-2"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <div className="ml-2 space-y-1 pt-1">
                      {/* LIGHT */}
                      <button
                        onClick={() => handleThemeChange("light")}
                        className={`w-full text-left text-[14px] md:text-[15px] lg:text-[16px] px-3 py-2 rounded-lg transition-all cursor-pointer ${
                          activeTheme === "light"
                            ? "bg-[#f0f4ff] text-[#1342ff] dark:bg-[#1a2040] dark:text-[#7b96ff]"
                            : "hover:bg-[#efefef] dark:hover:bg-[#212121]"
                        }`}
                      >
                        Light Mode
                      </button>

                      {/* DARK */}
                      <button
                        onClick={() => handleThemeChange("dark")}
                        className={`w-full text-left text-[14px] md:text-[15px] lg:text-[16px] px-3 py-2 rounded-lg transition-all cursor-pointer ${
                          activeTheme === "dark"
                            ? "bg-[#f0f4ff] text-[#1342ff] dark:bg-[#1a2040] dark:text-[#7b96ff]"
                            : "hover:bg-[#efefef] dark:hover:bg-[#212121]"
                        }`}
                      >
                        Dark Mode
                      </button>

                      {/* SYSTEM */}
                      <button
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

                {/* Subscriptions */}
                <li>
                  <button
                    className=" w-full text-sm sm:text-base
  font-medium text-[#010413] dark:text-[#f7f7f7]
  p-2 sm:p-2.5 font-medium text-[#010413] dark:text-[#f7f7f7] flex items-center cursor-pointer hover:bg-[#efefef] dark:hover:bg-[#212121]"
                    onClick={() => {
                      navigate("/userprofile", {
                        state: { active: "subscription" },
                      });
                      setOpen(false);
                    }}
                  >
                    Subscriptions
                  </button>
                </li>

                {/* Logout */}
                <li>
                  <button
                    className="
  w-full text-sm sm:text-base
  font-medium text-red-500
  p-2 sm:p-2.5
  flex items-center
  rounded-md
  hover:bg-[#efefef] dark:hover:bg-[#212121]
  mt-2 border-t border-[#eaecf0] dark:border-[#272725] pt-3
"
                    onClick={async () => {
                      if (item.key === "logout") {
                        await logout(navigate);
                      } else if (item.key === "admin") {
                        navigate("/admin/overview");
                      } else {
                        navigate("/userprofile", {
                          state: { active: item.key },
                        });
                      }
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
      </AnimatePresence>
    </div>
  );
};

export default UserIconDropdown;
