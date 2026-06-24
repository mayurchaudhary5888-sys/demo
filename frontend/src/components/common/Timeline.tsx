/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckCircle, Clock } from "lucide-react";

interface TimelineEntry {
  status: string;
  timestamp: string;
  remarks?: string;
}

interface TimelineProps {
  entries: TimelineEntry[];
}

export const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  return (
    <div className="relative pl-6 space-y-5 border-l-2 border-slate-200" id="timeline-track">
      {entries.map((entry, idx) => (
        <div key={idx} className="relative">
          <span className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-[#0B2A5B] text-white flex items-center justify-center">
            {idx === 0 ? (
              <Clock className="w-3 h-3" />
            ) : (
              <CheckCircle className="w-3 h-3" />
            )}
          </span>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#0B2A5B]">{entry.status}</p>
            <p className="text-[10px] text-slate-400 font-mono">{entry.timestamp}</p>
            {entry.remarks && (
              <p className="text-[11px] text-slate-500 leading-relaxed">{entry.remarks}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
