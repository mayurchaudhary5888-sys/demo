/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Award, TrendingUp, Cpu, Workflow, BookOpen, Globe, ArrowRight, CheckCircle, ShieldCheck
} from "lucide-react";
import { useAppState } from "../../context/AppContext";

export const ProgramsListing: React.FC = () => {
  const { programs, showToast, user } = useAppState();
  const navigate = useNavigate();

  // Helper to map icon name to Lucide Icon dynamically
  const getIcon = (name: string) => {
    switch (name) {
      case "Award": return <Award className="w-8 h-8 text-[#FF6B00]" />;
      case "TrendingUp": return <TrendingUp className="w-8 h-8 text-indigo-500" />;
      case "Workflow": return <Workflow className="w-8 h-8 text-emerald-500" />;
      case "BookOpen": return <BookOpen className="w-8 h-8 text-cyan-500" />;
      case "Cpu": return <Cpu className="w-8 h-8 text-amber-500" />;
      case "Globe": return <Globe className="w-8 h-8 text-blue-500" />;
      default: return <Award className="w-8 h-8 text-slate-500" />;
    }
  };

  const handleApplyClick = (progId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      showToast("Verification Required. Directing you to Register / Sign In.", "info");
      navigate("/register");
      return;
    }

    // Is onboarded, direct apply
    navigate(`/programs/${progId}`);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="programs-listing-container">
      
      {/* breadcrumbs */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li>
            <Link to="/" className="hover:text-[#0B2A5B]">Home</Link>
          </li>
          <li>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-[#0B2A5B] font-semibold">Initiatives & Programs</span>
          </li>
        </ol>
      </nav>

      {/* heading block */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#FF6B00] tracking-wider uppercase font-mono">Ministry Outlays</span>
        <h1 className="text-3xl font-black text-[#0B2A5B] tracking-tight">Ecosystem Growth Initiatives</h1>
        <p className="text-sm text-slate-500 max-w-xl text-justify">
          Browse active central funding and mentoring schemes. Filter your eligibility profiles to trigger physical allocations and incubator committee reviews.
        </p>
      </div>

      {/* DETAILED CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="programs-listing-grid">
        {programs.map((prog) => {
          const isSisfs = prog.id === "sisfs-seed-fund";
          return (
            <div 
              key={prog.id} 
              className={`bg-white rounded-xl border flex flex-col justify-between hover:shadow-md transition-all h-full overflow-hidden ${
                isSisfs 
                  ? "border-amber-400 ring-2 ring-amber-400/20" 
                  : "border-slate-250"
              }`}
              id={`program-card-${prog.id}`}
            >
              {/* Highlight ribbon for SISFS */}
              {isSisfs && (
                <div className="bg-[#FF6B00] text-white text-[10px] font-black text-center py-1 uppercase tracking-widest font-mono">
                  ★ Flagship Sovereign Funding Outlay
                </div>
              )}

              <div className="p-6 space-y-4">
                
                {/* Upper line icons */}
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-slate-50 rounded-xl shrink-0">
                    {getIcon(prog.iconName)}
                  </div>
                  <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full font-mono ${
                    prog.isOpen 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {prog.isOpen ? "Filing Open" : "Cohort Closed"}
                  </span>
                </div>

                {/* headings info */}
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#0B2A5B] hover:text-[#FF6B00] transition-colors leading-snug">
                    <Link to={`/programs/${prog.id}`}>{prog.name}</Link>
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 text-justify">
                    {prog.shortDescription}
                  </p>
                </div>

                {/* Single line checklist summary */}
                <div className="bg-slate-50 p-3 rounded border border-slate-150 text-[11px] text-slate-600 font-medium">
                  <p className="font-bold text-[#0B2A5B] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Eligibility Focus:</span>
                  </p>
                  <p className="truncate mt-0.5 font-sans">• {prog.eligibility[0] || "Open to all DPIIT recognitions"}</p>
                </div>

              </div>

              {/* Bottom operational buttons split */}
              <div className="border-t border-slate-100 bg-slate-50/50 p-4 grid grid-cols-2 gap-2 text-center text-xs">
                <Link
                  to={`/programs/${prog.id}`}
                  className="py-2.5 px-3 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors"
                  id={`view-details-${prog.id}`}
                >
                  View Details
                </Link>
                {prog.isOpen ? (
                  <button
                    onClick={(e) => handleApplyClick(prog.id, e)}
                    className="py-2.5 px-3 bg-[#FF6B00] hover:bg-[#FF6B00]/95 text-white font-bold rounded-lg shadow-sm transition-all text-xs"
                    id={`apply-now-${prog.id}`}
                  >
                    Apply Now
                  </button>
                ) : (
                  <span className="py-2.5 px-2 bg-slate-100 border border-slate-200 text-slate-400 font-bold rounded-lg select-none cursor-not-allowed text-xs">
                    Apply Closed
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ADDITIONAL GUIDANCE ALERT */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl flex items-start gap-4 max-w-3xl mx-auto text-xs leading-relaxed">
        <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#0B2A5B]">DPIIT Verification Requirements Checklist:</p>
          <p className="text-[#3b82f6-700] text-justify font-sans">
            Your startup must complete the pre-registration profiling block before generating application forms. Make sure you possess certified scan sheets for Udyam micro registries or DPIIT recognition numbers; these directories cascaded dynamically into specific scheme requirements.
          </p>
        </div>
      </div>

    </div>
  );
};
