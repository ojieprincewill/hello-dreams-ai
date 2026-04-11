import React from "react";
import PropTypes from "prop-types";

function normalizeSeniorContact(data = {}) {
  const c = data.contact && typeof data.contact === "object" ? data.contact : {};
  return {
    phone: c.phone ?? data.phone ?? "",
    email: c.email ?? data.email ?? "",
    location: c.location ?? data.location ?? "",
    linkedin: c.linkedin ?? data.linkedin ?? "#",
    behance: c.behance ?? data.behance ?? "#",
    portfolio: c.portfolio ?? data.portfolio ?? "#",
  };
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

const SeniorCVTemplate = ({ data = {} }) => {
  const contact = normalizeSeniorContact(data);
  const {
    name = "",
    title = "",
    summary = "",
    experience,
    education,
    toolsSkills,
    achievements,
  } = data;

  const experienceList = asArray(experience);
  const educationList = asArray(education);
  const achievementsList = asArray(achievements);
  const toolsSkillsObj =
    toolsSkills && typeof toolsSkills === "object" && !Array.isArray(toolsSkills)
      ? toolsSkills
      : {};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black font-sans">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-lg font-semibold">{title}</p>
        <div className="mt-2 text-sm space-y-1">
          {(contact.phone || contact.email) && (
            <p>
              {[contact.phone, contact.email].filter(Boolean).join(" | ")}
            </p>
          )}
          {contact.location && <p>{contact.location}</p>}
          <p className="space-x-2">
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {contact.behance && (
              <a
                href={contact.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Behance
              </a>
            )}
            {contact.portfolio && (
              <a
                href={contact.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Portfolio
              </a>
            )}
          </p>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Tools & Skills */}
      {Object.keys(toolsSkillsObj).length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Tools & Skills</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {Object.entries(toolsSkillsObj).map(([category, items], idx) => (
              <li key={idx}>
                <strong>{category}:</strong> {asArray(items).join(", ")}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Experience */}
      {experienceList.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Experience</h2>
          {experienceList.map((role, idx) => (
            <div key={idx} className="mb-4">
              <p className="font-semibold">
                {role.company} — {role.title} ({role.dates})
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {asArray(role.bullets).map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education & Certifications */}
      {educationList.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2">Education & Certifications</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {educationList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Key Achievements */}
      {achievementsList.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-2">Key Achievements</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {achievementsList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

// ✅ PropTypes validation
SeniorCVTemplate.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    contact: PropTypes.shape({
      phone: PropTypes.string,
      email: PropTypes.string,
      location: PropTypes.string,
      linkedin: PropTypes.string,
      behance: PropTypes.string,
      portfolio: PropTypes.string,
    }),
    summary: PropTypes.string,
    experience: PropTypes.arrayOf(
      PropTypes.shape({
        company: PropTypes.string,
        title: PropTypes.string,
        dates: PropTypes.string,
        bullets: PropTypes.arrayOf(PropTypes.string),
      }),
    ),
    education: PropTypes.arrayOf(PropTypes.string),
    toolsSkills: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    achievements: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default SeniorCVTemplate;
