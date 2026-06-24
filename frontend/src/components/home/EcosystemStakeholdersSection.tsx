/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Rocket,
  Coins,
  Compass,
  BookOpen,
  UserCheck,
  Layers,
  Landmark,
  Briefcase,
} from "lucide-react";

type Stakeholder = {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
};

const individualStakeholders: Stakeholder[] = [
  {
    title: "Founders / Entrepreneurs",
    description: "Launch, scale, and manage your startup journey with direct access to ecosystem players.",
    icon: <Rocket className="h-6 w-6 text-[#FF6B00]" />,
    benefits: ["Apply for seed fund grants", "DPIIT registration tools", "1-on-1 expert mentorship"],
  },
  {
    title: "Investors / Angels",
    description: "Discover verified high-traction startups, manage deal flow, and syndicates on a unified hub.",
    icon: <Coins className="h-6 w-6 text-[#FF6B00]" />,
    benefits: ["Deal-flow discovery tools", "Portfolio tracking dashboards", "Co-investment matching"],
  },
  {
    title: "Mentors / Experts",
    description: "Share your experience and guide promising founders through technical and business checkpoints.",
    icon: <Compass className="h-6 w-6 text-[#FF6B00]" />,
    benefits: ["Schedule virtual consulting", "Participate in pitch audits", "Ecosystem recognition benefits"],
  },
  {
    title: "Student Innovators",
    description: "Transition from research projects into commercial startups with capacity building resources.",
    icon: <BookOpen className="h-6 w-6 text-[#FF6B00]" />,
    benefits: ["Innovation lab access", "Student internship matching", "Prototype seed grants"],
  },
];

const organisationStakeholders: Stakeholder[] = [
  {
    title: "Startups",
    description: "Get certified, claim tax exemptions (Section 80-IAC), and bid directly for public procurement.",
    icon: <UserCheck className="h-6 w-6 text-[#FF6B00]" />,
    benefits: ["Sovereign scheme listings", "Fast-track compliance help", "GeM portal priority listings"],
  },
  {
    title: "Incubators & Accelerators",
    description: "Streamline cohort applications, monitor program metrics, and allocate seed capital.",
    icon: <Layers className="h-6 w-6 text-[#FF6B00]" />,
    benefits: ["Cohort applicant databases", "SISFS fund dispatch tools", "Performance audit reports"],
  },
  {
    title: "Corporate Partners",
    description: "Run sandboxes, pilot emerging tech, and form strategic industry alliances with startups.",
    icon: <Briefcase className="h-6 w-6 text-[#FF6B00]" />,
    benefits: ["Piloting setup sandbox", "Innovation challenge hosts", "Joint venture scouting"],
  },
  {
    title: "Government Nodal Bodies",
    description: "Monitor regional development metrics, publish guidelines, and run policy sandboxes.",
    icon: <Landmark className="h-6 w-6 text-[#FF6B00]" />,
    benefits: ["Policy feedback portals", "Compliance audit panels", "State startup rank tracking"],
  },
];

export const EcosystemStakeholdersSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"individual" | "organisation">("individual");
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardGridRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const tabRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const revealTargets = node.querySelectorAll<HTMLElement>(".stakeholder-reveal");
      const shellTargets = node.querySelectorAll<HTMLElement>(".stakeholder-shell");
      const cardTargets = node.querySelectorAll<HTMLElement>(".stakeholder-card");
      const accentTargets = node.querySelectorAll<HTMLElement>(".stakeholder-accent");

      if (prefersReducedMotion) {
        gsap.set([...revealTargets, ...shellTargets, ...cardTargets, ...accentTargets], {
          autoAlpha: 1,
          clearProps: "all",
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        revealTargets,
        { autoAlpha: 0, y: 30, filter: "blur(10px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.1 },
        0
      )
        .fromTo(
          shellTargets,
          { autoAlpha: 0, y: 22, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 },
          0.12
        )
        .fromTo(
          cardTargets,
          { autoAlpha: 0, y: 34, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.09 },
          0.26
        )
        .fromTo(
          accentTargets,
          { autoAlpha: 0, scale: 0.88 },
          { autoAlpha: 1, scale: 1, duration: 1, stagger: 0.1, ease: "sine.out" },
          0.1
        );
    }, node);

    return () => ctx.revert();
  }, []);

  // Animates the cards when the tab changes
  useEffect(() => {
    if (!cardGridRef.current) return;

    const cards = cardGridRef.current.children;
    gsap.killTweensOf(cards);

    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 24, scale: 0.98, filter: "blur(6px)" },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.55,
        stagger: 0.075,
        ease: "power2.out",
      }
    );
  }, [activeTab]);

  const activeStakeholders =
    activeTab === "individual" ? individualStakeholders : organisationStakeholders;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#07144A] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28"
      style={{
        borderRadius: "120px 0px 0px 0px",
      }}
      id="ecosystem-stakeholders-section"
    >
      {/* Visual background elements */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[length:54px_54px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="stakeholder-accent absolute right-[-10%] top-[-8%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.16)_0%,rgba(255,255,255,0)_72%)] blur-3xl pointer-events-none" />
      <div className="stakeholder-accent absolute left-[-14%] bottom-[-12%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(249,178,51,0.08)_0%,rgba(255,255,255,0)_72%)] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header content */}
        <div ref={headerRef} className="stakeholder-reveal mx-auto mb-12 max-w-4xl text-center space-y-6">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-1 text-[11px] font-black uppercase tracking-[0.26em] text-[#F9B233] backdrop-blur-sm">
            Persona ecosystem
          </span>
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ecosystem Stakeholders
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            BHASKAR captures the entire ecosystem over one channel through the following persona options
          </p>
        </div>

        {/* Tab Buttons */}
        <div ref={tabRef} className="stakeholder-reveal mb-16 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-md">
            <button
              onClick={() => setActiveTab("individual")}
              className={`rounded-full px-8 py-3 text-xs font-black uppercase tracking-[0.24em] transition-all duration-300 ${
                activeTab === "individual"
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF4B2B] text-white shadow-[0_14px_34px_rgba(255,107,0,0.34)]"
                  : "text-white/78 hover:text-white hover:bg-white/8"
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setActiveTab("organisation")}
              className={`rounded-full px-8 py-3 text-xs font-black uppercase tracking-[0.24em] transition-all duration-300 ${
                activeTab === "organisation"
                  ? "bg-gradient-to-r from-[#FF6B00] to-[#FF4B2B] text-white shadow-[0_14px_34px_rgba(255,107,0,0.34)]"
                  : "text-white/78 hover:text-white hover:bg-white/8"
              }`}
            >
              Organisation
            </button>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div
          ref={cardGridRef}
          className="stakeholder-shell grid grid-cols-1 gap-6 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-4"
        >
          {activeStakeholders.map((item, index) => (
            <div
              key={`${activeTab}-${index}`}
              className="stakeholder-card group relative overflow-hidden rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#FF6B00]/40 hover:shadow-[0_24px_70px_rgba(255,107,0,0.16)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,0,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_28%)] opacity-70 pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#FF6B00]/12 blur-3xl pointer-events-none transition-transform duration-500 group-hover:scale-125" />

              <div className="relative flex h-full flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex rounded-2xl border border-white/10 bg-white/7 p-3 text-[#FF6B00] shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-black tracking-tight text-white transition-colors duration-300 group-hover:text-[#F9B233]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 border-t border-white/8 pt-5">
                  {item.benefits.map((benefit, bIndex) => (
                    <li key={bIndex} className="flex items-start gap-3 text-[10px] font-semibold tracking-wide text-slate-300">
                      <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-[#FF6B00] shadow-[0_0_0_4px_rgba(255,107,0,0.12)]" />
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
