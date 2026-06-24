/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Link } from "react-router-dom";
import { Lightbulb, ArrowRight } from "lucide-react";

export const IdeaValidationProgram: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="idea-validation-program-page">
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li>
            <Link to="/" className="hover:text-[#0B2A5B]">Home</Link>
          </li>
          <li>
            <span className="text-slate-300 mx-1">/</span>
            <Link to="/programs" className="hover:text-[#0B2A5B]">Programs</Link>
          </li>
          <li>
            <span className="text-slate-300 mx-1">/</span>
            <span className="text-[#0B2A5B] font-semibold">Idea Validation Program</span>
          </li>
        </ol>
      </nav>

      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Lightbulb className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#FF6B00] tracking-wider uppercase font-mono">Programs</span>
          <h1 className="text-3xl font-black text-[#0B2A5B] tracking-tight">Idea Validation Program</h1>
          <p className="text-sm text-slate-500 max-w-2xl text-justify">
            Content for the Idea Validation Program page will be added here.
          </p>
        </div>
        <Link
          to="/track-application"
          className="inline-flex items-center gap-2 rounded-lg bg-[#0B2A5B] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#0B2A5B]/90"
        >
          Track Application
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
};
