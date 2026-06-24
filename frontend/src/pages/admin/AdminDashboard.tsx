/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Link } from "react-router-dom";
import { 
  Building2, FileText, CheckCircle2, AlertTriangle, Coins, Users, MapPin, Landmark
} from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { ApplicationStatus } from "../../types";

export const AdminDashboard: React.FC = () => {
  const { startups, applications, programs } = useAppState();

  const totalStartupsCount = startups.length;
  const approvedStartupsCount = startups.filter((s) => s.isApproved).length;
  const pendingStartupsCount = totalStartupsCount - approvedStartupsCount;

  const totalApplications = applications.length;
  const approvedApps = applications.filter((a) => a.status === ApplicationStatus.APPROVED).length;
  const pendingApps = applications.filter(
    (a) => a.status === ApplicationStatus.SUBMITTED || a.status === ApplicationStatus.UNDER_REVIEW
  ).length;

  return (
    <div className="space-y-10" id="admin-dashboard-container">
      
      {/* 1. SEED SCHEME WIDGET CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="admin-widgets-row">
        
        {/* total startups */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between hover:shadow transition-all">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">DPIIT REGISTER ROW</span>
            <p className="text-2xl font-black font-mono text-[#0B2A5B] leading-none">{totalStartupsCount} Entities</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Pending approval: {pendingStartupsCount}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* total proposals */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between hover:shadow transition-all">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">PROPOSAL APPLICATIONS</span>
            <p className="text-2xl font-black font-mono text-emerald-600 leading-none">{totalApplications} Cases</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Pending boards: {pendingApps}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* budgests */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between hover:shadow transition-all">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">BUDGET SANCTIONS</span>
            <p className="text-2xl font-black font-mono text-indigo-600 leading-none">₹945 Cr</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">SISFS Outlay Pool allocation</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* programs */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between hover:shadow transition-all">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">ACTIVE COHORTS</span>
            <p className="text-2xl font-black font-mono text-amber-500 leading-none">{programs.length} Programs</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Sovereign active cohorts</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

      </section>

      {/* 2. BENTO ACCENT SEED SUMMARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Review logs dashboard info */}
        <div className="md:col-span-8 bg-white border border-slate-200 p-6 rounded-xl space-y-4">
          <h4 className="text-xs font-mono font-bold text-[#0B2A5B] uppercase tracking-wide border-b border-slate-100 pb-2">
            Nodal Auditing Guidelines (DPIIT)
          </h4>
          
          <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-650 text-justify">
            <p>
              Under sections of the <strong>Startup India Seed Fund Scheme</strong> guidelines, the vetting authority bears responsibility to confirm:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[11px] font-semibold text-slate-600 font-sans">
              <li>Startup incorporates less than 2 years at moment of central registration submission.</li>
              <li>Sovereign Indian promoters hold at least 51% of aggregate equity shares inside LLP/Private formats.</li>
              <li>Applicants do not overlap central funding channels beyond specified maximums.</li>
            </ul>
            <div className="bg-slate-50 border border-slate-155 p-3.5 rounded-lg flex items-start gap-2 text-[11px] font-sans">
              <AlertTriangle className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
              <p className="text-[#3b82f6-700] italic">
                *Audit logs are persistently documented. Confirm all compliance criteria before issuing approvals or requested documents alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Quick side panel steps */}
        <aside className="md:col-span-4 bg-slate-900 text-white rounded-xl p-5 space-y-4 shadow">
          <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest border-b border-slate-800 pb-2">
            Rapid review lanes
          </h4>
          <div className="space-y-3.5 text-xs">
            <Link 
              to="/admin/startups" 
              className="block p-3.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all hover:translate-x-0.5"
            >
              <h5 className="font-bold text-xs">Vet Startup Licenses</h5>
              <p className="text-[10px] text-slate-500 mt-1">Pending: {pendingStartupsCount} entries requiring review.</p>
            </Link>
            
            <Link 
              to="/admin/applications" 
              className="block p-3.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all hover:translate-x-0.5"
            >
              <h5 className="font-bold text-xs">Verify Scheme applications</h5>
              <p className="text-[10px] text-slate-500 mt-1">Pending reviews: {pendingApps} cases total.</p>
            </Link>
          </div>
        </aside>

      </div>

    </div>
  );
};
