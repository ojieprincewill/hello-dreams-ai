import React from "react";

/**
 * Replaces common placeholder strings with real user data.
 * Handles both bracketed [Your Name] and unbracketed "Your Name" signature lines.
 */
const fillPlaceholders = (text, name, email) => {
  if (!text || typeof text !== "string") return "";
  let result = text
    .replace(/\[Your Name\]/gi, name || "")
    .replace(/\[Your Email\]/gi, email || "")
    .replace(/\[Your Phone(?: Number)?\]/gi, "")
    .replace(/\[Your Address\]/gi, "")
    .replace(/\[Your Location\]/gi, "")
    .replace(/\[Your Title\]/gi, "")
    .replace(/\[Your LinkedIn\]/gi, "");

  // Handle unbracketed "Your Name" that appears alone on a line (e.g. signature blocks)
  if (name) {
    result = result.replace(/^Your Name\s*$/gm, name);
  }

  return result;
};

/**
 * Extracts sender contact info from multiple possible locations in the backend response.
 * Backend shape: { content: { meta: { sender: { name, email, phone, location } }, sections, closing } }
 * Fallbacks: content.contact, content.name, content.email
 */
const extractSender = (doc) => {
  const content = doc?.content || {};
  const meta = content.meta || {};
  const sender = meta.sender || meta.contact || content.contact || {};
  return {
    name: sender.name || sender.fullName || content.name || "",
    email: sender.email || content.email || "",
    phone: sender.phone || "",
    location: sender.location || "",
  };
};

/**
 * Renders a single paragraph string as one or more <p> elements.
 * Splits on double-newlines (paragraph breaks) and handles single newlines with <br />.
 */
const ParagraphBlock = ({ text, fill, baseKey }) => {
  const filled = fill(text);
  const chunks = filled
    .split(/\n\n+/)
    .map((c) => c.trim())
    .filter(Boolean);

  return chunks.map((chunk, k) => (
    <p key={`${baseKey}-${k}`} className="mb-4">
      {chunk.split(/\n/).map((line, l) =>
        l === 0 ? line : <React.Fragment key={l}><br />{line}</React.Fragment>
      )}
    </p>
  ));
};

const CoverLetterTemplate = ({ document: doc, userName, userEmail }) => {
  const sender = extractSender(doc);
  const content = doc?.content || {};

  // Prefer document-embedded data, fall back to auth user
  const displayName = sender.name || userName || "";
  const displayEmail = sender.email || userEmail || "";
  const displayPhone = sender.phone || "";
  const displayLocation = sender.location || "";

  const fill = (text) => fillPlaceholders(text, displayName, displayEmail);

  const sections = content.sections || [];
  const rawClosing = content.closing;
  const closing = typeof rawClosing === "string"
    ? fill(rawClosing)
    : fill(rawClosing?.signoff || "");

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
          {/* Skip the generic "Cover Letter" heading — it's decorative */}
          {section.heading && section.heading.toLowerCase() !== "cover letter" && (
            <h3 className="font-semibold mb-2">{section.heading}</h3>
          )}

          {/* Each paragraph string is split on \n\n so multi-paragraph blobs render correctly */}
          {(section.paragraphs || []).flatMap((para, j) => (
            <ParagraphBlock key={j} text={para} fill={fill} baseKey={`${i}-${j}`} />
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
