"use client";

export default function ResearchPage() {
  return (
    <div className="min-h-screen font-serif bg-editorial-cream text-editorial-charcoal">
      <div className="bg-grain" />

      <section className="max-w-4xl mx-auto px-5 sm:px-8 md:px-16 pt-24 sm:pt-32 pb-10 sm:pb-16 text-center border-b-2 border-editorial-charcoal">
        <div className="animate-reveal">
          <div className="text-meta uppercase tracking-widest mb-4 sm:mb-6 text-xs sm:text-sm">Technical Documentation</div>
          <h1 className="heading-display text-3xl sm:text-5xl md:text-6xl mb-6 sm:mb-8 leading-tight">
            Autonomous Phenotyping of{" "}
            <span className="italic">Physalis peruviana</span>
          </h1>
          <p className="text-sm sm:text-lg italic text-editorial-gray mb-8 sm:mb-12">
            Abstract: A comprehensive study on integrating deep neural architectures for real-time ripeness classification and biomass estimation in high-altitude tropical agriculture.
          </p>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-widest border-t border-editorial-charcoal/20 pt-4 sm:pt-6 inline-block">
            Published: Spring 2026
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 sm:px-8 md:px-16 py-12 sm:py-20">
        <div className="animate-reveal" style={{ animationDelay: "0.1s" }}>
          <h2 className="heading-display text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">1. Introduction to Methodology</h2>
          <p className="text-base sm:text-xl leading-relaxed text-justify sm:indent-12 mb-6 sm:mb-8">
            Our approach utilizes a dual-stage inference pipeline to ensure absolute data integrity in complex field conditions. The fundamental challenge in agricultural computer vision&mdash;particularly with <span className="italic">Physalis peruviana</span>&mdash;is handling unpredictable light diffusion through the protective husk (calyx).
          </p>
          <p className="text-base sm:text-xl leading-relaxed text-justify sm:indent-12">
            By leveraging a primary YOLOv8 layer for rapid spatial localization and a secondary VLM layer for contextual depth, we achieve a robust analysis flow that adapts to varying light and occlusion.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 sm:px-8 md:px-16 py-8 sm:py-12 border-t border-editorial-charcoal/20">
        <div className="animate-reveal" style={{ animationDelay: "0.2s" }}>
          <h2 className="heading-display text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">2. Core Objectives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { title: "Spectral Indexing", desc: "Mapping biochemical transitions through non-invasive optical scanning." },
              { title: "Volumetric Forecasting", desc: "Digital biomass estimation with precision training multipliers." },
              { title: "Health Assessment", desc: "Autonomous monitoring of phytosanitary structural indices." }
            ].map((obj, i) => (
              <div key={i} className="text-center">
                <div className="font-bold text-base sm:text-lg mb-3 sm:mb-4 italic">{obj.title}</div>
                <p className="text-base sm:text-lg leading-relaxed text-justify">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 sm:px-8 md:px-16 py-12 sm:py-20 border-t border-editorial-charcoal/20">
        <div className="animate-reveal" style={{ animationDelay: "0.3s" }}>
          <h2 className="heading-display text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center">3. Architecture Specifications</h2>
          <div className="border-2 border-editorial-charcoal">
            {[
              { param: "Detection Layer", val: "YOLOv8s Optimized", detail: "mAP50: 0.792" },
              { param: "Contextual Layer", val: "VLM Parallel Flow", detail: "Deep Semantic latent space" },
              { param: "Input Fidelity", val: "640px to 1024px", detail: "Dynamic Resolution" },
              { param: "Inference Latency", val: "Sub-second Flow", detail: "Optimized GPU Pipeline" }
            ].map((spec, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-6 border-b border-editorial-charcoal last:border-b-0 hover:bg-editorial-charcoal/5 transition-all">
                <div className="font-bold mb-1 sm:mb-0 text-sm sm:text-base">{spec.param}</div>
                <div className="italic sm:text-center text-sm sm:text-base">{spec.val}</div>
                <div className="text-meta sm:text-right mt-1 sm:mt-0 opacity-60 text-xs">{spec.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-editorial-charcoal text-editorial-cream px-5 sm:px-8 md:px-16 py-16 sm:py-32 text-center my-8 sm:my-16">
        <div className="max-w-5xl mx-auto animate-reveal" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-meta uppercase tracking-widest mb-8 sm:mb-12 text-xs sm:text-sm">Equation 1.1: Forecasting Model</h2>
          <div className="heading-display text-2xl sm:text-4xl md:text-6xl mb-10 sm:mb-16 italic font-normal tracking-wide">
            Y = &Sigma; (A<sub>i</sub> &times; R<sub>f</sub>) &times; T<sub>s</sub> &times; G<sub>r</sub>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-8 sm:pt-12 border-t border-editorial-cream/20">
            {[
              { sym: "A", sub: "i", label: "Fruit Area" },
              { sym: "R", sub: "f", label: "Ripeness Factor" },
              { sym: "T", sub: "s", label: "Training Multiplier" },
              { sym: "G", sub: "r", label: "Growth Coeff." }
            ].map((v, i) => (
              <div key={i}>
                <div className="text-editorial-gold heading-display text-xl sm:text-2xl mb-1 sm:mb-2">{v.sym}<sub>{v.sub}</sub></div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-80">{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 md:px-16 pb-16 sm:pb-32 text-center">
        <p className="text-base sm:text-xl italic max-w-xl mx-auto opacity-60 font-serif">
          &ldquo;The digitization of nature is not an end, but a beginning of understanding.&rdquo;
        </p>
      </section>
    </div>
  );
}
