import React, { useState } from "react";
import Logo2 from "../logos/logo2.component";
import { Link } from "react-router-dom";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBarClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="w-full h-[72px] fixed top-0 left-0 bg-[#000] text-[#fff] px-[10%] flex justify-between items-center drop-shadow-2xl drop-shadow-[#0c4af65b] z-20">
        <div className="flex items-center space-x-5 md:space-x-10">
          <div className="flex-shrink-0 w-[38.17px] h-[28.44px] md:w-[67px] md:h-[46.75px] xl:w-[78.68px] xl:h-[54.89px] cursor-pointer">
            <Logo2 />
          </div>

          <Link
            to="/ai-dashboard"
            className="relative p-[0.8px] rounded-4xl bg-gradient-to-r from-[#1342ff] to-[#ffffff]"
          >
            <span className="w-[50px] md:w-[65px] xl:w-[81px] flex justify-center items-center bg-gradient-to-b from-[#060328] to-[#030b33] text-[16px] md:text-[20px] xl:text-[24px] rounded-4xl shadow-[inset_0px_-4px_12px] shadow-[#eddb7250] cursor-pointer">
              A<span className="text-[#1342ff]">I</span>
            </span>
          </Link>
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
                  className="absolute top-full right-[-18px] mt-3 z-30 bg-[#000]/70 backdrop-blur-sm border-[1.5px] border-[#ffffff63] p-3 rounded-lg flex flex-col space-y-3 w-[140px]"
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
      </nav>
      <div className="h-[72px]"></div>
    </>
  );
};

export default Navbar;
