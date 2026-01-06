import React from "react";

const JuniorCVTemplate = ({ data }) => {
  const {
    name,
    title,
    contact,
    summary,
    experience,
    education,
    skills,
    achievements,
  } = data;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-black font-sans">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-base font-semibold">{title}</p>
        <div className="mt-2 text-sm space-y-1">
          <p>
            {contact.phone} | {contact.email}
          </p>
          <p>{contact.location}</p>
          {contact.linkedin && (
            <p>
              <a href={contact.linkedin}>LinkedIn</a>
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

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">Education</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {education.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">Skills</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {skills.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="text-lg font-bold mb-2">Key Achievements</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {achievements.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default JuniorCVTemplate;
