/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-[#151515] text-white" id="app-footer">
      <div className="bg-[#262626]">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[1fr_1.45fr_0.8fr_0.8fr] lg:px-8">
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <img
              src="/logos/bhaskar.jpeg"
              alt="BHASKAR"
              className="h-16 w-auto max-w-[140px] rounded bg-white object-contain"
            />
            <img
              src="/logos/azadi-logo.png"
              alt="Azadi Ka Amrit Mahotsav"
              className="h-16 w-auto max-w-[140px] rounded bg-white object-contain"
            />
          </div>

          <form className="flex w-full flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="min-h-11 flex-1 rounded border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20"
            />
            <button
              type="submit"
              className="min-h-11 rounded bg-[#FF6B00] px-7 text-sm font-extrabold text-white transition hover:bg-[#E65F00]"
            >
              Subscribe
            </button>
          </form>

          <div className="text-center text-sm font-bold leading-6 lg:text-left">
            <p>Last Updated:</p>
            <p>10-Dec-2024 | 11:15 AM</p>
          </div>

          <div className="text-center text-sm font-bold leading-6 lg:text-left">
            <p>Working Hrs:</p>
            <p>10:00 am - 5:30 pm</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#151515] px-4 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Startup Bharat. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
