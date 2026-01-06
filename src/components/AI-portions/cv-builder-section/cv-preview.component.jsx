import React, { useRef } from "react";
import SeniorCVTemplate from "./senior-cv-template.component";
import JuniorCVTemplate from "./junior-cv-template.component";
import { useReactToPrint } from "react-to-print";

const CVPreview = ({ type, data }) => {
  const componentRef = useRef();

  // Frontend PDF export
  const handleDownloadPDF = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${data.name}-CV`,
  });

  // Backend DOCX export (placeholder API call)
  const handleDownloadDOCX = async () => {
    try {
      const response = await fetch("/api/export-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });

      if (!response.ok) throw new Error("Failed to generate DOCX");

      // Convert response to blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.name}-CV.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Error generating DOCX. Please try again later.");
    }
  };

  return (
    <div className="p-6">
      {/* Preview */}
      <div ref={componentRef} className="border rounded-lg shadow bg-white p-6">
        {type === "senior" ? (
          <SeniorCVTemplate data={data} />
        ) : (
          <JuniorCVTemplate data={data} />
        )}
      </div>

      {/* Download Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download as PDF
        </button>
        <button
          onClick={handleDownloadDOCX}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
        >
          Download as DOCX
        </button>
      </div>
    </div>
  );
};

export default CVPreview;
