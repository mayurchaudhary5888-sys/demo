/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertOctagon, X } from "lucide-react";

type AccountDeactivatedModalProps = {
  open: boolean;
  onClose: () => void;
};

export const AccountDeactivatedModal: React.FC<AccountDeactivatedModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-red-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.35)] animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white p-2 text-slate-400 transition hover:text-slate-700"
          aria-label="Close notice"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 py-10 text-center">
          <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
            <AlertOctagon className="h-10 w-10 animate-bounce" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-red-700">Authentication Error</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B2A5B]">Something went wrong</h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-650 font-medium">
            Something wrong happens. Contact support please at <span className="font-extrabold text-[#0B2A5B]">helloitsmeparth@gmail.com</span>.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 w-full rounded-full bg-[#0B2A5B] hover:bg-[#07144A] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg transition"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
