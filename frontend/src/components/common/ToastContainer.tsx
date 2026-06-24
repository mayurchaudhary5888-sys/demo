/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Info, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { useAppState } from "../../context/AppContext";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppState();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] p-4 max-w-sm w-full space-y-3 pointer-events-none">
      {toasts.map((toast) => {
        let bgStyle = "bg-slate-900 text-white border-slate-800 shadow-xl";
        let icon = <Info className="w-5 h-5 text-sky-400" />;

        if (toast.type === "success") {
          bgStyle = "bg-slate-900 border border-emerald-500/30 text-white shadow-emerald-950/20 shadow-lg";
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
        } else if (toast.type === "error") {
          bgStyle = "bg-slate-900 border border-red-500/30 text-white shadow-red-950/20 shadow-lg";
          icon = <AlertTriangle className="w-5 h-5 text-red-400" />;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start justify-between p-4 rounded-lg border pointer-events-auto transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${bgStyle}`}
            id={`portal-toast-${toast.id}`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5">{icon}</span>
              <p className="text-xs font-semibold tracking-wide leading-relaxed font-sans mt-0.5">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-0.5 focus:outline-none"
              title="Dismiss Toast Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
