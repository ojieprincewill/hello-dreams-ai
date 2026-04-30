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
      <Icon className="w-4 h-4 text-[#1342ff]" />
      <h3 className="text-sm font-bold text-[#010413] dark:text-white uppercase tracking-wider">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const ResumeView = ({ resume }) => {
  if (!resume) return <p className="text-[#667085] dark:text-gray-400 text-sm">No resume data.</p>;

  const c = resume.contactInfo ?? {};

  return (
    <div className="text-sm text-[#010413] dark:text-white space-y-1">
      {/* Header */}
      <div className="text-center mb-5 pb-4 border-b border-[#eaecf0] dark:border-[#3d3d3d]">
        <h2 className="text-xl font-bold">{c.fullName ?? "—"}</h2>
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs text-[#667085] dark:text-gray-400">
          {c.email && <span className="flex items-center gap-1"><EnvelopeIcon className="w-3 h-3" />{c.email}</span>}
          {c.phone && <span className="flex items-center gap-1"><PhoneIcon className="w-3 h-3" />{c.phone}</span>}
          {c.location && <span className="flex items-center gap-1"><MapPinIcon className="w-3 h-3" />{c.location}</span>}
          {c.linkedIn && <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3" />{c.linkedIn}</span>}
          {c.github && <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3" />{c.github}</span>}
          {c.portfolio && <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3" />{c.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <Section icon={UserIcon} title="Professional Summary">
          <p className="text-sm leading-relaxed text-[#374151] dark:text-gray-300">{resume.summary}</p>
        </Section>
      )}

      {/* Work Experience */}
      {resume.workExperience?.length > 0 && (
        <Section icon={BriefcaseIcon} title="Work Experience">
          {resume.workExperience.map((job, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-[#010413] dark:text-white">{job.jobTitle}</p>
                  <p className="text-[#667085] dark:text-gray-400 text-xs">{job.company}{job.location ? ` · ${job.location}` : ""}</p>
                </div>
                <p className="text-xs text-[#667085] dark:text-gray-400 shrink-0 ml-2">
                  {job.startDate}{job.endDate ? ` – ${job.endDate}` : " – Present"}
                </p>
              </div>
              {job.responsibilities?.length > 0 && (
                <ul className="mt-1.5 space-y-0.5 list-disc list-inside text-[#374151] dark:text-gray-300">
                  {job.responsibilities.map((r, j) => <li key={j} className="text-xs">{r}</li>)}
                </ul>
              )}
              {job.achievements?.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-inside text-[#374151] dark:text-gray-300">
                  {job.achievements.map((a, j) => <li key={j} className="text-xs">🏆 {a}</li>)}
                </ul>
              )}
              {job.tools?.length > 0 && (
                <p className="mt-1 text-xs text-[#667085] dark:text-gray-400"><span className="font-medium">Tools:</span> {job.tools.join(", ")}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <Section icon={AcademicCapIcon} title="Education">
          {resume.education.map((ed, i) => (
            <div key={i} className="mb-2 flex justify-between items-start">
              <div>
                <p className="font-medium">{ed.degree}</p>
                <p className="text-xs text-[#667085] dark:text-gray-400">{ed.institution}</p>
                {ed.honors && <p className="text-xs text-[#667085] dark:text-gray-400">{ed.honors}</p>}
              </div>
              {ed.graduationYear && <p className="text-xs text-[#667085] dark:text-gray-400 shrink-0 ml-2">{ed.graduationYear}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {resume.skills && (
        <Section icon={WrenchScrewdriverIcon} title="Skills">
          {resume.skills.technical?.length > 0 && (
            <p className="text-xs mb-1"><span className="font-medium">Technical: </span>{resume.skills.technical.join(" · ")}</p>
          )}
          {resume.skills.tools?.length > 0 && (
            <p className="text-xs mb-1"><span className="font-medium">Tools: </span>{resume.skills.tools.join(" · ")}</p>
          )}
          {resume.skills.soft?.length > 0 && (
            <p className="text-xs"><span className="font-medium">Soft skills: </span>{resume.skills.soft.join(" · ")}</p>
          )}
        </Section>
      )}

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <Section icon={StarIcon} title="Certifications">
          {resume.certifications.map((cert, i) => (
            <div key={i} className="flex justify-between text-xs mb-1">
              <span className="font-medium">{cert.name}{cert.issuingOrganization ? ` — ${cert.issuingOrganization}` : ""}</span>
              {cert.date && <span className="text-[#667085] dark:text-gray-400">{cert.date}</span>}
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <Section icon={FolderIcon} title="Projects">
          {resume.projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <p className="font-medium text-xs">{proj.name}</p>
              {proj.description && <p className="text-xs text-[#374151] dark:text-gray-300">{proj.description}</p>}
              {proj.technologies?.length > 0 && <p className="text-xs text-[#667085] dark:text-gray-400">{proj.technologies.join(", ")}</p>}
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
              {ach.description && <p className="text-xs text-[#374151] dark:text-gray-300">{ach.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Languages */}
      {resume.languages?.length > 0 && (
        <Section icon={LanguageIcon} title="Languages">
          <div className="flex flex-wrap gap-2">
            {resume.languages.map((lang, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-[#f0f4ff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff] rounded-full">
                {lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ""}
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
  if (!coverLetter) return <p className="text-[#667085] dark:text-gray-400 text-sm">No cover letter data.</p>;

  return (
    <div className="text-sm text-[#010413] dark:text-white leading-relaxed space-y-4 max-w-2xl mx-auto">
      <div className="text-right text-xs text-[#667085] dark:text-gray-400">
        {coverLetter.date ? new Date(coverLetter.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}
      </div>

      {(coverLetter.recipientName || coverLetter.recipientTitle || coverLetter.companyName) && (
        <div className="text-sm text-[#374151] dark:text-gray-300 space-y-0.5">
          {coverLetter.recipientName && <p className="font-semibold">{coverLetter.recipientName}</p>}
          {coverLetter.recipientTitle && <p>{coverLetter.recipientTitle}</p>}
          {coverLetter.companyName && <p>{coverLetter.companyName}</p>}
        </div>
      )}

      {coverLetter.subject && (
        <p className="font-semibold text-[#010413] dark:text-white">
          Re: {coverLetter.subject}
        </p>
      )}

      {coverLetter.body && (
        <div className="whitespace-pre-line text-[#374151] dark:text-gray-300 leading-7">
          {coverLetter.body}
        </div>
      )}

      {coverLetter.closing && (
        <div className="space-y-4">
          <p className="text-[#374151] dark:text-gray-300">{coverLetter.closing}</p>
          {coverLetter.senderName && <p className="font-semibold">{coverLetter.senderName}</p>}
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" style={{ fontFamily: "Darker Grotesque, sans-serif" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0] dark:border-[#3d3d3d] shrink-0">
          <div>
            <h2 className="font-bold text-[#010413] dark:text-white text-base">
              Generated Documents
            </h2>
            <p className="text-xs text-[#667085] dark:text-gray-400 mt-0.5">
              {jobTitle}{company ? ` @ ${company}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#eaecf0] dark:border-[#3d3d3d] text-[#010413] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors"
            >
              <PrinterIcon className="w-3.5 h-3.5" />
              Print / Save PDF
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
        <div className="flex gap-1 px-6 pt-3 shrink-0">
          <button
            onClick={() => setActiveTab("resume")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "resume"
                ? "bg-[#1342ff] text-white"
                : "text-[#667085] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]"
            }`}
          >
            <DocumentTextIcon className="w-4 h-4" /> Tailored Resume
          </button>
          <button
            onClick={() => setActiveTab("coverletter")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "coverletter"
                ? "bg-[#1342ff] text-white"
                : "text-[#667085] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]"
            }`}
          >
            <DocumentTextIcon className="w-4 h-4" /> Cover Letter
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5" ref={printRef}>
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
