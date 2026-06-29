import React from "react";
import { CheckCircle2, ArrowRight, X } from "lucide-react";

type ApplicationSuccessModalProps = {
  open: boolean;
  applicationId?: string;
  programName?: string;
  onContinue: () => void;
  onClose: () => void;
};

export const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
  open,
  applicationId,
  programName,
  onContinue,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-emerald-950/55 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-emerald-200 bg-white shadow-[0_30px_120px_rgba(6,95,70,0.25)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,253,245,0.92),_rgba(255,255,255,1)_55%)]" aria-hidden="true" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white p-2 text-slate-400 transition hover:text-slate-700"
          aria-label="Close success dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative px-6 py-10 text-center sm:px-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 shadow-[0_0_0_12px_rgba(16,185,129,0.12)]">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-emerald-600">
            Application Submitted
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B2A5B]">
            Your application was successfully submitted
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">
            {programName
              ? `Your submission for ${programName} has been saved.`
              : "Your submission has been saved and is now available in your dashboard."}
          </p>

          {applicationId && (
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              Application ID: <span className="font-mono">{applicationId}</span>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-600 transition hover:bg-slate-50"
            >
              Stay here
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_16px_30px_rgba(16,185,129,0.28)] transition hover:bg-emerald-600"
            >
              Okay
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
