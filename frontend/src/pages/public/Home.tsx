/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAppState } from "../../context/AppContext";
import { CommunityBridgeSection } from "../../components/home/CommunityBridgeSection";
import { EcosystemPathwaysSection } from "../../components/home/EcosystemPathwaysSection";
import { HowItWorksSection } from "../../components/home/HowItWorksSection";
import { EcosystemStakeholdersSection } from "../../components/home/EcosystemStakeholdersSection";
import { DisclaimerSection } from "../../components/home/DisclaimerSection";

export const Home: React.FC = () => {
  const { startups, programs, showToast } = useAppState();
  const navigate = useNavigate();

  const [heroFrame, setHeroFrame] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const heroRootRef = useRef<HTMLElement | null>(null);
  const activeHeroFrameRef = useRef(0);

  const heroSceneCount = 6;

  useLayoutEffect(() => {
    if (!heroRootRef.current) return;

    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>(".gsap-hero-frame");

      gsap.set(frames, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(".gsap-hero-word", { autoAlpha: 0, y: 34, filter: "blur(10px)" });
      gsap.set(".gsap-hero-line", { autoAlpha: 0, x: -24 });
      gsap.set(".gsap-hero-ribbon", { autoAlpha: 0, scaleX: 0.45, transformOrigin: "left center" });
      gsap.set(".gsap-hero-orb", { autoAlpha: 0, scale: 0.7 });
      gsap.set(".gsap-hero-glow", { autoAlpha: 0.2, scale: 0.85 });
      gsap.set(".gsap-hero-float", { autoAlpha: 0.55 });
      gsap.set(".gsap-hero-sweep", { autoAlpha: 0.25, xPercent: -24 });
      gsap.set(".gsap-hero-card", { autoAlpha: 0, scaleX: 0.46, y: 50, transformOrigin: "center center" });
      gsap.set(".gsap-card-title", { clipPath: "inset(0 100% 0 0)" });
      gsap.set(".gsap-orange-panel", { autoAlpha: 0, yPercent: 22 });
      gsap.set(".gsap-orange-text", { autoAlpha: 0, y: 28 });
      gsap.set(".gsap-spoke-scene", { autoAlpha: 0, scale: 0.72, rotate: -20 });
      gsap.set(".gsap-spoke-core", { rotate: 0 });
      gsap.set(".gsap-spoke-bar", { scaleY: 0, transformOrigin: "bottom center" });
      gsap.set(".gsap-final-panel", { autoAlpha: 0, yPercent: 14 });
      gsap.set(".gsap-final-copy", { autoAlpha: 0, y: 24 });

      const setFrame = (frame: number) => {
        if (activeHeroFrameRef.current === frame) return;
        activeHeroFrameRef.current = frame;
        setHeroFrame(frame);
      };

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "power3.out" },
        onUpdate: () => {
          const duration = tl.duration();
          const time = tl.time() % duration;
          const frame = Math.min(heroSceneCount - 1, Math.floor((time / duration) * heroSceneCount));
          setFrame(frame);
          setHeroProgress((time / duration) * heroSceneCount - frame);
        },
      });

      tl.set(".gsap-hero-frame-0", { autoAlpha: 1, pointerEvents: "auto" })
        .to(".gsap-hero-frame-0 .gsap-hero-line", { autoAlpha: 1, x: 0, duration: 0.58, stagger: 0.12 }, 0)
        .to(".gsap-hero-frame-0 .gsap-hero-word", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.62, stagger: 0.12 }, 0.08)
        .to(".gsap-hero-frame-0 .gsap-hero-ribbon", { autoAlpha: 1, scaleX: 1, duration: 0.56 }, 0.18)
        .to(".gsap-hero-frame-0 .gsap-hero-orb", { autoAlpha: 1, scale: 1, duration: 0.58, stagger: 0.14 }, 0.22)
        .to(".gsap-hero-frame-0 .gsap-hero-glow", { autoAlpha: 0.28, scale: 1, duration: 0.9 }, 0.12)
        .to(".gsap-hero-frame-0 .gsap-hero-word", { autoAlpha: 0, y: -30, filter: "blur(9px)", duration: 0.5, stagger: 0.05 }, 2.12)
        .to(".gsap-hero-frame-0 .gsap-hero-line", { autoAlpha: 0, x: 18, duration: 0.42, stagger: 0.06 }, 2.18)
        .set(".gsap-hero-frame-0", { autoAlpha: 0, pointerEvents: "none" })

        .set(".gsap-hero-frame-1", { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(".gsap-hero-frame-1 .gsap-hero-line", { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.58, stagger: 0.12 })
        .fromTo(".gsap-hero-frame-1 .gsap-hero-word", { autoAlpha: 0, y: 34, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.62, stagger: 0.12 }, 0.08)
        .to(".gsap-hero-frame-1 .gsap-hero-ribbon", { autoAlpha: 1, scaleX: 1, duration: 0.56 }, 0.16)
        .to(".gsap-hero-frame-1 .gsap-hero-orb", { autoAlpha: 1, scale: 1, duration: 0.58, stagger: 0.14 }, 0.2)
        .to(".gsap-hero-frame-1 .gsap-hero-word", { autoAlpha: 0, y: -30, filter: "blur(9px)", duration: 0.5, stagger: 0.05 }, "+=1.05")
        .to(".gsap-hero-frame-1 .gsap-hero-line", { autoAlpha: 0, x: 18, duration: 0.42, stagger: 0.06 }, "<")
        .set(".gsap-hero-frame-1", { autoAlpha: 0, pointerEvents: "none" })

        .set(".gsap-hero-frame-2", { autoAlpha: 1, pointerEvents: "auto" })
        .to(".gsap-hero-card", { autoAlpha: 1, scaleX: 1, y: 0, duration: 0.78 })
        .to(".gsap-card-sheen", { xPercent: 220, duration: 1.2, ease: "power2.inOut" }, "<")
        .to(".gsap-card-title", { clipPath: "inset(0 0% 0 0)", duration: 0.96 }, "<0.18")
        .to(".gsap-hero-card", { autoAlpha: 0, scale: 0.96, y: -26, duration: 0.5 }, "+=1")
        .set(".gsap-hero-frame-2", { autoAlpha: 0, pointerEvents: "none" })

        .set(".gsap-hero-frame-3", { autoAlpha: 1, pointerEvents: "auto" })
        .to(".gsap-orange-panel", { autoAlpha: 1, yPercent: 0, duration: 0.68 })
        .to(".gsap-orange-text", { autoAlpha: 1, y: 0, duration: 0.62 }, "<0.22")
        .to(".gsap-orange-panel", { autoAlpha: 0, yPercent: -16, duration: 0.54 }, "+=1.25")
        .set(".gsap-hero-frame-3", { autoAlpha: 0, pointerEvents: "none" })

        .set(".gsap-hero-frame-4", { autoAlpha: 1, pointerEvents: "auto" })
        .to(".gsap-spoke-scene", { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.72 })
        .to(".gsap-spoke-bar", { scaleY: 1, duration: 0.48, stagger: 0.045, ease: "back.out(1.7)" }, "<0.08")
        .to(".gsap-spoke-core", { rotate: 300, duration: 1.55, ease: "none" }, "<")
        .to(".gsap-spoke-scene", { autoAlpha: 0, scale: 1.12, rotate: 18, duration: 0.5 }, "+=0.62")
        .set(".gsap-hero-frame-4", { autoAlpha: 0, pointerEvents: "none" })

        .set(".gsap-hero-frame-5", { autoAlpha: 1, pointerEvents: "auto" })
        .to(".gsap-final-panel", { autoAlpha: 1, yPercent: 0, duration: 0.78 })
        .to(".gsap-final-copy", { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.16 }, "<0.18")
        .to(".gsap-final-panel", { autoAlpha: 0, yPercent: -12, duration: 0.62 }, "+=1.8")
        .set(".gsap-hero-frame-5", { autoAlpha: 0, pointerEvents: "none" });

      gsap.to(".gsap-hero-glow-left", {
        x: 42,
        y: -20,
        scale: 1.06,
        duration: 11,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".gsap-hero-glow-right", {
        x: -36,
        y: 26,
        scale: 1.08,
        duration: 13,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".gsap-hero-sweep", {
        xPercent: 24,
        duration: 7.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".gsap-hero-float-1", {
        y: -18,
        x: 16,
        rotation: 8,
        duration: 6.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".gsap-hero-float-2", {
        y: 20,
        x: -14,
        rotation: -10,
        duration: 7.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".gsap-hero-dust", {
        opacity: 0.9,
        scale: 1.06,
        duration: 4.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
      });
    }, heroRootRef);

    return () => ctx.revert();
  }, []);

  const heroLines = [
    {
      lead: "community for every",
      strong: "startup builder",
      tail: "across India",
    },
    {
      lead: "a world of",
      strong: "opportunity",
      tail: "starts here",
    },
  ];

  const spokePalette = ["#FF6B00", "#F9B233", "#07144A", "#FF7A3D", "#F9B233", "#07144A", "#FF6B00", "#F9B233", "#07144A", "#FF7A3D"];

  return (
    <div className="w-full flex flex-col bg-white" id="homepage-container">
      
      {/* 1. HERO SECTION INSPIRED BY THE BHASKAR OPENING ANIMATION */}
      <section ref={heroRootRef} className="relative min-h-[calc(100vh-8rem)] overflow-hidden bg-white rounded-br-[120px] lg:rounded-br-[220px] border-b border-slate-100" id="home-animated-hero">
        <div className="absolute inset-0 opacity-[0.35] bg-[linear-gradient(90deg,rgba(11,42,91,0.035)_1px,transparent_1px)] bg-[length:56px_56px]" />
        <div className="absolute bottom-0 right-0 h-[38%] w-[70%] rounded-tl-full bg-slate-50" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="gsap-hero-glow gsap-hero-glow-left absolute -left-24 top-1/2 h-[42rem] w-[42rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.24)_0%,rgba(255,107,0,0.08)_24%,rgba(255,255,255,0)_72%)] blur-3xl" />
          <div className="gsap-hero-glow gsap-hero-glow-right absolute right-[-8rem] top-[-7rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(7,20,74,0.18)_0%,rgba(7,20,74,0.06)_28%,rgba(255,255,255,0)_70%)] blur-3xl" />
          <div className="gsap-hero-sweep absolute left-[-12%] top-[10%] h-[78%] w-[28%] rounded-[999px] bg-[linear-gradient(180deg,rgba(7,20,74,0.07),rgba(255,107,0,0.05),rgba(249,178,51,0.04))] blur-2xl" />
          <div className="gsap-hero-float gsap-hero-float-1 absolute left-[10%] top-[24%] h-24 w-24 rounded-[28px] border border-[#FF6B00]/20 bg-white/55 shadow-[0_18px_50px_rgba(7,20,74,0.05)] backdrop-blur-sm" />
          <div className="gsap-hero-float gsap-hero-float-2 absolute right-[14%] bottom-[22%] h-28 w-40 rounded-[32px] border border-[#07144A]/10 bg-[#07144A]/5 shadow-[0_16px_40px_rgba(7,20,74,0.04)] backdrop-blur-sm" />
          <div className="gsap-hero-float absolute left-[42%] top-[18%] h-3 w-3 rounded-full bg-[#FF7A3D] shadow-[0_0_24px_rgba(255,122,61,0.6)]" />
          <div className="gsap-hero-float absolute right-[34%] top-[62%] h-2.5 w-2.5 rounded-full bg-[#F9B233] shadow-[0_0_22px_rgba(249,178,51,0.6)]" />
          <div className="gsap-hero-float gsap-hero-dust absolute left-[22%] bottom-[30%] h-1.5 w-1.5 rounded-full bg-[#07144A]/30" />
          <div className="gsap-hero-float gsap-hero-dust absolute left-[18%] top-[64%] h-1 w-1 rounded-full bg-[#FF6B00]/45" />
          <div className="gsap-hero-float gsap-hero-dust absolute right-[26%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#07144A]/25" />
          <div className="gsap-hero-ribbon absolute left-[8%] top-[22%] h-2 w-[34%] rounded-full bg-[#FF6B00]/70 shadow-[0_0_50px_rgba(255,107,0,0.45)]" />
          <div className="gsap-hero-ribbon absolute right-[8%] top-[56%] h-2 w-[24%] rounded-full bg-[#07144A]/60 shadow-[0_0_46px_rgba(7,20,74,0.4)]" />
          <div className="gsap-hero-orb absolute left-[14%] bottom-[18%] h-4 w-4 rounded-full bg-[#F9B233] shadow-[0_0_30px_rgba(249,178,51,0.55)]" />
          <div className="gsap-hero-orb absolute right-[20%] top-[24%] h-3 w-3 rounded-full bg-[#FF7A3D] shadow-[0_0_28px_rgba(255,122,61,0.55)]" />
        </div>

        {heroLines.map((line, index) => (
          <div key={line.strong} className={`gsap-hero-frame gsap-hero-frame-${index} absolute inset-0 z-10 flex items-center justify-center px-6`}>
            <div className="flex max-w-5xl flex-col items-center gap-5 text-center">
              <div className="gsap-hero-line h-px w-20 bg-[#FF6B00]" />
              <h1 className="max-w-4xl text-center text-4xl sm:text-5xl lg:text-6xl leading-tight font-medium tracking-normal text-[#07144A]">
                <span className="gsap-hero-word inline-block">{line.lead}&nbsp;</span>
                <span className="gsap-hero-word inline-block font-black text-[#FF6B00]">{line.strong}</span>
                <span className="gsap-hero-word inline-block">&nbsp;{line.tail}</span>
              </h1>
              <div className="gsap-hero-line h-px w-32 bg-[#07144A]/25" />
            </div>
          </div>
        ))}

        <div className="gsap-hero-frame gsap-hero-frame-2 absolute inset-0 z-10 flex items-center justify-center px-6">
          <div className="gsap-hero-card relative h-[260px] sm:h-[330px] w-full max-w-5xl overflow-hidden bg-[#07144A] shadow-[0_30px_70px_rgba(7,20,74,0.18)]">
            <div className="gsap-card-sheen absolute inset-y-0 -left-1/2 w-1/2 bg-white/5" />
            <h2 className="gsap-card-title absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap text-4xl sm:text-6xl lg:text-7xl font-black tracking-normal text-white">
              With the aim to...
            </h2>
          </div>
        </div>

        <div className="gsap-hero-frame gsap-hero-frame-3 absolute inset-0 z-10">
          <div className="gsap-orange-panel absolute inset-x-0 top-[14%] h-[56%] overflow-hidden rounded-br-[64px] bg-[#FF6B00]">
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:42px_42px]" />
            <h2 className="gsap-orange-text absolute inset-0 flex items-center justify-center px-8 text-center text-2xl sm:text-4xl lg:text-5xl font-medium tracking-normal text-white">
              community for <span className="mx-2 font-black">every stakeholder</span> of the ecosystem
            </h2>
          </div>
        </div>

        <div className="gsap-hero-frame gsap-hero-frame-4 absolute inset-0 z-10 flex items-center justify-center">
          <div className="gsap-spoke-scene relative h-[520px] w-[520px] max-h-[72vw] max-w-[72vw]">
            <div className="gsap-spoke-core absolute inset-0">
              {spokePalette.map((color, index) => (
                <span
                  key={`${color}-${index}`}
                  className="absolute left-1/2 top-1/2 h-[42%] w-9 sm:w-12 origin-bottom"
                  style={{ transform: `translate(-50%, -100%) rotate(${index * 36}deg)` }}
                >
                  <span className="gsap-spoke-bar block h-full w-full rounded-full shadow-lg" style={{ background: color }} />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="gsap-hero-frame gsap-hero-frame-5 absolute inset-0 z-10">
          <div className="gsap-final-panel absolute inset-x-0 top-0 h-[82%] overflow-hidden rounded-br-[120px] bg-[#07144A]">
            <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:48px_48px]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 text-center">
              <h2 className="gsap-final-copy text-4xl sm:text-5xl lg:text-6xl font-medium tracking-normal text-white">
                Innovate. Connect. Thrive.
              </h2>
              <div className="gsap-final-copy flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="rounded-md bg-[#FF6B00] px-7 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-[#e65f00]"
                >
                  Register
                </Link>
                <Link
                  to="/about-us"
                  className="rounded-md border border-white/50 px-7 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/10"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroFrame(index)}
              className={`relative h-2 overflow-hidden rounded-full transition-all ${
                heroFrame === index ? "w-12 bg-[#FF6B00]/25" : "w-2.5 bg-[#07144A]/20 hover:bg-[#07144A]/40"
              }`}
              aria-label={`Show hero frame ${index + 1}`}
            >
              {heroFrame === index && (
                <span
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[#FF6B00]"
                  style={{ transform: `scaleX(${heroProgress})` }}
                />
              )}
            </button>
          ))}
        </div>
      </section>

      <CommunityBridgeSection />
      <EcosystemPathwaysSection />
      <HowItWorksSection />
      <EcosystemStakeholdersSection />
      <DisclaimerSection />

    </div>
  );
};
