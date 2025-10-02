import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo2 from "../logos/logo2.component";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="text-[#fff] px-5 pt-5 md:px-10 md:pt-20 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] md:border-t-1 border-[#ffffff20]">
        <div className="relative md:border-r border-[#ffffff20] py-5 md:py-15">
          <Link
            to="/"
            className="absolute top-0 md:top-15 w-[32.99px] h-[24.23px] md:w-[67px] md:h-[46.75px] xl:w-[111.32px] xl:h-[77.67px] "
          >
            <Logo2 />
          </Link>
          <p className="text-[10px] md:text-[10px] xl:text-[14px] text-[#ffffff91] xl:font-bold md:mt-15 pt-5 md:pt-10">
            Hello Dreams is a multidisciplinary company dedicated to empowering
            individuals and businesses through a comprehensive suite of
            professional services. Our core focus is on delivering exceptional
            design, social media management, educational...{" "}
            <Link
              to=""
              className="font-bold xl:font-extrabold hover:text-[#d4d4d491] transition-colors duration-300 cursor-pointer"
            >
              read more
            </Link>
          </p>
          <Link
            to=""
            className="absolute bottom-0 hidden md:block md:w-[67px] md:h-[46.75px] xl:w-[111.32px] xl:h-[77.67px] "
          >
            <Logo2 />
          </Link>
        </div>
        <div className="flex flex-col border md:border-0 border-[#ffffff20] w-max md:w-full pb-4 md:pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start ">
            <div className="border-l md:border-none border-[#ffffff20] pl-3  py-5 md:py-15">
              <h1 className="text-[12px] md:text-[9px] xl:text-[14px] text-[#ffffff91] uppercase font-bold mb-4 md:mb-7">
                company
              </h1>
              <div className="text-[11px] md:text-[10px] xl:text-[16px] text-[#fff] md:font-bold flex flex-col space-y-2 md:space-y-4">
                <Link
                  to=""
                  className="hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
                >
                  Academy
                </Link>
                <Link
                  to=""
                  className="hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
                >
                  Portfolio
                </Link>
                <Link
                  to=""
                  className="hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
                >
                  About us
                </Link>
                <Link
                  to=""
                  className="hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
                >
                  Refer & Earn
                </Link>
              </div>
            </div>
            <div className="border-l border-[#ffffff20] flex flex-col pl-3  py-5 md:py-15">
              <div className="mb-7 md:mb-15">
                <h1 className="text-[12px] md:text-[9px] xl:text-[14px] text-[#ffffff91] uppercase font-bold mb-4 md:mb-7">
                  Follow
                </h1>
                <div className="text-[11px] md:text-[10px] xl:text-[16px] text-[#fff] md:font-bold flex flex-col space-y-2 md:space-y-4">
                  <a
                    href="https://www.youtube.com/@HelloDreamsAcademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
                  >
                    Youtube
                  </a>
                  <a
                    href="https://www.instagram.com/hellodreamss/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.linkedin.com/company/hello-dreams-limited/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://www.tiktok.com/@myhellodreams?_t=ZM-8wv4XL55NBu&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
                  >
                    Tiktok
                  </a>
                </div>
              </div>
              <div>
                <h1 className="text-[12px] md:text-[9px] xl:text-[14px] text-[#ffffff91] uppercase font-bold mb-4 md:mb-7">
                  Legal
                </h1>
                <div className="text-[11px] md:text-[10px] xl:text-[16px] text-[#fff] md:font-bold flex flex-col space-y-2 md:space-y-4">
                  <span
                    onClick={() => handleNavigate("/privacy-policy")}
                    className="hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
                  >
                    Privacy Policy
                  </span>
                  <span
                    onClick={() => handleNavigate("/terms-of-service")}
                    className="hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
                  >
                    Terms of Service
                  </span>
                </div>
              </div>
            </div>

            <div className="md:border-r border-l border-[#ffffff20] h-full pl-3 pr-6 py-5 md:py-15">
              <h1 className="text-[12px] md:text-[9px] xl:text-[14px] text-[#ffffff91] uppercase font-bold mb-4 md:mb-7">
                contact us
              </h1>
              <div className="text-[11px] md:text-[10px] xl:text-[16px] text-[#fff] md:font-bold flex flex-col space-y-2 md:space-y-4">
                <span className="w-[180px] md:w-full">
                  Email:{" "}
                  <a
                    href="mailto:support@myhellodreams.com"
                    className="hover:text-[#99c8ff] transition-colors duration-300"
                  >
                    support@myhellodreams.com
                  </a>
                </span>
                <span>
                  Phone:{" "}
                  <a
                    href="https://wa.me/2347016773420"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#99c8ff] transition-colors duration-300"
                  >
                    07016773420
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div className="border-l md:border-l-0 w-full h-max grid grid-cols-1 md:grid-cols-2 text-[#fff] text-[11px] md:text-[12px] xl:text-[20px] font-bold md:border-t md:border-b border-[#ffffff20]">
            <a
              href="https://web.facebook.com/profile.php?id=61565243428696"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-start md:justify-center items-center px-3 py-[10px] md:px-10 xl:px-20 md:py-10 md:border-b border-[#ffffff20] w-full h-full hover:text-[#99c8ff] transition-colors duration-300 cursor-pointer"
            >
              <span className="mr-1 md:mr-2">
                <img
                  src="https://i.ibb.co/fYPXmXPX/SVG.png"
                  alt="svg"
                  className="w-[13.56px] h-[13.56px] xl:w-[23.42px] xl:h-[23.42px] object-cover"
                />
              </span>
              Twitter
            </a>
            <a
              href="https://www.instagram.com/hellodreamss/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-start md:justify-center items-center px-3 py-[10px] md:px-10 xl:px-20 md:py-10 md:border-b md:border border-[#ffffff20] w-full h-full hover:text-[#ffb3ce] transition-colors duration-300 cursor-pointer"
            >
              <span className="mr-1 md:mr-2">
                <img
                  src="https://i.ibb.co/27nrzGhc/SVG-2.png"
                  alt="svg 2"
                  className="w-[11.12px] h-[11.12px] xl:w-[24px] xl:h-[24px] object-cover"
                />
              </span>
              Instagram
            </a>
            <a
              href="https://web.facebook.com/profile.php?id=61565243428696"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-start md:justify-center items-center px-3 py-[10px] md:px-10 xl:px-20 md:py-10 border-[#ffffff20] w-full h-full hover:text-[#8c77ec] transition-colors duration-300 cursor-pointer"
            >
              <span className="mr-1 md:mr-2">
                <img
                  src="https://i.ibb.co/xKdJ3Tgx/Vector.png"
                  alt="vector"
                  className="w-[12.36px] h-[7.46px] xl:w-[21.33px] xl:h-[12.88px] object-cover"
                />
              </span>
              Facebook
            </a>
            <a
              href="https://www.linkedin.com/company/hello-dreams-limited/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-start md:justify-center items-center px-3 py-[10px] md:px-10 xl:px-20 md:py-10 md:border border-[#ffffff20] w-full h-full hover:text-[#ff884d] transition-colors duration-300 cursor-pointer"
            >
              <span className="mr-1 md:mr-2">
                <img
                  src="https://i.ibb.co/KxBB6mx2/Background-Border.png"
                  alt="background border"
                  className="w-[11.58px] h-[11.58px] xl:w-[20px] xl:h-[20px] object-cover"
                />
              </span>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-[#ffffff71] font-bold text-center pt-12">
        © All Rights Reserved. {currentYear}, myhellodreams.com
      </p>
    </div>
  );
};

export default Footer;
