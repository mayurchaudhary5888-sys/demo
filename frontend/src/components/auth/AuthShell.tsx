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
  decorated?: boolean;
};

export const AuthShell: React.FC<AuthShellProps> = ({
  badge,
  title,
  description,
  children,
  aside,
  maxWidthClassName = "max-w-7xl",
  showFooterNote = true,
  decorated = true,
}) => {
  return (
    <div
      className="relative min-h-[calc(100vh-7rem)] overflow-hidden bg-[#F8FAFC] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
      id="auth-shell"
    >
      {decorated ? (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-72 bg-[#07184A]" />
          <div className="absolute right-[-8rem] top-[-8rem] h-96 w-96 rounded-full bg-[#FF6B00]/18 blur-3xl" />
          <div className="absolute left-[-10rem] top-20 h-80 w-80 rounded-full bg-[#07184A]/8 blur-3xl" />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[#07184A]" />
      )}

      <div
        className={`relative mx-auto ${maxWidthClassName} overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(7,20,74,0.14)]`}
      >
        <div className="h-1.5 bg-[#FF6B00]" />

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
