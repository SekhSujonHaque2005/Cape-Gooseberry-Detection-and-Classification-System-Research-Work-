"use client";

import { AnalysisResult } from "@/lib/api";
import { useEffect, useState } from "react";

interface ResultsDashboardProps {
  result: AnalysisResult;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.round(current * 100) / 100);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{typeof target === "number" && target % 1 !== 0 ? count.toFixed(2) : Math.round(count)}{suffix}</span>;
}

function LedgerMetric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="py-4 sm:py-8 border-b border-editorial-charcoal/20 group hover:bg-editorial-charcoal/5 transition-all">
      <div className="text-meta font-bold mb-1 sm:mb-2 text-xs sm:text-sm">{label}</div>
      <div className="heading-display text-3xl sm:text-5xl group-hover:pl-2 transition-all duration-300">
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
    </div>
  );
}

export default function ResultsDashboard({ result }: ResultsDashboardProps) {
  const total = result.total_fruits;
  const ripePercent = total > 0 ? (result.ripe / total) * 100 : 0;
  const semiPercent = total > 0 ? (result.semi_ripe / total) * 100 : 0;
  const unripePercent = total > 0 ? (result.unripe / total) * 100 : 0;

  return (
    <div className="animate-reveal font-serif">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8 mb-8 sm:mb-16 pb-3 sm:pb-4 border-b-2 border-editorial-charcoal">
        <div>
          <div className="text-meta mb-1 sm:mb-2 text-xs sm:text-sm">Harvest Forecast</div>
          <h2 className="heading-display text-2xl sm:text-4xl font-bold">Field Assessment</h2>
        </div>
        <div className="text-meta flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <span className="opacity-60 italic">AUTONOMOUS PROTOCOL v1.0</span>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-12 mb-8 sm:mb-16">
        <LedgerMetric label="Total Fruit Found" value={result.total_fruits} />
        <LedgerMetric label="Ready to Pick" value={result.ripe} />
        <LedgerMetric label="Maturing" value={result.semi_ripe} />
        <LedgerMetric label="Initial Growth" value={result.unripe} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16 border-t-2 border-editorial-charcoal pt-8 sm:pt-16">
        {/* Left: Yield & Timeline */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-12 border-2 border-editorial-charcoal bg-editorial-cream text-editorial-charcoal relative overflow-hidden group shadow-[4px_4px_0px_rgba(17,17,17,1)] sm:shadow-[8px_8px_0px_rgba(17,17,17,1)]">
            <div className="relative z-10">
              <div className="text-meta font-bold mb-4 sm:mb-8 text-xs sm:text-sm">Projected Harvest</div>
              <div className="flex items-baseline gap-2 sm:gap-4 mb-4 sm:mb-8">
                <span className="heading-display text-5xl sm:text-[8rem] group-hover:scale-105 transition-transform duration-700">
                  <AnimatedCounter target={result.estimated_yield_kg} />
                </span>
                <span className="heading-display text-2xl sm:text-4xl italic">kg</span>
              </div>
              <p className="text-sm italic leading-relaxed max-w-sm opacity-80">
                Estimated weight based on visual specimen analysis and growth factors.
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-16 space-y-8">
            <h3 className="text-meta font-bold border-b border-editorial-charcoal pb-2 text-xs sm:text-sm">Harvest Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border border-editorial-charcoal/20 bg-editorial-charcoal/5">
                <div className="text-xs uppercase tracking-widest opacity-60 mb-2">Ready Now</div>
                <div className="font-bold text-lg">{result.harvest_timeline.ripe}</div>
                <div className="text-[10px] italic mt-1">{result.ripe} fruits</div>
              </div>
              <div className="p-4 border border-editorial-charcoal/20">
                <div className="text-xs uppercase tracking-widest opacity-60 mb-2">Next Batch</div>
                <div className="font-bold text-lg">{result.harvest_timeline.semi_ripe}</div>
                <div className="text-[10px] italic mt-1">{result.semi_ripe} fruits</div>
              </div>
              <div className="p-4 border border-editorial-charcoal/20">
                <div className="text-xs uppercase tracking-widest opacity-60 mb-2">Future Harvest</div>
                <div className="font-bold text-lg">{result.harvest_timeline.unripe}</div>
                <div className="text-[10px] italic mt-1">{result.unripe} fruits</div>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-16 space-y-6 sm:space-y-8">
            <h3 className="text-meta font-bold border-b border-editorial-charcoal pb-2 text-xs sm:text-sm">Plant Vitality</h3>
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              {[
                { label: "Canopy Density", value: result.architecture.canopy_density_percent },
                { label: "Complexity", value: result.architecture.branch_complexity_score }
              ].map((item, i) => (
                <div key={i} className="pl-3 sm:pl-6 border-l-2 border-editorial-charcoal">
                  <div className="heading-display text-2xl sm:text-4xl mb-1 sm:mb-2">{item.value}%</div>
                  <div className="text-meta text-xs sm:text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Insights */}
        <div className="lg:col-span-5 space-y-8 sm:space-y-16">
          <div>
            <h3 className="text-meta font-bold border-b border-editorial-charcoal pb-2 mb-4 sm:mb-8 text-xs sm:text-sm">Maturity Progress</h3>
            <div className="space-y-8">
              {[
                { label: "Ready to Pick", val: ripePercent, color: "bg-editorial-charcoal" },
                { label: "Maturing", val: semiPercent, color: "bg-editorial-gray" },
                { label: "Early Stage", val: unripePercent, color: "bg-editorial-charcoal/20" }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-meta">
                    <span>{item.label}</span>
                    <span>{item.val.toFixed(1)}%</span>
                  </div>
                  <div className="h-4 bg-editorial-charcoal/10 w-full border border-editorial-charcoal/20">
                    <div 
                      className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.ai_insights && (
            <div className="p-4 sm:p-8 border-2 border-editorial-charcoal bg-editorial-cream shadow-[4px_4px_0px_rgba(17,17,17,1)]">
              <div className="text-meta font-bold mb-4 sm:mb-6 text-xs sm:text-sm">Narrative Insights</div>
              <p className="text-base sm:text-xl italic leading-relaxed text-editorial-charcoal mb-4 sm:mb-8">
                &ldquo;{result.ai_insights.observations}&rdquo;
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-8 pt-4 sm:pt-8 border-t border-editorial-charcoal/20">
                <div>
                  <div className="text-meta mb-1 opacity-60">Health Index</div>
                  <div className="font-bold text-lg">{result.ai_insights.health_notes || "Optimal"}</div>
                </div>
                <div>
                  <div className="text-meta mb-1 opacity-60">Growth Phase</div>
                  <div className="font-bold text-lg">{result.ai_insights.growth_stage}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
