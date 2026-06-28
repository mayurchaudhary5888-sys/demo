/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type PathwayCard = {
  number: string;
  title: string;
  shortText: string;
  detail: string;
};

const pathwayCards: PathwayCard[] = [
  {
    number: "01",
    title: "Industry Alliances",
    shortText: "By bringing together stakeholders from different sectors...",
    detail:
      "By bringing together stakeholders from different sectors, industries, technologies, and geographical regions, the platform creates opportunities for cross-collaboration for all.",
  },
  {
    number: "02",
    title: "Dynamic Networking",
    shortText: "Easily connect and collaborate with like-minded people...",
    detail:
      "Easily connect and collaborate with like-minded people via personalised dashboards and peer-to-peer connect features that keep the next opportunity close.",
  },
  {
    number: "03",
    title: "Enhanced Visibility",
    shortText: "Showcase your startup story and traction clearly...",
    detail:
      "Enhanced visibility helps startups present their work, traction, and credibility in a way that mentors, investors, and ecosystem partners can understand quickly.",
  },
  {
    number: "04",
    title: "Personalised Identification Number",
    shortText: "Build recognition through a single ecosystem identity...",
    detail:
      "A personalised identification number gives each startup a cleaner ecosystem identity, making recognition, discovery, and future platform journeys easier to manage.",
  },
];

export const EcosystemPathwaysSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCard = pathwayCards[activeIndex];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const revealTargets = node.querySelectorAll<HTMLElement>(".pathways-reveal");
    gsap.fromTo(
      revealTargets,
      { autoAlpha: 0, y: 34, filter: "blur(10px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.08, ease: "power3.out" },
    );
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { autoAlpha: 0, x: 32, filter: "blur(6px)" },
      { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.45, ease: "power2.out" },
    );
  }, [activeIndex]);

  const activateCard = (index: number) => {
    setActiveIndex(index);
    const card = cardRefs.current[index];
    if (!card) return;

    gsap.killTweensOf(card);
    gsap.to(card, {
      y: -8,
      scale: 1.03,
      duration: 0.34,
      ease: "power3.out",
    });
  };

  const releaseCard = (index: number) => {
    const card = cardRefs.current[index];
    if (!card || activeIndex === index) return;

    gsap.to(card, {
      y: 0,
      scale: 1,
      duration: 0.34,
      ease: "power3.out",
    });
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative overflow-hidden pt-0 -mt-px" 
      style={{ background: "linear-gradient(to right, white 50%, #07144A 50%)" }}
      id="ecosystem-pathways-section"
    >
      <div className="relative overflow-hidden rounded-t-[56px] bg-[#07144A] px-4 pt-24 pb-24 text-white shadow-[0_-24px_70px_rgba(7,20,74,0.10)] sm:px-6 sm:pt-28 sm:pb-28 lg:rounded-t-[96px] lg:px-8 lg:pt-32 lg:pb-32">
        <div className="absolute left-[7%] top-10 z-10 h-32 w-32 rotate-[-18deg] rounded-[38px] bg-[#FF6B00]/70 blur-[1px]" />
        <div className="absolute left-[6%] top-20 z-10 h-28 w-28 rotate-[22deg] rounded-[32px] border border-white/70 bg-[#FF6B00]/35" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        <div className="absolute right-[8%] top-[34%] select-none text-[18rem] font-black leading-none text-white/[0.055] sm:text-[24rem]">
          "
        </div>
        <div className="absolute right-[15%] top-[34%] select-none text-[18rem] font-black leading-none text-white/[0.055] sm:text-[24rem]">
          "
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="pathways-reveal grid max-w-xl gap-5 sm:grid-cols-2 lg:mx-auto">
            {pathwayCards.map((card, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={card.number}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  type="button"
                  onMouseEnter={() => activateCard(index)}
                  onMouseLeave={() => releaseCard(index)}
                  onFocus={() => activateCard(index)}
                  onClick={() => activateCard(index)}
                  className={`group relative flex min-h-[218px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-[0_18px_45px_rgba(0,0,0,0.12)] transition-colors duration-300 sm:min-h-[238px] ${
                    isActive ? "bg-[#F7B914] text-white" : "bg-white text-slate-950 hover:bg-[#F7B914] hover:text-white"
                  }`}
                  style={{
                    clipPath:
                      index < 2
                        ? "polygon(0 16%, 95% 0, 100% 7%, 100% 100%, 0 100%)"
                        : "polygon(0 0, 100% 0, 100% 84%, 95% 100%, 0 86%)",
                    borderRadius: "14px",
                  }}
                  aria-pressed={isActive}
                >
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    } bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.26),transparent_42%)]`}
                  />

                  {isActive ? (
                    <p className="relative max-w-[12rem] text-base font-semibold leading-7 text-white">
                      {card.shortText}
                    </p>
                  ) : (
                    <div className="relative flex flex-col items-center">
                      <div className="relative mb-6 h-16 w-20">
                        <div className="absolute inset-0 rotate-[-30deg] rounded-[16px] bg-[#FF4B35]" />
                        <div className="absolute left-0 top-2 h-12 w-16 rotate-[-30deg] rounded-[14px] border border-white/80" />
                        <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-white">
                          {card.number}
                        </span>
                      </div>
                      <h3 className="max-w-[12rem] text-xl font-black leading-snug text-inherit">
                        {card.title}
                      </h3>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div ref={contentRef} className="pathways-reveal relative z-10 max-w-3xl lg:pl-10">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-[#F7B914]">
              BHASKAR Community
            </p>
            <h2 className="text-4xl font-black tracking-normal text-white sm:text-5xl">
              {activeCard.title}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/88 sm:text-lg">
              {activeCard.detail}
            </p>

            <div className="mt-8 h-px w-28 bg-gradient-to-r from-[#FF6B00] via-[#F7B914] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
