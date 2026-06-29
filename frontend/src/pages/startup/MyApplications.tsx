/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, BookOpen, Building2, FileText, Sparkles, Lightbulb, Rocket, Globe2 } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { StatusBadge } from "../../components/common/StatusBadge";
import { getCatalogProgram, programCatalog } from "../../data/programCatalog";
import { contentApi } from "../../services/contentApi";
import type { Application } from "../../types";

export const MyApplications: React.FC = () => {
  const { user, startups } = useAppState();
  const navigate = useNavigate();
  const [localApps, setLocalApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"in_progress" | "selected" | "closed" | "rejected">("in_progress");

  const openApplicationView = (application: Application) => {
    const appId = application.id || (application as any)._id;
    navigate(`/support/${application.programId}/apply?view=true&appId=${appId}`);
  };

  useEffect(() => {
    let active = true;
    const fetchApps = async () => {
      try {
        setIsLoading(true);
        const data = await contentApi.getApplications();
        if (active) {
          setLocalApps(data);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    fetchApps();
    return () => {
      active = false;
    };
  }, [user]);

  const myStartup = startups.find((s) => s.id === user?.startupId);
  const userProgramId = myStartup?.selectedProgram || user?.selectedProgram || "startup-program";
  const myApplications = localApps.filter((app) => app.startupId === user?.startupId && app.programId === userProgramId);

  // Determine active application
  const activeAppId = selectedAppId || myApplications[0]?.id || "";
  const selectedApp = myApplications.find((app) => app.id === activeAppId) || myApplications[0];

  const selectedProg = selectedApp ? getCatalogProgram(selectedApp.programId) : null;

  const startupAppForTab = selectedApp && selectedApp.programId === "startup-program" ? selectedApp : null;

  return (
    <div className="space-y-6" id="my-applications-container">
      {/* Page Header */}
      <section className="rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-[#0B2A5B] sm:text-2xl">
          My Applications
        </h1>
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
          Track the status of your submitted applications for support programs under BHASKAR.
        </p>
      </section>

      {isLoading ? (
        /* Premium loading skeleton spinner */
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 bg-white border border-slate-200 rounded-xl p-10 shadow-xs">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF6B00]"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Loading your applications...
          </p>
        </div>
      ) : myApplications.length > 0 && selectedApp ? (
        <div className="space-y-6">
          {/* If there are multiple applications, show an elegant selector */}
          {myApplications.length > 1 && (
            <div className="flex flex-wrap gap-2.5 bg-slate-100/60 p-2 rounded-xl w-fit border border-slate-200">
              {myApplications.map((app) => {
                const isSelected = selectedApp.id === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      setSelectedAppId(app.id);
                      setActiveTab("in_progress");
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      isSelected
                        ? "bg-[#0B2A5B] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                    }`}
                  >
                    {app.programName}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tracking Details Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            {selectedApp.programId === "startup-program" ? (
              /* Custom tracker view with incubator preferences for startup support */
              <div className="space-y-6" id="startup-program-tracking-view">
                {/* My Applications Header & Tabs Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-[#FF6B00]" />
                      <h2 className="text-lg font-bold text-slate-800">{selectedProg?.name} Tracking</h2>
                    </div>
                    <div className="flex flex-wrap gap-6 text-xs font-bold text-slate-500 pt-1">
                      {(["in_progress", "selected", "closed", "rejected"] as const).map((tab) => {
                        const isActive = activeTab === tab;
                        const label =
                          tab === "in_progress"
                            ? "In Progress"
                            : tab === "selected"
                            ? "Selected"
                            : tab === "closed"
                            ? "Closed / Cancelled"
                            : "Rejected";
                        return (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 transition-all relative ${
                              isActive
                                ? "text-slate-900 border-b-2 border-[#F05A28] font-bold"
                                : "hover:text-slate-800"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openApplicationView(selectedApp)}
                    className="bg-[#0B2A5B] hover:bg-[#102e68] text-white font-bold px-6 py-2 rounded-full text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    View Submitted Form
                  </button>
                </div>

                {/* Application Details Card */}
                {startupAppForTab ? (
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    {/* Card Sub-header with ID & View Button */}
                    <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border-b border-slate-100 gap-4">
                      <h3 className="text-md font-bold text-slate-800">
                        Application Number - {startupAppForTab.id}
                      </h3>
                      <button
                        type="button"
                        onClick={() => openApplicationView(startupAppForTab)}
                        className="border border-[#0B2A5B] text-[#0B2A5B] hover:bg-slate-50 font-bold px-5 py-1.5 rounded-full text-xs uppercase tracking-wide transition-colors"
                      >
                        View Details
                      </button>
                    </div>

                    {/* Gray Title Bar: Incubator Preferences */}
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                        Incubator Preferences
                      </h4>
                    </div>

                    {/* List of 3 Incubators */}
                    <div className="divide-y divide-slate-150">
                      {(() => {
                        const prefs = startupAppForTab.incubatorPreferences || [];
                        const filteredPrefs = prefs.filter((p) => {
                          if (activeTab === "in_progress") return true;
                          if (activeTab === "selected") return p.status === "Selected";
                          if (activeTab === "rejected") return p.status === "Rejected";
                          return true;
                        });

                        if (filteredPrefs.length === 0) {
                          return (
                            <div className="p-6 text-center text-xs font-semibold text-slate-500">
                              No incubator preferences match this status.
                            </div>
                          );
                        }

                        return filteredPrefs.map((pref, idx) => {
                          const statusColors =
                            pref.status === "Pending Review"
                              ? "bg-amber-50 text-amber-850 border border-amber-250/50"
                              : pref.status === "Selected"
                              ? "bg-emerald-50 text-emerald-850 border border-emerald-250/50"
                              : pref.status === "Rejected"
                              ? "bg-rose-50 text-rose-850 border border-rose-250/50"
                              : "bg-slate-50 text-slate-700 border border-slate-200/50";

                          return (
                            <div key={pref.preferenceOrder} className="p-6 space-y-4">
                              {/* Incubator Title Line */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-slate-850">
                                    {pref.preferenceOrder}. {pref.incubatorName}
                                  </span>
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors}`}>
                                    {pref.status}
                                  </span>
                                </div>
                              </div>

                              {/* Metadata Row */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl text-xs pt-1">
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-medium">Submitted</span>
                                  <p className="font-bold text-slate-800">
                                    {pref.submittedDate || startupAppForTab.submittedDate}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-medium">
                                    Application Completeness Checked On
                                  </span>
                                  <p className="font-bold text-slate-750">
                                    {pref.completenessStatus || "In Progress"}
                                  </p>
                                </div>
                              </div>

                              {/* Comments/Feedback Table Block */}
                              {pref.status !== "Submitted" && (
                                <div className="pt-2 space-y-2">
                                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Incubator Comments/Feedback
                                  </h5>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left border-t border-slate-100">
                                      <thead>
                                        <tr className="text-slate-400 font-medium border-b border-slate-100">
                                          <th className="py-2 pr-4 font-normal">Application Status</th>
                                          <th className="py-2 px-4 font-normal">Date</th>
                                          <th className="py-2 pl-4 font-normal">Comments</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="text-slate-700 font-medium">
                                          <td className="py-2.5 pr-4 font-bold text-slate-800">
                                            {pref.status}
                                          </td>
                                          <td className="py-2.5 px-4 font-mono text-xs text-slate-500">
                                            {pref.commentsDate ||
                                              pref.submittedDate ||
                                              startupAppForTab.submittedDate}
                                          </td>
                                          <td className="py-2.5 pl-4 text-slate-650 italic">
                                            {pref.comments || "Pending review"}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center">
                    <p className="text-xs font-semibold text-slate-500">
                      No applications found in the "
                      {activeTab === "in_progress"
                        ? "In Progress"
                        : activeTab === "selected"
                        ? "Selected"
                        : activeTab === "closed"
                        ? "Closed / Cancelled"
                        : "Rejected"}
                      " tab.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Original timeline-based tracker view for the other 4 support programs */
              <div className="space-y-6" id="generic-program-tracking-view">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    {selectedApp.programId === "idea-validation-program" && (
                      <Lightbulb className="h-5 w-5 text-[#FF6B00]" />
                    )}
                    {selectedApp.programId === "msme-program" && (
                      <Building2 className="h-5 w-5 text-[#FF6B00]" />
                    )}
                    {selectedApp.programId === "foundation-program" && (
                      <BookOpen className="h-5 w-5 text-[#FF6B00]" />
                    )}
                    {selectedApp.programId === "global-impact-program" && (
                      <Globe2 className="h-5 w-5 text-[#FF6B00]" />
                    )}
                    <h2 className="text-lg font-bold text-slate-800">{selectedProg?.name} Tracking</h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    Latest activity tracked
                  </span>
                </div>

                <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
                  {/* Left Column: Quick Stats */}
                  <div className="border border-slate-200 bg-slate-50/50 p-6 rounded-2xl space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#07184A]">
                        Application ID
                      </p>
                      <p className="mt-1 font-mono text-base font-black text-[#0B2A5B]">
                        {selectedApp.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#07184A]">
                        Program
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-700">
                        {selectedApp.programName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#07184A]">
                        Current Status
                      </p>
                      <div className="mt-1.5">
                        <StatusBadge status={selectedApp.status} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openApplicationView(selectedApp)}
                      className="w-full inline-flex items-center justify-center rounded-lg bg-[#FF6B00] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#e65f00]"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Right Column: Timeline & Remarks */}
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#07184A]">
                        Latest Remarks
                      </p>
                      <p className="mt-3 text-xs leading-6 text-slate-600">
                        {selectedApp.adminRemarks ||
                          "Your application has been saved and is waiting for the next review step."}
                      </p>
                      <div className="mt-4 text-[11px] font-semibold text-slate-500">
                        Submitted on{" "}
                        <span className="font-mono text-slate-700">
                          {selectedApp.submittedDate}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#07184A]">
                        Timeline
                      </p>
                      <div className="mt-3 space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {selectedApp.timeline?.slice(0, 3).map((step, index) => (
                          <div
                            key={`${step.status}-${step.timestamp}-${index}`}
                            className="flex gap-3 rounded-xl border border-slate-250 bg-slate-50/50 px-3.5 py-2.5"
                          >
                            <div className="mt-1 h-2 w-2 rounded-full bg-[#FF6B00]" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-[#0B2A5B]">
                                  {step.status}
                                </p>
                                <span className="text-[10px] font-semibold text-slate-400">
                                  {step.timestamp}
                                </span>
                              </div>
                              {step.remarks && (
                                <p className="mt-1 text-xs text-slate-550 leading-relaxed">{step.remarks}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CASE: Startup has NOT applied to any support programs yet */
        <div className="flex justify-center pt-16">
          {programCatalog
            .filter((prog) => prog.id === userProgramId)
            .map((prog) => {
              const Icon = prog.icon;
              return (
                <article
                  key={prog.slug}
                  className="group relative flex flex-col pt-12 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-md transition duration-300 max-w-sm w-full"
                  id={`program-card-${prog.slug}`}
                >
                  {/* Circular Logo/Badge Container centered at top border */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-slate-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center z-10 p-1">
                    <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center border border-slate-100/80 overflow-hidden">
                      {(prog as any).logoUrl ? (
                        <img src={(prog as any).logoUrl} alt={prog.name} className="w-full h-full object-cover" />
                      ) : (
                        <Icon className="h-7 w-7 text-slate-500 transition-colors group-hover:text-[#FF6B00]" />
                      )}
                    </div>
                  </div>

                  {/* Title band with rounded-t corners matching the card's rounded-[2rem] */}
                  <div className="w-full bg-[#FFF5F2] border-b border-slate-100 py-5 px-6 text-center rounded-t-[2rem]">
                    <h2 className="text-lg font-black text-[#0B2A5B] leading-tight tracking-tight">{prog.name}</h2>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 flex flex-col p-6 pb-5">
                    {/* Description box fitting content perfectly */}
                    <div className="flex-1 text-sm leading-7 text-slate-600 text-center font-medium">
                      {prog.shortDescription}
                    </div>

                    {/* Status Section */}
                    <div className="mt-6 border-t border-slate-100 pt-5 w-full flex items-center justify-center">
                      <div className="text-center flex flex-col items-center justify-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
                        <span className="mt-1 text-base font-black tracking-tight block text-[#FF6B00]">
                          Eligible
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Buttons (Footer) */}
                  <div className="border-t border-slate-100 bg-[#FCFDFE] py-4 px-6 rounded-b-[2rem]">
                    <div className="flex justify-center w-full">
                      <Link
                        to={`/support/${prog.slug}/apply`}
                        className="text-xs font-black text-[#0B2A5B] hover:text-[#FF6B00] transition cursor-pointer"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      )}

    </div>
  );
};
