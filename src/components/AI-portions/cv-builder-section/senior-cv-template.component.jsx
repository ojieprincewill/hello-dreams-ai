import React from "react";

const SeniorCVTemplate = ({ data }) => {
  const {
    name,
    title,
    contact,
    summary,
    experience,
    education,
    toolsSkills,
    achievements,
  } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black font-sans">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-lg font-semibold">{title}</p>
        <div className="mt-2 text-sm space-y-1">
          <p>
            {contact.phone} | {contact.email}
          </p>
          <p>{contact.location}</p>
          <p>
            <a href={contact.linkedin}>LinkedIn</a> |{" "}
            <a href={contact.behance}>Behance</a> |{" "}
            <a href={contact.portfolio}>Portfolio</a>
          </p>
        </div>
      </div>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Professional Summary</h2>
        <p className="text-sm leading-relaxed">{summary}</p>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Experience</h2>
        {experience.map((role, idx) => (
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
        ))}
      </section>

      {/* Education & Certifications */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Education & Certifications</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {education.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Tools & Skills */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Tools & Skills</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Object.entries(toolsSkills).map(([category, items], idx) => (
            <div key={idx}>
              <p className="font-semibold">{category}</p>
              <ul className="list-disc pl-5 space-y-1">
                {items.map((tool, i) => (
                  <li key={i}>{tool}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Key Achievements */}
      <section>
        <h2 className="text-xl font-bold mb-2">Key Achievements</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {achievements.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SeniorCVTemplate;
