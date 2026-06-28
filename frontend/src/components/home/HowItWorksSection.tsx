/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BadgeCheck, Building2, Fingerprint, Link2, MonitorUp, UserPlus } from "lucide-react";

type WorkflowStep = {
  id: number;
  title: string;
  kicker: string;
  description: string;
  icon: React.ReactNode;
};

const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Sign up",
    kicker: "Create access",
    description: "Start with a secure account and enter the BHASKAR ecosystem with a verified identity.",
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Select profile type",
    kicker: "Choose your role",
    description: "Pick the role that fits you best: founder, investor, mentor, incubator, or ecosystem partner.",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Add your details",
    kicker: "Complete essentials",
    description: "Add organization details, sectors, location, goals, and the context others need to discover you.",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: 4,
    title: "Generate BHASKAR ID",
    kicker: "Unique identifier",
    description: "Receive your digital ecosystem identifier for trusted access across platform services.",
    icon: <Fingerprint className="h-5 w-5" />,
  },
  {
    id: 5,
    title: "Publish profile",
    kicker: "Go visible",
    description: "Review your public profile, showcase relevant updates, and make it discoverable to the network.",
    icon: <MonitorUp className="h-5 w-5" />,
  },
  {
    id: 6,
    title: "Start connecting",
    kicker: "Build momentum",
    description: "Search, connect, and collaborate with the right ecosystem stakeholders for your next milestone.",
    icon: <Link2 className="h-5 w-5" />,
  },
];

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const active = workflowSteps.find((step) => step.id === activeStep) || workflowSteps[0];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = node.querySelectorAll<HTMLElement>(".how-reveal");

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(revealTargets, { autoAlpha: 1, clearProps: "all" });
        return;
      }

      gsap.fromTo(
        revealTargets,
        { autoAlpha: 0, y: 28, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-slate-200 bg-[#F8FAFC] py-20 sm:py-28"
      id="how-it-works-section"
    >
      <div className="absolute left-[-12rem] top-20 h-96 w-96 rounded-full bg-[#FF6B00]/10 blur-3xl" />
      <div className="absolute right-[-10rem] bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#07144A]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="how-reveal mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#FF6B00]/20 bg-white px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.24em] text-[#FF6B00] shadow-sm">
            How it works
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-normal text-[#07144A] sm:text-4xl md:text-5xl">
            A guided onboarding workflow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Move from first sign-up to meaningful ecosystem connections through six clear, verified steps.
          </p>
        </div>

        <div className="how-reveal mt-12 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(7,20,74,0.08)]">
          <div className="relative hidden px-8 pb-10 pt-12 lg:block">
            <div className="absolute left-20 right-20 top-[6.25rem] h-1 rounded-full bg-slate-200" />
            <div
              className="absolute left-20 top-[6.25rem] h-1 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#F7B914] transition-all duration-500"
              style={{ width: `calc((100% - 10rem) * ${(active.id - 1) / (workflowSteps.length - 1)})` }}
            />

            <div className="grid grid-cols-6 gap-4">
              {workflowSteps.map((step) => {
                const isActive = activeStep === step.id;
                const isComplete = step.id < activeStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    onMouseEnter={() => setActiveStep(step.id)}
                    className="group relative flex min-h-[190px] flex-col items-center text-center outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/35"
                  >
                    <span
                      className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 text-sm font-black transition duration-300 ${
                        isActive
                          ? "border-white bg-[#FF6B00] text-white shadow-[0_18px_36px_rgba(255,107,0,0.28)]"
                          : isComplete
                            ? "border-white bg-[#07144A] text-white shadow-[0_14px_30px_rgba(7,20,74,0.16)]"
                            : "border-white bg-slate-100 text-slate-500 shadow-[0_12px_26px_rgba(7,20,74,0.08)] group-hover:bg-[#FFF4EC] group-hover:text-[#FF6B00]"
                      }`}
                    >
                      {isComplete ? <BadgeCheck className="h-5 w-5" /> : String(step.id).padStart(2, "0")}
                    </span>

                    <span className={`mt-7 flex h-10 w-10 items-center justify-center rounded-2xl transition ${isActive ? "bg-[#07144A] text-white" : "bg-slate-100 text-[#07144A] group-hover:bg-[#FF6B00] group-hover:text-white"}`}>
                      {step.icon}
                    </span>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {step.kicker}
                    </p>
                    <h3 className={`mt-2 text-sm font-black leading-snug transition ${isActive ? "text-[#FF6B00]" : "text-[#07144A]"}`}>
                      {step.title}
                    </h3>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-[0.72fr_1fr]">
            <div className="relative overflow-hidden bg-[#07144A] p-6 text-white sm:p-8">
              <div className="absolute right-[-5rem] top-[-5rem] h-56 w-56 rounded-full border border-white/10" />
              <div className="absolute bottom-[-6rem] left-[-4rem] h-56 w-56 rounded-full bg-[#FF6B00]/20 blur-2xl" />
              <div className="relative">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F7B914]">
                  Active stage
                </p>
                <h3 className="mt-4 text-3xl font-black tracking-normal sm:text-4xl">
                  {active.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/78 sm:text-base">
                  {active.description}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                    Progress
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#07144A]">
                    Step {active.id} of {workflowSteps.length}: {active.kicker}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B00] text-white shadow-[0_16px_34px_rgba(255,107,0,0.24)]">
                  {active.icon}
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#F7B914] transition-all duration-500"
                  style={{ width: `${(active.id / workflowSteps.length) * 100}%` }}
                />
              </div>

              <div className="mt-8 space-y-4 lg:hidden">
                {workflowSteps.map((step, index) => {
                  const isActive = activeStep === step.id;
                  const isComplete = step.id < activeStep;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStep(step.id)}
                      className="relative flex w-full items-start gap-4 text-left"
                    >
                      {index !== workflowSteps.length - 1 && (
                        <span className="absolute left-6 top-12 h-[calc(100%+1rem)] w-px bg-slate-200" />
                      )}
                      <span
                        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white text-xs font-black shadow-md ${
                          isActive
                            ? "bg-[#FF6B00] text-white"
                            : isComplete
                              ? "bg-[#07144A] text-white"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isComplete ? <BadgeCheck className="h-4 w-4" /> : String(step.id).padStart(2, "0")}
                      </span>
                      <span className={`block flex-1 rounded-2xl border px-4 py-3 ${isActive ? "border-[#FF6B00]/35 bg-[#FFF7F1]" : "border-slate-200 bg-white"}`}>
                        <span className="flex items-center gap-3">
                          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? "bg-[#FF6B00] text-white" : "bg-slate-100 text-[#07144A]"}`}>
                            {step.icon}
                          </span>
                          <span>
                            <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                              {step.kicker}
                            </span>
                            <span className="block text-sm font-black text-[#07144A]">
                              {step.title}
                            </span>
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
