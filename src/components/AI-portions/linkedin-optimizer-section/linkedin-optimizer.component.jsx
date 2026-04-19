import React, { useState, useEffect, useRef } from "react";
import { Loader2, Sparkles, Pencil, Trash2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useLinkedInProfile,
  useGenerateLinkedInProfile,
  usePatchLinkedInProfile,
  useDeleteLinkedInProfile,
} from "../../../hooks/ai/useLinkedInOptimizer";
import { useResume } from "../../../context/ResumeContext";
import { useDashboardActions } from "../../../context/DashboardActionsContext";
import LoadingSpinner from "../../loading-spinner/loading-spinner.component";

/* ─── Inline editable text area ─── */
const EditableField = ({ value, onSave, multiline = false }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value ?? "");
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="space-y-2">
        {multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            className="w-full border border-[#ccc] dark:border-[#3d3d3d] rounded-lg px-3 py-2 bg-white dark:bg-[#212121] text-[16px] resize-none focus:outline-none focus:ring-1 focus:ring-[#1342ff]"
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full border border-[#ccc] dark:border-[#3d3d3d] rounded-lg px-3 py-2 bg-white dark:bg-[#212121] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#1342ff]"
          />
        )}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#17a34a] hover:bg-[#1a9447] text-white rounded-md text-sm"
          >
            <Check size={14} /> Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1.5 border border-[#ccc] dark:border-[#3d3d3d] rounded-md text-sm"
          >
            <X size={14} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3 group">
      <p className="text-[16px] leading-relaxed flex-1">{value || <span className="italic text-[#999]">Not set</span>}</p>
      <button
        onClick={() => { setDraft(value ?? ""); setEditing(true); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-[#efefef] dark:hover:bg-[#2d2d2d] shrink-0"
        title="Edit"
      >
        <Pencil size={14} />
      </button>
    </div>
  );
};

/* ─── Section card wrapper ─── */
const SectionCard = ({ title, children }) => (
  <div className="bg-[#f6f6f6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-6">
    <h3 className="text-[18px] font-bold mb-4">{title}</h3>
    {children}
  </div>
);

/* ─── Main component ─── */
const LinkedInOptimizer = () => {
  const { data: profile, isLoading } = useLinkedInProfile();
  const generateMutation = useGenerateLinkedInProfile();
  const patchMutation = usePatchLinkedInProfile();
  const deleteMutation = useDeleteLinkedInProfile();

  const { resume, isLoading: resumeLoading, refresh: refreshResume } = useResume();
  const { navigateToConversation } = useDashboardActions();

  // Try to load resume from server once on mount if not in context
  useEffect(() => {
    if (!resume && !resumeLoading) refreshResume();
  }, []); // eslint-disable-line

  // Show one-time toast when we've confirmed there is no resume
  const resumeToastShown = useRef(false);
  useEffect(() => {
    if (resumeLoading || resumeToastShown.current) return;
    if (!resume) {
      resumeToastShown.current = true;
      toast("Complete your CV Builder first so we can generate a personalised LinkedIn profile from your resume.", {
        icon: "ℹ️",
        duration: 6000,
      });
    }
  }, [resume, resumeLoading]);

  const handlePatch = (field, value) => {
    patchMutation.mutate({ [field]: value });
  };

  const selectedHeadline =
    profile?.headline?.selected ??
    profile?.headline?.options?.[0] ??
    null;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="px-[5%] py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6" />
          <div>
            <h2 className="text-[24px] font-extrabold">LinkedIn Optimiser</h2>
            <p className="text-[20px]">
              AI-generated LinkedIn profile built from your resume
            </p>
          </div>
        </div>
        {profile && (
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950 text-sm"
          >
            <Trash2 size={14} />
            {deleteMutation.isPending ? "Deleting..." : "Delete Profile"}
          </button>
        )}
      </div>

      {/* No profile yet */}
      {!profile ? (
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="bg-[#f6f6f6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-10 space-y-6">
            <Sparkles className="h-12 w-12 mx-auto text-[#1342ff]" />
            <h3 className="text-[22px] font-bold">
              Generate Your LinkedIn Profile
            </h3>
            <p className="text-[16px] text-[#555] dark:text-[#aaa] leading-relaxed">
              We'll use your resume data to craft an optimised LinkedIn profile
              — including a compelling headline, about section, experience
              bullets, and skills list.
            </p>
            {!resumeLoading && !resume && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-left">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  No resume found. Complete your CV Builder first so we can
                  generate a personalised profile from your actual data.
                </p>
                <button
                  onClick={() => navigateToConversation("cv-builder", null)}
                  className="mt-2 text-sm text-[#1342ff] hover:underline"
                >
                  Go to CV Builder →
                </button>
              </div>
            )}
            <button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-b from-[#1342ff] to-[#ff00e6] text-white font-bold rounded-xl text-[18px] disabled:opacity-60 cursor-pointer"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Generate Profile
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Profile sections */
        <div className="space-y-4">
          {/* Regenerate button */}
          <div className="flex justify-end">
            <button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 border border-[#eaecf0] dark:border-[#2d2d2d] rounded-lg text-sm hover:bg-[#f0f0f0] dark:hover:bg-[#252525]"
            >
              {generateMutation.isPending ? (
                <><Loader2 className="animate-spin" size={14} /> Regenerating...</>
              ) : (
                <><Sparkles size={14} /> Regenerate</>
              )}
            </button>
          </div>

          {/* Headline */}
          <SectionCard title="Headline">
            {profile.headline?.options?.length > 1 ? (
              <div className="space-y-2">
                <p className="text-sm text-[#666] dark:text-[#999] mb-3">
                  Select your preferred headline:
                </p>
                {profile.headline.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      (profile.headline.selected ?? profile.headline.options[0]) === opt
                        ? "border-[#1342ff] bg-blue-50 dark:bg-[#0a1033]"
                        : "border-[#eaecf0] dark:border-[#2d2d2d] hover:border-[#aaa]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="headline"
                      value={opt}
                      checked={(profile.headline.selected ?? profile.headline.options[0]) === opt}
                      onChange={() =>
                        handlePatch("headline", {
                          ...profile.headline,
                          selected: opt,
                        })
                      }
                      className="mt-1 accent-[#1342ff]"
                    />
                    <span className="text-[16px]">{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <EditableField
                value={selectedHeadline}
                onSave={(val) =>
                  handlePatch("headline", {
                    ...(profile.headline ?? {}),
                    selected: val,
                    options: [val],
                  })
                }
              />
            )}
          </SectionCard>

          {/* About */}
          {profile.about != null && (
            <SectionCard title="About">
              <EditableField
                value={profile.about}
                multiline
                onSave={(val) => handlePatch("about", val)}
              />
            </SectionCard>
          )}

          {/* Top Skills */}
          {profile.topSkills?.length > 0 && (
            <SectionCard title="Top Skills">
              <div className="flex flex-wrap gap-2">
                {profile.topSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-full text-[14px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <SectionCard title="Skills">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white dark:bg-[#212121] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-full text-[14px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Experience */}
          {profile.experience?.length > 0 && (
            <SectionCard title="Experience">
              <div className="space-y-5">
                {profile.experience.map((exp, i) => (
                  <div
                    key={i}
                    className="border-b border-[#eaecf0] dark:border-[#2d2d2d] pb-5 last:border-0 last:pb-0"
                  >
                    <p className="font-bold text-[17px]">{exp.jobTitle}</p>
                    <p className="text-[15px] text-[#555] dark:text-[#aaa]">
                      {exp.company}
                      {exp.dates ? ` · ${exp.dates}` : ""}
                    </p>
                    {exp.bullets?.length > 0 && (
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        {exp.bullets.map((b, j) => (
                          <li key={j} className="text-[15px] leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Education */}
          {profile.education?.length > 0 && (
            <SectionCard title="Education">
              <div className="space-y-3">
                {profile.education.map((edu, i) => (
                  <div key={i}>
                    <p className="font-bold text-[16px]">{edu.degree}</p>
                    <p className="text-[15px] text-[#555] dark:text-[#aaa]">
                      {edu.institution}
                      {edu.dates ? ` · ${edu.dates}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Certifications */}
          {profile.certifications?.length > 0 && (
            <SectionCard title="Certifications">
              <div className="space-y-2">
                {profile.certifications.map((cert, i) => (
                  <div key={i}>
                    <p className="font-semibold text-[16px]">{cert.name}</p>
                    {cert.issuingOrganization && (
                      <p className="text-[14px] text-[#666] dark:text-[#aaa]">
                        {cert.issuingOrganization}
                        {cert.date ? ` · ${cert.date}` : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedInOptimizer;
