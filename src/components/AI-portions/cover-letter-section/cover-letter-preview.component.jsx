import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import CoverLetterTemplate from "./cover-letter-template.component";
import { useAuth } from "../../../auth/authContext";

const CoverLetterPreview = ({ document: doc }) => {
  const { user } = useAuth();
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Cover Letter",
  });

  return (
    <div className="p-6">
      {/* Printable area */}
      <div ref={printRef} className="border rounded-lg shadow bg-white">
        <CoverLetterTemplate
          document={doc}
          userName={user?.name || ""}
          userEmail={user?.email || ""}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download / Print PDF
        </button>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
