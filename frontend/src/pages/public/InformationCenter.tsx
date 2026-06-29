/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, CheckCircle, ChevronDown, ChevronUp, ExternalLink, HelpCircle, Search } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { contentApi } from "../../services/contentApi";

type AnnouncementCard = {
  id: string;
  title: string;
  category: string;
  description: string;
};

export const InformationCenter: React.FC = () => {
  const { showToast } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<Array<{ q: string; a: string }>>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementCard[]>([]);
  const [featuredProgram, setFeaturedProgram] = useState<Record<string, unknown> | null>(null);

  React.useEffect(() => {
    contentApi.getFaqs().then((items) => setFaqs(items as Array<{ q: string; a: string }>)).catch(() => setFaqs([]));
    contentApi.getAnnouncements().then((items) => {
      setAnnouncements(
        (items as Array<Record<string, unknown>>).map((item, index) => ({
          id: String(item.id || `announcement-${index}`),
          title: String(item.title || "Announcement"),
          category: String(item.category || "General"),
          description: String(item.description || ""),
        }))
      );
    }).catch(() => setAnnouncements([]));
    contentApi.getProgramById("sisfs-seed-fund").then((item) => setFeaturedProgram(item as Record<string, unknown>)).catch(() => setFeaturedProgram(null));
  }, []);

  const categories = useMemo(() => {
    const values = new Set(["All"]);
    announcements.forEach((item) => values.add(item.category));
    return Array.from(values);
  }, [announcements]);

  const filteredArticles = useMemo(() => {
    return announcements.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [announcements, searchQuery, selectedCategory]);

  const toggleFaq = (idx: number) => setExpandedFaq(expandedFaq === idx ? null : idx);

  const handleReadMore = (title: string) => {
    showToast(`Opened backend content for ${title}.`, "info");
  };

  const featuredBenefits = Array.isArray(featuredProgram?.benefits) ? (featuredProgram.benefits as string[]) : [];
  const featuredEligibility = Array.isArray(featuredProgram?.eligibility) ? (featuredProgram.eligibility as string[]) : [];

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="info-center-container">
      
      <div className="space-y-4">
        <span className="text-xs font-bold text-[#FF6B00] tracking-wider uppercase font-mono">Facilitated Knowledge Hub</span>
        <h1 className="text-3xl font-black text-[#0B2A5B]">Information & Schemes Center</h1>
        <p className="text-sm text-slate-500 max-w-2xl text-justify">
          Backend-fed support updates, scheme notes, and FAQ records for founders and admins.
        </p>
      </div>

      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="pl-10 pr-4 py-3 border border-slate-300 rounded-lg w-full text-xs font-semibold text-slate-700 focus:border-[#0B2A5B] outline-none"
              id="info-search-input"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#0B2A5B] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
                id={`cat-filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#FFFDF3] border border-amber-300/60 rounded-2xl p-6 lg:p-8 space-y-6" id="sisfs-deep-dive">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-xl shrink-0 shadow">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] bg-amber-200 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full font-mono uppercase">
                Core Spotlight Support
              </span>
              <h2 className="text-xl font-bold text-[#0B2A5B] mt-0.5">
                {String(featuredProgram?.name || "Featured Support")}
              </h2>
            </div>
          </div>
          <Link
            to="/support/startup-program"
            className="bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white font-extrabold text-xs px-5 py-2.5 rounded-lg uppercase tracking-wider"
          >
            View Support
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs font-sans">
          <div className="lg:col-span-8 space-y-4">
            <div>
              <h4 className="font-extrabold text-[#0B2A5B] text-sm mb-1">Support Overview</h4>
              <p className="text-slate-600 leading-relaxed text-justify">
                {String(featuredProgram?.longDescription || featuredProgram?.shortDescription || "No featured support loaded yet.")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredBenefits.slice(0, 2).map((benefit, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-150 space-y-1">
                  <p className="font-bold text-[#FF6B00]">Benefit {idx + 1}</p>
                  <p className="text-slate-500 text-[11px] leading-normal">{benefit}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-extrabold text-[#0B2A5B] text-sm mb-1.5">Eligibility Snapshot</h4>
              <p className="text-slate-600 leading-relaxed text-justify">
                {featuredEligibility.join(" ")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-amber-200/80 p-5 rounded-xl space-y-4">
            <p className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Latest Announcements</p>
            <div className="space-y-3 font-medium">
              {announcements.slice(0, 4).map((item, idx) => (
                <div key={item.id || idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0B2A5B] text-[11px]">{item.title}</p>
                    <p className="text-slate-500 text-[11px] leading-dense">{item.description}</p>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <div className="text-xs text-slate-400">No announcements found.</div>}
            </div>
            <div className="p-3 bg-slate-50 border border-slate-150 rounded text-[10px] text-slate-400 italic">
              Content is pulled from backend records and updates with admin changes.
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#0B2A5B] border-b border-slate-200 pb-2">Ecosystem Articles & Guides</h3>
        {filteredArticles.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 rounded" id="info-no-results">
            <p className="text-xs text-slate-500 font-bold">No resource documents match your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="info-articles-grid">
            {filteredArticles.map((art) => (
              <div key={art.id} className="bg-white border border-slate-250 p-6 rounded-xl flex flex-col justify-between hover:shadow-md hover:border-slate-350 transition-all shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold font-mono text-[#0B2A5B] bg-[#0B2A5B]/10 px-2.5 py-0.5 rounded uppercase">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">{art.id.toUpperCase()}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{art.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{art.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-medium">
                      #{art.category}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-5 pt-4">
                  <button
                    onClick={() => handleReadMore(art.title)}
                    className="text-xs font-bold text-[#FF6B00] hover:text-[#FF6B00]/90 inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Read Guidebook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-xl space-y-6" id="faq-accordions">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-[#0B2A5B]">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-xs font-bold text-[#0B2A5B] hover:bg-slate-50 text-left transition-colors"
                  id={`faq-btn-${idx}`}
                >
                  <span className="max-w-[90%] leading-relaxed">{faq.q}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="p-4 pt-1 bg-slate-50/50 text-slate-600 border-t border-slate-100 text-xs leading-relaxed text-justify animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
          {faqs.length === 0 && <div className="text-xs text-slate-400">No FAQ records available yet.</div>}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8" id="useful-links-hub">
        <h3 className="text-lg font-bold text-[#0B2A5B] mb-4">Official Links & Resource Referrals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {[
            { label: "Startup India Portal Registry Link", desc: "Central startupindia.gov.in portal details.", url: "https://www.startupindia.gov.in" },
            { label: "National Guidelines for Grant Filing", desc: "Official PDF documents on the sisfs outlay.", url: "https://seedfund.startupindia.gov.in" },
            { label: "IP Patent Rebates Policy Guidelines", desc: "Complete regulations on the fast-track highway.", url: "https://www.ipindia.gov.in" }
          ].map((lnk, idx) => (
            <a
              key={idx}
              href={lnk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-slate-200 p-4 rounded-lg hover:border-[#FF6B00] transition-colors flex items-start justify-between shadow-sm"
            >
              <div>
                <p className="font-bold text-slate-800 hover:text-[#0B2A5B] hover:underline flex items-center gap-1">
                  <span>{lnk.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 inline" />
                </p>
                <p className="text-slate-500 text-[10px] sm:text-[11px] mt-1">{lnk.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
