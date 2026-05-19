import React, { useState, useEffect } from "react";
import Logo2 from "../logos/logo2.component";
import { Link } from "react-router-dom";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useScroll } from "motion/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 20);
    });

    return () => unsubscribe();
  }, [scrollY]);

  const handleBarClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <motion.nav
        animate={{
          backgroundColor: scrolled ? "rgba(0,0,0,0.82)" : "rgba(0,0,0,0.45)",

          backdropFilter: scrolled ? "blur(22px)" : "blur(10px)",

          boxShadow: scrolled
            ? "0 25px 35px rgba(12,74,246,.18)"
            : "0 15px 25px rgba(12,74,246,.06)",
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
  w-full
  h-[72px]
  fixed
  top-0
  left-0
  text-white
  px-[10%]
  flex
  justify-between
  items-center
  z-50
  border-b
  border-white/5
"
      >
        <div className="flex items-center space-x-5 md:space-x-10">
          <div className="flex-shrink-0 w-[38.17px] h-[28.44px] md:w-[67px] md:h-[46.75px] xl:w-[78.68px] xl:h-[54.89px] cursor-pointer">
            <Logo2 />
          </div>

          <motion.div
            animate={{
              y: [0, -3, 0], // subtle floating
            }}
            transition={{
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="rounded-4xl"
          >
            <Link
              to="/ai-dashboard"
              className="relative block p-[0.8px] rounded-4xl bg-gradient-to-r from-[#1342ff] to-[#ffffff]"
            >
              <motion.span
                className="relative overflow-hidden w-[50px] md:w-[65px] xl:w-[81px]
      flex justify-center items-center
      bg-gradient-to-b from-[#060328] to-[#030b33]
      text-[16px] md:text-[20px] xl:text-[24px]
      rounded-4xl
      shadow-[inset_0px_-4px_12px] shadow-[#eddb7250]
      cursor-pointer"
              >
                {/* animated shine sweep */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ x: "-150%" }}
                  whileHover={{ x: "250%" }}
                  transition={{
                    duration: 1.1,
                    ease: "easeInOut",
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
                    width: "40%",
                    transform: "skewX(-25deg)",
                  }}
                />

                <motion.div
                  whileHover={{
                    letterSpacing: "0.05em",
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                >
                  A<span className="text-[#1342ff]">I</span>
                </motion.div>
              </motion.span>
            </Link>
          </motion.div>
        </div>
        <div
          className="flex items-center space-x-5"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <Link
            to="/signin"
            className="hidden md:inline bg-transparent text-[#fff] border border-[#fff] font-medium text-[12px] md:text-[16px] xl:text-[18px] px-6 py-2 rounded-md transition-colors duration-300 hover:text-[#1342ff] cursor-pointer"
          >
            Sign in
          </Link>

          <Link
            to="/signup"
            className="hidden md:inline bg-[#1342ff] text-white border border-[#1342ff] font-medium text-[12px] md:text-[16px] xl:text-[18px] px-6 py-2 rounded-md hover:bg-[#1b13ff] hover:border-[#1b13ff] cursor-pointer transition-colors duration-300"
          >
            Sign up
          </Link>

          <div className="relative md:hidden">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                  }}
                >
                  <XMarkIcon
                    onClick={handleBarClick}
                    className="h-8 w-8 text-white cursor-pointer"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                  }}
                >
                  <Bars3BottomLeftIcon
                    onClick={handleBarClick}
                    className="h-8 w-8 text-white cursor-pointer"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -20,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -15,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="absolute top-full right-[-10px] mt-2 z-30 bg-[#000]/70 backdrop-blur-sm border border-white/20 p-3 rounded-xl flex flex-col space-y-3 w-[150px] origin-top-right shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <Link
                    onClick={() => setIsOpen(false)}
                    to="/signin"
                    className="bg-transparent text-white border border-white text-[12px] px-4 py-2 rounded-md text-center"
                  >
                    Sign in
                  </Link>

                  <Link
                    onClick={() => setIsOpen(false)}
                    to="/signup"
                    className="bg-[#1342ff] text-white border border-[#1342ff] text-[12px] px-4 py-2 rounded-md text-center"
                  >
                    Sign up
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
      <div className="h-[72px]"></div>
    </>
  );
};

export default Navbar;
