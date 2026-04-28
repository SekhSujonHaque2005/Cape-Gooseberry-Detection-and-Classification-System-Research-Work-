"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  disabled?: boolean;
}

type Mode = "upload" | "camera";

export default function ImageUploader({ onImageSelected, disabled }: ImageUploaderProps) {
  const [mode, setMode] = useState<Mode>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
        };
      }
    } catch {
      setCameraError("Scouting lens access denied. Check system permissions.");
      setMode("upload");
    }
  };

  const handleModeSwitch = (newMode: Mode) => {
    if (newMode === mode) return;
    stopCamera();
    setPreview(null);
    setMode(newMode);
    if (newMode === "camera") {
      setTimeout(startCamera, 100);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        handleFile(file);
        stopCamera();
      }
    }, "image/jpeg", 0.92);
  };

  const handleReset = () => {
    setPreview(null);
    if (mode === "camera") {
      setTimeout(startCamera, 100);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Mode Tabs */}
      <div className="flex p-1 rounded-2xl bg-white/[0.03] border border-white/5">
        <button
          onClick={() => handleModeSwitch("upload")}
          disabled={disabled}
          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            mode === "upload"
              ? "bg-gold-500 text-black shadow-lg"
              : "text-gray-500 hover:text-white"
          }`}
        >
          📂 Repository
        </button>
        <button
          onClick={() => handleModeSwitch("camera")}
          disabled={disabled}
          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            mode === "camera"
              ? "bg-gold-500 text-black shadow-lg"
              : "text-gray-500 hover:text-white"
          }`}
        >
          📷 Remote Lens
        </button>
      </div>

      {/* Workspace */}
      <div className="relative group">
        {preview ? (
          <div className="relative rounded-[2rem] overflow-hidden border border-white/10 glass-panel p-2 animate-reveal">
            <div className="relative rounded-[1.5rem] overflow-hidden">
              <img src={preview} alt="Selected Specimen" className="w-full max-h-80 object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={handleReset}
                disabled={disabled}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-gold-500 hover:text-black transition-all backdrop-blur-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Optical Data Synchronized</span>
              </div>
            </div>
          </div>
        ) : mode === "upload" ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`rounded-[2rem] border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-500 group/drop ${
              dragActive
                ? "border-gold-500 bg-gold-500/10"
                : "border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]"
            } ${disabled ? "opacity-20 cursor-not-allowed" : ""}`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center group-hover/drop:scale-110 transition-transform">
                <svg className="w-8 h-8 text-gray-600 group-hover/drop:text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm tracking-wide">Import Specimen Data</p>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest mt-2">DND Optical File or Select Path</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
              className="hidden"
            />
          </div>
        ) : (
          <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black relative aspect-video animate-reveal">
            {cameraError ? (
              <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-[200px]">{cameraError}</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover grayscale-[0.5] opacity-80"
                />
                {/* HUD Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 text-[8px] font-mono text-gold-500 uppercase tracking-widest">
                    REC: LIVE_STREAM_S1<br />FPS: 60.0<br />SCAN: ACTIVE
                  </div>
                  <div className="absolute top-4 right-4 text-[8px] font-mono text-gold-500 text-right uppercase tracking-widest">
                    GRID: ENABLED<br />LAT: 4.5709 N<br />LON: 74.2973 W
                  </div>
                  {/* Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <div className="w-32 h-32 border border-gold-500/50 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-gold-500 rounded-full" />
                    </div>
                  </div>
                </div>

                {cameraReady && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <button
                      onClick={handleCapture}
                      disabled={disabled}
                      className="w-16 h-16 rounded-full bg-white border-[6px] border-white/20 hover:scale-110 active:scale-95 transition-transform shadow-2xl group/shutter"
                      aria-label="Capture Optical Data"
                    >
                      <div className="w-full h-full rounded-full bg-white hover:bg-gold-500 transition-colors" />
                    </button>
                  </div>
                )}
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center glass-panel">
                    <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full" />
                  </div>
                )}
              </>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </div>
    </div>
  );
}
