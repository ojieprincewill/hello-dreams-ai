import React, { useState } from "react";

const DocumentPreview = ({
  document,
  onGenerate,
  onRefresh,
  onUpdate,
  onPatch,
  onDelete,
}) => {
  const [localEdit, setLocalEdit] = useState("");

  if (!document) {
    return (
      <div className="p-4 md:p-6 border rounded-lg bg-gray-50 dark:bg-[#1a1a1a] h-full flex flex-col justify-center items-center text-center">
        <p className="text-base md:text-lg mb-4 text-gray-500">
          No document generated yet
        </p>

        <button
          onClick={onGenerate}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Generate Document
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 border rounded-lg bg-gray-50 dark:bg-[#1a1a1a] h-full flex flex-col">
      <h3 className="text-base md:text-lg font-bold mb-4">
        Generated Document
      </h3>

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto border rounded p-3 md:p-4 bg-white dark:bg-[#121212]">
        <pre className="whitespace-pre-wrap break-words text-[13px] md:text-[15px] leading-relaxed">
          {document.content || JSON.stringify(document, null, 2)}
        </pre>
      </div>

      {/* Quick Edit */}
      <textarea
        placeholder="Quick edit (patch document)..."
        value={localEdit}
        onChange={(e) => setLocalEdit(e.target.value)}
        className="
    mt-4
    w-full
    min-h-[100px]
    md:min-h-[120px]
    border
    rounded
    p-3
    text-sm
    dark:bg-[#1f1f1f]
    resize-y
  "
      />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mt-4">
        <button
          onClick={onRefresh}
          className="w-full sm:w-auto
  px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>

        <button
          onClick={() =>
            onPatch({ content: localEdit || "Updated content..." })
          }
          className="w-full sm:w-auto
  px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Patch
        </button>

        <button
          onClick={() => onUpdate(document)}
          className="w-full sm:w-auto
  px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Save (PUT)
        </button>

        <button
          onClick={onDelete}
          className="w-full sm:w-auto
  px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DocumentPreview;
