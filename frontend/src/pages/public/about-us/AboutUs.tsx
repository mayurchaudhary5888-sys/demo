import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { AboutHero } from "./AboutHero";
import { InitiativeSection } from "./InitiativeSection";
import { VisionSection } from "./VisionSection";
import { FaqSection } from "./FaqSection";

export const AboutUs: React.FC = () => {
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = pageRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-reveal",
        { autoAlpha: 0, y: 34, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-white" id="about-us-page">
      <AboutHero />
      <InitiativeSection />
      <VisionSection />
      <FaqSection />
    </div>
  );
};
