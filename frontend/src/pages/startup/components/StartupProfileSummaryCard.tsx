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
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="grid gap-0 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="border-b border-slate-200 bg-slate-50/50 p-8 xl:border-b-0 xl:border-r-2 xl:border-slate-100">
          <div className="mx-auto flex max-w-[220px] flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {profile.logoPreview || profile.logoUrl ? (
                <img
                  src={profile.logoPreview || profile.logoUrl}
                  alt={`${profile.startupName || profile.name} logo`}
                  className="h-full w-full object-contain p-5"
                />
              ) : (
                <Building2 className="h-10 w-10 text-slate-400" />
              )}
            </div>

            <h2 className="mt-5 text-base font-bold tracking-tight text-[#0B2A5B]">
              {profile.legalName || profile.startupName || profile.name}
            </h2>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
              {profile.startupBrief || profile.description}
            </p>

            <div className="mt-5 flex w-full flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF2FF] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0B2A5B]">
                <Sparkles className="h-3 w-3" />
                {profile.stage}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF2E8] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#DF6B15]">
                <FileDigit className="h-3 w-3" />
                {profile.fundingStatus || profile.fundingType}
              </span>
            </div>

            <Link
              to="/startup/settings"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0B2A5B] hover:bg-[#07144A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition shadow-sm"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-8 xl:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <StartupProfileFieldGroup fields={primaryFields(profile)} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <StartupProfileFieldGroup fields={secondaryFields(profile)} />
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Contact and Links
              </div>
              <StartupProfileFieldGroup fields={contactFields(profile)} className="space-y-5" />
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Services
                </div>
                <p className="text-xs font-bold leading-6 text-slate-700">
                  {formatList(profile.services || profile.supportRequired)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Interests
                </div>
                <p className="text-xs font-bold leading-6 text-slate-700">
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
