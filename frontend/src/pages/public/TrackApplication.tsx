/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../../context/AppContext";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Timeline } from "../../components/common/Timeline";
import { Search, ShieldAlert, Award, FileText, ArrowRight } from "lucide-react";
import { contentApi } from "../../services/contentApi";

export const TrackApplication: React.FC = () => {
  const { applications } = useAppState();
  const [appId, setAppId] = useState("");
  const [searchedApp, setSearchedApp] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const queryId = appId.trim();
    if (!queryId) {
      setSearchedApp(null);
      return;
    }
    contentApi.getApplicationById(queryId)
      .then((found) => setSearchedApp(found || null))
      .catch(() => {
        const fallback = applications.find((a) => a.id.toLowerCase() === queryId.toLowerCase());
        setSearchedApp(fallback || null);
      });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8" id="track-application-container">
      {/* breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li>
            <Link to="/" className="hover:text-[#0B2A5B]">Home</Link>
          </li>
          <li>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-[#0B2A5B] font-semibold">Track Application</span>
          </li>
        </ol>
      </nav>

      {/* Heading */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl font-black text-[#0B2A5B] tracking-tight">Track Application Status</h1>
        <p className="text-xs text-slate-500 max-w-xl text-justify">
          Enter your unique application tracking ID below to check the real-time status, timeline milestones, and administrative feedback of your scheme filing.
        </p>
      </div>

      {/* Search Input bar */}
      <form onSubmit={handleSearch} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-3">
        <label htmlFor="app-id-input" className="block text-xs font-bold text-[#0B2A5B]">
          Enter Application ID *
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="app-id-input"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="e.g. APP-2026-05624"
              className="pl-10 pr-4 py-2.5 border border-slate-350 rounded-lg w-full text-xs font-mono font-semibold text-slate-800 outline-none focus:border-[#0B2A5B]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-extrabold text-xs px-6 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span>Query Registry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Result Card */}
      {hasSearched && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          {searchedApp ? (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    FOUND REGISTRY NODE
                  </span>
                  <h3 className="font-extrabold text-[#0B2A5B] font-mono text-sm">{searchedApp.id}</h3>
                </div>
                <StatusBadge status={searchedApp.status} />
              </div>

              <div className="p-6 space-y-6 text-xs text-slate-700">
                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">
                      Startup Enterprise Name
                    </span>
                    <p className="font-bold text-[#0B2A5B]">{searchedApp.startupName}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">
                      Scheme Program Applied
                    </span>
                    <p className="font-bold text-[#0B2A5B]">{searchedApp.programName}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">
                      Filing Date
                    </span>
                    <p className="font-semibold text-slate-650 font-mono">{searchedApp.submittedDate}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">
                      Last Updated Nodal Desk
                    </span>
                    <p className="font-semibold text-slate-650 font-mono">{searchedApp.lastUpdated}</p>
                  </div>
                </div>

                {/* Admin remarks */}
                {searchedApp.adminRemarks && (
                  <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-lg space-y-1">
                    <span className="font-bold text-amber-900 block">Nodal desk administrative remarks:</span>
                    <p className="text-slate-600 font-semibold leading-relaxed">{searchedApp.adminRemarks}</p>
                  </div>
                )}

                {/* Timeline */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <span className="font-black text-[#0B2A5B] uppercase block">
                    Verification Milestones Tracking
                  </span>
                  <Timeline entries={searchedApp.timeline} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3 shadow-xs">
              <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="text-sm font-bold text-[#0B2A5B]">No Application Record Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                The application ID "{appId}" could not be matched against our database records. Please double-check the characters and try again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
