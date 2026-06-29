/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

type ProgramCard = {
  title: string;
  description: string;
  tag: string;
  month: string;
};

const upcomingPrograms: ProgramCard[] = [
  {
    title: "Mentor Mixer Support",
    description:
      "A networking platform Connecting incubated founders with the Sector specific mentors, investors, and industry leaders to accelerate and build startup growth in the market.",
    tag: "Mentorship",
    month: "This month",
  },
  {
    title: "Investor Demo Day",
    description:
      "A dynamic platform, under the GARVI initiative of GUSEC, enables potential startups to pitch to investors, VCs, and angel networks explore strategic funding growth opportunities.",
    tag: "Funding",
    month: "This month",
  },
  {
    title: "Masterclass: Scaling",
    description:
      "A power-packed masterclass exploring the journey of building and scaling a successful Indian brand, with practical insights on sales, distribution, market expansion, and sustainable business growth.",
    tag: "Growth",
    month: "This month",
  },
  {
    title: "VSCIC Felicitation",
    description:
      "Celebrating innovation excellence in students from the Tribal Region support with special recognition.",
    tag: "Recognition",
    month: "This month",
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
      className="relative overflow-hidden bg-white py-20 sm:py-28"
      id="upcoming-programs-section"
    >
      {/* Visual background details */}
      <div className="absolute right-[-10rem] top-8 h-80 w-80 rounded-full bg-[#FF6B00]/7 blur-3xl pointer-events-none" />
      <div className="absolute left-[-9rem] bottom-4 h-[26rem] w-[26rem] rounded-full bg-[#07144A]/6 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="programs-reveal mb-14 grid gap-6 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/20 bg-white px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.24em] text-[#FF6B00] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Upcoming Support
            </span>
            <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-normal text-[#07144A] sm:text-4xl md:text-5xl">
              Support opening this month
            </h2>
          </div>
          <p className="max-w-2xl text-sm font-medium leading-7 text-slate-600 sm:text-base lg:justify-self-end">
            Explore curated mentorship, funding, growth, and recognition opportunities built for founders moving through the BHASKAR ecosystem.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingPrograms.map((program, index) => (
            <div
              key={index}
              className="program-card-item group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_18px_50px_rgba(7,20,74,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#FF6B00]/30 hover:shadow-[0_26px_70px_rgba(7,20,74,0.1)]"
            >
              <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#FF6B00] via-[#F7B914] to-[#07144A]" />
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#FF6B00]/10 blur-3xl transition-transform duration-500 group-hover:scale-125" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <div className="relative space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#FFF4EC] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#FF6B00]">
                    {program.tag}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#07144A] text-white shadow-[0_14px_30px_rgba(7,20,74,0.16)]">
                    <CalendarDays className="h-4.5 w-4.5" />
                  </span>
                </div>

                <h3 className="text-xl font-black leading-snug tracking-tight text-[#07144A] transition-colors duration-300 group-hover:text-[#FF6B00]">
                  {program.title}
                </h3>
                <p className="text-sm font-medium leading-7 text-slate-600">
                  {program.description}
                </p>
              </div>

              <div className="relative mt-8 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Status
                    </p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#07144A]">
                      Registration open soon
                    </p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[#FF6B00] transition group-hover:border-[#FF6B00]/40 group-hover:bg-[#FF6B00] group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  {program.month}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
