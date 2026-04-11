import { apiFetch } from "../auth/apiClient";
import { API_BASE_URL } from "../config/apiConfig";

const asTrimmedString = (value) =>
  typeof value === "string" ? value.trim() : "";

const asStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map(asTrimmedString).filter(Boolean);
  }
  const single = asTrimmedString(value);
  return single ? [single] : [];
};

const pickFirst = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
};

const isObject = (value) =>
  value != null && typeof value === "object" && !Array.isArray(value);

const parseResponseBody = async (res, fallback = null) => {
  if (res.status === 204) return fallback;
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return fallback;
  try {
    return await res.json();
  } catch {
    const err = new Error("Invalid JSON response from server");
    err.kind = "INVALID_RESPONSE";
    throw err;
  }
};

export const normalizePersonaPayload = (raw) => {
  if (!isObject(raw)) return null;

  const source = isObject(raw.persona) ? raw.persona : raw;

  const normalized = {
    communicationStyle: asTrimmedString(
      pickFirst(source.communicationStyle, source.communication_style),
    ),
    tone: asTrimmedString(pickFirst(source.tone, source.voiceTone, source.voice_tone)),
    professionalVoice: asTrimmedString(
      pickFirst(source.professionalVoice, source.professional_voice),
    ),
    writingStyle: asTrimmedString(
      pickFirst(source.writingStyle, source.writing_style),
    ),
    personalityTraits: asStringArray(
      pickFirst(source.personalityTraits, source.personality_traits),
    ),
  };

  const hasPersonaContent =
    Boolean(normalized.communicationStyle) ||
    Boolean(normalized.tone) ||
    Boolean(normalized.professionalVoice) ||
    Boolean(normalized.writingStyle) ||
    normalized.personalityTraits.length > 0;

  return hasPersonaContent ? normalized : null;
};

export const submitPersonaAnswers = async (answers) => {
  const res = await apiFetch(`${API_BASE_URL}/persona-builder/answers`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
  return parseResponseBody(res, {});
};

export const generatePersona = async () => {
  const res = await apiFetch(`${API_BASE_URL}/persona-builder/generate`, {
    method: "POST",
  });
  const data = await parseResponseBody(res, null);
  return normalizePersonaPayload(data);
};

export const fetchPersona = async () => {
  const res = await apiFetch(`${API_BASE_URL}/persona-builder/persona`, {
    method: "GET",
  });
  const data = await parseResponseBody(res, null);
  return normalizePersonaPayload(data);
};

