import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ExternalLink, Landmark } from "lucide-react";
import { PortfolioHero } from "./PortfolioHero";

export const IncubatorPortfolio: React.FC = () => {
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = pageRef.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-reveal",
        { autoAlpha: 0, y: 30, filter: "blur(8px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.75, stagger: 0.1, ease: "power3.out" }
      );
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-white" id="incubator-portfolio-page">
      <PortfolioHero
        active="incubators"
        eyebrow="SISFS approved network"
        title="Portfolio of incubators approved under the Startup India Seed Fund Scheme"
        description="Explore selected incubation centres, focus domains, and startup support capacity across the national seed fund ecosystem."
      />

      <section className="bg-[#F8FAFC] py-14 sm:py-18">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <div className="portfolio-reveal overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="grid lg:grid-cols-[0.72fr_1fr]">
              <div className="relative overflow-hidden bg-[#07144A] p-8 text-white sm:p-10">
                <div className="absolute right-[-5rem] top-[-5rem] h-56 w-56 rounded-full bg-[#FF6B00]/20 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#F9B233]">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-[11px] font-black uppercase tracking-[0.26em] text-[#F9B233]">
                    Incubator information
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
                    Official SISFS incubator details
                  </h2>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <p className="text-base font-medium leading-8 text-slate-700">
                  Startup India Seed Fund Scheme incubators are listed and updated through the official SISFS portal. Please use the official portal to review incubator participation, eligibility, scheme information, and application-related guidance.
                </p>
                <p className="mt-4 text-base font-medium leading-8 text-slate-700">
                  This keeps incubator information accurate and avoids showing outdated local lists during active programme cycles.
                </p>
                <a
                  href="https://seedfund.startupindia.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-3 rounded-md bg-[#FF6B00] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_16px_36px_rgba(255,107,0,0.24)] transition hover:bg-[#ef5f00]"
                >
                  Click here for incubator information
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
