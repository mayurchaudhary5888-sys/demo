import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { INDIAN_STATES } from "../../../constants/options";
import { PortfolioHero } from "./PortfolioHero";
import { PortfolioFilters } from "./PortfolioFilters";
import { incubatorDomains, incubatorPortfolio } from "./portfolioData";

export const IncubatorPortfolio: React.FC = () => {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [domain, setDomain] = useState("");

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

  const filteredIncubators = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return incubatorPortfolio.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.city.toLowerCase().includes(normalizedSearch) ||
        item.domains.some((entry) => entry.toLowerCase().includes(normalizedSearch));
      const matchesState = !state || item.state === state;
      const matchesDomain = !domain || item.domains.includes(domain);
      return matchesSearch && matchesState && matchesDomain;
    });
  }, [domain, search, state]);

  return (
    <div ref={pageRef} className="bg-white" id="incubator-portfolio-page">
      <PortfolioHero
        active="incubators"
        eyebrow="SISFS approved network"
        title="Portfolio of incubators approved under the Startup India Seed Fund Scheme"
        description="Explore selected incubation centres, focus domains, and startup support capacity across the national seed fund ecosystem."
      />

      <PortfolioFilters
        title="Selected Incubators"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search incubator, city, or focus domain..."
        filters={[
          {
            label: "State",
            value: state,
            onChange: setState,
            options: INDIAN_STATES.map((item) => ({ label: item, value: item })),
          },
          {
            label: "Domain",
            value: domain,
            onChange: setDomain,
            options: incubatorDomains.map((item) => ({ label: item, value: item })),
          },
        ]}
        onClear={() => {
          setSearch("");
          setState("");
          setDomain("");
        }}
      />

      <section className="bg-[#F8FAFC] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="portfolio-reveal mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Certain incubators may not be available during high application cycles. Please contact the relevant centre for clarifications.
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-normal text-slate-950">
                Selected Incubators ({filteredIncubators.length})
              </h2>
            </div>
            <Link
              to="/portfolio/startups"
              className="inline-flex items-center gap-2 rounded-md bg-[#07144A] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#102262]"
            >
              View startups
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {filteredIncubators.length === 0 ? (
            <div className="portfolio-reveal rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm font-bold text-slate-500">No incubators match the selected filters.</p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredIncubators.map((item) => (
                <article
                  key={item.id}
                  className="portfolio-reveal group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative">
                    <img src={item.image} alt="" className="aspect-[16/10] w-full object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(7,20,74,0.82)_100%)]" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md bg-white/92 px-3 py-2 text-xs font-black text-[#07144A] backdrop-blur">
                      <MapPin className="h-4 w-4 text-[#FF6B00]" />
                      {item.city}, {item.state}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#FF6B00]/10 text-[#FF6B00]">
                        {item.icon}
                      </div>
                      <span className="rounded-full bg-[#07144A]/8 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#07144A]">
                        {item.id.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-black leading-snug text-[#2947B8]">
                      {item.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-md bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Fund outlay</p>
                        <p className="mt-1 text-lg font-black text-slate-950">{item.fundOutlay}</p>
                      </div>
                      <div className="rounded-md bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Startups</p>
                        <p className="mt-1 text-lg font-black text-slate-950">{item.approvedStartups}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.domains.slice(0, 3).map((domainItem) => (
                        <span key={domainItem} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                          {domainItem}
                        </span>
                      ))}
                      {item.domains.length > 3 && (
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                          +{item.domains.length - 3} More
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
