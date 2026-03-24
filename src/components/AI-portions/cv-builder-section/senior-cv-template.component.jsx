import React from "react";
import PropTypes from "prop-types";

const SeniorCVTemplate = ({ data }) => {
  const {
    name,
    title,
    contact = {},
    summary = "",
    experience = [],
    education = [],
    toolsSkills = {},
    achievements = [],
  } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black font-sans">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-lg font-semibold">{title}</p>
        <div className="mt-2 text-sm space-y-1">
          <p>
            {contact.phone || "-"} | {contact.email || "-"}
          </p>
          <p>{contact.location || "-"}</p>
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
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Professional Summary</h2>
        <p className="text-sm leading-relaxed">
          {summary || "No summary provided."}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Experience</h2>
        {experience.length > 0 ? (
          experience.map((role, idx) => (
            <div key={idx} className="mb-4">
              <p className="font-semibold">
                {role.company} — {role.title} ({role.dates})
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {role.bullets?.length ? (
                  role.bullets.map((point, i) => <li key={i}>{point}</li>)
                ) : (
                  <li>No details provided.</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-sm italic">No experience provided yet.</p>
        )}
      </section>

      {/* Education & Certifications */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Education & Certifications</h2>
        {education.length > 0 ? (
          <ul className="list-disc pl-5 text-sm space-y-1">
            {education.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic">No education provided yet.</p>
        )}
      </section>

      {/* Tools & Skills */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Tools & Skills</h2>
        {Object.keys(toolsSkills).length > 0 ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(toolsSkills).map(([category, items], idx) => (
              <div key={idx}>
                <p className="font-semibold">{category}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {items.length > 0 ? (
                    items.map((tool, i) => <li key={i}>{tool}</li>)
                  ) : (
                    <li>No tools listed.</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic">No tools or skills provided yet.</p>
        )}
      </section>

      {/* Key Achievements */}
      <section>
        <h2 className="text-xl font-bold mb-2">Key Achievements</h2>
        {achievements.length > 0 ? (
          <ul className="list-disc pl-5 text-sm space-y-1">
            {achievements.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic">No achievements provided yet.</p>
        )}
      </section>
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
