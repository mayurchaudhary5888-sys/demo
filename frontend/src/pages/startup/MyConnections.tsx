/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Clock3, Sparkles, Users, MessageSquare, Rocket, Mail, ArrowRight, Check } from "lucide-react";

export const MyConnections: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail("");
    }
  };

  return (
    <div
      className="relative left-1/2 right-1/2 -mx-[50vw] min-h-[calc(100vh-7rem)] w-screen overflow-hidden bg-slate-50/50"
      id="connections-coming-soon"
    >
      {/* Decorative Glowing Orbs */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#0B2A5B]/10 to-transparent blur-3xl animate-pulse duration-10000" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#F05A28]/10 to-transparent blur-3xl animate-pulse duration-7000" />

      <div className="relative flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_32px_96px_-16px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-12 md:p-16">
          
          {/* Badge */}
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-[#F05A28]/20 bg-[#FFF7F1] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.24em] text-[#F05A28]">
            <Sparkles className="h-4 w-4 text-[#F05A28] animate-spin-slow" />
            <span>Connections Portal</span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-2xl text-4xl font-black tracking-tight text-[#0B2A5B] sm:text-5xl md:text-6xl leading-[1.1]">
            Startup Connections <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#F05A28] to-[#FF8C39] bg-clip-text text-transparent">
              will open soon
            </span>
          </h1>

          {/* Paragraph */}
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-500 sm:text-base md:text-lg">
            Unlock direct networking channels. Connect with verified co-founders, access curated investors, and form collaborations with DPIIT-recognized enterprises across Bharat. We are polishing the secure messaging pipes.
          </p>

          {/* Notification Form */}
          <div className="mx-auto mt-10 max-w-md">
            {subscribed ? (
              <div className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 animate-fadeIn">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Successfully Subscribed!</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">We'll alert you the moment the networking portal goes live.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center p-1 rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-[#F05A28] focus-within:ring-2 focus-within:ring-[#F05A28]/10 transition-all duration-200">
                <div className="flex items-center pl-3 text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your work email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#0B2A5B] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#F05A28] active:scale-[0.98] transition-all duration-300 shrink-0 shadow-sm"
                >
                  <span>Notify Me</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Features Preview Grid */}
          <div className="mt-16 border-t border-slate-100 pt-16">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0B2A5B]/65">What is in the works</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              
              <div className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-left hover:border-[#F05A28]/20 hover:bg-white hover:shadow-[0_12px_24px_-8px_rgba(15,23,42,0.04)] transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B2A5B]/5 text-[#0B2A5B] group-hover:bg-[#0B2A5B] group-hover:text-white transition-all duration-300">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-black text-[#0B2A5B]">Verified Network</h3>
                <p className="mt-2 text-xs leading-5 text-slate-450 font-medium">
                  Connect instantly with DPIIT-registered startups, co-founders, and specialists filtered by sector.
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-left hover:border-[#F05A28]/20 hover:bg-white hover:shadow-[0_12px_24px_-8px_rgba(15,23,42,0.04)] transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B2A5B]/5 text-[#0B2A5B] group-hover:bg-[#0B2A5B] group-hover:text-white transition-all duration-300">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-black text-[#0B2A5B]">Direct Messaging</h3>
                <p className="mt-2 text-xs leading-5 text-slate-450 font-medium">
                  Pitch directly to investors and incubation managers using a secure messaging suite.
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-left hover:border-[#F05A28]/20 hover:bg-white hover:shadow-[0_12px_24px_-8px_rgba(15,23,42,0.04)] transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B2A5B]/5 text-[#0B2A5B] group-hover:bg-[#0B2A5B] group-hover:text-white transition-all duration-300">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-black text-[#0B2A5B]">Virtual Showrooms</h3>
                <p className="mt-2 text-xs leading-5 text-slate-450 font-medium">
                  Publish pitch decks, demo clips, and operational metrics to an exclusive marketplace view.
                </p>
              </div>

            </div>
          </div>

          {/* Time Badge Footer */}
          <div className="mt-12 inline-flex items-center gap-2 rounded-full bg-slate-100/80 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Clock3 className="h-3.5 w-3.5 text-[#F05A28] animate-pulse" />
            <span>Targeting Launch Q3 2026</span>
          </div>

        </div>
      </div>
    </div>
  );
};
