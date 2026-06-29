import React, { useState, useRef } from "react";
import { 
  Building2, 
  Search, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

const rolesList = [
  "All",
  "Startup Founder",
  "Traditional Business Owner",
  "Individual Investor",
  "Mentor",
  "Enabler",
  "Explorer",
  "Student"
];

const fallbackStates = ["Delhi", "Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Punjab"];
const fallbackCities = ["Mumbai", "Bengaluru", "Ahmedabad", "Pune", "Chennai", "Hyderabad", "Noida", "Surat"];
const fallbackSectors = ["Healthcare", "Finance", "Agriculture", "Education", "Energy", "E-Commerce", "IT Services", "Other"];

export const StartupProfiles: React.FC = () => {
  // Presentational states for visual show-off
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const tabContainerRef = useRef<HTMLDivElement>(null);

  // Handle horizontal scrolling of tabs
  const scrollTabs = (direction: "left" | "right") => {
    if (tabContainerRef.current) {
      const scrollAmount = 200;
      tabContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setSelectedRole("All");
    setSelectedState("");
    setSelectedCity("");
    setSelectedSector("");
    setSearchInput("");
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-slate-50 pb-20" id="startup-profiles-static-page">
      {/* Banner */}
      <section className="bg-[#07184A] text-white py-12 text-center">
        <div className="mx-auto max-w-4xl px-5 space-y-3">
          <span className="text-xs font-black uppercase tracking-[0.26em] text-[#F9B233]">Ecosystem Directory</span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Startup Profiles
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-white/80">
            Explore registered startup profiles across the BHASKAR network.
          </p>
        </div>
      </section>

      {/* Main filter container & results */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Role tabs bar matching screenshot */}
        <div className="bg-[#1E293B] rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center gap-4 relative overflow-hidden">
          <div className="shrink-0 bg-[#FF6B00] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg shadow-sm">
            Who are you looking for?
          </div>

          <div className="flex items-center w-full min-w-0 relative">
            <button 
              type="button" 
              onClick={() => scrollTabs("left")}
              className="p-1.5 rounded-full bg-slate-700/80 hover:bg-slate-600 text-white shrink-0 mr-2 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div 
              ref={tabContainerRef}
              className="flex gap-2.5 overflow-x-auto scrollbar-none py-1 w-full scroll-smooth whitespace-nowrap"
            >
              {rolesList.map((role) => {
                const isActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "bg-[#F9B233] text-slate-900 shadow font-extrabold scale-102"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>

            <button 
              type="button" 
              onClick={() => scrollTabs("right")}
              className="p-1.5 rounded-full bg-slate-700/80 hover:bg-slate-600 text-white shrink-0 ml-2 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter options bar matching screenshot */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Filter by:</span>
              
              {/* State Dropdown */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#FF6B00] transition"
                >
                  <option value="">State</option>
                  {fallbackStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-3 h-2 w-2 border-b-2 border-r-2 border-slate-400 rotate-45" />
              </div>

              {/* District/City Dropdown */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#FF6B00] transition"
                >
                  <option value="">District</option>
                  {fallbackCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-3 h-2 w-2 border-b-2 border-r-2 border-slate-400 rotate-45" />
              </div>

              {/* Sector Dropdown */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#FF6B00] transition"
                >
                  <option value="">Sectors</option>
                  {fallbackSectors.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-3 h-2 w-2 border-b-2 border-r-2 border-slate-400 rotate-45" />
              </div>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-black uppercase tracking-wider text-slate-400 hover:text-[#FF6B00] transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Search Pill Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-6 max-w-3xl mx-auto">
            <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#FF6B00] focus-within:bg-white shadow-inner p-1.5 pl-6 rounded-full transition duration-200">
              <Search className="h-4.5 w-4.5 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Who are you looking for?"
                className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none pr-3 py-1 font-medium"
              />
              <button
                type="submit"
                className="bg-[#0B2A5B] hover:bg-[#FF6B00] text-white px-7 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-colors duration-200 shrink-0"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Dummy status result section */}
        <div className="mt-8 px-2 font-medium text-slate-800 text-sm">
          No records found
        </div>
      </main>
    </div>
  );
};

