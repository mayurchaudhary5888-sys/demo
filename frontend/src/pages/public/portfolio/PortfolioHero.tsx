import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { portfolioImages, portfolioMetrics } from "./portfolioData";

type PortfolioHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  active: "incubators" | "startups";
};

export const PortfolioHero: React.FC<PortfolioHeroProps> = ({ eyebrow, title, description, active }) => {
  const image = active === "incubators" ? portfolioImages.incubator : portfolioImages.startup;

  return (
    <section className="relative overflow-hidden bg-[#07144A] text-white">
      <div className="absolute right-[-12%] top-[-22%] h-[32rem] w-[32rem] rounded-full bg-[#FF6B00]/18 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        <div className="portfolio-reveal">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#F9B233]">{eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/76">{description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/portfolio"
              className={`inline-flex items-center gap-2 rounded-md px-5 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${
                active === "incubators" ? "bg-[#FF6B00] text-white" : "border border-white/18 text-white hover:bg-white/10"
              }`}
            >
              Incubators
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/startup_portfolio"
              className={`inline-flex items-center gap-2 rounded-md px-5 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${
                active === "startups" ? "bg-[#FF6B00] text-white" : "border border-white/18 text-white hover:bg-white/10"
              }`}
            >
              Startups
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="portfolio-reveal relative">
          <div className="absolute -left-5 top-10 hidden h-24 w-24 rounded-lg bg-[#FF6B00] lg:block" />
          <div className="relative overflow-hidden rounded-lg border border-white/12 bg-white/8 shadow-[0_28px_90px_rgba(0,0,0,0.32)]">
            <img src={image} alt="" className="aspect-[16/9] w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,20,74,0.84)_100%)]" />
            <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
              {portfolioMetrics.map((metric) => (
                <div key={metric.label} className="rounded-md border border-white/14 bg-white/12 px-4 py-3 backdrop-blur-md">
                  <div className="text-[#F9B233]">{metric.icon}</div>
                  <p className="mt-2 text-2xl font-black text-white">{metric.value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/68">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
