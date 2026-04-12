import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { isNetworkError } from "../../../utils/networkError";
import * as service from "../module-services/headshotService";

export const useProfessionalHeadshot = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [styleId, setStyleId] = useState(null);
  const [personaId, setPersonaId] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [imageId, setImageId] = useState(null);
  const [generation, setGeneration] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [autoPersona, setAutoPersona] = useState(null);

  const [generations, setGenerations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleFileChange = (file) => {
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // =====================
  // FAKE PROGRESS UPLOAD (UX LAYER)
  // =====================
  const uploadImage = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // fake progress loop (since backend doesn't support it)
      const fakeProgress = () =>
        new Promise((resolve) => {
          let progress = 0;

          const interval = setInterval(() => {
            progress += Math.random() * 20;

            if (progress >= 95) {
              progress = 95;
              clearInterval(interval);
              resolve();
            }

            setUploadProgress(Math.floor(progress));
          }, 150);
        });

      await fakeProgress();

      const res = await service.uploadImage(file);

      setUploadProgress(100);
      setImageId(res?.imageUrl || res?.imageId || res?.id);

      toast.success("Upload complete");
      return res;
    } catch (err) {
      console.error(err);
      if (!isNetworkError(err)) toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const generateHeadshot = async () => {
    if (!file || !styleId || !personaId) return;

    try {
      setIsGenerating(true);

      const res = await service.generateHeadshots({
        styleId,
        personaId,
        imageId,
      });

      // handle backend persona (if exists)
      const detectedPersona = res?.personaId || res?.persona;

      if (detectedPersona) {
        setPersonaId(detectedPersona);
        setAutoPersona(detectedPersona);
      }

      setGeneration(res);
      setHasGenerated(true);
    } catch (err) {
      console.error(err);
      if (!isNetworkError(err)) toast.error("Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setStyleId(null);
    setPersonaId(null);
    setImageId(null);
    setGeneration(null);
    setHasGenerated(false);
    setUploadProgress(0);
  };

  const canGenerate = !!file && !!styleId && !!personaId;

  const fetchGenerations = async () => {
    try {
      setLoadingHistory(true);
      const res = await service.getGenerations();

      // adjust depending on backend shape
      setGenerations(res?.data || res || []);
    } catch (err) {
      console.error(err);
      if (!isNetworkError(err)) toast.error("Failed to load history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadGeneration = (gen) => {
    setGeneration(gen);
    setHasGenerated(true);

    setStyleId(gen?.styleId || null);
    setPersonaId(gen?.personaId || null);

    // optional (if backend stores it)
    if (gen?.imageUrl) {
      setPreviewUrl(gen.imageUrl);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  return {
    file,
    previewUrl,
    styleId,
    personaId,
    autoPersona,

    uploading,
    uploadProgress,
    isGenerating,

    imageId,
    generation,
    hasGenerated,

    canGenerate,
    generations,
    loadingHistory,
    fetchGenerations,
    loadGeneration,

    setStyleId,
    setPersonaId,

    handleFileChange,
    uploadImage,
    generateHeadshot,
    reset,
  };
};
