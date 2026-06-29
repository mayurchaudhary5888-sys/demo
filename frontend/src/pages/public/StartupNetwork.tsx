/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Building2, TrendingUp, ShieldCheck, Mail, ArrowRight, X, ExternalLink } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { INDIAN_STATES, SECTORS } from "../../constants/options";
import { StartupStage, StartupProfile } from "../../types";

export const StartupNetwork: React.FC = () => {
  const { startups, showToast } = useAppState();
  const [searchParams] = useSearchParams();
  
  // States and filter values
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  
  // Selected Profile for detailed modal focus
  const [focusedProfile, setFocusedProfile] = useState<StartupProfile | null>(null);

  // Sync with search parameter from main navbar
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
      showToast(`Showing search results for "${q}"`, "info");
    }
  }, [searchParams]);

  const stages = ["All", StartupStage.IDEATION, StartupStage.VALIDATION, StartupStage.EARLY_TRACTION, StartupStage.SCALING];

  // filtrations
  const approvedStartups = startups.filter((s) => s.isApproved);

  const filteredStartups = approvedStartups.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = !selectedState || s.state === selectedState;
    const matchesSector = !selectedSector || s.sector === selectedSector;
    const matchesStage = selectedStage === "All" || s.stage === selectedStage;

    return matchesSearch && matchesState && matchesSector && matchesStage;
  });

  const handleOpenProfile = (profile: StartupProfile) => {
    setFocusedProfile(profile);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedSector("");
    setSelectedStage("All");
    showToast("Filters restored to default", "info");
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="startup-network-container">
      
      {/* heading */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#FF6B00] tracking-wider uppercase font-mono">Verified Ecosystem Directory</span>
        <h1 className="text-3xl font-black text-[#0B2A5B] tracking-tight">DPIIT Recognized Startups</h1>
        <p className="text-sm text-slate-500 max-w-2xl text-justify">
          Discover verified, innovatively driven ventures across Indian states. These enterprises have passed preliminary administrative screenings and are listed as active hubs.
        </p>
      </div>

      {/* GRAPHIC STATS BLOCK */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-3 rounded-lg border border-slate-150">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Approved listings</p>
          <p className="text-xl font-bold font-mono text-[#0B2A5B] mt-1">{approvedStartups.length} Companies</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-150">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Filtered results</p>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-1">{filteredStartups.length} Matches</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-slate-150 col-span-2">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">System security flag</p>
          <p className="text-xs text-slate-500 font-semibold mt-1">✓ Privacy Protected (Contact credentials require founder clearance)</p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Query search */}
          <div className="relative md:col-span-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, profiles, sectors..."
              className="pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg w-full text-xs font-semibold text-slate-700 outline-none focus:border-[#0B2A5B]"
              id="directory-search-input"
            />
          </div>

          {/* State select */}
          <div className="md:col-span-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border border-slate-300 rounded-lg w-full p-2.5 text-xs font-semibold text-slate-700 bg-white"
              id="state-filter-select"
            >
              <option value="">Select State / UT (All)</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* sector select */}
          <div className="md:col-span-3">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="border border-slate-300 rounded-lg w-full p-2.5 text-xs font-semibold text-slate-700 bg-white"
              id="sector-filter-select"
            >
              <option value="">Select Industry / Sector (All)</option>
              {SECTORS.map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </select>
          </div>

          {/* clear buttons */}
          <div className="md:col-span-2">
            <button
              onClick={clearFilters}
              className="text-center w-full px-4 py-2.5 border border-slate-200 text-xs font-extrabold text-[#0B2A5B] bg-slate-50 hover:bg-slate-100 rounded-lg transition-all"
            >
              Reset Filters
            </button>
          </div>

        </div>

        {/* Dynamic stage pills */}
        <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">Filter Capital Stage:</span>
          {stages.map((stg) => (
            <button
              key={stg}
              onClick={() => setSelectedStage(stg)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                selectedStage === stg
                  ? "bg-[#FF6B00] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              id={`stage-pill-${stg.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {stg}
            </button>
          ))}
        </div>
      </div>

      {/* PROFILE GRID DISPLAY */}
      {filteredStartups.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center" id="directory-empty-state">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-md font-bold text-[#0B2A5B]">No Registered Entities Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try refining your state selection or search criteria to match registered enterprises.</p>
          <button onClick={clearFilters} className="text-xs text-[#FF6B00] font-bold mt-4 hover:underline">
            Restore All Entities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="directory-profiles-grid">
          {filteredStartups.map((corp) => (
            <div 
              key={corp.id} 
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 hover:scale-[1.005] duration-150 hover:shadow-md shadow-sm"
              id={`startup-card-${corp.id}`}
            >
              <div className="space-y-4">
                
                {/* Upper row header */}
                <div className="flex gap-4 items-start">
                  {corp.logoUrl ? (
                    <img 
                      src={corp.logoUrl} 
                      alt={`${corp.name} Visual Logo`} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 shadow-sm shrink-0 border border-slate-150" 
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#0B2A5B]/5 text-[#0B2A5B] font-bold text-center flex items-center justify-center rounded-lg uppercase shrink-0 font-mono border border-indigo-150">
                      {corp.name.slice(0, 2)}
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <h3 className="text-md font-bold text-slate-900 line-clamp-1">{corp.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{corp.city}, {corp.state}</span>
                    </div>
                  </div>
                </div>

                {/* Badges strip */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="bg-[#0B2A5B]/10 text-[#0B2A5B] text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                    {corp.sector}
                  </span>
                  <span className="bg-amber-100 text-[#B45309] text-[10px] font-bold px-2 py-0.5 rounded-full font-sans">
                    {corp.stage}
                  </span>
                  {corp.isDpiitRecognized && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1 font-sans">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>DPIIT REG</span>
                    </span>
                  )}
                </div>

                {/* Brief description */}
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 text-justify">
                  {corp.description}
                </p>

              </div>

              {/* Read profiles anchor */}
              <div className="pt-6 border-t border-slate-100 mt-5 flex justify-between items-center text-xs">
                <span className="text-[10px] text-slate-400 font-bold font-mono">ID: {corp.id.toUpperCase()}</span>
                <button
                  onClick={() => handleOpenProfile(corp)}
                  className="px-3.5 py-2 border border-[#0B2A5B] text-[#0B2A5B] hover:bg-slate-50 text-[11px] font-bold rounded-lg flex items-center gap-1"
                  id={`view-profile-btn-${corp.id}`}
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* PUBLIC PROFILE DEEPLY POLISHED POP-UP MODAL (GUEST SAFE) */}
      {focusedProfile && (
        <div className="fixed inset-0 bg-slate-900/60 z-[999] backdrop-blur-xs flex justify-center items-center p-4 animate-in fade-in duration-150 animate-out fade-out" id="public-profile-modal">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xl max-w-xl w-full p-6 space-y-6 relative animate-in zoom-in-95 duration-200">
            
            {/* Modal dismissal button */}
            <button
              onClick={() => setFocusedProfile(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              title="Close modal"
              id="close-profile-modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* upper layout details */}
            <div className="flex gap-4 items-start pb-4 border-b border-slate-100">
              {focusedProfile.logoUrl ? (
                <img 
                  src={focusedProfile.logoUrl} 
                  alt={focusedProfile.name} 
                  className="w-14 h-14 rounded-xl object-cover bg-slate-50 border shrink-0" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 bg-indigo-50 text-[#0B2A5B] rounded-xl text-center flex justify-center items-center font-bold font-mono text-lg shrink-0">
                  {focusedProfile.name.slice(0, 2)}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[#0B2A5B]">{focusedProfile.name}</h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                    Approved
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-bold">{focusedProfile.city}, {focusedProfile.state} • Recognized Node</p>
              </div>
            </div>

            {/* Profile Grid metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-0.5">
                <span className="text-slate-400 font-bold uppercase text-[9px] font-mono">Primary Sector</span>
                <p className="font-bold text-[#0B2A5B]">{focusedProfile.sector}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-0.5">
                <span className="text-slate-400 font-bold uppercase text-[9px] font-mono">Incorporation Stage</span>
                <p className="font-bold text-[#0B2A5B]">{focusedProfile.stage}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-0.5">
                <span className="text-slate-400 font-bold uppercase text-[9px] font-mono">Startup Class</span>
                <p className="font-bold text-slate-700">{focusedProfile.startupType}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-0.5">
                <span className="text-slate-400 font-bold uppercase text-[9px] font-mono">DPIIT Recognition</span>
                <p className="font-bold text-emerald-700 font-mono">
                  {focusedProfile.isDpiitRecognized ? focusedProfile.dpiitNumber : "Not Filed"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 text-xs">
              <p className="font-bold text-[#0B2A5B]">Company Brief:</p>
              <p className="text-slate-600 leading-relaxed text-justify">{focusedProfile.description}</p>
            </div>

            {/* Strict instruction section 6.4: never founder contact info, documents or admin remarks */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-[11px] leading-relaxed text-blue-800 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold">Credential Privacy Shield Active</p>
                <p className="text-[#3b82f6-700] mt-0.5 text-justify">
                  To safeguard our national innovators, email credentials, phone rosters, pitch decks, and audit files are fully hidden. Sign in with a verified account to file partnership invitations.
                </p>
              </div>
            </div>

            {/* Links and Actions */}
            <div className="flex gap-3 justify-end pt-2">
              {focusedProfile.website && (
                <a
                  href={focusedProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-1"
                >
                  <span>Visit website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => {
                  setFocusedProfile(null);
                  showToast("Please register or log in to initiate mutual peer matches.", "info");
                }}
                className="bg-[#FF6B00] hover:bg-[#FF6B00]/95 text-white font-bold text-xs py-2.5 px-5 rounded-lg"
              >
                Connect with Founder
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
