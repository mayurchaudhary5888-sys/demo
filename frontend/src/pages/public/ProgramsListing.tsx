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
    <div className="min-h-[calc(100vh-7rem)] bg-slate-50" id="programs-listing-container">
      <section className="bg-[#07184A] text-white">
        <div className="mx-auto max-w-[88rem] px-5 py-10 sm:px-8 lg:px-10">
          <nav className="flex" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2 text-xs font-bold text-white/65">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              <li>
                <span className="mx-1 text-white/30">/</span>
                <span className="text-white">Programs</span>
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.45fr)] lg:items-end">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.26em] text-[#F9B233]">Support Programs</span>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
                Find the right startup support program
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/76">
                Explore curated funding and mentorship tracks for idea validation, MSME innovation, foundation-stage founders, seed-stage startups, and global impact ventures.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/8 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#F9B233]">Available Tracks</p>
              <p className="mt-2 text-3xl font-black">{displayedPrograms.length}</p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                Select a program to review eligibility, required documents, and application details.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[88rem] px-5 py-8 sm:px-8 lg:px-10">
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6" id="programs-listing-grid">
        {displayedPrograms.map((program) => {
          const Icon = program.icon;

          return (
            <article
              key={program.slug}
              className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#FF6B00]/40 hover:shadow-md md:col-span-1 xl:col-span-2"
              id={`program-card-${program.slug}`}
            >
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-[#FF6B00] transition group-hover:bg-[#FF6B00] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Open
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{program.partner}</p>
                  <h2 className="text-xl font-black leading-tight text-[#0B2A5B]">{program.name}</h2>
                  <p className="inline-flex rounded-md bg-orange-50 px-3 py-1 text-xs font-extrabold text-[#FF6B00]">{program.funding}</p>
                  <p className="text-sm leading-7 text-slate-600">{program.shortDescription}</p>
                </div>

                <div className="mt-5 space-y-2.5">
                  {program.focusAreas.slice(0, 3).map((area) => (
                    <div key={area} className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50 p-4">
                <Link
                  to={`/support/${program.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-3 text-xs font-black text-[#0B2A5B] transition-colors hover:border-[#0B2A5B]/30 hover:bg-slate-100"
                  id={`see-more-${program.slug}`}
                >
                  Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleApply(program.slug)}
                  className="rounded-md bg-[#FF6B00] px-3 py-3 text-xs font-black text-white transition-colors hover:bg-[#e65f00]"
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
