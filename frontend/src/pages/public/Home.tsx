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

  const heroSceneCount = 10;

  useLayoutEffect(() => {
    if (!heroRootRef.current) return;

    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>(".gsap-hero-frame");

      gsap.set(frames, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(".gsap-frame0-left", { xPercent: -100 });
      gsap.set(".gsap-frame0-right", { xPercent: 100 });
      gsap.set([
        ".gsap-frame0-text",
        ".gsap-frame1-text",
        ".gsap-frame2-text",
        ".gsap-frame3-text",
        ".gsap-frame5-text",
        ".gsap-frame6-text"
      ], { autoAlpha: 0, y: 30, filter: "blur(5px)" });
      gsap.set(".gsap-frame4-btn", { autoAlpha: 0, scale: 0.8 });

      gsap.set(".gsap-hero-glow", { autoAlpha: 0.2, scale: 0.85 });
      gsap.set(".gsap-hero-float", { autoAlpha: 0.55 });
      gsap.set(".gsap-hero-sweep", { autoAlpha: 0.25, xPercent: -24 });

      // Original effects states
      gsap.set(".gsap-orange-panel", { autoAlpha: 0, yPercent: 22 });
      gsap.set(".gsap-orange-text", { autoAlpha: 0, y: 28 });
      gsap.set(".gsap-spoke-scene", { autoAlpha: 0, scale: 0.72, rotate: -20 });
      gsap.set(".gsap-spoke-core", { rotate: 0 });
      gsap.set(".gsap-spoke-bar", { scaleY: 0, transformOrigin: "bottom center" });
      gsap.set(".gsap-final-left", { xPercent: -100 });
      gsap.set(".gsap-final-right", { xPercent: 100 });
      gsap.set(".gsap-final-content", { autoAlpha: 0, scale: 0.8 });

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

      // Frame 0: Unveiling one-stop platform
      tl.set(".gsap-hero-frame-0", { autoAlpha: 1, pointerEvents: "auto" })
        .to(".gsap-frame0-left", { xPercent: 0, duration: 0.4 }, 0)
        .to(".gsap-frame0-right", { xPercent: 0, duration: 0.4 }, 0)
        .to(".gsap-frame0-text", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.4 }, 0.1)
        .to(".gsap-frame0-text", { autoAlpha: 0, y: -20, filter: "blur(5px)", duration: 0.3 }, 1.2)
        .to(".gsap-frame0-left", { xPercent: -100, duration: 0.35 }, 1.3)
        .to(".gsap-frame0-right", { xPercent: 100, duration: 0.35 }, 1.3)
        .set(".gsap-hero-frame-0", { autoAlpha: 0, pointerEvents: "none" })

      // Frame 1: community for every stakeholder of the Indian startup ecosystem
      tl.set(".gsap-hero-frame-1", { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(".gsap-frame1-text", { autoAlpha: 0, y: 30, filter: "blur(5px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.4 })
        .to(".gsap-frame1-text", { autoAlpha: 0, y: -20, filter: "blur(5px)", duration: 0.3 }, "+=0.9")
        .set(".gsap-hero-frame-1", { autoAlpha: 0, pointerEvents: "none" })

      // Frame 2: inclusive and collaborative
      tl.set(".gsap-hero-frame-2", { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(".gsap-hero-frame-2", { yPercent: 100 }, { yPercent: 0, duration: 0.45 })
        .fromTo(".gsap-frame2-text", { autoAlpha: 0, y: 30, filter: "blur(5px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.4 }, "-=0.25")
        .to(".gsap-frame2-text", { autoAlpha: 0, y: -20, filter: "blur(5px)", duration: 0.3 }, "+=0.9")
        .to(".gsap-hero-frame-2", { yPercent: -100, duration: 0.4 }, "-=0.1")
        .set(".gsap-hero-frame-2", { autoAlpha: 0, pointerEvents: "none" })

      // Frame 3: With the aim to build an
      tl.set(".gsap-hero-frame-3", { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(".gsap-hero-frame-3", { yPercent: 100 }, { yPercent: 0, duration: 0.45 })
        .fromTo(".gsap-frame3-text", { autoAlpha: 0, y: 30, filter: "blur(5px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.4 }, "-=0.25")
        .to(".gsap-frame3-text", { autoAlpha: 0, y: -20, filter: "blur(5px)", duration: 0.3 }, "+=0.9")
        .to(".gsap-hero-frame-3", { yPercent: -100, duration: 0.4 }, "-=0.1")
        .set(".gsap-hero-frame-3", { autoAlpha: 0, pointerEvents: "none" })

      // Frame 4: Register Now
      tl.set(".gsap-hero-frame-4", { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(".gsap-hero-frame-4", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })
        .fromTo(".gsap-frame4-btn", { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.4 }, "-=0.1")
        .to(".gsap-frame4-btn", { autoAlpha: 0, scale: 0.8, duration: 0.3 }, "+=1.0")
        .set(".gsap-hero-frame-4", { autoAlpha: 0, pointerEvents: "none" });

      // Frame 5: Take a step towards the future of entrepreneurship!
      tl.set(".gsap-hero-frame-5", { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(".gsap-frame5-text", { autoAlpha: 0, y: 30, filter: "blur(5px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.4 })
        .to(".gsap-frame5-text", { autoAlpha: 0, y: -20, filter: "blur(5px)", duration: 0.3 }, "+=0.9")
        .set(".gsap-hero-frame-5", { autoAlpha: 0, pointerEvents: "none" })

      // Frame 6: A world of new opportunities awaits you!
      tl.set(".gsap-hero-frame-6", { autoAlpha: 1, pointerEvents: "auto" })
        .fromTo(".gsap-frame6-text", { autoAlpha: 0, y: 30, filter: "blur(5px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.4 })
        .to(".gsap-frame6-text", { autoAlpha: 0, y: -20, filter: "blur(5px)", duration: 0.3 }, "+=0.9")
        .set(".gsap-hero-frame-6", { autoAlpha: 0, pointerEvents: "none" });

      // Frame 7: Orange panel effect slide (Effect 1)
      tl.set(".gsap-hero-frame-7", { autoAlpha: 1, pointerEvents: "auto" })
        .to(".gsap-orange-panel", { autoAlpha: 1, yPercent: 0, duration: 0.45 })
        .to(".gsap-orange-text", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
        .to(".gsap-orange-panel", { autoAlpha: 0, yPercent: -16, duration: 0.4 }, "+=0.9")
        .set(".gsap-hero-frame-7", { autoAlpha: 0, pointerEvents: "none" });

      // Frame 8: Spoke wheel effect slide (Effect 2)
      tl.set(".gsap-hero-frame-8", { autoAlpha: 1, pointerEvents: "auto" })
        .to(".gsap-spoke-scene", { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5 })
        .to(".gsap-spoke-bar", { scaleY: 1, duration: 0.35, stagger: 0.03, ease: "back.out(1.7)" }, "<0.05")
        .to(".gsap-spoke-core", { rotate: 300, duration: 1.2, ease: "none" }, "<")
        .to(".gsap-spoke-scene", { autoAlpha: 0, scale: 1.12, rotate: 18, duration: 0.4 }, "+=0.5")
        .set(".gsap-hero-frame-8", { autoAlpha: 0, pointerEvents: "none" });

      // Frame 9: Final logo panel slide (Effect 3)
      tl.set(".gsap-hero-frame-9", { autoAlpha: 1, pointerEvents: "auto" })
        .to(".gsap-final-left", { xPercent: 0, duration: 0.45 })
        .to(".gsap-final-right", { xPercent: 0, duration: 0.45 }, "<")
        .to(".gsap-final-content", { autoAlpha: 1, scale: 1, duration: 0.4 }, "-=0.25")
        .to(".gsap-final-content", { autoAlpha: 0, scale: 0.8, duration: 0.3 }, "+=1.2")
        .to(".gsap-final-left", { xPercent: -100, duration: 0.35 })
        .to(".gsap-final-right", { xPercent: 100, duration: 0.35 }, "<")
        .set(".gsap-hero-frame-9", { autoAlpha: 0, pointerEvents: "none" });

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

  const spokePalette = ["#FF6B00", "#F9B233", "#07144A", "#FF7A3D", "#F9B233", "#07144A", "#FF6B00", "#F9B233", "#07144A", "#FF7A3D"];

  return (
    <div className="w-full flex flex-col bg-white" id="homepage-container">
      
      {/* 1. HERO SECTION INSPIRED BY THE BHASKAR OPENING ANIMATION */}
      <section ref={heroRootRef} className="relative min-h-[calc(100vh-8rem)] overflow-hidden bg-white rounded-br-[120px] lg:rounded-br-[220px] border-b border-slate-100" id="home-animated-hero">
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
          <div className="gsap-hero-orb absolute left-[14%] bottom-[18%] h-4 w-4 rounded-full bg-[#F9B233] shadow-[0_0_30px_rgba(249,178,51,0.55)]" />
          <div className="gsap-hero-orb absolute right-[20%] top-[24%] h-3 w-3 rounded-full bg-[#FF7A3D] shadow-[0_0_28px_rgba(255,122,61,0.55)]" />
        </div>

        {/* Slide 0 (Photo 1) */}
        <div className="gsap-hero-frame gsap-hero-frame-0 absolute inset-0 z-10 flex items-center justify-center px-6">
          <div className="gsap-frame0-left absolute inset-y-0 left-0 w-[28%] bg-[#07144A]" />
          <div className="gsap-frame0-right absolute inset-y-0 right-0 w-[45%] bg-[#FF6B00]" style={{ clipPath: "polygon(35% 100%, 100% 20%, 100% 100%)" }} />
          
          <div className="flex max-w-5xl flex-col items-center gap-5 text-center z-20">
            <h1 className="gsap-frame0-text max-w-4xl text-center text-4xl sm:text-5xl lg:text-6xl leading-tight font-medium tracking-normal text-[#07144A]">
              Unveiling <span className="font-black text-[#07144A]">one-stop platform</span>
            </h1>
          </div>
        </div>

        {/* Slide 1 (Photo 2) */}
        <div className="gsap-hero-frame gsap-hero-frame-1 absolute inset-0 z-10 flex items-center justify-center px-6">
          <div className="flex max-w-5xl flex-col items-center gap-5 text-center">
            <h1 className="gsap-frame1-text max-w-4xl text-center text-3xl sm:text-5xl lg:text-6xl leading-tight font-medium tracking-normal text-[#07144A]">
              community for <span className="font-black text-[#07144A]">every stakeholder</span> of the
              <br className="hidden sm:inline" />
              <span className="font-black text-[#07144A] mt-2 sm:mt-0"> Indian startup ecosystem</span>
            </h1>
          </div>
        </div>

        {/* Slide 2 (Photo 3) */}
        <div className="gsap-hero-frame gsap-hero-frame-2 absolute inset-0 z-10 flex items-center justify-center px-6 bg-[#FF6B00]">
          <div className="flex max-w-5xl flex-col items-center gap-5 text-center">
            <h1 className="gsap-frame2-text max-w-4xl text-center text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white">
              inclusive and collaborative
            </h1>
          </div>
        </div>

        {/* Slide 3 (Photo 4) */}
        <div className="gsap-hero-frame gsap-hero-frame-3 absolute inset-0 z-10 flex items-center justify-center px-6 bg-[#D93F3F]">
          <div className="flex max-w-5xl flex-col items-center gap-5 text-center">
            <h1 className="gsap-frame3-text max-w-4xl text-center text-4xl sm:text-5xl lg:text-7xl font-medium tracking-tight text-white">
              With the aim to <span className="font-black">build</span> an
            </h1>
          </div>
        </div>

        {/* Slide 4 (Photo 5) */}
        <div className="gsap-hero-frame gsap-hero-frame-4 absolute inset-0 z-10 flex items-center justify-center px-6 bg-white">
          <div className="flex flex-col items-center justify-center gap-6">
            <Link
              to="/register"
              className="gsap-frame4-btn px-10 py-5 text-xl sm:text-2xl font-black uppercase tracking-wider text-white bg-[#FF6B00] rounded-xl shadow-[0_12px_30px_rgba(255,107,0,0.3)] transition-all hover:bg-[#e65f00] hover:scale-105"
            >
              Register Now
            </Link>
          </div>
        </div>

        {/* Slide 5 (Photo 6) */}
        <div className="gsap-hero-frame gsap-hero-frame-5 absolute inset-0 z-10 flex items-center justify-center px-6 bg-white">
          <div className="flex max-w-5xl flex-col items-center gap-5 text-center">
            <h1 className="gsap-frame5-text max-w-4xl text-center text-3xl sm:text-5xl lg:text-6xl leading-tight font-medium tracking-normal text-[#07144A]">
              Take a step towards <span className="font-black text-[#07144A]">the future of entrepreneurship!</span>
            </h1>
          </div>
        </div>

        {/* Slide 6 (Photo 7) */}
        <div className="gsap-hero-frame gsap-hero-frame-6 absolute inset-0 z-10 flex items-center justify-center px-6 bg-white">
          <div className="flex max-w-5xl flex-col items-center gap-5 text-center">
            <h1 className="gsap-frame6-text max-w-4xl text-center text-3xl sm:text-5xl lg:text-6xl leading-tight font-medium tracking-normal text-[#07144A]">
              A <span className="font-black text-[#07144A]">world of new opportunities</span> awaits you!
            </h1>
          </div>
        </div>

        {/* Slide 7 (Orange Panel Effect 1) */}
        <div className="gsap-hero-frame gsap-hero-frame-7 absolute inset-0 z-10">
          <div className="gsap-orange-panel absolute inset-x-0 top-[14%] h-[56%] overflow-hidden rounded-br-[64px] bg-[#FF6B00]">
            <h2 className="gsap-orange-text absolute inset-0 flex items-center justify-center px-8 text-center text-2xl sm:text-4xl lg:text-5xl font-medium tracking-normal text-white">
              community for <span className="mx-2 font-black">every stakeholder</span> of the ecosystem
            </h2>
          </div>
        </div>

        {/* Slide 8 (Spoke Wheel Effect 2) */}
        <div className="gsap-hero-frame gsap-hero-frame-8 absolute inset-0 z-10 flex items-center justify-center">
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

        {/* Slide 9 (Final Panel Effect 3) */}
        <div className="gsap-hero-frame gsap-hero-frame-9 absolute inset-0 z-10 flex flex-col items-center justify-center bg-white px-6">
          <div className="gsap-final-left absolute left-0 top-0 bottom-0 w-[30%] bg-[#FCD34D]" style={{ clipPath: "polygon(0 0, 100% 0, 40% 100%, 0 100%)" }} />
          <div className="gsap-final-right absolute right-0 top-0 bottom-0 w-[30%] bg-[#FCD34D]" style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 0 100%)" }} />
          
          <div className="gsap-final-content flex flex-col items-center gap-6 z-20">
            <img
              src="/logos/bhaskar.jpeg"
              alt="BHASKAR"
              className="h-44 sm:h-56 w-auto object-contain"
            />
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Link
                to="/register"
                className="rounded-md bg-[#FF6B00] px-7 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-[#e65f00]"
              >
                Register
              </Link>
              <Link
                to="/about-us"
                className="rounded-md border border-[#07144A]/40 px-7 py-3 text-xs font-black uppercase tracking-widest text-[#07144A] transition hover:bg-[#07144A]/10"
              >
                About Us
              </Link>
            </div>
          </div>
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
