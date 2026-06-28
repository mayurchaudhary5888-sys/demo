import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { programCatalog } from "../../data/programCatalog";

const requestLogin = () => {
  window.dispatchEvent(new CustomEvent("bsi:open-login"));
};

export const ProgramsListing: React.FC = () => {
  const { user, showToast, startups } = useAppState();
  const navigate = useNavigate();

  const myStartup = user?.startupId ? startups.find((s) => s.id === user.startupId) : null;
  const userProgramId = myStartup?.selectedProgram || user?.selectedProgram;

  const displayedPrograms = (user && user.role === "founder" && userProgramId)
    ? programCatalog.filter((p) => p.id === userProgramId || p.slug === userProgramId)
    : programCatalog;

  const handleApply = (programSlug: string) => {
    if (!user) {
      showToast("Please login to apply for this program.", "info");
      requestLogin();
      return;
    }

    navigate(`/support/${programSlug}/apply`);
  };

  return (
    <div className="bg-slate-50" id="programs-listing-container">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li>
            <Link to="/" className="hover:text-[#0B2A5B]">Home</Link>
          </li>
          <li>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-[#0B2A5B] font-semibold">Programs</span>
          </li>
        </ol>
      </nav>

      <section className="space-y-3">
        <span className="text-xs font-bold text-[#FF6B00] tracking-wider uppercase font-mono">Support Programs</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A5B] tracking-tight">Find the right startup support program</h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Explore curated funding and mentorship tracks for idea validation, MSME innovation, foundation-stage founders, seed-stage startups, and global impact ventures.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-6" id="programs-listing-grid">
        {displayedPrograms.map((program) => {
          const Icon = program.icon;

          return (
            <article
              key={program.slug}
              className="group relative flex min-h-[410px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(7,20,74,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/30 hover:shadow-[0_22px_52px_rgba(7,20,74,0.10)] md:col-span-1 xl:col-span-2"
              id={`program-card-${program.slug}`}
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[#FF6B00] shadow-sm transition group-hover:scale-105 group-hover:bg-[#FF6B00] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Open
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{program.partner}</p>
                  <h2 className="text-xl font-black leading-tight text-[#0B2A5B]">{program.name}</h2>
                  <p className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold text-[#FF6B00]">{program.funding}</p>
                  <p className="text-sm leading-7 text-slate-600">{program.shortDescription}</p>
                </div>

                <div className="mt-6 space-y-2.5">
                  {program.focusAreas.slice(0, 3).map((area) => (
                    <div key={area} className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50/80 p-4">
                <Link
                  to={`/support/${program.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-[#0B2A5B] transition-colors hover:border-[#0B2A5B]/30 hover:bg-slate-100"
                  id={`see-more-${program.slug}`}
                >
                  Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleApply(program.slug)}
                  className="rounded-xl bg-[#FF6B00] px-3 py-3 text-xs font-black text-white shadow-[0_12px_24px_rgba(255,107,0,0.22)] transition-colors hover:bg-[#e65f00]"
                  id={`apply-now-${program.slug}`}
                >
                  Apply Now
                </button>
              </div>
            </article>
          );
        })}
      </section>
      </div>
    </div>
  );
};
