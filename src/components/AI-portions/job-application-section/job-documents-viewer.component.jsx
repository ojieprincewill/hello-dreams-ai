import React, { useRef, useState } from "react";
import {
  XMarkIcon,
  PrinterIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  TrophyIcon,
  LanguageIcon,
  FolderIcon,
  StarIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

// ── Resume renderer ───────────────────────────────────────────────────────────

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#eaecf0] dark:border-[#3d3d3d]">
      <Icon className="w-4 h-4 text-[#1342ff] shrink-0" />
      <h3 className="text-sm font-bold text-[#010413] dark:text-white uppercase tracking-wider break-words">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const ResumeView = ({ resume }) => {
  if (!resume)
    return (
      <p className="text-[#667085] dark:text-gray-400 text-sm">
        No resume data.
      </p>
    );

  const c = resume.contactInfo ?? {};

  return (
    <div className="text-sm text-[#010413] dark:text-white space-y-1">
      {/* Header */}
      <div className="text-center mb-5 pb-4 border-b border-[#eaecf0] dark:border-[#3d3d3d]">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold break-words">
          {c.fullName ?? "—"}
        </h2>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 mt-2 text-xs text-[#667085] dark:text-gray-400">
          {c.email && (
            <span className="flex items-center gap-1 break-all text-center">
              <EnvelopeIcon className="w-3 h-3 shrink-0" />
              {c.email}
            </span>
          )}
          {c.phone && (
            <span className="flex items-center gap-1 break-all text-center">
              <PhoneIcon className="w-3 h-3 shrink-0" />
              {c.phone}
            </span>
          )}
          {c.location && (
            <span className="flex items-center gap-1 break-all text-center">
              <MapPinIcon className="w-3 h-3 shrink-0" />
              {c.location}
            </span>
          )}
          {c.linkedIn && (
            <span className="flex items-center gap-1 break-all text-center">
              <LinkIcon className="w-3 h-3 shrink-0" />
              {c.linkedIn}
            </span>
          )}
          {c.github && (
            <span className="flex items-center gap-1 break-all text-center">
              <LinkIcon className="w-3 h-3 shrink-0" />
              {c.github}
            </span>
          )}
          {c.portfolio && (
            <span className="flex items-center gap-1 break-all text-center">
              <LinkIcon className="w-3 h-3 shrink-0" />
              {c.portfolio}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <Section icon={UserIcon} title="Professional Summary">
          <p className="text-sm leading-relaxed text-[#374151] dark:text-gray-300">
            {resume.summary}
          </p>
        </Section>
      )}

      {/* Work Experience */}
      {resume.workExperience?.length > 0 && (
        <Section icon={BriefcaseIcon} title="Work Experience">
          {resume.workExperience.map((job, i) => (
            <div key={i} className="mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <div>
                  <p className="font-semibold text-[#010413] dark:text-white break-words">
                    {job.jobTitle}
                  </p>
                  <p className="text-[#667085] dark:text-gray-400 text-xs break-words">
                    {job.company}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                </div>
                <p className="text-xs text-[#667085] dark:text-gray-400 shrink-0 sm:ml-2">
                  {job.startDate}
                  {job.endDate ? ` – ${job.endDate}` : " – Present"}
                </p>
              </div>
              {job.responsibilities?.length > 0 && (
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-[#374151] dark:text-gray-300">
                  {job.responsibilities.map((r, j) => (
                    <li key={j} className="text-xs">
                      {r}
                    </li>
                  ))}
                </ul>
              )}
              {job.achievements?.length > 0 && (
                <ul className="mt-1 space-y-1 list-disc list-inside text-[#374151] dark:text-gray-300">
                  {job.achievements.map((a, j) => (
                    <li key={j} className="text-xs">
                      🏆 {a}
                    </li>
                  ))}
                </ul>
              )}
              {job.tools?.length > 0 && (
                <p className="mt-1 text-xs text-[#667085] dark:text-gray-400">
                  <span className="font-medium">Tools:</span>{" "}
                  {job.tools.join(", ")}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <Section icon={AcademicCapIcon} title="Education">
          {resume.education.map((ed, i) => (
            <div
              key={i}
              className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1"
            >
              <div>
                <p className="font-medium break-words">{ed.degree}</p>
                <p className="text-xs text-[#667085] dark:text-gray-400 break-words">
                  {ed.institution}
                </p>
                {ed.honors && (
                  <p className="text-xs text-[#667085] dark:text-gray-400 break-words">
                    {ed.honors}
                  </p>
                )}
              </div>
              {ed.graduationYear && (
                <p className="text-xs text-[#667085] dark:text-gray-400 shrink-0 sm:ml-2">
                  {ed.graduationYear}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {resume.skills && (
        <Section icon={WrenchScrewdriverIcon} title="Skills">
          {resume.skills.technical?.length > 0 && (
            <p className="text-xs mb-1 break-words leading-relaxed">
              <span className="font-medium">Technical: </span>
              {resume.skills.technical.join(" · ")}
            </p>
          )}
          {resume.skills.tools?.length > 0 && (
            <p className="text-xs mb-1 break-words leading-relaxed">
              <span className="font-medium">Tools: </span>
              {resume.skills.tools.join(" · ")}
            </p>
          )}
          {resume.skills.soft?.length > 0 && (
            <p className="text-xs break-words leading-relaxed">
              <span className="font-medium">Soft skills: </span>
              {resume.skills.soft.join(" · ")}
            </p>
          )}
        </Section>
      )}

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <Section icon={StarIcon} title="Certifications">
          {resume.certifications.map((cert, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-xs mb-2 gap-1"
            >
              <span className="font-medium break-words">
                {cert.name}
                {cert.issuingOrganization
                  ? ` — ${cert.issuingOrganization}`
                  : ""}
              </span>
              {cert.date && (
                <span className="text-[#667085] dark:text-gray-400 shrink-0 sm:ml-2">
                  {cert.date}
                </span>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <Section icon={FolderIcon} title="Projects">
          {resume.projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <p className="font-medium text-xs">{proj.name}</p>
              {proj.description && (
                <p className="text-xs text-[#374151] dark:text-gray-300 break-words leading-relaxed">
                  {proj.description}
                </p>
              )}
              {proj.technologies?.length > 0 && (
                <p className="text-xs text-[#667085] dark:text-gray-400 break-words leading-relaxed">
                  {proj.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Achievements */}
      {resume.achievements?.length > 0 && (
        <Section icon={TrophyIcon} title="Achievements">
          {resume.achievements.map((ach, i) => (
            <div key={i} className="mb-1">
              <p className="font-medium text-xs">{ach.title}</p>
              {ach.description && (
                <p className="text-xs text-[#374151] dark:text-gray-300 break-words leading-relaxed">
                  {ach.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Languages */}
      {resume.languages?.length > 0 && (
        <Section icon={LanguageIcon} title="Languages">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {resume.languages.map((lang, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 sm:px-2 sm:py-0.5 bg-[#f0f4ff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff] rounded-full break-words leading-tight"
              >
                {lang.language}
                {lang.proficiency ? ` (${lang.proficiency})` : ""}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

// ── Cover letter renderer ─────────────────────────────────────────────────────

const CoverLetterView = ({ coverLetter }) => {
  if (!coverLetter)
    return (
      <p className="text-[#667085] dark:text-gray-400 text-sm">
        No cover letter data.
      </p>
    );

  return (
    <div className="text-sm text-[#010413] dark:text-white leading-relaxed space-y-4 max-w-2xl mx-auto w-full">
      <div className="text-right text-xs text-[#667085] dark:text-gray-400">
        {coverLetter.date
          ? new Date(coverLetter.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : ""}
      </div>

      {(coverLetter.recipientName ||
        coverLetter.recipientTitle ||
        coverLetter.companyName) && (
        <div className="text-sm text-[#374151] dark:text-gray-300 space-y-0.5 sm:space-y-1">
          {coverLetter.recipientName && (
            <p className="font-semibold">{coverLetter.recipientName}</p>
          )}
          {coverLetter.recipientTitle && <p>{coverLetter.recipientTitle}</p>}
          {coverLetter.companyName && <p>{coverLetter.companyName}</p>}
        </div>
      )}

      {coverLetter.subject && (
        <p className="font-semibold text-[#010413] dark:text-white text-base sm:text-lg">
          Re: {coverLetter.subject}
        </p>
      )}

      {coverLetter.body && (
        <div className="whitespace-pre-line text-[#374151] dark:text-gray-300 leading-7 sm:leading-8">
          {coverLetter.body}
        </div>
      )}

      {coverLetter.closing && (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-[#374151] dark:text-gray-300">
            {coverLetter.closing}
          </p>
          {coverLetter.senderName && (
            <p className="font-semibold">{coverLetter.senderName}</p>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main viewer modal ─────────────────────────────────────────────────────────

const JobDocumentsViewer = ({ application, onClose }) => {
  const [activeTab, setActiveTab] = useState("resume");
  const printRef = useRef(null);

  if (!application) return null;

  const resume = application.generatedResumeContent;
  const coverLetter = application.generatedCoverLetterContent;
  const jobTitle = application.jobListing?.title ?? "Job";
  const company = application.jobListing?.company ?? "";

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>${activeTab === "resume" ? "Resume" : "Cover Letter"} — ${jobTitle}${company ? " @ " + company : ""}</title>
          <style>
            body { font-family: 'Georgia', serif; margin: 40px; color: #111; line-height: 1.6; font-size: 13px; }
            h2 { font-size: 20px; margin-bottom: 4px; }
            h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 8px; color: #444; }
            .contact { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; color: #555; margin-bottom: 16px; }
            ul { margin: 4px 0; padding-left: 16px; }
            li { margin-bottom: 2px; }
            p { margin: 4px 0; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div
        className="bg-white dark:bg-[#1e1e1e] rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
        style={{ fontFamily: "Darker Grotesque, sans-serif" }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-b border-[#eaecf0] dark:border-[#3d3d3d] shrink-0">
          <div>
            <h2 className="font-bold text-[#010413] dark:text-white text-sm sm:text-base">
              Generated Documents
            </h2>
            <p className="text-[11px] sm:text-xs text-[#667085] dark:text-gray-400 mt-0.5">
              {jobTitle}
              {company ? ` @ ${company}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#eaecf0] dark:border-[#3d3d3d] text-[#010413] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors"
            >
              <PrinterIcon className="w-3.5 h-3.5" />
              Print / PDF
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-[#667085] dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 sm:px-6 pt-3 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("resume")}
            className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "resume"
                ? "bg-[#1342ff] text-white"
                : "text-[#667085] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]"
            }`}
          >
            <DocumentTextIcon className="w-4 h-4" />
            Resume
          </button>

          <button
            onClick={() => setActiveTab("coverletter")}
            className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "coverletter"
                ? "bg-[#1342ff] text-white"
                : "text-[#667085] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]"
            }`}
          >
            <DocumentTextIcon className="w-4 h-4" />
            Cover Letter
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-5"
          ref={printRef}
        >
          {activeTab === "resume" ? (
            <ResumeView resume={resume} />
          ) : (
            <CoverLetterView coverLetter={coverLetter} />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDocumentsViewer;
