/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, FileText, CalendarDays, Building2, CheckCircle2 } from "lucide-react";
import { Application } from "../../types";
import { StatusBadge } from "./StatusBadge";

type ApplicationDetailsModalProps = {
  open: boolean;
  application: Application | null;
  onClose: () => void;
};

const META_KEYS = new Set([
  "id",
  "programId",
  "programName",
  "startupId",
  "startupName",
  "submittedDate",
  "lastUpdated",
  "status",
  "adminRemarks",
  "rejectedAt",
  "selectedProgram",
  "submittedByEmail",
  "submittedByName",
  "updatedAt",
  "createdAt",
  "timeline",
]);

const CORE_KEYS = [
  "problemStatement",
  "solutionDescription",
  "currentStage",
  "teamSize",
  "fundingStatus",
  "pitchDeckName",
  "additionalDocumentsName",
];

const formatLabel = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const formatPrimitive = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  return String(value);
};

const ValueRenderer: React.FC<{ value: unknown }> = ({ value }) => {
  if (Array.isArray(value)) {
    if (!value.length) return <p className="text-slate-500">Not provided</p>;
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <span key={`${String(item)}-${index}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {formatPrimitive(item)}
          </span>
        ))}
      </div>
    );
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (!entries.length) return <p className="text-slate-500">Not provided</p>;
    return (
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        {entries.map(([key, item]) => (
          <div key={key} className="grid grid-cols-1 gap-1 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{formatLabel(key)}</span>
            <div className="text-sm font-medium text-slate-700">
              <ValueRenderer value={item} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span>{formatPrimitive(value)}</span>;
};

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5B64A8]">{title}</h3>
    <div className="mt-4">{children}</div>
  </section>
);

export const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({ open, application, onClose }) => {
  if (!open || !application) return null;

  const app = application as Application & Record<string, unknown>;
  const detailEntries = Object.entries(app).filter(([key, value]) => {
    if (META_KEYS.has(key) || CORE_KEYS.includes(key)) return false;
    if (value === undefined || value === null || value === "") return false;
    if (Array.isArray(value) && !value.length) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.98),_rgba(255,255,255,1)_55%)]" aria-hidden="true" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white p-2 text-slate-400 transition hover:text-slate-700"
          aria-label="Close application details"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative max-h-[90vh] overflow-y-auto px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F05A28]">View Application</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0B2A5B]">
                {application.programName}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Read-only copy of the exact details submitted by the founder.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={application.status} />
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                <CalendarDays className="h-3.5 w-3.5 text-[#F05A28]" />
                {application.submittedDate}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <SectionCard title="Application Summary">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Application ID", application.id],
                  ["Startup Name", application.startupName],
                  ["Program Name", application.programName],
                  ["Program ID", application.programId],
                  ["Selected Program", application.selectedProgram],
                  ["Submitted By", application.submittedByName],
                  ["Submitted Email", application.submittedByEmail],
                  ["Last Updated", application.lastUpdated || application.updatedAt || application.submittedDate],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{formatPrimitive(value)}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Timeline">
              <div className="space-y-3">
                {application.timeline?.length ? (
                  application.timeline.map((step) => (
                    <div key={`${step.status}-${step.timestamp}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-[#0B2A5B]">{step.status}</p>
                        <span className="text-[11px] font-semibold text-slate-400">{step.timestamp}</span>
                      </div>
                      {step.remarks && <p className="mt-1 text-sm text-slate-600">{step.remarks}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No timeline entries available.</p>
                )}
              </div>
            </SectionCard>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <SectionCard title="Core Form Fields">
              <div className="space-y-3">
                {CORE_KEYS.map((key) => {
                  const value = app[key];
                  if (value === undefined || value === null || value === "") return null;
                  return (
                    <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{formatLabel(key)}</p>
                      <div className="mt-1 text-sm font-medium text-slate-700">
                        <ValueRenderer value={value} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Additional Submitted Details">
              {detailEntries.length ? (
                <div className="space-y-3">
                  {detailEntries.map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{formatLabel(key)}</p>
                      <div className="mt-1 text-sm font-medium text-slate-700">
                        <ValueRenderer value={value} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  No extra fields were stored for this application.
                </div>
              )}
            </SectionCard>
          </div>

          {application.adminRemarks && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-amber-700">Admin Remarks</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{application.adminRemarks}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#0B2A5B] px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#102e68]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
