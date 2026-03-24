import React from "react";
import PropTypes from "prop-types";

const JuniorCVTemplate = ({ data }) => {
  const {
    name,
    title,
    contact = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    achievements = [],
  } = data;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-black font-sans">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-base font-semibold">{title}</p>
        <div className="mt-2 text-sm space-y-1">
          <p>
            {contact.phone || "-"} | {contact.email || "-"}
          </p>
          <p>{contact.location || "-"}</p>
          {contact.linkedin && (
            <p>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">Professional Summary</h2>
        <p className="text-sm leading-relaxed">{summary}</p>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">Experience</h2>
        {experience.length > 0 ? (
          experience.map((role, idx) => (
            <div key={idx} className="mb-4">
              <p className="font-semibold">
                {role.company} — {role.title} ({role.dates})
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {role.bullets.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-sm italic">No experience provided yet.</p>
        )}
      </section>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">Education</h2>
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

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">Skills</h2>
        {skills.length > 0 ? (
          <ul className="list-disc pl-5 text-sm space-y-1">
            {skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic">No skills provided yet.</p>
        )}
      </section>

      {/* Achievements */}
      <section>
        <h2 className="text-lg font-bold mb-2">Key Achievements</h2>
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
JuniorCVTemplate.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    contact: PropTypes.shape({
      phone: PropTypes.string,
      email: PropTypes.string,
      location: PropTypes.string,
      linkedin: PropTypes.string,
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
    skills: PropTypes.arrayOf(PropTypes.string),
    achievements: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default JuniorCVTemplate;
