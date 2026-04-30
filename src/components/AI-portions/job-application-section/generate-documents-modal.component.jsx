import React from "react";
import { SparklesIcon, DocumentTextIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const steps = [
  { label: "Analysing job requirements", icon: SparklesIcon },
  { label: "Tailoring your resume", icon: DocumentTextIcon },
  { label: "Writing cover letter", icon: DocumentTextIcon },
  { label: "Finalising documents", icon: CheckCircleIcon },
];

const GenerateDocumentsModal = ({ isOpen, isGenerating, onClose, result }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        {isGenerating ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2040] flex items-center justify-center mx-auto mb-5 animate-pulse">
              <SparklesIcon className="w-8 h-8 text-[#1342ff]" />
            </div>
            <h3 className="text-lg font-bold text-[#010413] dark:text-white mb-2">
              Generating your documents
            </h3>
            <p className="text-sm text-[#667085] dark:text-gray-400 mb-6">
              Our AI is tailoring your resume and writing a cover letter specifically for this role…
            </p>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f0f4ff] dark:bg-[#1a2040] flex items-center justify-center shrink-0 animate-pulse" style={{ animationDelay: `${i * 300}ms` }}>
                    <step.icon className="w-3.5 h-3.5 text-[#1342ff]" />
                  </div>
                  <span className="text-sm text-[#667085] dark:text-gray-400">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : result ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircleIcon className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-[#010413] dark:text-white mb-2">
              Documents ready!
            </h3>
            <p className="text-sm text-[#667085] dark:text-gray-400 mb-6">
              Your tailored resume and cover letter have been generated. You can now apply!
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f9f9] dark:bg-[#2a2a2a]">
                <DocumentTextIcon className="w-5 h-5 text-[#1342ff]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#010413] dark:text-white">Tailored Resume</p>
                  <p className="text-xs text-[#667085] dark:text-gray-400">Optimised for this role</p>
                </div>
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 ml-auto" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f9f9f9] dark:bg-[#2a2a2a]">
                <DocumentTextIcon className="w-5 h-5 text-[#1342ff]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#010413] dark:text-white">Cover Letter</p>
                  <p className="text-xs text-[#667085] dark:text-gray-400">Company-specific</p>
                </div>
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 ml-auto" />
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-5 w-full py-2.5 bg-[#1342ff] hover:bg-[#0f35d9] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GenerateDocumentsModal;
