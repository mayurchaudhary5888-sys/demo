import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Briefcase,
  Shield,
  Bell,
  ArrowRight,
  Sparkles,
  Globe,
  BadgeCheck,
  Rocket,
  ChevronRight,
} from "lucide-react";

const LAUNCH_DATE = new Date("2026-08-15T00:00:00+05:30");

const useCountdown = (target: Date) => {
  const calc = () => {
    const now = Date.now();
    const diff = Math.max(0, target.getTime() - now);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

const features = [
  {
    icon: TrendingUp,
    title: "Smart Deal Flow",
    description:
      "AI-curated startup recommendations based on your investment thesis, sector preferences, and ticket size.",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description:
      "SEBI-compliant due diligence records and DPIIT verified credentials for every listed investor entity.",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Users,
    title: "Co-Investment Network",
    description:
      "Syndicate deal rooms connecting angel investors, VC partners, and institutional LPs for collaborative rounds.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Globe,
    title: "Cross-Border Access",
    description:
      "Gateway to international investor networks across Singapore, UAE, UK, and US for Indian startups seeking global capital.",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const stats = [
  { value: "250+", label: "Angel Investors" },
  { value: "80+", label: "VC Firms" },
  { value: "₹500Cr+", label: "Capital Deployed" },
  { value: "15+", label: "Sectors Covered" },
];

export const InvestorProfiles: React.FC = () => {
  const countdown = useCountdown(LAUNCH_DATE);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" id="investor-profiles-page">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B00]/10 to-amber-50 border border-[#FF6B00]/20 rounded-full px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">
              Coming Soon
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0B2A5B] leading-[1.1]">
            Investor Profiles
            <span className="block mt-2 bg-gradient-to-r from-[#FF6B00] to-amber-500 bg-clip-text text-transparent">
              Directory
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            India's most comprehensive verified directory of angel investors, venture capital firms,
            and institutional funding partners — purpose-built for the BHASKAR startup ecosystem.
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-3 sm:gap-5 pt-4">
            {[
              { value: countdown.days, label: "Days" },
              { value: countdown.hours, label: "Hours" },
              { value: countdown.minutes, label: "Minutes" },
              { value: countdown.seconds, label: "Seconds" },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-[#0B2A5B] tabular-nums">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
            >
              <p className="text-2xl md:text-3xl font-black text-[#0B2A5B]">{stat.value}</p>
              <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <span className="text-[11px] font-black text-[#FF6B00] uppercase tracking-[0.2em]">
            Platform Capabilities
          </span>
          <h2 className="mt-2 text-2xl md:text-3xl font-black text-[#0B2A5B] tracking-tight">
            What's Coming
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="group bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-xl ${feat.bgColor} flex items-center justify-center shrink-0`}>
                  <feat.icon className={`h-6 w-6 ${feat.iconColor}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-black text-[#0B2A5B]">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notify CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-[#0B2A5B] to-[#163d7a] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />

          <div className="relative z-10 max-w-lg mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
              <Bell className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">
                Get Early Access
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Be the First to Know
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Join our early access list to get notified when Investor Profiles goes live.
              Priority access for registered BHASKAR members.
            </p>

            {subscribed ? (
              <div className="flex items-center justify-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl py-3 px-6">
                <BadgeCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">
                  You're on the list! We'll notify you at launch.
                </span>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white placeholder-white/40 outline-none focus:border-[#FF6B00] focus:bg-white/15 transition-all"
                  id="investor-notify-email"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#FF6B00] hover:bg-[#E65F00] px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all flex items-center gap-2"
                >
                  Notify Me
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/network/startup-profiles"
            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#FF6B00]/30 transition-all flex items-center gap-4"
          >
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <Rocket className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-black text-[#0B2A5B]">Startup Profiles</p>
              <p className="text-xs text-slate-500 mt-0.5">Browse registered founders</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-[#FF6B00] transition-colors" />
          </Link>

          <Link
            to="/startup_portfolio"
            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#FF6B00]/30 transition-all flex items-center gap-4"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
              <Briefcase className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-black text-[#0B2A5B]">Startup Portfolio</p>
              <p className="text-xs text-slate-500 mt-0.5">Explore funded ventures</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-[#FF6B00] transition-colors" />
          </Link>

          <Link
            to="/contact-us"
            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#FF6B00]/30 transition-all flex items-center gap-4"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
              <BadgeCheck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-black text-[#0B2A5B]">Register as Investor</p>
              <p className="text-xs text-slate-500 mt-0.5">Join the directory</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-[#FF6B00] transition-colors" />
          </Link>
        </div>
      </section>
    </div>
  );
};
