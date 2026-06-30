import React, { useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, X } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { getCatalogProgram } from "../../data/programCatalog";

const requestLogin = () => {
  window.dispatchEvent(new CustomEvent("bsi:open-login"));
};

export const ProgramInfoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const program = getCatalogProgram(slug);
  const { user, showToast, startups, applications } = useAppState();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [alreadyAppliedOpen, setAlreadyAppliedOpen] = useState(
    searchParams.get("alreadyApplied") === "true"
  );

  const myStartup = user?.startupId ? startups.find((s) => s.id === user.startupId) : null;
  const userProgramId = myStartup?.selectedProgram || user?.selectedProgram;

  if (!program) {
    return <Navigate to="/support" replace />;
  }

  if (user && user.role === "founder" && userProgramId && program.id !== userProgramId && program.slug !== userProgramId) {
    return <Navigate to={`/support/${userProgramId}`} replace />;
  }

  const hasAlreadyApplied = user && applications.some(
    (app) => app.programId === program.id || app.programName === program.name
  );

  const Icon = program.icon;
  const handleApply = () => {
    if (!user) {
      showToast("Please login to apply for this support.", "info");
      requestLogin();
      return;
    }
    if (hasAlreadyApplied) {
      setAlreadyAppliedOpen(true);
      return;
    }

    navigate(`/support/${program.slug}/apply`);
  };

  const handleCloseModal = () => {
    setAlreadyAppliedOpen(false);
    if (searchParams.has("alreadyApplied")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("alreadyApplied");
      setSearchParams(newParams, { replace: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id={`${program.slug}-info-page`}>
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
              <DetailPanel title="Support Benefits">
                {program.benefits.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#FF6B00] shrink-0 mt-0.5" />
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

          </aside>
        </div>
      </section>

      <AlreadyAppliedModal open={alreadyAppliedOpen} onClose={handleCloseModal} programName={program.name} />
    </div>
  );
};

type AlreadyAppliedModalProps = {
  open: boolean;
  onClose: () => void;
  programName: string;
};

const AlreadyAppliedModal: React.FC<AlreadyAppliedModalProps> = ({ open, onClose, programName }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-blue-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.35)] animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white p-2 text-slate-400 transition hover:text-slate-700"
          aria-label="Close notice"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 py-10 text-center">
          <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-blue-700">Already Applied</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B2A5B]">Application Submitted</h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-600">
            You have already submitted an application for the <strong>{programName}</strong>. You can monitor the status of your application from your dashboard.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 rounded-full bg-[#0B2A5B] px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#071c3e]"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailPanel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
    <h2 className="text-base font-black text-[#0B2A5B]">{title}</h2>
    <ul className="space-y-3">{children}</ul>
  </section>
);
