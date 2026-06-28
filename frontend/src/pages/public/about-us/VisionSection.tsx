import React from "react";
import { visionPillars } from "./aboutData";

export const VisionSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="about-reveal mx-auto max-w-[86rem] px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#FF6B00]">
              Our vision
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">
              A single roof for an evolving startup India.
            </h2>
          </div>

          <div>
            <div className="space-y-4 text-base leading-8 text-slate-700 sm:text-lg">
              <p>
                BHASKAR will work as the central one-stop digital platform that
                will house the ever-evolving startup ecosystem stakeholders
                under one single roof, making it the largest digital registry of
                the startup ecosystem in the world in the coming times.
              </p>
              <p>
                By providing a BHASKAR ID to each participant of the startup
                ecosystem, BHASKAR ensures that every interaction within the
                platform is personalised, streamlined, and impactful.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {visionPillars.map((pillar, index) => (
            <div key={pillar.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
              <span className="text-sm font-black text-[#FF6B00]">0{index + 1}</span>
              <h3 className="mt-4 text-xl font-black text-slate-950">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-[#07144A] p-8 text-white sm:p-10">
          <p className="text-2xl font-black leading-snug text-white sm:text-3xl">
            Join us in shaping the future of entrepreneurship and use BHASKAR to
            innovate, connect, and thrive.
          </p>
        </div>
      </div>
    </section>
  );
};
