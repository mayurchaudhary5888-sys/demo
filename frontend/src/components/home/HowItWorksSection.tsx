/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { UserPlus, Building2, Users, Monitor, Link2 } from "lucide-react";

type StepNode = {
  id: number;
  label: string;
  sublabel?: string;
  description: string;
  icon: React.ReactNode;
  position: "top" | "bottom" | "middle";
  // Coordinates for SVG path on desktop (viewBox 1200 x 400)
  x: number;
  y: number;
};

const steps: StepNode[] = [
  {
    id: 1,
    label: "Sign-up",
    description: "Create your basic account to access the BHASKAR network.",
    icon: null, // Represented by a special green node in the timeline
    position: "middle",
    x: 60,
    y: 200,
  },
  {
    id: 2,
    label: "Select profile type",
    description: "Choose your primary ecosystem role: founder, investor, mentor, or incubator.",
    icon: <UserPlus className="h-6 w-6 text-[#07144A]" />,
    position: "bottom",
    x: 260,
    y: 260,
  },
  {
    id: 3,
    label: "Add your details",
    description: "Enter organization information, sector experience, and current goals.",
    icon: <Building2 className="h-6 w-6 text-[#07144A]" />,
    position: "top",
    x: 440,
    y: 140,
  },
  {
    id: 4,
    label: "Generate Bhaskar ID",
    description: "Receive a unique digital ecosystem identifier to access national resources.",
    icon: <Users className="h-6 w-6 text-[#07144A]" />,
    position: "bottom",
    x: 680,
    y: 260,
  },
  {
    id: 5,
    label: "Complete public profile and publish",
    description: "Add showcase details, key updates, and publish to index for visibility.",
    icon: <Monitor className="h-6 w-6 text-[#07144A]" />,
    position: "top",
    x: 880,
    y: 140,
  },
  {
    id: 6,
    label: "Start connecting!",
    description: "Initiate direct secure connections, search partners, and grow together.",
    icon: <Link2 className="h-6 w-6 text-[#07144A]" />,
    position: "bottom",
    x: 1040,
    y: 260,
  },
];

// Intermediate green dots on the wave
const intermediateDots = [
  { x: 160, y: 140 }, // Peak 1
  { x: 560, y: 260 }, // Trough 2
  { x: 800, y: 140 }, // Peak 3
  { x: 960, y: 260 }, // Trough 4
  { x: 1120, y: 140 }, // Peak 4
];

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stepButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealTargets = node.querySelectorAll<HTMLElement>(".how-it-works-reveal");
    const shellTargets = node.querySelectorAll<HTMLElement>(".how-it-works-shell");
    const stepTargets = node.querySelectorAll<HTMLElement>(".how-it-works-step");
    const greenDotTargets = node.querySelectorAll<HTMLElement>(".green-flow-dot");
    const pathTarget = node.querySelector<SVGPathElement>(".timeline-wave-path");
    const mobileCards = node.querySelectorAll<HTMLElement>(".how-it-works-mobile-card");

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([...revealTargets, ...shellTargets, ...stepTargets, ...greenDotTargets, ...mobileCards], {
          autoAlpha: 1,
          clearProps: "all",
        });
        if (pathTarget) gsap.set(pathTarget, { strokeDasharray: "none", strokeDashoffset: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        revealTargets,
        { autoAlpha: 0, y: 34, filter: "blur(10px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.12 },
        0
      )
        .fromTo(
          shellTargets,
          { autoAlpha: 0, y: 28, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 },
          0.12
        )
        .fromTo(
          stepTargets,
          { autoAlpha: 0, y: 30, scale: 0.86, filter: "blur(8px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.1 },
          0.28
        )
        .fromTo(
          greenDotTargets,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.55, stagger: 0.08, ease: "back.out(2)" },
          0.55
        )
        .fromTo(
          mobileCards,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 },
          0.28
        );

      if (pathTarget) {
        const length = pathTarget.getTotalLength();
        gsap.set(pathTarget, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(pathTarget, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0.42);
      }

      tl.fromTo(
        ".how-it-works-glow",
        { autoAlpha: 0, scale: 0.84 },
        { autoAlpha: 1, scale: 1, duration: 1.2, stagger: 0.12, ease: "sine.out" },
        0
      );
    }, node);

    return () => ctx.revert();
  }, []);

  const animateStepButton = (index: number, entering: boolean) => {
    const button = stepButtonRefs.current[index];
    if (!button) return;

    gsap.to(button, {
      y: entering ? -10 : 0,
      scale: entering ? 1.03 : 1,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible bg-white py-16 sm:py-24"
      id="how-it-works-section"
    >
      <div className="how-it-works-glow absolute left-0 top-[14%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.08)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="how-it-works-glow absolute right-0 top-[22%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(7,20,74,0.08)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="absolute inset-0 opacity-[0.36] bg-[linear-gradient(90deg,rgba(11,42,91,0.03)_1px,transparent_1px)] bg-[length:56px_56px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="how-it-works-reveal mx-auto mb-14 max-w-3xl text-center space-y-4 sm:mb-16">
          <span className="inline-flex items-center rounded-full border border-[#FF6B00]/20 bg-[#FF6B00]/5 px-4 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-[#FF6B00]">
            How it works
          </span>
          <h2 className="text-3xl font-black tracking-tight text-[#07144A] sm:text-4xl md:text-5xl">
            How it Works
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Fast-track your startup journey in 6 simplified steps. Follow this path to get fully onboarded and connect with top Indian ecosystem leaders.
          </p>
        </div>

        {/* Desktop Interactive Sine Wave Timeline */}
        <div className="how-it-works-shell relative hidden select-none md:block">
          <div className="relative mx-auto h-[520px] w-full max-w-[1600px] px-0 sm:px-0">
            <div className="absolute right-6 top-2 hidden rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-slate-500 shadow-[0_10px_24px_rgba(7,20,74,0.06)] lg:flex">
              Premium onboarding flow
            </div>

            {/* Background SVG curve */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none"
              viewBox="0 0 1200 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Dotted Connection line */}
              <path
                className="timeline-wave-path"
                d="M 60,200 C 110,140 110,140 160,140 C 210,140 210,260 260,260 C 350,260 350,140 440,140 C 500,140 500,260 560,260 C 620,260 620,260 680,260 C 740,260 740,140 800,140 C 840,140 840,140 880,140 C 920,140 920,260 960,260 C 1000,260 1000,260 1040,260 C 1080,260 1080,140 1120,140 L 1150,200"
                stroke="#D1D5DB"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Render Intermediate Flow Dots */}
            {intermediateDots.map((dot, index) => (
              <div
                key={`dot-${index}`}
                className="green-flow-dot absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_0_8px_rgba(16,185,129,0.08)]"
                style={{ left: `${dot.x}px`, top: `${dot.y}px` }}
              />
            ))}

            {/* Render Step Nodes */}
            {steps.map((step) => {
              const isSignup = step.id === 1;
              const isActive = activeStep === step.id;

              if (isSignup) {
                return (
                  <button
                    key={step.id}
                    ref={(el) => {
                      stepButtonRefs.current[step.id - 1] = el;
                    }}
                    type="button"
                    onMouseEnter={() => {
                      setActiveStep(step.id);
                      animateStepButton(step.id - 1, true);
                    }}
                    onMouseLeave={() => {
                      animateStepButton(step.id - 1, false);
                      setActiveStep(1);
                    }}
                    onFocus={() => setActiveStep(step.id)}
                    onBlur={() => setActiveStep(1)}
                    className="how-it-works-step step-circle-container absolute flex items-center -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-[#FF6B00]/40"
                    style={{ left: `${step.x}px`, top: `${step.y}px` }}
                  >
                    <div className="relative flex items-center gap-3 rounded-full border border-emerald-200 bg-white/95 px-4 py-2 shadow-[0_16px_36px_rgba(7,20,74,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(16,185,129,0.16)]">
                      <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-8 w-8 rounded-full bg-emerald-400/25 blur-md" />
                        <span className="absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-80 animate-ping" />
                        <div className="relative z-10 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.45)]" />
                      </div>
                      <span className="font-extrabold text-sm tracking-wide text-slate-900">
                        {step.label}
                      </span>
                    </div>
                  </button>
                );
              }

              return (
                <button
                  key={step.id}
                  ref={(el) => {
                    stepButtonRefs.current[step.id - 1] = el;
                  }}
                  type="button"
                  onMouseEnter={() => {
                    setActiveStep(step.id);
                    animateStepButton(step.id - 1, true);
                  }}
                  onMouseLeave={() => {
                    animateStepButton(step.id - 1, false);
                    setActiveStep(1);
                  }}
                  onFocus={() => setActiveStep(step.id)}
                  onBlur={() => setActiveStep(1)}
                  className="how-it-works-step step-circle-container absolute group flex flex-col items-center -translate-x-1/2 -translate-y-1/2 rounded-full outline-none"
                  style={{ left: `${step.x}px`, top: `${step.y}px` }}
                >
                  {/* Connecting indicator line to label */}
                  <div
                    className={`how-it-works-step-line absolute h-12 w-px bg-gradient-to-b from-[#FF6B00] to-transparent ${
                      step.position === "top" ? "top-full" : "bottom-full rotate-180"
                    }`}
                  />

                  {/* Main Double-Ring Interactive Circle */}
                  <div className={`how-it-works-node relative z-20 flex h-20 w-20 items-center justify-center rounded-full border transition-all duration-300 ${isActive ? "border-[#FF6B00]/80 shadow-[0_20px_45px_rgba(255,107,0,0.22)] scale-105" : "border-[#FF6B00]/35 shadow-[0_12px_24px_rgba(7,20,74,0.05)]"} bg-white`}>
                    <div className="absolute inset-2 rounded-full border border-orange-200 bg-[radial-gradient(circle_at_top_left,rgba(255,107,0,0.12),rgba(255,255,255,0.32))] transition-colors duration-300 group-hover:bg-[radial-gradient(circle_at_top_left,rgba(255,107,0,0.16),rgba(255,255,255,0.42))]" />
                    <div className={`absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.14),transparent_70%)] opacity-0 transition-opacity duration-300 ${isActive ? "opacity-100" : "group-hover:opacity-100"}`} />
                    <div className="relative z-10 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  {/* Premium Hover Card */}
                  <div
                    className={`how-it-works-step-label absolute w-[255px] text-center flex flex-col items-center ${
                      step.position === "top"
                        ? "bottom-[122px] flex-col"
                        : "top-[122px] flex-col-reverse"
                    }`}
                  >
                    <div
                      className={`pointer-events-none w-full rounded-2xl border border-white/80 bg-white/92 px-4 py-3 text-center shadow-[0_22px_40px_rgba(7,20,74,0.14)] backdrop-blur-xl transition-all duration-300 ${isActive ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"}`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FF6B00]">
                        Step 0{step.id}
                      </p>
                      <h3 className="mt-1 text-[15px] font-black leading-snug text-slate-900">
                        {step.label}
                      </h3>
                      <div className="mx-auto mt-3 h-px w-12 bg-gradient-to-r from-transparent via-[#FF6B00]/60 to-transparent" />
                      <p className="mt-3 text-xs leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet Beautiful Vertical Flow */}
        <div className="md:hidden relative mx-auto max-w-md space-y-8 pl-8 before:absolute before:left-[16px] before:top-2 before:bottom-2 before:w-[2px] before:bg-dashed before:bg-slate-200">
          {/* Vertical dashed timeline guide */}
          <div className="absolute left-[15px] top-4 bottom-4 w-0.5 border-l-2 border-dashed border-slate-300 pointer-events-none" />

          {steps.map((step) => {
            const isSignup = step.id === 1;

            if (isSignup) {
              return (
                <div key={step.id} className="how-it-works-mobile-card relative flex items-center gap-4">
                  {/* Timeline point */}
                  <div className="absolute left-[-24px] flex items-center justify-center w-[18px] h-[18px] rounded-full bg-emerald-500 border-4 border-white shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  </div>
                  <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_14px_34px_rgba(7,20,74,0.06)] backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Step 01
                      </span>
                      <h3 className="font-extrabold text-slate-800 text-sm">{step.label}</h3>
                    </div>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div key={step.id} className="how-it-works-mobile-card relative flex items-start gap-4">
                {/* Timeline point */}
                <div className="absolute left-[-29px] flex items-center justify-center w-7 h-7 rounded-full bg-white border-2 border-[#FF6B00] shadow-sm z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                </div>

                <div className="flex-1 space-y-3 rounded-2xl border border-[#FF6B00]/15 bg-white/92 p-5 shadow-[0_14px_32px_rgba(7,20,74,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/35 hover:shadow-[0_20px_42px_rgba(255,107,0,0.12)]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#FF6B00] bg-orange-50 px-2.5 py-1 rounded">
                      Step 0{step.id}
                    </span>
                    <div className="p-1.5 bg-orange-50/50 rounded-lg">
                      {step.icon}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-slate-800 text-base leading-snug">
                      {step.label}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
