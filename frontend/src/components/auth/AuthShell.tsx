/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Info } from "lucide-react";

type AuthShellProps = {
  badge: string;
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
  maxWidthClassName?: string;
  showFooterNote?: boolean;
};

export const AuthShell: React.FC<AuthShellProps> = ({
  badge,
  title,
  description,
  children,
  aside,
  maxWidthClassName = "max-w-7xl",
  showFooterNote = true,
}) => {
  return (
    <div
      className="relative min-h-[calc(100vh-7rem)] overflow-hidden bg-[#07184A] px-4 py-10 text-slate-900 sm:px-6 lg:px-8"
      id="auth-shell"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(7,24,74,0.98),_rgba(11,42,91,0.96)_48%,_rgba(13,31,71,0.98))]" />
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#FF6B00]/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#F9B233]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(90deg,_rgba(255,255,255,0.12)_1px,_transparent_1px),linear-gradient(0deg,_rgba(255,255,255,0.12)_1px,_transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div
        className={`relative mx-auto ${maxWidthClassName} rounded-[2rem] border border-white/45 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl`}
      >
        <div className="h-2 rounded-t-[2rem] bg-gradient-to-r from-[#FF6B00] via-[#F9B233] to-[#0B2A5B]" />

        <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/20 bg-[#FFF4EA] px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-[#D94F00]">
                <Info className="h-3.5 w-3.5 text-[#FF6B00]" />
                {badge}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[#07184A] sm:text-3xl">{title}</h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
            </div>

            {aside}
          </div>

          {children}

          {showFooterNote && (
            <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-600">
              <span className="font-bold text-[#07184A]">Bhaskar Startup India</span> keeps the registration, login, and verification
              flows on one common surface so the journey feels consistent.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
