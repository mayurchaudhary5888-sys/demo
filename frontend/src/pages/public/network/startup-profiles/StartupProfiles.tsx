/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Link } from "react-router-dom";
import { Building2, CheckCircle2, LockKeyhole, MapPin, Search, ShieldCheck } from "lucide-react";

const placeholderCards = Array.from({ length: 6 }, (_, index) => index + 1);
const stageLabels = ["All", "Ideation", "Validation", "Early Traction", "Scaling"];

export const StartupProfiles: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-7rem)] bg-slate-50" id="startup-profiles-static-page">
      <section className="bg-[#07184A] text-white">
        <div className="mx-auto max-w-[88rem] px-5 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] lg:items-end">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.26em] text-[#F9B233]">Verified Ecosystem Directory</span>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
                DPIIT recognized startup profiles
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/76">
                A public-facing directory surface for ecosystem discovery, profile visibility, and startup network navigation.
              </p>
            </div>

            <div className="rounded-lg border border-white/15 bg-white/8 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-[#07184A]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#F9B233]">Privacy Mode</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    Public details are intentionally hidden on this showcase view.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[88rem] px-5 py-8 sm:px-8 lg:px-10">
        <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Search directory
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                disabled
                placeholder="Search is not active"
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-semibold text-slate-500"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              State / UT
            </label>
            <select
              disabled
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-500"
            >
              <option>All regions</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Sector
            </label>
            <select
              disabled
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-500"
            >
              <option>All sectors</option>
            </select>
          </div>

          <div className="flex items-end lg:col-span-2">
            <button
              type="button"
              disabled
              className="w-full rounded-md border border-slate-200 bg-slate-100 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-400"
            >
              Reset
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4 lg:col-span-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stage</span>
              {stageLabels.map((label) => (
                <button
                  key={label}
                  type="button"
                  disabled
                  className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-[11px] font-bold text-slate-500"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3" id="startup-profile-placeholder-grid">
          {placeholderCards.map((item) => (
            <article
              key={item}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-[#FF6B00]">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Location hidden</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Sector hidden
                </span>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">
                  Stage hidden
                </span>
              </div>

              <div className="mt-5 space-y-2">
                <div className="h-3 rounded bg-slate-100" />
                <div className="h-3 rounded bg-slate-100" />
                <div className="h-3 w-3/4 rounded bg-slate-100" />
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <LockKeyhole className="h-4 w-4" />
                  <span>Private profile</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-[11px] font-black text-slate-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Showcase
                </span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};
