import React from "react";
import Logo2 from "../logos/logo2.component";
import { Link } from "react-router-dom";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  return (
    <div className="w-full bg-[#000] text-[#fff] px-[10%] py-3 flex justify-between items-center drop-shadow-2xl drop-shadow-[#0c4af65b]">
      <div className="flex items-center space-x-5 md:space-x-10">
        <div className="flex-shrink-0 w-[38.17px] h-[28.44px] md:w-[67px] md:h-[46.75px] xl:w-[78.68px] xl:h-[54.89px] cursor-pointer">
          <Logo2 />
        </div>

        <div className="relative p-[0.8px] rounded-4xl bg-gradient-to-r from-[#1342ff] to-[#ffffff]">
          <span className="w-[50px] md:w-[65px] xl:w-[81px] flex justify-center items-center bg-gradient-to-b from-[#060328] to-[#030b33] text-[16px] md:text-[20px] xl:text-[24px] rounded-4xl shadow-[inset_0px_-4px_12px] shadow-[#eddb7250]">
            A<span className="text-[#1342ff]">I</span>
          </span>
        </div>
      </div>
      <div
        className="flex items-center space-x-5"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <Link
          to="/signin"
          className="hidden xl:inline bg-transparent text-[#fff] border border-[#fff] font-medium text-[12px] md:text-[16px] xl:text-[18px] px-6 py-2 rounded-md transition-colors duration-300 hover:text-[#1342ff] cursor-pointer"
        >
          Sign in
        </Link>

        <Link
          to="/signup"
          className="hidden xl:inline bg-[#1342ff] text-white border border-[#1342ff] font-medium text-[12px] md:text-[16px] xl:text-[18px] px-6 py-2 rounded-md hover:bg-[#1b13ff] hover:border-[#1b13ff] cursor-pointer transition-colors duration-300"
        >
          Sign up
        </Link>

        <button className="h-8 w-8 text-[#fff] xl:hidden cursor-pointer align-middle">
          <Bars3BottomLeftIcon />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
