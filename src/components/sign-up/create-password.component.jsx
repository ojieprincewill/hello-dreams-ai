import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const CreatePassword = ({ onContinue, onBack, formData, setFormData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password requirements
  const requirements = [
    {
      label: "At least 8 characters strong",
      test: (pw) => pw.length >= 8,
    },
    {
      label: "One lower case character",
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      label: "One upper case",
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      label: "One special symbol (@>!?.*%$)",
      test: (pw) => /[@>!?.*%$]/.test(pw),
    },
  ];
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;
  const passed = requirements.map((r) => r.test(password));
  const allPassed = passed.every(Boolean);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  const canContinue = allPassed && passwordsMatch;

  // Password strength bar (simple: 0-4)
  const strength = passed.filter(Boolean).length;
  const strengthColors = [
    "bg-gray-200",
    "bg-red-400",
    "bg-yellow-400",
    "bg-blue-400",
    "bg-green-500",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen w-full p-[5%] flex items-center justify-center">
      <div className="w-full md:w-[635px] bg-white rounded-3xl shadow-lg p-4">
        {/* Back arrow */}
        <button
          onClick={onBack}
          className="text-[#101828] hover:text-[#1342ff] text-2xl md:text-3xl transition-colors duration-200 cursor-pointer"
        >
          <span aria-label="Back" role="img">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </span>
        </button>
        <div className="w-full flex flex-col items-center mt-2">
          <div className="flex flex-col justify-center items-center">
            <span
              className="text-[#222] text-[18px] md:text-[20px] font-bold mb-2"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Hello Dreams A<span className="text-[#1342ff]">I</span>
            </span>
          </div>
          <h1 className="text-[#101828] text-[20px] md:text-[30px] xl:text-[48px] font-bold mb-2 text-center">
            Create your password
          </h1>
          <p className="text-[#667085] text-[14px] md:text-[16px] xl:text-[18px] mb-6 text-center max-w-md">
            Please create your password
          </p>

          <form
            className="w-full flex flex-col items-center mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (canContinue) onContinue();
            }}
          >
            <div className="w-full mb-4">
              <label className="block text-[#101828] text-[14px] md:text-[15px] mb-1">
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className="global-input w-full px-4 py-3 rounded-lg border border-[#eaecf0] bg-[#f7f7f7] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1342ff] pr-12 disabled:opacity-60"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] disabled:opacity-60"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <span role="img" aria-label="Hide">
                      <EyeSlashIcon className="w-4 h-4 text-[#667085] cursor-pointer" />
                    </span>
                  ) : (
                    <span role="img" aria-label="Show">
                      <EyeIcon className="w-4 h-4 text-[#667085] cursor-pointer" />
                    </span>
                  )}
                </button>
              </div>
              {/* Strength bar */}
              <div className="flex items-center mt-2 space-x-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < strength ? strengthColors[strength] : "bg-gray-200"
                    }`}
                  />
                ))}
                <span className="ml-2 text-xs font-bold text-[#667085]">
                  {strength === 4
                    ? "Strong"
                    : strength === 3
                    ? "Good"
                    : strength === 2
                    ? "Fair"
                    : "Weak"}
                </span>
              </div>
            </div>
            <div className="w-full mb-4">
              <label className="block text-[#101828] text-[14px] md:text-[15px] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="global-input w-full px-4 py-3 rounded-lg border border-[#eaecf0] bg-[#f7f7f7] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1342ff] pr-12 disabled:opacity-60"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] disabled:opacity-60"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <span role="img" aria-label="Hide">
                      <EyeSlashIcon className="w-4 h-4 text-[#667085] cursor-pointer" />
                    </span>
                  ) : (
                    <span role="img" aria-label="Show">
                      <EyeIcon className="w-4 h-4 text-[#667085] cursor-pointer" />
                    </span>
                  )}
                </button>
              </div>
            </div>
            {/* Requirements checklist */}
            <div className="w-full mb-4 flex flex-col space-y-1">
              {requirements.map((r, i) => (
                <div key={i} className="flex items-center text-[14px]">
                  <span
                    className={`mr-2 text-lg ${
                      passed[i] ? "text-green-500" : "text-gray-300"
                    }`}
                  >
                    ●
                  </span>
                  <span
                    className={passed[i] ? "text-green-600" : "text-[#667085]"}
                  >
                    {r.label}
                  </span>
                </div>
              ))}
              <div className="flex items-center text-[14px] mt-1">
                <span
                  className={`mr-2 text-lg ${
                    passwordsMatch ? "text-green-500" : "text-gray-300"
                  }`}
                >
                  ●
                </span>
                <span
                  className={
                    passwordsMatch ? "text-green-600" : "text-[#667085]"
                  }
                >
                  Passwords match
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#1342ff] text-white text-[16px] md:text-[18px] font-bold hover:bg-[#2313ff] disabled:opacity-60 transition-colors duration-200 cursor-pointer"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
