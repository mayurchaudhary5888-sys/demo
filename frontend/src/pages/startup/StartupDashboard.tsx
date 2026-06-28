/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, BookOpen, Building2, FileText, Sparkles } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ApplicationDetailsModal } from "../../components/common/ApplicationDetailsModal";
import { StartupProfileSummaryCard } from "./components/StartupProfileSummaryCard";
import { getCatalogProgram } from "../../data/programCatalog";

export const StartupDashboard: React.FC = () => {
  const { user, startups, applications } = useAppState();
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const myStartup = startups.find((s) => s.id === user?.startupId);
  const companyName = myStartup?.startupName || myStartup?.legalName || myStartup?.name || user?.name || "Startup";
  const selectedProgramId = myStartup?.selectedProgram || user?.selectedProgram || "";
  const selectedProgram = getCatalogProgram(selectedProgramId);
  const myApplications = applications.filter((app) => app.startupId === user?.startupId);
  const latestApplication = myApplications[0];

  return (
    <div className="space-y-8" id="startup-dashboard-container">
      <section className="rounded-[28px] border border-[#D9DCF4] bg-[linear-gradient(135deg,rgba(244,246,255,0.98),rgba(232,237,255,0.92))] px-6 py-7 shadow-[0_20px_55px_rgba(69,84,155,0.14)] sm:px-8">
        <h1 className="text-2xl font-black tracking-tight text-[#162457] sm:text-3xl">
          Welcome, {companyName}
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
          Review the registration details and company profile information submitted for your startup.
        </p>
      </section>

      {myStartup ? (
        <StartupProfileSummaryCard profile={myStartup} />
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-black text-[#162457]">Startup profile is still loading</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-slate-500">
            We could not find your startup registration profile yet. Complete registration verification, then come back here to see the full dashboard card.
          </p>
        </div>
      )}

      {selectedProgram ? (
        <section className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 bg-slate-50 pt-8">
          <div className="mx-auto grid max-w-[1600px] gap-0 px-4 py-8 sm:px-6 lg:px-8 xl:grid-cols-[340px_minmax(0,1fr)]">
            <div className="border border-slate-200 bg-[#07184A] p-6 text-white xl:border-r-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 text-[#F9B233]">
                <selectedProgram.icon className="h-8 w-8" />
              </div>
              <div className="mt-5">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/65">Your Selected Program</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">{selectedProgram.name}</h2>
                <p className="mt-3 text-sm leading-7 text-white/80">{selectedProgram.tagline}</p>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/60">Partner</p>
                  <p className="mt-1 text-sm font-bold text-white">{selectedProgram.partner}</p>
                </div>
                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/60">Funding</p>
                  <p className="mt-1 text-sm font-bold text-white">{selectedProgram.funding}</p>
                </div>
              </div>

              <Link
                to={`/support/${selectedProgram.slug}`}
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#FF6B00] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#e65f00]"
              >
                View Program Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#07184A]">
                    <BookOpen className="h-4 w-4 text-[#FF6B00]" />
                    About the Program
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{selectedProgram.longDescription}</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#07184A]">
                    <BadgeCheck className="h-4 w-4 text-[#FF6B00]" />
                    Eligibility
                  </div>
                  <ul className="space-y-3 text-sm leading-7 text-slate-700">
                    {selectedProgram.eligibility.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FF6B00]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#07184A]">
                    <FileText className="h-4 w-4 text-[#FF6B00]" />
                    Required Documents
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProgram.requiredDocuments.map((doc) => (
                      <span key={doc} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#07184A]">
                    <Sparkles className="h-4 w-4 text-[#FF6B00]" />
                    What Happens Next
                  </div>
                  <div className="space-y-3">
                    {selectedProgram.processSteps.map((step, index) => (
                      <div key={step} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[11px] font-black text-[#FF6B00]">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-slate-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-black text-[#162457]">Selected program is not available yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-slate-500">
            We could not find a support program on your profile yet. Once a program is saved, this full-screen support card will appear here.
          </p>
        </section>
      )}

      <section className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 bg-slate-50 pt-8">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="border-b border-slate-200 pb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#FF6B00]">Track Application</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#07184A]">Your submission status</h2>
          </div>

        {latestApplication ? (
          <div className="grid gap-0 border border-slate-200 bg-white xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="border-b border-slate-200 bg-slate-50 p-6 xl:border-b-0 xl:border-r">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#07184A]">Application ID</p>
                  <p className="mt-1 font-mono text-lg font-black text-[#0B2A5B]">{latestApplication.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#07184A]">Program</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{latestApplication.programName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#07184A]">Current Status</p>
                  <div className="mt-2">
                    <StatusBadge status={latestApplication.status} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(true)}
                  className="inline-flex items-center justify-center rounded-md bg-[#FF6B00] px-4 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#e65f00]"
                >
                  View Application
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#07184A]">Latest update</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {latestApplication.adminRemarks || "Your application has been saved and is waiting for the next review step."}
                  </p>
                  <div className="mt-5 text-xs font-semibold text-slate-500">
                    Submitted on <span className="font-mono text-slate-700">{latestApplication.submittedDate}</span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#07184A]">Timeline</p>
                  <div className="mt-4 space-y-3">
                    {latestApplication.timeline.slice(0, 3).map((step) => (
                      <div key={`${step.status}-${step.timestamp}`} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#FF6B00]" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-[#0B2A5B]">{step.status}</p>
                            <span className="text-[11px] font-semibold text-slate-400">{step.timestamp}</span>
                          </div>
                          {step.remarks && <p className="mt-1 text-sm text-slate-600">{step.remarks}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-slate-200 bg-white px-6 py-12 text-center sm:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-xl font-black text-[#162457]">No application submitted yet</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-7 text-slate-500">
              Once you submit a program application, the tracking section will appear here with your application ID, status, and review timeline.
            </p>
          </div>
        )}
        </div>
      </section>

      <ApplicationDetailsModal
        open={showApplicationModal}
        application={latestApplication}
        onClose={() => setShowApplicationModal(false)}
      />
    </div>
  );
};
