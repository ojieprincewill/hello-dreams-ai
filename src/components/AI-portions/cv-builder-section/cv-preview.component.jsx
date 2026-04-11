import React, { useRef } from "react";
import PropTypes from "prop-types";
import SeniorCVTemplate from "./senior-cv-template.component";
import JuniorCVTemplate from "./junior-cv-template.component";
import { useReactToPrint } from "react-to-print";

const CVPreview = ({ data }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.name}-CV`,
  });

  return (
    <div className="p-6">
      {/* Preview */}
      <div ref={componentRef} className="border rounded-lg shadow bg-white p-6">
        {data.level === "senior" ? (
          <SeniorCVTemplate data={data} />
        ) : (
          <JuniorCVTemplate data={data} />
        )}
      </div>

      {/* Download Buttons */}
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

CVPreview.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    level: PropTypes.oneOf(["junior", "senior"]).isRequired,
    summary: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    experience: PropTypes.arrayOf(PropTypes.object),
    education: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default CVPreview;
