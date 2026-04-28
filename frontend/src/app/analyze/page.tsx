"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ResultsDashboard from "@/components/ResultsDashboard";
import { analyzeImage, AnalysisResult } from "@/lib/api";

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [growthRetardant, setGrowthRetardant] = useState("none");
  const [trainingSystem, setTrainingSystem] = useState("standard");
  const [nutrientManagement, setNutrientManagement] = useState("standard");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeImage(
        selectedFile,
        growthRetardant,
        trainingSystem,
        nutrientManagement
      );
      setResult(data);
    } catch (err) {
      setError("Analysis protocol interrupted. Please verify specimen integrity.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-grain" />

      {/* Header Banner */}
      <section className="px-5 sm:px-8 md:px-16 py-10 sm:py-16 border-thick-b mt-16 sm:mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8">
          <div className="animate-reveal">
            <div className="heading-sub text-editorial-charcoal mb-3 sm:mb-4 uppercase tracking-widest text-xs sm:text-sm">Phenotype Scanning Protocol</div>
            <h1 className="heading-display text-3xl sm:text-5xl md:text-6xl">Optical Analysis</h1>
          </div>
          <div className="flex items-center gap-6 sm:gap-12 animate-reveal" style={{ animationDelay: "0.1s" }}>
            <div className="sm:text-right">
              <div className="text-meta text-xs sm:text-sm">Core_Source</div>
              <div className="text-base sm:text-lg italic text-editorial-charcoal mt-1">Hybrid YOLO-VLM</div>
            </div>
            <div className="sm:text-right">
              <div className="text-meta text-xs sm:text-sm">Status</div>
              <div className="text-base sm:text-lg italic text-editorial-gold mt-1 font-bold">Live Connection</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[50vh] lg:min-h-[70vh]">
        {/* Input Panel */}
        <div className="lg:col-span-5 p-5 sm:p-8 md:p-12 lg:border-r-2 border-editorial-charcoal/20">
          <div className="max-w-md mx-auto lg:mx-0 lg:sticky lg:top-40 animate-reveal" style={{ animationDelay: "0.2s" }}>
            <div className="mb-8 sm:mb-12">
              <h2 className="heading-display text-xl sm:text-2xl border-b-2 border-editorial-charcoal pb-3 sm:pb-4 mb-4 sm:mb-6">1. Specimen Acquisition</h2>
              <p className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 italic">
                Provide high-resolution optical data for autonomous classification. Ensure even illumination across the husk surface.
              </p>
              <div className="border-thick border-editorial-charcoal p-2">
                <ImageUploader 
                  onImageSelected={(file) => {
                    setSelectedFile(file);
                    setResult(null);
                    setError(null);
                  }} 
                  disabled={isLoading} 
                />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8 pb-8 sm:pb-12">
              <h2 className="heading-display text-xl sm:text-2xl border-b-2 border-editorial-charcoal pb-3 sm:pb-4">2. Scientific Controls</h2>
              
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                <div className="group">
                  <label className="text-meta mb-2 block font-bold text-xs sm:text-sm">Growth Regulation</label>
                  <select
                    value={growthRetardant}
                    onChange={(e) => setGrowthRetardant(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 sm:px-4 py-3 bg-editorial-cream border-2 border-editorial-charcoal font-serif text-base sm:text-lg focus:border-editorial-gold outline-none transition-all cursor-pointer appearance-none shadow-[4px_4px_0px_rgba(17,17,17,1)]"
                  >
                    <option value="none">Baseline</option>
                    <option value="CCC">Cycocel (CCC)</option>
                    <option value="Paclobutrazol">Paclobutrazol (PBZ)</option>
                  </select>
                </div>

                <div className="group">
                  <label className="text-meta mb-2 block font-bold text-xs sm:text-sm">Canopy System</label>
                  <select
                    value={trainingSystem}
                    onChange={(e) => setTrainingSystem(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 sm:px-4 py-3 bg-editorial-cream border-2 border-editorial-charcoal font-serif text-base sm:text-lg focus:border-editorial-gold outline-none transition-all cursor-pointer appearance-none shadow-[4px_4px_0px_rgba(17,17,17,1)]"
                  >
                    <option value="standard">Standard</option>
                    <option value="2-stem">2-Stem Vertical</option>
                    <option value="4-stem">4-Stem Complex</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || isLoading}
                className="w-full mt-4 sm:mt-8 py-3 sm:py-4 bg-editorial-charcoal text-editorial-cream text-base sm:text-lg italic hover:bg-editorial-gold transition-all duration-300 disabled:opacity-50 border-2 border-editorial-charcoal"
              >
                {isLoading ? "Synthesizing Data..." : "Execute Analysis"}
              </button>
            </div>

            {error && (
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 border-l-4 border-red-800 bg-red-100 text-red-900 font-serif italic text-base sm:text-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Display */}
        <div className={`lg:col-span-7 p-5 sm:p-8 md:p-12 transition-all duration-1000 ${result ? 'bg-editorial-cream' : 'bg-editorial-charcoal/5'}`}>
          <div className="max-w-4xl mx-auto h-full">
            {!result && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 sm:py-20 animate-reveal" style={{ animationDelay: "0.3s" }}>
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-thick border-editorial-charcoal flex items-center justify-center mb-6 sm:mb-8 opacity-30">
                  <div className="w-2 h-2 bg-editorial-charcoal rounded-full animate-ping" />
                </div>
                <div className="heading-sub text-editorial-charcoal mb-3 sm:mb-4 uppercase tracking-widest text-xs sm:text-sm">Awaiting Input</div>
                <p className="text-editorial-charcoal italic text-lg sm:text-2xl max-w-sm leading-relaxed">
                  &ldquo;Observation begins with the acquisition of visual evidence.&rdquo;
                </p>
              </div>
            )}

            {isLoading && (
              <div className="h-full flex flex-col items-center justify-center py-12 sm:py-20 animate-reveal">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-6 sm:mb-8">
                  <div className="absolute inset-0 border-thick border-editorial-charcoal/20 rounded-full" />
                  <div className="absolute inset-0 border-t-editorial-charcoal border-4 rounded-full animate-spin" />
                </div>
                <div className="heading-sub text-editorial-charcoal uppercase tracking-widest text-xs sm:text-sm">Syncing Neural Core</div>
              </div>
            )}

            {result && <ResultsDashboard result={result} />}
          </div>
        </div>
      </section>

      {/* Tech Footer */}
      <section className="dark-section px-5 sm:px-8 md:px-16 py-12 sm:py-24 border-thick-t">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-16 animate-reveal">
          <div>
            <div className="heading-sub text-editorial-gold mb-4 sm:mb-6">Inference Core</div>
            <p className="text-base sm:text-lg leading-relaxed opacity-80">
              Parallel execution of YOLO object persistence and VLM contextual fallback ensures absolute analysis reliability.
            </p>
          </div>
          <div>
            <div className="heading-sub text-editorial-gold mb-4 sm:mb-6">Pixel Metric</div>
            <p className="text-base sm:text-lg leading-relaxed opacity-80">
              Sub-millimeter volumetric estimation derived from Husk-to-Fruit area ratios and maturation coefficients.
            </p>
          </div>
          <div className="hidden md:flex md:col-span-2 justify-end items-end opacity-10">
            <div className="heading-display text-[8rem] lg:text-[12rem] leading-[0.8] italic">
              PX_7
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
