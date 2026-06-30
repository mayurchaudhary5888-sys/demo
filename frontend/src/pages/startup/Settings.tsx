/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Building2,
  FileText,
  Globe,
  ImagePlus,
  KeyRound,
  Lock,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings2,
  Sparkles,
} from "lucide-react";
import { FundingType, StartupProfile, StartupStage } from "../../types";
import { useAppState } from "../../context/AppContext";
import { industrySectors } from "../../data/industrySectors";

type ProfileFormState = {
  logoPreview: string;
  legalName: string;
  startupName: string;
  registrationNumber: string;
  startupBrief: string;
  stage: StartupStage;
  fundingStatus: FundingType;
  industry: string;
  sector: string;
  nature: string;
  state: string;
  city: string;
  email: string;
  mobile: string;
  website: string;
  appLink: string;
  cin: string;
  udhyogAadhaar: string;
  services: string;
  interests: string;
  registrationDate: string;
};

const stageOptions: StartupStage[] = [
  StartupStage.IDEATION,
  StartupStage.VALIDATION,
  StartupStage.EARLY_TRACTION,
  StartupStage.SCALING,
];

const fundingOptions: FundingType[] = [FundingType.BOOTSTRAPPED, FundingType.FUNDED];
const industryOptions = Object.keys(industrySectors);
const natureOptions = ["Private Limited Company", "LLP", "Partnership", "Section 8", "Sole Proprietorship", "Other"];
const stateOptions = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const toCsv = (items?: string[]) => (items?.length ? items.join(", ") : "");

const buildFormState = (profile: StartupProfile | undefined, userEmail?: string): ProfileFormState => ({
  logoPreview: profile?.logoPreview || profile?.logoUrl || "",
  legalName: profile?.legalName || profile?.startupName || profile?.name || "",
  startupName: profile?.startupName || profile?.name || "",
  registrationNumber: profile?.registrationNumber || profile?.id || "",
  startupBrief: profile?.startupBrief || profile?.description || "",
  stage: profile?.stage || StartupStage.VALIDATION,
  fundingStatus: (profile?.fundingStatus as FundingType) || profile?.fundingType || FundingType.BOOTSTRAPPED,
  industry: profile?.industry || "",
  sector: profile?.sector || "",
  nature: profile?.nature || profile?.startupType || "",
  state: profile?.state || "",
  city: profile?.city || "",
  email: profile?.email || userEmail || "",
  mobile: profile?.mobile || "",
  website: profile?.website || "",
  appLink: profile?.appLink || "",
  cin: profile?.cin || profile?.dpiitNumber || "",
  udhyogAadhaar: profile?.udhyogAadhaar || profile?.msmeNumber || "",
  services: toCsv(profile?.services || profile?.supportRequired),
  interests: toCsv(profile?.interests || profile?.interestedPrograms),
  registrationDate: profile?.registrationDate || new Date().toISOString().split("T")[0],
});

const parseCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const sectionClassName =
  "rounded-[26px] border border-[#D9DCF4] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_rgba(248,249,255,0.96)_38%,_rgba(231,236,255,0.88)_100%)] p-6 shadow-[0_20px_55px_rgba(69,84,155,0.14)]";

const inputClassName =
  "w-full rounded-2xl border border-[#DCE2F6] bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#2B2F86] focus:shadow-[0_0_0_4px_rgba(43,47,134,0.08)]";

const labelClassName = "mb-2 block text-[12px] font-black uppercase tracking-[0.16em] text-[#5B64A8]";

export const Settings: React.FC = () => {
  const { user, startups, showToast, updateStartupProfile } = useAppState();
  const location = useLocation();
  const myStartup = startups.find((s) => s.id === user?.startupId);

  const [profileForm, setProfileForm] = useState<ProfileFormState>(() => buildFormState(myStartup, user?.email));
  const sectorOptions = profileForm.industry ? (industrySectors[profileForm.industry] || []) : [];
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  useEffect(() => {
    setProfileForm(buildFormState(myStartup, user?.email));
  }, [myStartup, user?.email]);

  const companyName = useMemo(
    () => profileForm.startupName || profileForm.legalName || myStartup?.name || "Startup",
    [profileForm.legalName, profileForm.startupName, myStartup?.name]
  );

  const updateProfileField = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProfileField("logoPreview", typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.startupId) {
      showToast("Startup profile not found for this account.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<StartupProfile> = {
        name: profileForm.startupName || profileForm.legalName,
        logoUrl: profileForm.logoPreview || undefined,
        logoPreview: profileForm.logoPreview || undefined,
        legalName: profileForm.legalName,
        startupName: profileForm.startupName,
        registrationNumber: profileForm.registrationNumber,
        startupBrief: profileForm.startupBrief,
        description: profileForm.startupBrief,
        stage: profileForm.stage,
        fundingStatus: profileForm.fundingStatus,
        fundingType: profileForm.fundingStatus,
        industry: profileForm.industry,
        sector: profileForm.sector,
        nature: profileForm.nature,
        startupType: profileForm.nature || profileForm.industry,
        state: profileForm.state,
        city: profileForm.city,
        email: profileForm.email,
        mobile: profileForm.mobile,
        website: profileForm.website || undefined,
        appLink: profileForm.appLink || undefined,
        cin: profileForm.cin || undefined,
        dpiitNumber: profileForm.cin || undefined,
        udhyogAadhaar: profileForm.udhyogAadhaar || undefined,
        msmeNumber: profileForm.udhyogAadhaar || undefined,
        isDpiitRecognized: Boolean(profileForm.cin),
        isMsmeRegistered: Boolean(profileForm.udhyogAadhaar),
        services: parseCsv(profileForm.services),
        supportRequired: parseCsv(profileForm.services),
        interests: parseCsv(profileForm.interests),
        interestedPrograms: parseCsv(profileForm.interests),
        registrationDate: profileForm.registrationDate,
      };

      await updateStartupProfile(user.startupId, payload);
      showToast("Profile details updated successfully.", "success");
    } catch {
      showToast("Unable to save profile changes right now.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-sm text-slate-700" id="settings-container">
      <section className={sectionClassName}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5B64A8]">Edit Profile</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#162457] sm:text-3xl">
              {companyName}
            </h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">
              Update the same company details that appear on your dashboard profile card.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#2B2F86] shadow-sm">
            <Settings2 className="h-4 w-4 text-[#FF8A1C]" />
            Profile Editor
          </div>
        </div>
      </section>

      <form onSubmit={handleSave} className="space-y-6" id="settings-form">
        <section className={sectionClassName}>
          <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="border-b border-[#E4E8FB] pb-6 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-8">
              <div className="mx-auto flex max-w-[220px] flex-col items-center text-center">
                <label className="flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-[0_20px_45px_rgba(72,82,150,0.16)]">
                  {profileForm.logoPreview ? (
                    <img src={profileForm.logoPreview} alt={`${companyName} logo`} className="h-full w-full object-contain p-5" />
                  ) : (
                    <Building2 className="h-10 w-10 text-[#394B98]" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)} />
                </label>

                <button
                  type="button"
                  onClick={() => document.querySelector<HTMLInputElement>("#settings-form input[type='file']")?.click()}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-[#DCE2F6] bg-white px-4 py-2 text-sm font-black text-[#2B2F86] transition hover:border-[#2B2F86]"
                >
                  <ImagePlus className="h-4 w-4" />
                  Change Logo
                </button>

                <div className="mt-5 flex w-full flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF2FF] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#394B98]">
                    <Sparkles className="h-3.5 w-3.5" />
                    {profileForm.stage}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF2E8] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#DF6B15]">
                    <FileText className="h-3.5 w-3.5" />
                    {profileForm.fundingStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <label className={labelClassName}>Entity Name</label>
                  <input
                    type="text"
                    value={profileForm.legalName}
                    onChange={(e) => updateProfileField("legalName", e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className={labelClassName}>Startup Name</label>
                  <input
                    type="text"
                    value={profileForm.startupName}
                    onChange={(e) => updateProfileField("startupName", e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className={labelClassName}>Registration Number</label>
                  <input
                    type="text"
                    value={profileForm.registrationNumber}
                    onChange={(e) => updateProfileField("registrationNumber", e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className={labelClassName}>Registration Date</label>
                  <input
                    type="date"
                    value={profileForm.registrationDate}
                    onChange={(e) => updateProfileField("registrationDate", e.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>

              <div>
                <label className={labelClassName}>Startup Brief</label>
                <textarea
                  rows={5}
                  value={profileForm.startupBrief}
                  onChange={(e) => updateProfileField("startupBrief", e.target.value)}
                  className={`${inputClassName} resize-none leading-6`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className={sectionClassName}>
            <div className="mb-5 flex items-center gap-2 text-[#162457]">
              <Building2 className="h-5 w-5 text-[#FF8A1C]" />
              <h2 className="text-lg font-black">Business Details</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClassName}>Stage</label>
                <select value={profileForm.stage} onChange={(e) => updateProfileField("stage", e.target.value as StartupStage)} className={inputClassName}>
                  {stageOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>Funding Status</label>
                <select value={profileForm.fundingStatus} onChange={(e) => updateProfileField("fundingStatus", e.target.value as FundingType)} className={inputClassName}>
                  {fundingOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>Industry</label>
                <select
                  value={profileForm.industry}
                  onChange={(e) => {
                    updateProfileField("industry", e.target.value);
                    updateProfileField("sector", "");
                  }}
                  className={inputClassName}
                >
                  <option value="">Select industry</option>
                  {industryOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>Sector</label>
                <select value={profileForm.sector} onChange={(e) => updateProfileField("sector", e.target.value)} className={inputClassName}>
                  <option value="">Select sector</option>
                  {sectorOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>Company Nature</label>
                <select value={profileForm.nature} onChange={(e) => updateProfileField("nature", e.target.value)} className={inputClassName}>
                  <option value="">Select nature</option>
                  {natureOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>DPIIT Recognition</label>
                <input type="text" value={profileForm.cin} onChange={(e) => updateProfileField("cin", e.target.value)} className={inputClassName} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClassName}>MSME / Udyog Aadhaar</label>
                <input
                  type="text"
                  value={profileForm.udhyogAadhaar}
                  onChange={(e) => updateProfileField("udhyogAadhaar", e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          <div className={sectionClassName}>
            <div className="mb-5 flex items-center gap-2 text-[#162457]">
              <Phone className="h-5 w-5 text-[#FF8A1C]" />
              <h2 className="text-lg font-black">Contact And Links</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClassName}>Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input type="email" value={profileForm.email} onChange={(e) => updateProfileField("email", e.target.value)} className={`${inputClassName} pl-11`} />
                </div>
              </div>
              <div>
                <label className={labelClassName}>Mobile</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input type="text" value={profileForm.mobile} onChange={(e) => updateProfileField("mobile", e.target.value)} className={`${inputClassName} pl-11`} />
                </div>
              </div>
              <div>
                <label className={labelClassName}>State</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <select value={profileForm.state} onChange={(e) => updateProfileField("state", e.target.value)} className={`${inputClassName} pl-11`}>
                    <option value="">Select state</option>
                    {stateOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClassName}>City</label>
                <input type="text" value={profileForm.city} onChange={(e) => updateProfileField("city", e.target.value)} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>Website</label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input type="url" value={profileForm.website} onChange={(e) => updateProfileField("website", e.target.value)} className={`${inputClassName} pl-11`} />
                </div>
              </div>
              <div>
                <label className={labelClassName}>App Link</label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input type="url" value={profileForm.appLink} onChange={(e) => updateProfileField("appLink", e.target.value)} className={`${inputClassName} pl-11`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className={sectionClassName}>
            <div className="mb-5 flex items-center gap-2 text-[#162457]">
              <FileText className="h-5 w-5 text-[#FF8A1C]" />
              <h2 className="text-lg font-black">Services And Interests</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className={labelClassName}>Services</label>
                <textarea
                  rows={4}
                  value={profileForm.services}
                  onChange={(e) => updateProfileField("services", e.target.value)}
                  placeholder="Platform, SaaS, Online Aggregator"
                  className={`${inputClassName} resize-none leading-6`}
                />
              </div>
              <div>
                <label className={labelClassName}>Interests</label>
                <textarea
                  rows={4}
                  value={profileForm.interests}
                  onChange={(e) => updateProfileField("interests", e.target.value)}
                  placeholder="Investors, Incubators, Mentors"
                  className={`${inputClassName} resize-none leading-6`}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="email" className={sectionClassName}>
          <div className="mb-5 flex items-center gap-2 text-[#162457]">
            <Mail className="h-5 w-5 text-[#FF8A1C]" />
            <h2 className="text-lg font-black">Login Email</h2>
          </div>
          <div className="rounded-2xl border border-[#E7EBFB] bg-white/70 p-4 text-sm font-medium text-slate-600">
            Your current login email is <span className="font-mono font-bold text-[#162457]">{profileForm.email || user?.email}</span>.
          </div>
        </section>

        <section id="password" className={sectionClassName}>
          <div className="mb-5 flex items-center gap-2 text-[#162457]">
            <LockKeyhole className="h-5 w-5 text-[#FF8A1C]" />
            <h2 className="text-lg font-black">Change Password</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className={labelClassName}>Current Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`${inputClassName} pl-11`} />
              </div>
            </div>
            <div>
              <label className={labelClassName}>New Password</label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputClassName} pl-11`} />
              </div>
            </div>
            <div>
              <label className={labelClassName}>Confirm Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputClassName} pl-11`} />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2B2F86] px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_16px_30px_rgba(43,47,134,0.24)] transition hover:bg-[#21256A] disabled:opacity-60"
            id="btn-settings-save"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};
