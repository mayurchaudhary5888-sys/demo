/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Trophy, Briefcase, ExternalLink, HelpCircle } from "lucide-react";
import { InvestorProfile } from "../../types";
import { contentApi } from "../../services/contentApi";

export const InvestorNetwork: React.FC = () => {
  const [investors, setInvestors] = useState<InvestorProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const list = await contentApi.getInvestors();
        setInvestors(list as InvestorProfile[]);
      } catch (e) {
        setInvestors([]);
      } finally {
        setLoadingLocal(false);
      }
    };
    fetch();
  }, []);

  const categories: ("Partner Investor" | "VC Partner" | "Angel Investor" | "Funding Partner")[] = [
    "Partner Investor", "VC Partner", "Angel Investor", "Funding Partner"
  ];

  const filteredInvestors = investors.filter((inv) => {
    return inv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           inv.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
           inv.investmentFocus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="investor-network-container">
      
      {/* breadcrumbs */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li>
            <Link to="/" className="hover:text-[#0B2A5B]">Home</Link>
          </li>
          <li>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-[#0B2A5B] font-semibold">Angel & VC Partners</span>
          </li>
        </ol>
      </nav>

      {/* page heading */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#FF6B00] tracking-wider uppercase font-mono">Reference Directory</span>
        <h1 className="text-3xl font-black text-[#0B2A5B] tracking-tight">Ecosystem Funding Partners</h1>
        <p className="text-sm text-slate-500 max-w-xl text-justify">
          Public database compiling verified national investment institutions, venture firms, and angel networks aligned with Indian startup scale frameworks.
        </p>
      </div>

      {/* FILTER SEARCH BAR */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search investors, VC funds, or filter focus sector types (e.g. AgriTech, FinTech)..."
            className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg w-full text-xs font-semibold text-slate-700 outline-none focus:border-[#0B2A5B]"
            id="investor-search-input"
          />
        </div>
      </div>

      {/* SECTIONED ROW GROUPS */}
      {loadingLocal ? (
        <div className="space-y-3">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-slate-100 rounded-lg animate-pulse"></div>
            <div className="h-32 bg-slate-100 rounded-lg animate-pulse"></div>
            <div className="h-32 bg-slate-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((cat) => {
            const group = filteredInvestors.filter(inv => inv.type === cat);
            if (group.length === 0) return null;

            return (
              <section key={cat} className="space-y-4" id={`investor-group-${cat.toLowerCase().replace(/\s+/g, "-")}`}>
                
                {/* Sector group header */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Briefcase className="w-5 h-5 text-[#FF6B00]" />
                  <h3 className="text-md sm:text-lg font-bold text-[#0B2A5B] uppercase tracking-wide">
                    {cat} listings ({group.length})
                  </h3>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.map((inv) => (
                    <div 
                      key={inv.id} 
                      className="bg-white border border-slate-250 p-6 rounded-xl hover:shadow-md hover:border-slate-350 transition-all flex flex-col justify-between"
                      id={`investor-card-${inv.id}`}
                    >
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest">{inv.id.toUpperCase()}</span>
                        <h4 className="text-sm font-bold text-[#0B2A5B]">{inv.name}</h4>
                        <p className="text-xs text-slate-500 font-semibold">{inv.organization}</p>
                        
                        {/* focus tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {inv.investmentFocus.map((foc) => (
                            <span key={foc} className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-medium border border-slate-200">
                              {foc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* website visual redirects */}
                      <div className="border-t border-slate-100 mt-5 pt-4">
                        {inv.website || inv.linkedInUrl ? (
                          <a
                            href={inv.website || inv.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#FF6B00] hover:text-[#FF6B00]/90 inline-flex items-center gap-1 hover:underline"
                          >
                            <span>Explore Investment Portfolio</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono italic">Offline Node Synergy Only</span>
                        )}
                      </div>

                    </div>
                  ))}
                </div>

              </section>
            );
          })}
        </div>
      )}

      {/* INSTRUCTIONAL BANNER */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center max-w-xl mx-auto space-y-3">
        <HelpCircle className="w-8 h-8 text-amber-500 mx-auto" />
        <h4 className="text-sm font-bold text-[#0B2A5B]">Are You an Accredited Angel Fund?</h4>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
          Approved VC syndicates and institutional angel partners can join the national reference directory to evaluate state-sanctioned milestone projects. Submit your credentials to the DPIIT facilitation nodal desk.
        </p>
        <div className="pt-2">
          <Link
            to="/contact-us"
            className="bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-bold py-2 px-5 rounded-lg text-xs"
          >
            Contact Facilitation Desk
          </Link>
        </div>
      </div>

    </div>
  );
};
