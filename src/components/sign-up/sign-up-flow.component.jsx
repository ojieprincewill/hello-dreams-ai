import React, { useState } from "react";
import SignUpForm from "./sign-up-form.component";
import CreatePassword from "./create-password.component";
import VerifyAccount from "./verify-account.component";
import SignUpSuccess from "./sign-up-success.component";

const SignUpFlow = () => {
  // 0: SignUpForm, 1: CreatePassword, 2: VerifyAccount, 3: SignUpSuccess
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const handleContinue = (options = {}) => {
    setStep((s) => s + 1);
    if (options.justRegistered) {
      setFormData((prev) => ({ ...prev, justRegistered: true }));
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  return (
    <div className="bg-[#f6f6f8]">
      {step === 0 && (
        <SignUpForm
          onContinue={handleContinue}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 1 && (
        <CreatePassword
          onContinue={handleContinue}
          onBack={handleBack}
          formData={formData}
          setFormData={setFormData}
          isLoading
          error
        />
      )}
      {step === 2 && (
        <VerifyAccount
          onContinue={handleContinue}
          onBack={handleBack}
          formData={formData}
        />
      )}
      {step === 3 && <SignUpSuccess formData={formData} />}
    </div>
  );
};

export default SignUpFlow;
