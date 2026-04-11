import React from "react";

/**
 * Replaces common placeholder strings with real user data.
 */
const fillPlaceholders = (text, name, email) => {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/\[Your Name\]/gi, name || "")
    .replace(/\[Your Email\]/gi, email || "")
    .replace(/\[Your Phone(?: Number)?\]/gi, "")
    .replace(/\[Your Address\]/gi, "")
    .replace(/\[Your Location\]/gi, "")
    .replace(/\[Your Title\]/gi, "")
    .replace(/\[Your LinkedIn\]/gi, "");
};

/**
 * Extracts sender info from the document's StructuredDocumentJson.
 * Backend shape: { content: { meta: { sender: { name, email, phone, location } }, sections, closing } }
 */
const extractSender = (doc) => {
  const content = doc?.content || {};
  const meta = content.meta || {};
  const sender = meta.sender || meta.contact || content.contact || {};
  return {
    name: sender.name || sender.fullName || "",
    email: sender.email || "",
    phone: sender.phone || "",
    location: sender.location || "",
  };
};

const CoverLetterTemplate = ({ document: doc, userName, userEmail }) => {
  const sender = extractSender(doc);
  const content = doc?.content || {};

  // Prefer document data, fall back to auth user
  const displayName = sender.name || userName || "";
  const displayEmail = sender.email || userEmail || "";
  const displayPhone = sender.phone || "";
  const displayLocation = sender.location || "";

  const fill = (text) => fillPlaceholders(text, displayName, displayEmail);

  const sections = content.sections || [];
  const closing = fill(content.closing || "");

  const today = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white text-black font-sans text-[14px] leading-[1.8]">
      {/* Sender block */}
      <div className="mb-6">
        {displayName && (
          <p className="font-bold text-[16px]">{displayName}</p>
        )}
        {displayEmail && <p>{displayEmail}</p>}
        {displayPhone && <p>{displayPhone}</p>}
        {displayLocation && <p>{displayLocation}</p>}
      </div>

      {/* Date */}
      <p className="mb-8">{today}</p>

      {/* Body sections */}
      {sections.map((section, i) => (
        <div key={i} className="mb-4">
          {/* Skip the top-level "Cover Letter" heading — it's decorative */}
          {section.heading && section.heading.toLowerCase() !== "cover letter" && (
            <h3 className="font-semibold mb-2">{section.heading}</h3>
          )}
          {(section.paragraphs || []).map((para, j) => (
            <p key={j} className="mb-4">
              {fill(para)}
            </p>
          ))}
          {(section.bullets || []).map((bullet, j) => (
            <p key={j} className="mb-2 pl-4">
              &bull; {fill(bullet)}
            </p>
          ))}
        </div>
      ))}

      {/* Closing line */}
      {closing && <p className="mt-4 mb-8">{closing}</p>}

      {/* Signature */}
      {displayName && (
        <p className="mt-10 font-semibold">{displayName}</p>
      )}
    </div>
  );
};

export default CoverLetterTemplate;
