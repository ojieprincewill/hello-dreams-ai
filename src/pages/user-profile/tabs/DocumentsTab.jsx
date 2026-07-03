import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  listResumeConversations,
  getGeneratedResume,
} from "../../../api/resumeBuilderService";
import {
  listDocumentConversations,
  getDocument,
} from "../../../api/documentGeneratorService";
import { getLinkedInProfile } from "../../../api/linkedInService";

/* ── Document type config ── */

const TYPE_CONFIG = {
  resume: {
    label: "Resume",
    badge: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  },
  "cover-letter": {
    label: "Cover Letter",
    badge: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  },
  "personal-statement": {
    label: "Personal Statement",
    badge: "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300",
  },
  linkedin: {
    label: "LinkedIn Profile",
    badge: "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300",
  },
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "resume", label: "Resumes" },
  { id: "cover-letter", label: "Cover Letters" },
  { id: "personal-statement", label: "Personal Statements" },
  { id: "linkedin", label: "LinkedIn" },
];

/* ── Helpers ── */

const formatDate = (str) => {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const extractTextContent = (doc) => {
  if (!doc) return "";
  if (typeof doc === "string") return doc;
  if (doc.content) return doc.content;
  if (doc.rawText) return doc.rawText;
  if (doc.sections) return Object.values(doc.sections).join("\n\n");
  return JSON.stringify(doc, null, 2);
};

const downloadAsText = (content, filename) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/* ── Safe fetch wrappers ── */
const safeListResumeConversations = async () => {
  try { return await listResumeConversations(); } catch { return null; }
};
const safeListDocumentConversations = async () => {
  try { return await listDocumentConversations(); } catch { return null; }
};
const safeGetLinkedInProfile = async () => {
  try { return await getLinkedInProfile(); } catch { return null; }
};

/* ── View panel (slide-over) ── */

const ViewPanel = ({ item, onClose }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!item) return;
    (async () => {
      setLoading(true);
      try {
        let raw;
        if (item.type === "resume") raw = await getGeneratedResume(item.conversationId);
        else if (item.type === "linkedin") raw = item._rawData;
        else raw = await getDocument(item.conversationId);
        setContent(extractTextContent(raw));
      } catch {
        setContent("Could not load document.");
      } finally {
        setLoading(false);
      }
    })();
  }, [item]);

  if (!item) return null;

  const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.resume;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-lg h-full bg-white dark:bg-[#181818] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#eaecf0] dark:border-[#2d2d2d]">
          <div>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${cfg.badge}`}>
              {cfg.label}
            </span>
            <p className="text-sm font-bold leading-snug">{item.title}</p>
            <p className="text-xs text-[#667085] dark:text-gray-400 mt-0.5">{formatDate(item.date)}</p>
          </div>
          <button type="button" onClick={onClose} className="text-[#667085] hover:text-[#010413] dark:hover:text-white cursor-pointer p-1">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-[#efefef] dark:bg-[#2d2d2d] rounded" />
              ))}
            </div>
          ) : (
            <pre className="text-sm text-[#010413] dark:text-[#f7f7f7] whitespace-pre-wrap font-sans leading-relaxed">
              {content}
            </pre>
          )}
        </div>

        {/* Footer */}
        {!loading && content && (
          <div className="px-5 py-4 border-t border-[#eaecf0] dark:border-[#2d2d2d]">
            <button
              type="button"
              onClick={() => downloadAsText(content, `${item.title.replace(/\s+/g, "-")}.txt`)}
              className="flex items-center gap-2 w-full justify-center py-2.5 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] text-sm font-semibold hover:bg-[#f9f9f9] dark:hover:bg-[#2d2d2d] cursor-pointer transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download as .txt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Document card ── */

const DocCard = ({ item, onView }) => {
  const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.resume;
  return (
    <div className="rounded-xl border border-[#eaecf0] dark:border-[#2d2d2d] bg-[#f9f9f9] dark:bg-[#1c1c1c] p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <DocumentTextIcon className="w-8 h-8 text-[#d0d5dd] dark:text-[#444] shrink-0 mt-0.5" />
        <div className="min-w-0">
          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${cfg.badge}`}>
            {cfg.label}
          </span>
          <p className="text-sm font-bold truncate leading-snug">{item.title}</p>
          <p className="text-xs text-[#667085] dark:text-gray-400 mt-0.5">{formatDate(item.date)}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onView(item)}
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#efefef] dark:bg-[#272725] text-sm font-semibold hover:bg-[#e0e0e0] dark:hover:bg-[#333] cursor-pointer transition-colors"
      >
        <EyeIcon className="w-4 h-4" />
        View
      </button>
    </div>
  );
};

/* ── Empty state ── */

const EmptyState = ({ filter }) => {
  const links = {
    resume: { label: "CV Builder", to: "/ai-dashboard" },
    "cover-letter": { label: "Cover Letter tool", to: "/ai-dashboard" },
    "personal-statement": { label: "Document Generator", to: "/ai-dashboard" },
    linkedin: { label: "LinkedIn Optimizer", to: "/ai-dashboard" },
  };
  const link = links[filter];
  return (
    <div className="text-center py-12">
      <DocumentTextIcon className="w-12 h-12 mx-auto text-[#d0d5dd] dark:text-[#444] mb-3" />
      <p className="text-sm font-semibold text-[#010413] dark:text-[#f7f7f7]">No documents yet</p>
      {link && (
        <p className="text-sm text-[#667085] dark:text-gray-400 mt-1">
          Head to the{" "}
          <Link to={link.to} className="text-[#1342ff] dark:text-[#7b96ff] underline underline-offset-2">
            {link.label}
          </Link>{" "}
          to generate one.
        </p>
      )}
    </div>
  );
};

/* ── Main component ── */

const DocumentsTab = () => {
  const [filter, setFilter] = useState("all");
  const [viewItem, setViewItem] = useState(null);

  /* Use the same query keys as useProgressTracker — cache hit is guaranteed
     if the navbar has already loaded (staleTime: 60s means no extra requests). */
  const [resumeConvsQuery, docConvsQuery, linkedInQuery] = useQueries({
    queries: [
      {
        queryKey: ["resumeBuilder", "conversations"],
        queryFn: safeListResumeConversations,
        staleTime: 60_000,
      },
      {
        queryKey: ["documentConversations"],
        queryFn: safeListDocumentConversations,
        staleTime: 60_000,
      },
      {
        queryKey: ["linkedInProfile"],
        queryFn: safeGetLinkedInProfile,
        staleTime: 60_000,
      },
    ],
  });

  const loading =
    resumeConvsQuery.isLoading || docConvsQuery.isLoading || linkedInQuery.isLoading;

  const items = useMemo(() => {
    const rawResume = resumeConvsQuery.data;
    const resumeConvs = Array.isArray(rawResume)
      ? rawResume
      : Array.isArray(rawResume?.data)
      ? rawResume.data
      : [];

    const docConvs = Array.isArray(docConvsQuery.data) ? docConvsQuery.data : [];
    const li = linkedInQuery.data ?? null;

    const allItems = [];

    for (const conv of resumeConvs) {
      allItems.push({
        id: `resume-${conv.id}`,
        type: "resume",
        title: conv.title || "My Resume",
        date: conv.updatedAt ?? conv.createdAt,
        conversationId: conv.id,
      });
    }

    for (const conv of docConvs) {
      const docType =
        conv.documentType === "cover_letter"
          ? "cover-letter"
          : conv.documentType === "personal_statement"
          ? "personal-statement"
          : "cover-letter";
      allItems.push({
        id: `doc-${conv.id}`,
        type: docType,
        title:
          conv.title || (docType === "cover-letter" ? "Cover Letter" : "Personal Statement"),
        date: conv.updatedAt ?? conv.createdAt,
        conversationId: conv.id,
      });
    }

    if (li && (li.headline || li.summary || li.sections)) {
      allItems.push({
        id: "linkedin-profile",
        type: "linkedin",
        title: "LinkedIn Profile",
        date: li.updatedAt ?? li.createdAt,
        _rawData: li,
      });
    }

    return allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [resumeConvsQuery.data, docConvsQuery.data, linkedInQuery.data]);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.type === filter)),
    [items, filter],
  );

  return (
    <div className="space-y-5">
      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
              filter === f.id
                ? "bg-[#1342ff] text-white border-[#1342ff]"
                : "border-[#eaecf0] dark:border-[#2d2d2d] text-[#667085] dark:text-gray-400 hover:border-[#1342ff] hover:text-[#1342ff]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-[#efefef] dark:bg-[#2d2d2d]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter === "all" ? null : filter} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <DocCard key={item.id} item={item} onView={setViewItem} />
          ))}
        </div>
      )}

      {/* View panel */}
      {viewItem && <ViewPanel item={viewItem} onClose={() => setViewItem(null)} />}
    </div>
  );
};

export default DocumentsTab;
