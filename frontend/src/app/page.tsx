"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches || "ontouchstart" in window);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="relative">
      <div className="bg-grain" />
      
      {/* Hero: Editorial Print */}
      <section className="relative min-h-screen flex items-center px-5 sm:px-8 md:px-16 pt-20 sm:pt-24 pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-8 animate-reveal">
            <div className="heading-sub text-editorial-charcoal mb-10 flex items-center gap-4 uppercase tracking-widest text-sm">
              <span className="w-8 h-[2px] bg-editorial-charcoal" />
              Volume I • Issue 1 • 2026
            </div>
            
            <h1 className="heading-display text-4xl sm:text-6xl md:text-7xl lg:text-[9rem] mb-6 sm:mb-12">
              Future of <br />
              <span className="italic text-editorial-gold font-normal">Precision</span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl max-w-2xl mb-8 sm:mb-16 leading-relaxed text-editorial-charcoal">
              Redefining the study of <span className="font-bold italic">Physalis peruviana</span> through advanced neural vision and autonomous phenotyping.
            </p>

            <div className="flex flex-wrap gap-6 sm:gap-12 items-center">
              <Link
                href="/analyze"
                className="group flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full border-thick border-editorial-charcoal flex items-center justify-center group-hover:bg-editorial-charcoal group-hover:text-editorial-cream transition-all duration-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <span className="heading-sub">Start Analysis</span>
              </Link>
              <Link
                href="/research"
                className="heading-sub border-b-2 border-editorial-charcoal pb-1 hover:text-editorial-gold hover:border-editorial-gold transition-all"
              >
                Read Studies
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 relative animate-reveal" style={{ animationDelay: "0.2s" }}>
            <div className={`relative aspect-[3/4] overflow-hidden transition-all duration-1000 border-thick ${isMobile ? '' : 'grayscale hover:grayscale-0'}`}>
              <Image 
                src="/editorial-hero.png" 
                alt="Cape Gooseberry"
                fill
                priority
                className={`object-cover ${isMobile ? 'animate-cinematic' : 'scale-110 hover:scale-100 transition-transform duration-[2s]'}`}
              />
            </div>
            <div className="mt-6 border-t border-editorial-charcoal pt-4">
              <div className="text-meta">Figure 1.0</div>
              <div className="text-sm italic text-editorial-charcoal mt-1">Alpha Protocol Observation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="px-5 sm:px-8 md:px-16 py-12 sm:py-24 border-thick-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-display text-2xl sm:text-4xl md:text-5xl mb-8 sm:mb-12 text-center">
            Bridging the gap between <span className="italic font-normal">nature</span> and data.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 text-justify">
            <p className="text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
              Our system utilizes state-of-the-art computer vision to automate the estimation of fruit yield and ripeness, providing researchers with unprecedented clarity in the field. This ensures high data integrity across all environmental conditions.
            </p>
            <p className="text-lg leading-relaxed">
              By digitizing the lifecycle of the Cape Gooseberry, we empower sustainable agricultural practices through empirical evidence and real-time insights, standardizing phenotyping across various growing altitudes.
            </p>
          </div>
        </div>
      </section>

      {/* Refined Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-thick-t border-thick-b">
        {[
          {
            title: "Neural Vision",
            desc: "Custom-trained models optimized for agricultural complexity."
          },
          {
            title: "Spectral Depth",
            desc: "Precision classification across the entire ripening spectrum."
          },
          {
            title: "Biomass Logic",
            desc: "Algorithmic forecasting integrated with plant architecture."
          }
        ].map((feat, i) => (
          <div key={i} className="p-8 sm:p-12 lg:p-16 border-b sm:border-r border-editorial-charcoal/20 last:border-b-0 sm:last:border-r-0 lg:last:border-r-0 hover:bg-editorial-charcoal hover:text-editorial-cream transition-all duration-700 group animate-reveal" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
            <h3 className="heading-display text-3xl mb-6">{feat.title}</h3>
            <p className="text-lg leading-relaxed italic">{feat.desc}</p>
            <div className="mt-12 w-8 h-[2px] bg-editorial-charcoal group-hover:bg-editorial-gold group-hover:w-full transition-all duration-700" />
          </div>
        ))}
      </section>

      {/* Quote: Academic Focus */}
      <section className="dark-section px-5 sm:px-8 md:px-16 py-16 sm:py-40 flex items-center justify-center text-center">
        <div className="max-w-4xl animate-reveal">
          <h2 className="heading-display text-3xl sm:text-5xl md:text-7xl italic font-normal mb-8 sm:mb-12 leading-tight">
            “Knowledge is the most <br className="hidden sm:block" />valuable crop.”
          </h2>
          <div className="heading-sub text-editorial-gold uppercase tracking-widest text-sm">— Scientific Statement 2026</div>
        </div>
      </section>
    </div>
  );
}
