import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { INDIAN_STATES } from "../../../constants/options";
import { useAppState } from "../../../context/AppContext";
import { StartupStage } from "../../../types";
import { PortfolioFilters } from "./PortfolioFilters";
import { PortfolioHero } from "./PortfolioHero";
import { startupIndustries, startupSectors } from "./portfolioData";

export const StartupPortfolio: React.FC = () => {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { startups } = useAppState();
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [sector, setSector] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [stage, setStage] = useState("");

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

  const approvedStartups = useMemo(() => startups.filter((item) => item.isApproved), [startups]);
  const cityOptions = useMemo(
    () => Array.from(new Set(approvedStartups.map((item) => item.city))).sort(),
    [approvedStartups]
  );

  const filteredStartups = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return approvedStartups.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.sector.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch);
      const matchesSector = !sector || item.sector === sector;
      const matchesState = !state || item.state === state;
      const matchesCity = !city || item.city === city;
      const matchesStage = !stage || item.stage === stage;
      const matchesIndustry = !industry || item.sector.toLowerCase().includes(industry.replace("Agriculture", "Agri").replace("Finance", "Fin").replace("Healthcare", "Health").replace("Education", "Ed").replace("Clean Energy", "Clean").toLowerCase());
      return matchesSearch && matchesSector && matchesState && matchesCity && matchesStage && matchesIndustry;
    });
  }, [approvedStartups, city, industry, search, sector, stage, state]);

  const clearFilters = () => {
    setSearch("");
    setIndustry("");
    setSector("");
    setState("");
    setCity("");
    setStage("");
  };

  return (
    <div ref={pageRef} className="bg-white" id="startup-portfolio-page">
      <PortfolioHero
        active="startups"
        eyebrow="Selected startup portfolio"
        title="Portfolio of startups selected under the Startup India Seed Fund Scheme"
        description="Browse approved startup showcases by sector, location, stage, and ecosystem readiness."
      />

      <PortfolioFilters
        title="Startup Filters"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search selected startups..."
        filters={[
          {
            label: "Industry",
            value: industry,
            onChange: setIndustry,
            options: startupIndustries.map((item) => ({ label: item, value: item })),
          },
          {
            label: "Sector",
            value: sector,
            onChange: setSector,
            options: startupSectors.map((item) => ({ label: item, value: item })),
          },
          {
            label: "State",
            value: state,
            onChange: setState,
            options: INDIAN_STATES.map((item) => ({ label: item, value: item })),
          },
          {
            label: "City",
            value: city,
            onChange: setCity,
            options: cityOptions.map((item) => ({ label: item, value: item })),
          },
        ]}
        onClear={clearFilters}
      />

      <section className="bg-[#F8FAFC] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="portfolio-reveal mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-normal text-[#2947B8]">
                Selected Startups ({filteredStartups.length})
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Public showcase of approved startups participating in the national ecosystem.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={stage}
                onChange={(event) => setStage(event.target.value)}
                className="h-12 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2947B8] focus:ring-4 focus:ring-[#2947B8]/10"
              >
                <option value="">Stage completed</option>
                {Object.values(StartupStage).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <Link
                to="/portfolio/incubators"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#07144A] px-5 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#102262]"
              >
                Incubators
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {filteredStartups.length === 0 ? (
            <div className="portfolio-reveal rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-500">No selected startups match the current filters.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredStartups.map((startup, index) => (
                <article
                  key={startup.id}
                  className="portfolio-reveal group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)]"
                >
                  <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-[#07144A]">
                    <div className="absolute inset-0 opacity-[0.1] bg-[linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[length:42px_42px]" />
                    <div className="absolute right-[-20%] top-[-30%] h-52 w-52 rounded-full bg-[#FF6B00]/35 blur-3xl" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-lg bg-white text-3xl font-black text-[#2947B8] shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
                      {startup.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute left-4 top-4 rounded-full bg-emerald-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#07144A]">
                      Selected
                    </span>
                    <span className="absolute bottom-4 right-4 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <MapPin className="h-4 w-4 text-[#FF6B00]" />
                      {startup.city}, {startup.state}
                    </div>
                    <h3 className="mt-4 text-xl font-black leading-snug text-[#2947B8]">
                      {startup.name}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                      {startup.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#FF6B00]/10 px-3 py-1 text-xs font-black text-[#C2410C]">
                        {startup.sector}
                      </span>
                      <span className="rounded-full bg-[#2947B8]/10 px-3 py-1 text-xs font-black text-[#2947B8]">
                        {startup.stage}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/network?q=${encodeURIComponent(startup.name)}`)}
                      className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#FF6B00] transition hover:text-[#D94F00]"
                    >
                      View profile
                      <ArrowRight className="h-4 w-4" />
                    </button>
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
