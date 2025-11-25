import React, { useState, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/authContext";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
const UserIconDropdown = ({ active }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, loading, user } = useContext(AuthContext);

  const menuItems = [
    { key: "settings", label: "Settings" },
    { key: "appearance", label: "Appearance" },
    { key: "subscription", label: "Subscriptions" },
    { key: "logout", label: "Sign out" },
  ];

  return (
    <div className="relative">
      {loading && <LoadingSpinner />}
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="w-[40px] h-[40px] bg-gray-700 rounded-full overflow-hidden">
          <img
            src="https://res.cloudinary.com/dganx8kmn/image/upload/v1759449140/Hello%20dreams%20%20AI/26d3a9db798a4cc8725cb83dcbf5cf7966ae74dc_jifjis.png"
            alt="user-image"
            className="w-full h-full object-cover"
          />
        </div>
        <span
          className="text-sm font-medium"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {user ? user.name : "Guest"}
        </span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute right-0 mt-2 w-[333px] bg-[#1c1c1c] border-[0.4px] border-[#eaecf0] rounded-lg shadow-md z-50 overflow-hidden px-4 py-2"
          >
            <div className="hidden xl:flex space-x-2 items-center px-2 py-3 border-b border-b-[#272725] ">
              <div className="bg-gradient-to-b from-[#8aa1ff] via-[#becbff] to-[#ffffff] w-8 h-8 md:w-12 md:h-12 xl:w-[45.86px] xl:h-[45.86px] text-[#fff] uppercase text-[14px] md:text-[18px] xl:text-[32px] text-center font-bold flex justify-center items-center rounded-full cursor-pointer">
                P
              </div>
              <div>
                <p className="text-[16px] md:text-[18px] xl:text-[20px] font-bold text-[#f7f7f7]">
                  Pamela's Dream World
                </p>
                <p className="text-[14px] text-[#f7f7f7]">
                  ohaeripamela12@gmail.com
                </p>
              </div>
            </div>

            <div className="bg-[#272725] rounded-lg px-3 py-2 my-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[20px] text-[#f7f7f7] ">Credits</p>
                <button className="bg-[#fff] border-0 rounded-xl w-[32px] h-[20.27px] text-[#1342ff] text-[12px] text-center font-bold">
                  0/5
                </button>
              </div>
              <div className="w-full h-[10px] bg-[#1342ff] rounded-3xl mb-2"></div>
              <p className="text-[16px] text-[#f7f7f7] ">
                Daily credits, reset at midnight
              </p>
            </div>

            <div
              className="w-full flex flex-col justify-center items-center gap-1 py-5 border-b border-b-[#272725]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <button className="w-[252px] bg-transparent border-[0.5px] border-transparent rounded-md py-2 px-4 text-center text-[12.35px] font-bold cursor-pointer ">
                You are on Free plan
              </button>
              <button className="w-[252px] bg-[#1342ff] border-[0.5px] border-[#eaecf0] rounded-md py-2 px-4 text-center text-[12.35px] font-bold cursor-pointer ">
                Upgrade now!
              </button>
            </div>

            <ul>
              {menuItems.map((item) => (
                <li key={item.key}>
                  <button
                    className={`w-full text-[14px] md:text-[16px] xl:text-[20px] font-medium text-[#f7f7f7] p-1 flex items-center gap-1 cursor-pointer ${
                      active === item.key ? "bg-[#f0f4ff]" : ""
                    } ${
                      item.key === "logout" &&
                      "text-[#ff0000] mt-2 border-t border-t-[#272725]"
                    } hover:bg-[#212121]`}
                    onClick={async () => {
                      if (item.key === "logout") {
                        await logout(navigate);
                      } else {
                        navigate("/userprofile", {
                          state: { active: item.key },
                        });
                      }
                      setOpen(false);
                    }}
                    disabled={item.key === "logout" && loading} // 👈 disable while logging out
                  >
                    {item.key === "logout" && loading
                      ? "Signing out..."
                      : item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserIconDropdown;
