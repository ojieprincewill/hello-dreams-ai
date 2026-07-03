import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getMyProfile, updateMyProfile } from "../../../api/professionalProfileService";
import { AuthContext } from "../../../auth/authContext";
import { CheckCircleIcon, PencilIcon, XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

/* ── System prompt detection ── */

const isLikelySystemPrompt = (text) =>
  typeof text === "string" &&
  text.length > 800 &&
  /^(You are|As an AI|Your role is|You will|I am an AI)/i.test(text.trim());

/* ── Tiny helpers ── */

const Chip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 bg-[#e8edff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff] text-xs font-semibold px-2.5 py-1 rounded-full">
    {label}
    {onRemove && (
      <button type="button" onClick={onRemove} className="hover:opacity-70 cursor-pointer">
        <XMarkIcon className="w-3 h-3" />
      </button>
    )}
  </span>
);

const TagInput = ({ values = [], onChange, placeholder }) => {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <Chip key={v} label={v} onRemove={() => onChange(values.filter((x) => x !== v))} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          placeholder={placeholder || "Add and press Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          className="flex-1 px-3 py-2 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1342ff]/30 focus:border-[#1342ff] transition-colors"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 bg-[#f0f4ff] dark:bg-[#1a2040] text-[#1342ff] dark:text-[#7b96ff] rounded-lg text-sm font-semibold hover:opacity-80 cursor-pointer"
        >
          Add
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs uppercase tracking-wide text-[#667085] dark:text-gray-400">
      {label}
    </label>
    {children}
  </div>
);

const textInput = (val, setVal, placeholder = "") => (
  <input
    type="text"
    value={val || ""}
    placeholder={placeholder}
    onChange={(e) => setVal(e.target.value)}
    className="w-full px-3 py-2.5 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1342ff]/30 focus:border-[#1342ff] transition-colors"
  />
);

const textareaInput = (val, setVal, placeholder = "", rows = 3) => (
  <textarea
    value={val || ""}
    placeholder={placeholder}
    rows={rows}
    onChange={(e) => setVal(e.target.value)}
    className="w-full px-3 py-2.5 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1342ff]/30 focus:border-[#1342ff] transition-colors resize-none"
  />
);

/* ── Corrupted data warning ── */

const CorruptedDataWarning = ({ onClear }) => (
  <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-lg px-4 py-3">
    <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
        Unexpected content detected
      </p>
      <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
        This field contains system data rather than your personal goals. Clear it, then complete a
        new &ldquo;Get to Know You&rdquo; conversation to regenerate your career goals.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-300 underline underline-offset-2 hover:opacity-70 cursor-pointer"
      >
        Clear field
      </button>
    </div>
  </div>
);

/* ── Section card ── */

const SectionCard = ({ title, hasData, editContent, onSave, children }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      setEditing(false);
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] bg-[#f9f9f9] dark:bg-[#1c1c1c] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <div className="flex items-center gap-2">
          <CheckCircleIcon
            className={`w-4 h-4 shrink-0 ${hasData ? "text-emerald-500" : "text-[#d0d5dd] dark:text-[#444]"}`}
          />
          <h3 className="text-sm font-bold">{title}</h3>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#667085] dark:text-gray-400 hover:text-[#1342ff] dark:hover:text-[#7b96ff] cursor-pointer transition-colors"
          >
            <PencilIcon className="w-3.5 h-3.5" />
            Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-xs text-[#667085] hover:text-[#010413] dark:hover:text-white cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-semibold text-[#1342ff] dark:text-[#7b96ff] hover:opacity-70 cursor-pointer disabled:opacity-50 transition-opacity"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>
      <div className="px-5 py-4">
        {editing ? editContent : children}
      </div>
    </div>
  );
};

/* ── Read-only views ── */

const ReadChips = ({ values }) =>
  values?.length ? (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => <Chip key={v} label={v} />)}
    </div>
  ) : (
    <p className="text-sm text-[#667085] dark:text-gray-400 italic">Not provided yet</p>
  );

const ReadText = ({ value }) =>
  value ? (
    <p className="text-sm text-[#010413] dark:text-[#f7f7f7] whitespace-pre-wrap">{value}</p>
  ) : (
    <p className="text-sm text-[#667085] dark:text-gray-400 italic">Not provided yet</p>
  );

/* ── Main component ── */

const AiProfileTab = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["professionalProfile", "me"],
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000,
  });

  /* section edit state — synced from profile cache */
  const [basic, setBasic] = useState({});
  const [goals, setGoals] = useState({});
  const [extracted, setExtracted] = useState({});
  const [cv, setCv] = useState({});
  const [target, setTarget] = useState({});
  const [persona, setPersona] = useState({});

  useEffect(() => {
    if (!profile) return;
    setBasic(profile.basicInfo ?? {});
    setGoals(profile.careerGoals ?? {});
    setExtracted(profile.extractedData ?? {});
    setCv(profile.cvMetadata ?? {});
    setTarget(profile.targetJob ?? {});
    setPersona(profile.personaData ?? {});
  }, [profile]);

  const save = (sectionKey, data) => async () => {
    await updateMyProfile({ [sectionKey]: data });
    queryClient.invalidateQueries({ queryKey: ["professionalProfile", "me"] });
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-[#efefef] dark:bg-[#2d2d2d]" />
        ))}
      </div>
    );
  }

  const cs = profile?.completedSections ?? {};

  /* Merge auth user data with basicInfo for display */
  const displayName = basic.name || user?.name || "";
  const displayEmail = basic.email || user?.email || "";

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#667085] dark:text-gray-400">
        Here's what your AI career coach knows about you. Review and correct any mistakes.
      </p>

      {/* Basic Info */}
      <SectionCard
        title="Basic Info"
        hasData={!!(displayName || displayEmail || basic.phone || basic.country || basic.linkedIn)}
        onSave={save("basicInfo", { ...basic, name: basic.name || user?.name, email: basic.email || user?.email })}
        editContent={
          <div className="space-y-3">
            <Field label="Full name">{textInput(basic.name || user?.name, (v) => setBasic({ ...basic, name: v }), user?.name || "Your full name")}</Field>
            <Field label="Email">{textInput(basic.email || user?.email, (v) => setBasic({ ...basic, email: v }), user?.email || "Your email")}</Field>
            <Field label="Phone">{textInput(basic.phone, (v) => setBasic({ ...basic, phone: v }), "+1 555 000 0000")}</Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Country">{textInput(basic.country, (v) => setBasic({ ...basic, country: v }), "Nigeria")}</Field>
              <Field label="City">{textInput(basic.city, (v) => setBasic({ ...basic, city: v }), "Lagos")}</Field>
            </div>
            <Field label="LinkedIn URL">{textInput(basic.linkedIn, (v) => setBasic({ ...basic, linkedIn: v }), "linkedin.com/in/your-handle")}</Field>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
          {[
            ["Name", displayName],
            ["Email", displayEmail],
            ["Phone", basic.phone],
            ["Location", [basic.city, basic.country].filter(Boolean).join(", ")],
            ["LinkedIn", basic.linkedIn],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-xs text-[#667085] dark:text-gray-400 mb-0.5">{k}</p>
              <p className="font-medium truncate">{v || "—"}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#667085] dark:text-gray-500 mt-3 border-t border-[#eaecf0] dark:border-[#2d2d2d] pt-3">
          Phone, city, and LinkedIn URL must be added manually — the AI doesn't extract these from conversations.
        </p>
      </SectionCard>

      {/* Career Goals */}
      <SectionCard
        title="Career Goals"
        hasData={!!(goals.targetRoles?.length || (goals.careerAspirations && !isLikelySystemPrompt(goals.careerAspirations)))}
        onSave={save("careerGoals", goals)}
        editContent={
          <div className="space-y-3">
            <Field label="Target roles">
              <TagInput values={goals.targetRoles} onChange={(v) => setGoals({ ...goals, targetRoles: v })} placeholder="e.g. Product Manager" />
            </Field>
            <Field label="Target industries">
              <TagInput values={goals.targetIndustries} onChange={(v) => setGoals({ ...goals, targetIndustries: v })} placeholder="e.g. Fintech" />
            </Field>
            <Field label="Work style">{textInput(goals.workStyle, (v) => setGoals({ ...goals, workStyle: v }), "Remote / Hybrid / On-site")}</Field>
            <Field label="Values">
              <TagInput values={goals.values} onChange={(v) => setGoals({ ...goals, values: v })} placeholder="e.g. Work-life balance" />
            </Field>
            <Field label="Career aspirations">
              {textareaInput(goals.careerAspirations, (v) => setGoals({ ...goals, careerAspirations: v }), "What you ultimately want to achieve…")}
            </Field>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[#667085] dark:text-gray-400 mb-1.5">Target roles</p>
            <ReadChips values={goals.targetRoles} />
          </div>
          {goals.careerAspirations && (
            <div>
              <p className="text-xs text-[#667085] dark:text-gray-400 mb-1">Aspirations</p>
              {isLikelySystemPrompt(goals.careerAspirations) ? (
                <CorruptedDataWarning
                  onClear={() =>
                    save("careerGoals", { ...goals, careerAspirations: "" })().catch(() =>
                      toast.error("Failed to clear field")
                    )
                  }
                />
              ) : (
                <ReadText value={goals.careerAspirations} />
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {/* Skills & Background */}
      <SectionCard
        title="Skills & Background"
        hasData={!!(extracted.skills?.length || extracted.education)}
        onSave={save("extractedData", extracted)}
        editContent={
          <div className="space-y-3">
            <Field label="Skills">
              <TagInput values={extracted.skills} onChange={(v) => setExtracted({ ...extracted, skills: v })} placeholder="e.g. Python" />
            </Field>
            <Field label="Achievements">
              <TagInput values={extracted.achievements} onChange={(v) => setExtracted({ ...extracted, achievements: v })} placeholder="e.g. Led team of 10" />
            </Field>
            <Field label="Education">{textInput(extracted.education, (v) => setExtracted({ ...extracted, education: v }), "BSc Computer Science, MIT")}</Field>
            <Field label="Certifications">
              <TagInput values={extracted.certifications} onChange={(v) => setExtracted({ ...extracted, certifications: v })} placeholder="e.g. AWS Certified" />
            </Field>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[#667085] dark:text-gray-400 mb-1.5">Skills</p>
            <ReadChips values={extracted.skills} />
          </div>
          {extracted.education && (
            <div>
              <p className="text-xs text-[#667085] dark:text-gray-400 mb-1">Education</p>
              <ReadText value={extracted.education} />
            </div>
          )}
        </div>
      </SectionCard>

      {/* Work History */}
      <SectionCard
        title="Work History"
        hasData={!!(cv.workHistory?.length || cv.experienceLevel)}
        onSave={save("cvMetadata", cv)}
        editContent={
          <div className="space-y-3">
            <Field label="Experience level">
              <select
                value={cv.experienceLevel || ""}
                onChange={(e) => setCv({ ...cv, experienceLevel: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121] text-sm focus:outline-none focus:ring-2 focus:ring-[#1342ff]/30"
              >
                <option value="">Select level</option>
                {["Entry", "Junior", "Mid", "Senior", "Lead", "Executive"].map((l) => (
                  <option key={l} value={l.toLowerCase()}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Keywords">
              <TagInput values={cv.keywords} onChange={(v) => setCv({ ...cv, keywords: v })} placeholder="e.g. Agile" />
            </Field>
            <Field label="Work history entries">
              <div className="space-y-2">
                {(cv.workHistory ?? []).map((entry, i) => (
                  <div key={i} className="bg-[#efefef] dark:bg-[#272725] rounded-lg p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Job title"
                        value={entry.title || ""}
                        onChange={(e) => {
                          const wh = [...cv.workHistory];
                          wh[i] = { ...wh[i], title: e.target.value };
                          setCv({ ...cv, workHistory: wh });
                        }}
                        className="px-2.5 py-2 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121] text-sm focus:outline-none focus:ring-1 focus:ring-[#1342ff]/30"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={entry.company || ""}
                        onChange={(e) => {
                          const wh = [...cv.workHistory];
                          wh[i] = { ...wh[i], company: e.target.value };
                          setCv({ ...cv, workHistory: wh });
                        }}
                        className="px-2.5 py-2 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121] text-sm focus:outline-none focus:ring-1 focus:ring-[#1342ff]/30"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Duration (e.g. Jan 2022 – Mar 2024)"
                      value={entry.duration || ""}
                      onChange={(e) => {
                        const wh = [...cv.workHistory];
                        wh[i] = { ...wh[i], duration: e.target.value };
                        setCv({ ...cv, workHistory: wh });
                      }}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] bg-white dark:bg-[#212121] text-sm focus:outline-none focus:ring-1 focus:ring-[#1342ff]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setCv({ ...cv, workHistory: cv.workHistory.filter((_, j) => j !== i) })}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCv({ ...cv, workHistory: [...(cv.workHistory ?? []), { title: "", company: "", duration: "" }] })}
                  className="text-xs font-semibold text-[#1342ff] dark:text-[#7b96ff] hover:opacity-70 cursor-pointer"
                >
                  + Add entry
                </button>
              </div>
            </Field>
          </div>
        }
      >
        <div className="space-y-3">
          {cv.experienceLevel && (
            <div>
              <p className="text-xs text-[#667085] dark:text-gray-400 mb-1">Level</p>
              <span className="inline-block text-xs font-semibold bg-[#efefef] dark:bg-[#2d2d2d] px-2.5 py-1 rounded-full capitalize">{cv.experienceLevel}</span>
            </div>
          )}
          {cv.workHistory?.length > 0 ? (
            <ul className="space-y-1.5">
              {cv.workHistory.map((entry, i) => (
                <li key={i} className="text-sm">
                  <span className="font-semibold">{entry.title}</span>
                  {entry.company && <span className="text-[#667085] dark:text-gray-400"> · {entry.company}</span>}
                  {entry.duration && <span className="text-[#667085] dark:text-gray-400"> · {entry.duration}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#667085] dark:text-gray-400 italic">No work history yet</p>
          )}
        </div>
      </SectionCard>

      {/* Target Job */}
      <SectionCard
        title="Target Job"
        hasData={!!(target.targetJobTitle || target.careerGoal)}
        onSave={save("targetJob", target)}
        editContent={
          <div className="space-y-3">
            <Field label="Target job title">{textInput(target.targetJobTitle, (v) => setTarget({ ...target, targetJobTitle: v }), "Senior Product Manager")}</Field>
            <Field label="Career goal">{textareaInput(target.careerGoal, (v) => setTarget({ ...target, careerGoal: v }), "What you want to achieve in your next role…")}</Field>
            <Field label="Salary expectation">{textInput(target.salaryExpectation, (v) => setTarget({ ...target, salaryExpectation: v }), "e.g. $120,000 – $150,000")}</Field>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
          {[
            ["Target title", target.targetJobTitle],
            ["Salary expectation", target.salaryExpectation],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-xs text-[#667085] dark:text-gray-400 mb-0.5">{k}</p>
              <p className="font-medium">{v || "—"}</p>
            </div>
          ))}
          {target.careerGoal && (
            <div className="col-span-2">
              <p className="text-xs text-[#667085] dark:text-gray-400 mb-1">Career goal</p>
              <ReadText value={target.careerGoal} />
            </div>
          )}
        </div>
      </SectionCard>

      {/* My Persona — only if completed */}
      {cs.persona && (
        <SectionCard
          title="My Persona"
          hasData={!!(persona.currentPersona || persona.idealPersona)}
          onSave={save("personaData", persona)}
          editContent={
            <div className="space-y-3">
              <Field label="Current persona">{textareaInput(persona.currentPersona, (v) => setPersona({ ...persona, currentPersona: v }))}</Field>
              <Field label="Ideal persona">{textareaInput(persona.idealPersona, (v) => setPersona({ ...persona, idealPersona: v }))}</Field>
              <Field label="Transformation path">{textareaInput(persona.transformationPath, (v) => setPersona({ ...persona, transformationPath: v }))}</Field>
            </div>
          }
        >
          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#667085] dark:text-gray-400 mb-1">Current persona</p>
              <ReadText value={persona.currentPersona} />
            </div>
            {persona.idealPersona && (
              <div>
                <p className="text-xs text-[#667085] dark:text-gray-400 mb-1">Ideal persona</p>
                <ReadText value={persona.idealPersona} />
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default AiProfileTab;
