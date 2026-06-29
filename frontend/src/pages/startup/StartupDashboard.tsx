/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2 } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { StartupProfileSummaryCard } from "./components/StartupProfileSummaryCard";

export const StartupDashboard: React.FC = () => {
  const { user, startups } = useAppState();

  const myStartup = startups.find((s) => s.id === user?.startupId);
  const companyName = myStartup?.startupName || myStartup?.legalName || myStartup?.name || user?.name || "Startup";

  return (
    <div className="space-y-8" id="startup-dashboard-container">
      <section className="rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-xs sm:px-8">
        <h1 className="text-xl font-bold tracking-tight text-[#0B2A5B] sm:text-2xl">
          Welcome, {companyName}
        </h1>
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
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

    </div>
  );
};
