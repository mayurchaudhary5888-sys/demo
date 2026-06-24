import React from "react";
import { ArrowDownRight } from "lucide-react";
import { aboutImages, impactStats } from "./aboutData";

export const AboutHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white text-slate-950">
      <div className="absolute inset-x-0 top-0 h-[72%] bg-[#07144A]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[length:64px_64px]" />

      <div className="about-reveal relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="pb-8 text-white lg:pb-20">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#F9B233]">
              About BHASKAR
            </p>
            <h1 className="mt-5 text-5xl font-black tracking-normal text-white sm:text-6xl lg:text-7xl">
              India&apos;s startup ecosystem, connected.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/76 sm:text-lg">
              BHASKAR brings discovery, identity, knowledge, and collaboration
              into one national digital platform for every ecosystem stakeholder.
            </p>
            <a
              href="#about-initiative"
              className="mt-8 inline-flex items-center gap-3 rounded-md bg-[#FF6B00] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_18px_44px_rgba(255,107,0,0.26)] transition hover:bg-[#f35f00]"
            >
              Explore initiative
              <ArrowDownRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-lg bg-[#FF6B00] lg:block" />
            <div className="absolute -right-4 bottom-16 hidden h-20 w-20 border-b-[10px] border-r-[10px] border-[#F9B233] lg:block" />
            <div className="relative overflow-hidden rounded-lg border border-white/12 bg-white/8 shadow-[0_28px_90px_rgba(0,0,0,0.32)]">
              <img
                src={aboutImages.hero}
                alt="Professionals shaking hands with digital network connections"
                className="aspect-[16/10] h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,20,74,0.84)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
                {impactStats.map((stat) => (
                  <div key={stat.label} className="rounded-md border border-white/14 bg-white/12 px-4 py-3 backdrop-blur-md">
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/68">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
