/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type ProgramCard = {
  title: string;
  description: string;
  borderColor: string;
  textColor: string;
};

const upcomingPrograms: ProgramCard[] = [
  {
    title: "Mentor Mixer Programs",
    description:
      "A networking platform Connecting incubated founders with the Sector specific mentors, investors, and industry leaders to accelerate and build startup growth in the market.",
    borderColor: "bg-[#D91B5C]",
    textColor: "text-[#D91B5C]",
  },
  {
    title: "Investor Demo Day",
    description:
      "A dynamic platform, under the GARVI initiative of GUSEC, enables potential startups to pitch to investors, VCs, and angel networks explore strategic funding growth opportunities.",
    borderColor: "bg-[#D99100]",
    textColor: "text-[#D99100]",
  },
  {
    title: "Masterclass: Scaling",
    description:
      "A power-packed masterclass exploring the journey of building and scaling a successful Indian brand, with practical insights on sales, distribution, market expansion, and sustainable business growth.",
    borderColor: "bg-[#6AA84F]",
    textColor: "text-[#6AA84F]",
  },
  {
    title: "VSCIC Felicitation",
    description:
      "Celebrating innovation excellence in students from the Tribal Region programs with special recognition.",
    borderColor: "bg-[#E05326]",
    textColor: "text-[#E05326]",
  },
];

export const UpcomingProgramsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const revealTargets = node.querySelectorAll<HTMLElement>(".programs-reveal");
    const cardTargets = node.querySelectorAll<HTMLElement>(".program-card-item");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        revealTargets,
        { autoAlpha: 0, y: 24, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        cardTargets,
        { autoAlpha: 0, y: 32, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.15,
        }
      );
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-16 sm:py-24"
      id="upcoming-programs-section"
    >
      {/* Visual background details */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,74,0.02)_1px,transparent_1px)] bg-[length:48px_48px] pointer-events-none" />
      <div className="absolute right-[-8rem] top-10 h-72 w-72 rounded-full bg-[#FF6B00]/5 blur-3xl pointer-events-none" />
      <div className="absolute left-[-6rem] bottom-10 h-[22rem] w-[22rem] rounded-full bg-[#07144A]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="programs-reveal mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-normal text-[#07144A] sm:text-4xl md:text-5xl">
            Upcoming Programs Of This Month
          </h2>
          <div className="mt-4 mx-auto h-1 w-20 bg-gradient-to-r from-[#FF6B00] to-[#F7B914] rounded-full" />
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingPrograms.map((program, index) => (
            <div
              key={index}
              className="program-card-item group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200/90 bg-white p-6 shadow-[0_12px_36px_rgba(7,20,74,0.03)] transition-all duration-300 hover:-translate-y-2 hover:border-slate-300/80 hover:shadow-[0_20px_50px_rgba(7,20,74,0.07)]"
            >
              {/* Thick Top Border Highlight */}
              <div className={`absolute top-0 inset-x-0 h-[6px] ${program.borderColor}`} />

              <div className="mt-4 space-y-4">
                <h3 className="text-xl font-extrabold tracking-tight text-[#07144A] transition-colors duration-300 group-hover:text-[#FF6B00]">
                  {program.title}
                </h3>
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-500 font-medium">
                  {program.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <span className={`text-[11px] font-black uppercase tracking-widest ${program.textColor}`}>
                  REGISTRATION OPEN SOON
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
