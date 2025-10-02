import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
const SigninForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (loginError) setLoginError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      // For now, we'll use email login since phone login requires additional setup
      if (activeTab === "phone") {
        setLoginError(
          "Phone login is not yet supported. Please use email login."
        );
        setIsLoggingIn(false);
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.message || "Failed to login. Please check your credentials."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setResetError("");
    setResetSuccess(false);
  };

  const currentYear = new Date().getFullYear();

  const handleOrigins = () => {};

  return (
    <>
      <div className="w-full h-screen px-[5%] xl:px-0 flex items-center justify-center">
        <div className="w-full grid xl:grid-cols-[45%_55%] bg-white shadow-lg overflow-hidden">
          {/* Left: Image and text */}
          <div className="hidden h-screen xl:flex flex-col justify-between bg-black/80 p-10 relative rounded-tr-[10%] rounded-br-[10%]">
            <img
              src="https://res.cloudinary.com/dganx8kmn/image/upload/v1752698465/Academy/sign%20up/ef9d88980ccdbe63c578ec2f42fdc6e46f8282e1_guckoj.jpg"
              alt="Login visual"
              className="absolute inset-0 w-full h-full object-cover object-center z-0 rounded-tr-[10%] rounded-br-[10%]"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#000000]/10 to-[#000000] rounded-tr-[10%] rounded-br-[10%]" />
            <div className="relative z-20 flex flex-col h-full justify-between">
              <div className="mt-10">
                <span
                  className="text-white text-[16px] md:text-[20px] font-bold tracking-wide "
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  Hello Dreams A<span className="text-[#1342ff]">I</span>
                </span>
              </div>
              <div className="pl-10 -mb-40 mt-auto">
                <h2 className="text-white text-[36px] font-semibold mb-4 leading-tight w-[495px] ">
                  Unlocking opportunities through education and skill
                  developlment.
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#1342ff]" />
                  <span className="inline-block w-2 h-2 rounded-full bg-white/40" />
                </div>
              </div>
              <div className="pl-10 text-white text-[12px] md:text-[14px] mt-auto opacity-80">
                © {currentYear} Hello Dreams Limited. All rights reserved.
              </div>
            </div>
          </div>
          {/* Right: Form */}
          <div
            className="w-full flex flex-col justify-center p-[6%] md:p-0 md:px-12"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <h1 className="text-[#101828] text-[22px] md:text-[38px] xl:text-[48px] font-bold mb-2">
              Great! You're back 😊
            </h1>
            <p className="text-[#667085] text-[14px] md:text-[16px] mb-6">
              Login with your email or phone number
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <button
                type="button"
                className={`px-4 py-3 rounded-lg text-[14px] border transition-colors duration-200 cursor-pointer font-medium ${
                  activeTab === "email"
                    ? "bg-[#010413] border-[#010413] text-white"
                    : "bg-transparent border-[#eaecf0] text-[#667085]"
                }`}
                onClick={() => setActiveTab("email")}
                disabled={isLoggingIn}
              >
                Email address
              </button>
              <button
                type="button"
                className={`px-4 py-3 rounded-lg text-[14px] border transition-colors duration-300 cursor-pointer font-medium ${
                  activeTab === "phone"
                    ? "bg-[#010413] border-[#010413] text-white"
                    : "bg-transparent border-[#eaecf0] text-[#667085] hover:bg-[#f7f7f7]"
                }`}
                onClick={() => setActiveTab("phone")}
                disabled={isLoggingIn}
              >
                Phone number
              </button>
            </div>

            {/* Error display */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {activeTab === "email" ? (
                <>
                  <div>
                    <label className="block text-[#101828] text-[16px] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-lg border border-[#eaecf0] bg-[#f7f7f7] text-[#101828] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1342ff] disabled:opacity-60"
                      required={activeTab === "email"}
                      disabled={isLoggingIn}
                    />
                  </div>
                  <div>
                    <label className="block text-[#101828] text-[16px] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="w-full px-4 py-3 rounded-lg border border-[#eaecf0] bg-[#f7f7f7] text-[#101828] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1342ff] pr-12 disabled:opacity-60"
                        required
                        disabled={isLoggingIn}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] disabled:opacity-60"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        disabled={isLoggingIn}
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
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[#101828] text-[16px] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 rounded-lg border border-[#eaecf0] bg-[#f7f7f7] text-[#101828] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1342ff] disabled:opacity-60"
                      required={activeTab === "phone"}
                      disabled={isLoggingIn}
                    />
                  </div>
                  <div>
                    <label className="block text-[#101828] text-[16px] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="w-full px-4 py-3 rounded-lg border border-[#eaecf0] text-[#101828] bg-[#f7f7f7] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1342ff] pr-12 disabled:opacity-60"
                        required
                        disabled={isLoggingIn}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] disabled:opacity-60"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        disabled={isLoggingIn}
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
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[#1342ff] text-[14px] md:text-[16px] w-max mr-0.5 ml-auto font-medium cursor-pointer hover:underline disabled:opacity-50"
                disabled={isLoggingIn}
              >
                Forgot Password?
              </button>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-lg bg-[#1342ff] text-[#fff] text-[18px] font-bold hover:bg-[#2313ff] disabled:opacity-60 transition-colors duration-200 cursor-pointer"
                disabled={
                  isLoggingIn ||
                  !(
                    (activeTab === "email" &&
                      formData.email &&
                      formData.password) ||
                    (activeTab === "phone" &&
                      formData.phone &&
                      formData.password)
                  )
                }
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="flex items-center w-full mt-6">
              <hr className="flex-grow border-t border-[#e5e7eb]" />
              <div className="text-center text-[#667085] text-[15px] px-2">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  onClick={handleOrigins}
                  className="text-[#1342ff] font-bold hover:underline"
                >
                  Sign up now
                </Link>
              </div>
              <hr className="flex-grow border-t border-[#e5e7eb]" />
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#101828]">
                Reset Password
              </h3>
              <button
                onClick={closeForgotPassword}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            {resetSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-[#101828] mb-2">
                  Check your email
                </h4>
                <p className="text-[#667085] text-sm mb-4">
                  We've sent a password reset link to your email address. Click
                  the link to reset your password.
                </p>
                <button
                  onClick={closeForgotPassword}
                  className="w-full py-2 px-4 bg-[#1342ff] text-white rounded-lg hover:bg-[#2313ff] transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-[#667085] text-sm mb-4">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>

                {resetError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{resetError}</p>
                  </div>
                )}

                <form>
                  <div className="mb-4">
                    <label className="block text-[#101828] text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-[#eaecf0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1342ff] disabled:opacity-60"
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={closeForgotPassword}
                      className="flex-1 py-2 px-4 border border-[#eaecf0] text-[#667085] rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-[#1342ff] text-white rounded-lg hover:bg-[#2313ff] disabled:opacity-60 transition-colors duration-200"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SigninForm;
