/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, MapPin, ShieldCheck, Mail, MessageSquare, Clock, PlusCircle } from "lucide-react";
import { useAppState } from "../../context/AppContext";

export const MyConnections: React.FC = () => {
  const { user, connections, startups } = useAppState();
  const [activeTab, setActiveTab] = useState<"All" | "Initiated" | "Approved">("All");

  const startupConnections = connections.filter((c) => c.startupId === user?.startupId);
  const userStartup = startups.find((s) => s.id === user?.startupId);

  const filtered = startupConnections.filter((c) => {
    if (activeTab === "All") return true;
    return c.status === activeTab;
  });

  return (
    <div className="space-y-6" id="connections-roster-container">
      
      {/* 1. Header split */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-3">
        <div className="space-y-1">
          <h3 className="text-md font-bold text-[#0B2A5B]">Incubator Connection Ledger</h3>
          <p className="text-[11px] text-slate-500">Track mutual communication channels initiated with certified accelerators.</p>
        </div>

        {/* Tab selection */}
        <div className="flex bg-slate-150 p-1 rounded-lg self-start text-xs font-sans">
          {["All", "Initiated", "Approved"].map((st) => (
            <button
              key={st}
              onClick={() => setActiveTab(st as any)}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                activeTab === st
                  ? "bg-[#0B2A5B] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              id={`connection-tab-${st.toLowerCase()}`}
            >
              {st} ({st === "All" ? startupConnections.length : startupConnections.filter(c => c.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* 2. List or cards display */}
      {filtered.length === 0 ? (
        <div className="bg-slate-50 p-12 text-center rounded-xl border border-dashed border-slate-300">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-[#0B2A5B]">No Correspondence Records Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Click the outreach pitch buttons in the main dashboard panel to start conversation logs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="connections-cards-grid">
          {filtered.map((cn) => (
            <div key={cn.id} className="bg-white border-2 border-slate-205 p-5 rounded-xl shadow-xs space-y-4 hover:border-slate-300 transition-colors">
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest">{cn.id.toUpperCase()}</span>
                  <h4 className="text-sm font-black text-[#0B2A5B]">{cn.incubatorName}</h4>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                  cn.status === "Approved" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {cn.status}
                </span>
              </div>

              {/* cover pitch brief */}
              <div className="bg-slate-50 p-3 rounded border border-slate-150 space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">Outreach Cover Brief:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed text-justify italic">{cn.message}</p>
              </div>

              {/* metadata footer details */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-305" />
                  <span>Submitted Today</span>
                </div>
                <span className="font-bold text-[#0B2A5B]">Type: ISMC Pitch</span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
