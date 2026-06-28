import React from "react";
import { Link } from "react-router-dom";
import { Building2, Edit3, FileDigit, Sparkles } from "lucide-react";
import { StartupProfile } from "../../../types";
import { StartupProfileFieldGroup } from "./StartupProfileFieldGroup";

type StartupProfileSummaryCardProps = {
  profile: StartupProfile;
};

const formatList = (items?: string[]) => {
  if (!items?.length) return "Not provided";
  return items.join(", ");
};

const primaryFields = (profile: StartupProfile) => [
  { label: "Entity Name", value: profile.legalName || profile.startupName || profile.name },
  { label: "Startup Name", value: profile.startupName || profile.name },
  { label: "Registration Number", value: profile.registrationNumber || profile.id },
  { label: "Stage", value: profile.stage },
  { label: "Funding Status", value: profile.fundingStatus || profile.fundingType },
  { label: "Profile Status", value: profile.isApproved ? "Approved" : "Pending review" },
];

const secondaryFields = (profile: StartupProfile) => [
  { label: "Industry", value: profile.industry || "Not provided" },
  { label: "Sector", value: profile.sector || "Not provided" },
  { label: "Company Nature", value: profile.nature || profile.startupType || "Not provided" },
  { label: "State", value: profile.state || "Not provided" },
  { label: "City", value: profile.city || "Not provided" },
  { label: "Registration Date", value: profile.registrationDate || "Not provided" },
];

const contactFields = (profile: StartupProfile) => [
  { label: "Email", value: profile.email || "Not provided" },
  { label: "Mobile", value: profile.mobile || "Not provided" },
  {
    label: "Website",
    value: profile.website ? (
      <a href={profile.website} className="text-[#0B63B6] hover:underline" target="_blank" rel="noreferrer">
        {profile.website}
      </a>
    ) : (
      "Not provided"
    ),
  },
  {
    label: "App Link",
    value: profile.appLink ? (
      <a href={profile.appLink} className="text-[#0B63B6] hover:underline" target="_blank" rel="noreferrer">
        {profile.appLink}
      </a>
    ) : (
      "Not provided"
    ),
  },
];

export const StartupProfileSummaryCard: React.FC<StartupProfileSummaryCardProps> = ({ profile }) => {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#D9DCF4] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(248,249,255,0.96)_38%,_rgba(231,236,255,0.88)_100%)] shadow-[0_24px_60px_rgba(73,84,153,0.16)]">
      <div className="grid gap-0 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="border-b border-[#E4E8FB] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,246,255,0.96))] p-8 xl:border-b-0 xl:border-r">
          <div className="mx-auto flex max-w-[220px] flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-[0_20px_45px_rgba(72,82,150,0.16)]">
              {profile.logoPreview || profile.logoUrl ? (
                <img
                  src={profile.logoPreview || profile.logoUrl}
                  alt={`${profile.startupName || profile.name} logo`}
                  className="h-full w-full object-contain p-5"
                />
              ) : (
                <Building2 className="h-10 w-10 text-[#394B98]" />
              )}
            </div>

            <h2 className="mt-5 text-lg font-black uppercase tracking-tight text-[#1A275B]">
              {profile.legalName || profile.startupName || profile.name}
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
              {profile.startupBrief || profile.description}
            </p>

            <div className="mt-5 flex w-full flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF2FF] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#394B98]">
                <Sparkles className="h-3.5 w-3.5" />
                {profile.stage}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF2E8] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#DF6B15]">
                <FileDigit className="h-3.5 w-3.5" />
                {profile.fundingStatus || profile.fundingType}
              </span>
            </div>

            <Link
              to="/startup/settings"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#2B2F86] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_16px_30px_rgba(43,47,134,0.25)] transition hover:bg-[#21256A]"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-8 xl:grid-cols-2">
            <div className="rounded-2xl border border-[#E7EBFB] bg-white/70 p-5">
              <StartupProfileFieldGroup fields={primaryFields(profile)} />
            </div>

            <div className="rounded-2xl border border-[#E7EBFB] bg-white/70 p-5">
              <StartupProfileFieldGroup fields={secondaryFields(profile)} />
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-2xl border border-[#E7EBFB] bg-white/70 p-5">
              <div className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#5B64A8]">
                Contact And Links
              </div>
              <StartupProfileFieldGroup fields={contactFields(profile)} className="space-y-5" />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E7EBFB] bg-white/70 p-5">
                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#5B64A8]">
                  Services
                </div>
                <p className="text-sm font-semibold leading-7 text-slate-800">
                  {formatList(profile.services || profile.supportRequired)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E7EBFB] bg-white/70 p-5">
                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#5B64A8]">
                  Interests
                </div>
                <p className="text-sm font-semibold leading-7 text-slate-800">
                  {formatList(profile.interests || profile.interestedPrograms)}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
