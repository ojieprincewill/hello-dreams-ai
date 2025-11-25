import React from "react";
import { Link } from "react-router-dom";

const SignUpSuccess = ({ formData }) => {
  return (
    <div className="relative min-h-screen w-full p-[5%] flex items-center justify-center bg-[url('https://res.cloudinary.com/dganx8kmn/image/upload/v1752984140/Academy/sign%20up/3f66b694a8196a4df5f2b870dc9901b56806d575_pntsis.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-white/70"></div>
      <div className="relative z-10 w-full md:w-[635px] flex flex-col items-center justify-center bg-white rounded-3xl p-4">
        <div className="flex flex-col justify-center items-center">
          <span
            className="text-[#222] text-[18px] md:text-[20px] font-bold mb-2"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Hello Dreams A<span className="text-[#1342ff]">I</span>
          </span>
        </div>
        <img
          src="https://res.cloudinary.com/dganx8kmn/image/upload/v1752671335/Academy/sign%20up/57748ea748da9204ec419470544d09d5567918bb_dvjl7o.png"
          alt="Confetti box"
          className="md:w-[233.72px] md:h-[236.3px] mx-auto my-6"
        />
        <h1 className="text-[#101828] capitalize text-[20px] md:text-[30px] xl:text-[48px] font-bold mb-2 text-center">
          congratulations {formData.firstName || "!"}
        </h1>
        <p className="text-[#667085] text-[14px] md:text-[16px] xl:text-[18px] mb-8 text-center max-w-lg">
          You have successfully created your Hello Dreams{" "}
          <span className="font-bold text-[#101828]">
            A<span className="text-[#1342ff]">I</span>
          </span>{" "}
          account.
        </p>

        <Link
          to="/signin"
          className="block w-full py-3 rounded-lg bg-[#1342ff] text-white text-[16px] md:text-[18px] font-bold text-center hover:bg-[#2313ff] transition-colors duration-200 "
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUpSuccess;
