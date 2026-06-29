import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { programCatalog } from "../../data/programCatalog";

const requestLogin = () => {
  window.dispatchEvent(new CustomEvent("bsi:open-login"));
};

export const ProgramsListing: React.FC = () => {
  const { user, showToast, startups, applications } = useAppState();
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
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.26em] text-[#F9B233]">Support</span>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              Find the right startup support
            </h1>
            <p className="max-w-3xl text-base leading-7 text-white/76">
              Explore curated funding and mentorship tracks to scale your startup.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 lg:px-10">
      <section className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3" id="programs-listing-grid">
        {displayedPrograms.map((program) => {
          const Icon = program.icon;

          // Check if there is an application for this program
          const userApp = user ? applications.find((app) => app.programId === program.id) : null;
          
          // Determine status text and colors
          let statusInfo = { text: "Apply Now", color: "text-emerald-600", bg: "bg-emerald-50", appId: "" };
          
          if (!user) {
            statusInfo = { text: "Apply Now", color: "text-emerald-600", bg: "bg-emerald-50", appId: "" };
          } else if (userApp) {
            statusInfo = {
              text: userApp.status,
              color: userApp.status === "Rejected" ? "text-red-600" : "text-emerald-600",
              bg: userApp.status === "Rejected" ? "bg-red-50" : "bg-emerald-50",
              appId: userApp.id
            };
          } else {
            // Logged in, not applied yet
            // Keep only the "Apply Now" label green; the rest stays on the orange/blue theme.
            if (program.id === "idea-validation-program" || program.id === "foundation-program") {
              statusInfo = { text: "Apply Now", color: "text-emerald-600", bg: "bg-emerald-50", appId: "" };
            } else {
              statusInfo = { text: "Eligible", color: "text-[#FF6B00]", bg: "bg-orange-50", appId: "" };
            }
          }

          return (
            <article
              key={program.slug}
              className="group relative flex flex-col pt-12 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-md transition duration-300"
              id={`program-card-${program.slug}`}
            >
              {/* Circular Logo/Badge Container centered at top border */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-slate-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center z-10 p-1">
                <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center border border-slate-100/80 overflow-hidden">
                  {(program as any).logoUrl ? (
                    <img src={(program as any).logoUrl} alt={program.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon className="h-7 w-7 text-slate-500 transition-colors group-hover:text-[#FF6B00]" />
                  )}
                </div>
              </div>

              {/* Title band with rounded-t corners matching the card's rounded-[2rem] */}
              <div className="w-full bg-[#FFF5F2] border-b border-slate-100 py-5 px-6 text-center rounded-t-[2rem]">
                <h2 className="text-lg font-black text-[#0B2A5B] leading-tight tracking-tight">{program.name}</h2>
              </div>

              {/* Card Body */}
              <div className="flex-1 flex flex-col p-6 pb-5">
                {/* Description box fitting content perfectly */}
                <div className="flex-1 text-sm leading-7 text-slate-600 text-center font-medium">
                  {program.shortDescription}
                </div>

                {/* Status Section */}
                <div className="mt-6 border-t border-slate-100 pt-5 w-full flex items-center justify-center">
                  {statusInfo.appId ? (
                    <div className="grid grid-cols-2 gap-4 w-full text-center divide-x divide-slate-100">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
                        <span className={`mt-1 text-base font-black tracking-tight block ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center pl-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Application No</span>
                        <span className="mt-1 text-base font-black tracking-tight text-slate-800 block font-mono">
                          {statusInfo.appId.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
                      <span className={`mt-1 text-base font-black tracking-tight block ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Buttons (Footer) */}
              <div className="border-t border-slate-100 bg-[#FCFDFE] py-4 px-6 rounded-b-[2rem]">
                <div className="flex justify-center w-full">
                  <button
                    type="button"
                    onClick={() => handleApply(program.slug)}
                    className="text-xs font-black text-[#0B2A5B] hover:text-[#FF6B00] transition cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
      </div>
    </div>
  );
};
