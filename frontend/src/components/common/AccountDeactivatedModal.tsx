/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertOctagon, X, Clock } from "lucide-react";

type AccountDeactivatedModalProps = {
  open: boolean;
  onClose: () => void;
  message?: string;
};

export const AccountDeactivatedModal: React.FC<AccountDeactivatedModalProps> = ({ open, onClose, message = "" }) => {
  if (!open) return null;

  const isUnderReview = message.toLowerCase().includes("not approved yet") || message.toLowerCase().includes("1-2");

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-xs">
      <div className={`relative w-full max-w-md overflow-hidden rounded-[28px] border bg-white shadow-[0_30px_120px_rgba(15,23,42,0.35)] animate-in zoom-in-95 duration-200 ${
        isUnderReview ? "border-amber-200" : "border-red-200"
      }`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white p-2 text-slate-400 transition hover:text-slate-700 focus:outline-none"
          aria-label="Close notice"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 py-10 text-center">
          {isUnderReview ? (
            <>
              <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                <Clock className="h-10 w-10 animate-pulse" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">Approval Pending</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B2A5B]">Profile Under Review</h2>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-650 font-medium">
                Your profile is not approved yet. Please wait 1-2 working days.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-red-50 text-[#F05A28] border border-red-100">
                <AlertOctagon className="h-10 w-10 animate-bounce" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-red-700">Authentication Error</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B2A5B]">Something went wrong</h2>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-650 font-medium">
                {message || "Something wrong happens. Contact support please at helloitsmeparth@gmail.com."}
              </p>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`mt-7 w-full rounded-full px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg transition ${
              isUnderReview ? "bg-amber-600 hover:bg-amber-700" : "bg-[#0B2A5B] hover:bg-[#07144A]"
            }`}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
