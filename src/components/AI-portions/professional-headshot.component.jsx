import React, { useRef, useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { Download, Loader2, RefreshCcw } from "lucide-react";
import SelectableCard from "./reusable-customs/selectable-card.component";
import GradientIcon from "./reusable-customs/gradient-icon.component";

const STYLES = [
  {
    id: "corporate",
    label: "Corporate Professional",
    desc: "Neutral background, business attire, confident posture",
  },
  {
    id: "modern",
    label: "Modern Professional",
    desc: "Soft lighting, modern background, relaxed authoritative",
  },
  {
    id: "executive",
    label: "Executive",
    desc: "Sophisticated background, premium attire, authoritative presence",
  },
  {
    id: "creative",
    label: "Creative Professional",
    desc: "Creative background, stylish attire, artistic composition",
  },
];

const PERSONAS = [
  {
    id: "confident",
    label: "Confident Leader",
    desc: "Direct eye contact, slight smile, authoritative posture",
  },
  {
    id: "approachable",
    label: "Approachable Expert",
    desc: "Warm smile, open posture, friendly demeanor",
  },
  {
    id: "innovative",
    label: "Innovative Thinker",
    desc: "Thoughtful expression, creative energy, forward-looking",
  },
  {
    id: "trustworthy",
    label: "Trustworthy Professional",
    desc: "Genuine smile, reliable appearance, professional warmth",
  },
];

const ProfessionalHeadshot = () => {
  const [file, setFile] = useState(null);
  const [styleId, setStyleId] = useState(null);
  const [personaId, setPersonaId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const inputRef = useRef(null);

  const handlePick = () => inputRef.current?.click();

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url); // set preview only
  };

  const canGenerate = !!file && !!styleId && !!personaId;

  const generateHeadshot = async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    // Simulate generation delay and keep current preview until "generated"
    setTimeout(() => {
      setIsGenerating(false);
      setResultUrl(previewUrl); // use preview as final image
      setHasGenerated(true); // now we show the result view
    }, 1800);
  };

  const downloadImage = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "professional-headshot.png";
    a.click();
  };

  const resetForAnother = () => {
    setIsGenerating(false);
    setResultUrl(null);
    setPreviewUrl(null);
    setFile(null);
    setStyleId(null);
    setPersonaId(null);
    setHasGenerated(false);
  };

  return (
    <div className="px-[5%] py-10">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 p-5 border-b-[1.5px] dark:border-b border-[#eaecf0] dark:border-[#2d2d2d]">
        <UserIcon className="h-6 w-6" />
        <div>
          <h2 className="text-[24px] font-extrabold ">
            Professional Image Generator
          </h2>
          <p className="text-[20px]">
            Transform your photo into a professional headshot with AI
          </p>
        </div>
      </div>

      {/* If generated result */}
      {resultUrl && !isGenerating && styleId && personaId ? (
        <div className="bg-[#f6f6f6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[20px] font-bold">
                Your Professional Headshot is Ready
              </p>
              <p className="text-[16px]">
                Generated with {STYLES.find((s) => s.id === styleId)?.label}{" "}
                style and {PERSONAS.find((p) => p.id === personaId)?.label}{" "}
                persona
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={downloadImage}
                className="px-4 py-2 rounded-md bg-[#17a34a] hover:bg-[#1a9447] text-white flex items-center gap-2 cursor-pointer"
              >
                <Download size={16} /> Download Image
              </button>
              <button
                onClick={resetForAnother}
                className="px-4 py-2 rounded-md border border-[#2d2d2d] flex items-center gap-2 cursor-pointer"
              >
                <RefreshCcw size={16} /> Generate another
              </button>
            </div>
          </div>

          <div className="w-full flex items-center justify-center">
            <div className="border border-[#ccc] dark:border-[#2d2d2d] rounded-md p-2 bg-[#ececec] dark:bg-black">
              <img
                src={resultUrl}
                alt="Generated headshot"
                className="max-h-[420px] object-contain"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-4">
          {/* Upload */}
          <div className="bg-[#f6f6f6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-6">
            <p className="font-semibold mb-4">1. Upload Your Photo</p>
            <div
              role="button"
              onClick={handlePick}
              className="h-[500px] rounded-md border border-dashed border-[#ccc] dark:border-[#2d2d2d] flex items-center justify-center text-center hover:bg-[#d2d2d2] dark:hover:bg-[#151515] transition-all ease-in-out cursor-pointer"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-full object-contain"
                />
              ) : (
                <div>
                  <p className="text-[24px] font-extrabold">
                    Click to upload your photo
                  </p>
                  <p className="text-[20px] ">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {/* Choose Style */}
          <div className="bg-[#f6f6f6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-6">
            <p className="font-semibold mb-4">2. Choose Style</p>
            <div className="space-y-3">
              {STYLES.map((s) => (
                <SelectableCard
                  key={s.id}
                  isSelected={styleId === s.id}
                  onClick={() => setStyleId(s.id)}
                >
                  <div className="flex items-start gap-3">
                    <GradientIcon />
                    <div>
                      <p className="text-[16px] font-semibold">{s.label}</p>
                      <p className="text-sm w-[200px] ">{s.desc}</p>
                    </div>
                  </div>
                </SelectableCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Personas and CTA */}
      {!hasGenerated && (
        <div className="mt-6 bg-[#f6f6f6] dark:bg-[#181818] border border-[#eaecf0] dark:border-[#2d2d2d] rounded-xl p-6">
          <p className="font-semibold mb-4">3. Select Persona</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PERSONAS.map((p) => (
              <SelectableCard
                key={p.id}
                isSelected={personaId === p.id}
                onClick={() => setPersonaId(p.id)}
              >
                <div className="flex items-start gap-3">
                  <GradientIcon />
                  <div>
                    <p className="text-[16px] font-semibold">{p.label}</p>
                    <p className="text-sm ">{p.desc}</p>
                  </div>
                </div>
              </SelectableCard>
            ))}
          </div>
        </div>
      )}

      {!hasGenerated && (
        <div className="flex items-center justify-center mt-8">
          <button
            onClick={generateHeadshot}
            disabled={!canGenerate || isGenerating}
            className="w-[476px] text-center py-3 border border-[#eaecf0] bg-gradient-to-b from-[#1342ff] to-[#ff00e6] text-[#fff] text-[24px] font-bold rounded-xl tracking-tighter disabled:opacity-60 cursor-pointer"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {isGenerating ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Generating...
              </span>
            ) : (
              "Generate Headshot"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfessionalHeadshot;
