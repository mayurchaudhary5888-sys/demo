/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Clock3, Sparkles } from "lucide-react";

export const MyConnections: React.FC = () => {
  return (
    <div
      className="relative left-1/2 right-1/2 -mx-[50vw] min-h-[calc(100vh-7rem)] w-screen overflow-hidden bg-white"
      id="connections-coming-soon"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B2A5B] via-[#12356f] to-[#F05A28] opacity-[0.06]" aria-hidden="true" />
      <div className="relative flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <div className="w-full max-w-5xl rounded-[2rem] border border-slate-200 bg-white px-6 py-16 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:px-10">
          <div className="mb-6 flex items-center justify-center gap-3 rounded-full border border-[#F05A28]/15 bg-[#FFF7F1] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#F05A28]">
            <Sparkles className="h-4 w-4" />
            Coming Soon
          </div>
          <h1 className="mx-auto max-w-2xl text-4xl font-black tracking-tight text-[#0B2A5B] sm:text-5xl">
            Startup Connections will open soon
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            This section is being prepared for a focused launch. We are keeping it clean for now, so no extra features or backend data are shown here yet.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
            <Clock3 className="h-4 w-4 text-[#F05A28]" />
            Check back soon for the full experience
          </div>
        </div>
      </div>
    </div>
  );
};
