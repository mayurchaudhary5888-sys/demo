import React from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { getCatalogProgram } from "../../data/programCatalog";

const requestLogin = () => {
  window.dispatchEvent(new CustomEvent("bsi:open-login"));
};

export const ProgramInfoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const program = getCatalogProgram(slug);
  const { user, showToast, startups } = useAppState();
  const navigate = useNavigate();

  const myStartup = user?.startupId ? startups.find((s) => s.id === user.startupId) : null;
  const userProgramId = myStartup?.selectedProgram || user?.selectedProgram;

  if (!program) {
    return <Navigate to="/support" replace />;
  }

  if (user && user.role === "founder" && userProgramId && program.id !== userProgramId && program.slug !== userProgramId) {
    return <Navigate to={`/support/${userProgramId}`} replace />;
  }

  const Icon = program.icon;
  const handleApply = () => {
    if (!user) {
      showToast("Please login to apply for this program.", "info");
      requestLogin();
      return;
    }

    navigate(`/support/${program.slug}/apply`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id={`${program.slug}-info-page`}>
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li>
            <Link to="/support" className="hover:text-[#0B2A5B] flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Programs</span>
            </Link>
          </li>
          <li>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-[#0B2A5B] font-semibold">{program.name}</span>
          </li>
        </ol>
      </nav>

      <section className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <div className="h-14 w-14 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00]">
                <Icon className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-[#FF6B00]">{program.partner}</p>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A5B] tracking-tight">{program.name}</h1>
                <p className="text-base font-extrabold text-slate-700">{program.tagline}</p>
                <p className="text-sm leading-relaxed text-slate-600 max-w-3xl">{program.longDescription}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DetailPanel title="Program Benefits">
                {program.benefits.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </DetailPanel>

              <DetailPanel title="Eligibility">
                {program.eligibility.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </DetailPanel>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
              <h2 className="text-base font-black text-[#0B2A5B]">Application Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program.processSteps.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-lg bg-slate-50 border border-slate-100 p-4">
                    <span className="h-7 w-7 rounded-full bg-[#0B2A5B] text-white flex items-center justify-center text-xs font-black shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
            <div className="rounded-lg bg-[#0B2A5B] p-6 text-white space-y-4 shadow-lg">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-amber-300">Funding Support</p>
                <p className="mt-1 text-2xl font-black">{program.funding}</p>
              </div>
              <p className="text-sm leading-relaxed text-blue-100">
                Applications are reviewed against eligibility, documents, founder readiness, and milestone clarity.
              </p>
              <button
                type="button"
                onClick={handleApply}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#e65f00]"
                id={`detail-apply-${program.slug}`}
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
              <h2 className="text-base font-black text-[#0B2A5B]">Required Documents</h2>
              <div className="space-y-2">
                {program.requiredDocuments.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-100 p-3">
                    <FileText className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

const DetailPanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
    <h2 className="text-base font-black text-[#0B2A5B]">{title}</h2>
    <ul className="space-y-3">{children}</ul>
  </section>
);
