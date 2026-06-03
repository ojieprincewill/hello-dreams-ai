import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import CoverLetterTemplate from "./cover-letter-template.component";
import { useAuth } from "../../../auth/authContext";

const CoverLetterPreview = ({ document: doc }) => {
  const { user } = useAuth();
  const printRef = useRef();

  // Try multiple fields — backend may store name as `name`, `firstName`+`lastName`, etc.
  const userName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "";

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Cover Letter",
  });

  return (
    <div className="px-3 py-4 md:p-6">
      {/* Printable area */}
      <div
        ref={printRef}
        className="border rounded-lg shadow bg-white overflow-x-auto"
      >
        <CoverLetterTemplate
          document={doc}
          userName={userName}
          userEmail={user?.email || ""}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
        <button
          onClick={handlePrint}
          className="
  w-full sm:w-auto
  px-6 py-3
  bg-blue-600
  text-white
  font-bold
  rounded-lg
  hover:bg-blue-700
  transition-colors
"
        >
          Download / Print PDF
        </button>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
