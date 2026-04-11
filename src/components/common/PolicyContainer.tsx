import React from "react";
const heroBg = "/images/hero-bg.png";
import { Clock } from "lucide-react";

interface PolicySection {
  title: string;
  content: React.ReactNode;
}

interface PolicyContainerProps {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export function PolicyContainer({
  title,
  effectiveDate,
  lastUpdated,
  sections,
}: PolicyContainerProps) {
  return (
    <div className="flex flex-col bg-brand-navy min-h-screen font-montserrat text-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-b from-brand-navy/60 to-brand-navy" />
        
        <div className="relative z-10 px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold font-playfair mb-4 bg-linear-to-r from-white to-brand-blue-light bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-blue-light" />
              <span>Effective Date: {effectiveDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-blue-light" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative -mt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative group">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl group-hover:bg-brand-blue/20 transition-colors duration-700" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-blue-light/10 rounded-full blur-3xl group-hover:bg-brand-blue-light/20 transition-colors duration-700" />
            
            <div className="relative z-10 space-y-12">
              {sections.map((section, index) => (
                <div key={index} className="space-y-4">
                  <h2 className="text-2xl font-bold text-brand-blue-light flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-blue/20 text-sm font-mono">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="text-text-secondary leading-relaxed space-y-4 prose prose-invert max-w-none">
                    {section.content}
                  </div>
                  {index < sections.length - 1 && (
                    <div className="pt-8 border-b border-white/5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
