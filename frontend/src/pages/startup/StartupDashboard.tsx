/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../../context/AppContext";
import { LayoutDashboard, FileText, Building2, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export const StartupDashboard: React.FC = () => {
  const { user, startups, applications } = useAppState();

  const myStartup = startups.find((s) => s.id === user?.startupId);
  const myApps = applications.filter((a) => a.startupId === user?.startupId);

  return (
    <div className="space-y-8" id="startup-dashboard-container">
      {/* Welcome */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-xl font-black text-[#0B2A5B]">Welcome, {user?.name || "Founder"}</h2>
        <p className="text-xs text-slate-500 mt-1">Your startup dashboard overview and activity summary.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg"><Building2 className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Profile Status</p>
              <p className="text-sm font-black text-[#0B2A5B]">
                {myStartup?.isApproved ? "Approved" : "Pending Review"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg"><FileText className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Applications</p>
              <p className="text-sm font-black text-emerald-600">{myApps.length} Filed</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg"><Clock className="w-5 h-5 text-amber-600" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Sector</p>
              <p className="text-sm font-black text-slate-700">{myStartup?.sector || "Not Set"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-md font-bold text-[#0B2A5B] border-b border-slate-100 pb-2">My Applications</h3>
        {myApps.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            <p className="mb-2">No applications filed yet.</p>
            <Link to="/programs" className="text-[#FF6B00] font-bold hover:underline">Browse Programs →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myApps.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-lg text-xs">
                <div>
                  <p className="font-bold text-[#0B2A5B]">{app.programName}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {app.id} • Filed: {app.submittedDate}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  app.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  app.status === "Rejected" ? "bg-red-50 text-red-700 border border-red-200" :
                  "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
