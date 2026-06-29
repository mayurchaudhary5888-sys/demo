/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertTriangle, X } from "lucide-react";

type ProfileUnderReviewModalProps = {
  open: boolean;
  onClose: () => void;
};

export const ProfileUnderReviewModal: React.FC<ProfileUnderReviewModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.35)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white p-2 text-slate-400 transition hover:text-slate-700"
          aria-label="Close notice"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 py-10 text-center">
          <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-700">Profile Under Review</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B2A5B]">Your profile is under review</h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-600">
            Please try again after some time. You can log in normally, but support applications are temporarily paused until the review is completed.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 rounded-full bg-[#F05A28] px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#d9481b]"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
