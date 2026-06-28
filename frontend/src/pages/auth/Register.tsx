/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  FileText,
  Globe,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
  Users,
  Lock,
} from "lucide-react";
import { AuthShell } from "../../components/auth/AuthShell";
import { useAppState } from "../../context/AppContext";
import { programCatalog } from "../../data/programCatalog";
import { authApi } from "../../services/authApi";

type RegistrationForm = {
  logoName: string;
  startupName: string;
  startupBrief: string;
  hasCompanyLogo: boolean;
  fundingStatus: "Funded" | "Bootstrapped";
  stage: "Ideation" | "Validation" | "Early Traction" | "Scaling";
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  state: string;
  city: string;
  website: string;
  appLink: string;
  industry: string;
  sector: string;
  services: string[];
  udhyogAadhaar: string;
  cin: string;
  nature: string;
  legalName: string;
  interests: string[];
  selectedProgram: string;
  agreeTerms: boolean;
};

const steps = [
  { number: 1, title: "About Startup" },
  { number: 2, title: "Contact info" },
  { number: 3, title: "Category & Program" },
  { number: 4, title: "Your Interest" },
];

const stageOptions: RegistrationForm["stage"][] = ["Ideation", "Validation", "Early Traction", "Scaling"];
const fundingOptions: RegistrationForm["fundingStatus"][] = ["Funded", "Bootstrapped"];
const industryOptions = ["AI", "Fintech", "Healthtech", "Edtech", "Manufacturing", "Agri", "Climate", "Other"];
const sectorOptions = ["SaaS", "D2C", "B2B", "B2C", "Marketplace", "Hardware", "Services", "Other"];
const serviceOptions = ["Mobile", "Online Aggregator", "Platform", "Others", "SaaS"];
const interestOptions = ["All", "Investors", "Incubators", "Other Startups", "Mentors", "Accelerators"];
const natureOptions = ["Private Limited Company", "LLP", "Partnership", "Section 8", "Sole Proprietorship", "Other"];
const stateOptions = ["Punjab", "Delhi", "Haryana", "Maharashtra", "Karnataka", "Gujarat", "Tamil Nadu", "Other"];

export const Register: React.FC = () => {
  const { showToast } = useAppState();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<RegistrationForm>({
    logoName: "",
    startupName: "",
    startupBrief: "",
    hasCompanyLogo: true,
    fundingStatus: "Bootstrapped",
    stage: "Validation",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    state: "Punjab",
    city: "",
    website: "",
    appLink: "",
    industry: "AI",
    sector: "Other",
    services: ["Platform", "SaaS"],
    udhyogAadhaar: "",
    cin: "",
    nature: "Private Limited Company",
    legalName: "",
    interests: ["All", "Investors", "Incubators"],
    selectedProgram: "",
    agreeTerms: false,
  });

  const updateField = <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleListValue = (key: "services" | "interests", value: string) => {
    setForm((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: next } as RegistrationForm;
    });
  };

  const buildStepErrors = (targetStep: number) => {
    const nextErrors: Record<string, string> = {};

    if (targetStep === 1) {
      if (!form.startupName.trim()) nextErrors.startupName = "Startup name is required.";
      if (!form.startupBrief.trim()) nextErrors.startupBrief = "A short startup brief helps complete registration.";
    }

    if (targetStep === 2) {
      if (!form.email.trim()) nextErrors.email = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = "Enter a valid email address.";

      if (!form.mobile.trim()) nextErrors.mobile = "Mobile number is required.";
      else if (!/^\d{10}$/.test(form.mobile)) nextErrors.mobile = "Enter a 10-digit mobile number.";

      if (!form.password) nextErrors.password = "Password is required.";
      else if (form.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
      else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/\d/.test(form.password)) {
        nextErrors.password = "Use uppercase, lowercase, and one number.";
      }

      if (!form.confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
      else if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords do not match.";

      if (!form.city.trim()) nextErrors.city = "City is required.";
    }

    if (targetStep === 3) {
      if (!form.industry.trim()) nextErrors.industry = "Select an industry.";
      if (!form.sector.trim()) nextErrors.sector = "Select a sector.";
      if (!form.selectedProgram.trim()) nextErrors.selectedProgram = "Select one program for your registration.";
      if (!form.services.length) nextErrors.services = "Choose at least one service.";
      if (!form.legalName.trim()) nextErrors.legalName = "Legal name is required.";
    }

    if (targetStep === 4) {
      if (!form.interests.length) nextErrors.interests = "Select at least one interest.";
      if (!form.agreeTerms) nextErrors.agreeTerms = "You need to agree to the terms.";
    }

    return nextErrors;
  };

  const validateStep = (targetStep: number) => {
    const nextErrors = buildStepErrors(targetStep);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateAllSteps = () => {
    const mergedErrors = {
      ...buildStepErrors(1),
      ...buildStepErrors(2),
      ...buildStepErrors(3),
      ...buildStepErrors(4),
    };
    setErrors(mergedErrors);

    if (mergedErrors.startupName || mergedErrors.startupBrief) {
      setStep(1);
    } else if (mergedErrors.email || mergedErrors.mobile || mergedErrors.password || mergedErrors.confirmPassword || mergedErrors.city) {
      setStep(2);
    } else if (mergedErrors.industry || mergedErrors.sector || mergedErrors.selectedProgram || mergedErrors.services || mergedErrors.legalName) {
      setStep(3);
    } else if (mergedErrors.interests || mergedErrors.agreeTerms) {
      setStep(4);
    }

    return Object.keys(mergedErrors).length === 0;
  };

  const handleLogoUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(typeof reader.result === "string" ? reader.result : "");
      setForm((prev) => ({
        ...prev,
        logoName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAllSteps()) {
      showToast("Please complete the missing registration details.", "error");
      return;
    }

    setLoading(true);
    try {
      const startupId = `startup-${Date.now()}`;
      const { password, confirmPassword, ...startupProfileFields } = form;
      const payload = {
        ...startupProfileFields,
        id: startupId,
        logoPreview,
        registeredAt: Date.now(),
      };

      const response = await authApi.register({
        name: form.startupName,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        startupId,
        selectedProgram: form.selectedProgram,
        startupProfile: payload,
      });

      localStorage.setItem(
        "bsi_temp_registration",
        JSON.stringify({
          name: form.startupName,
          email: form.email,
          mobile: form.mobile,
          selectedProgram: form.selectedProgram,
          startupId: response.startupId || startupId,
          startupProfile: payload,
          timestamp: Date.now(),
        })
      );

      showToast("Registration details saved. Please verify your email.", "success");
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch {
      showToast("Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="startup registration"
      title="Register your startup in four steps"
      description="Share your startup profile, contact details, category information, and participation interests to move into verification."
      aside={
        <div className="flex items-center gap-3 rounded-2xl border border-[#FF6B00]/20 bg-[#FFF7ED] px-4 py-3 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#F9B233] text-white shadow-[0_14px_28px_rgba(255,107,0,0.22)]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D94F00]">Step</div>
            <div className="text-sm font-black text-[#07184A]">{steps[step - 1].title}</div>
          </div>
        </div>
      }
    >
      <div className="space-y-8">

          <div className="mb-10">
            <div className="relative mx-auto max-w-6xl">
              <div className="absolute left-8 right-8 top-4 h-1 rounded-full bg-[#07184A]/10" />
              <div
                className="absolute left-8 top-4 h-1 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#F9B233] to-[#07184A] transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
              <div className="relative grid grid-cols-4 gap-3">
                {steps.map((item) => {
                  const active = step === item.number;
                  const complete = step > item.number;

                  return (
                    <button
                      key={item.number}
                      type="button"
                      onClick={() => {
                        if (item.number < step) setStep(item.number);
                      }}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className={`z-10 flex h-9 w-9 items-center justify-center rounded-full border-4 bg-white text-sm font-black transition-all ${
                          complete
                            ? "border-[#F9B233] text-[#07184A] shadow-[0_10px_24px_rgba(249,178,51,0.18)]"
                            : active
                              ? "border-[#FF6B00] text-[#07184A] shadow-[0_0_0_7px_rgba(255,107,0,0.14),0_14px_30px_rgba(255,107,0,0.22)]"
                              : "border-slate-300 text-slate-500"
                        }`}
                      >
                        {complete ? <Check className="h-4 w-4" /> : item.number}
                      </div>
                      <div className="mt-2 text-[11px] uppercase tracking-wide text-slate-500">Step</div>
                      <div className={`text-sm font-extrabold ${active ? "text-[#07184A]" : "text-slate-700"}`}>{item.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[13px] font-black uppercase tracking-wider text-slate-500">
                      <Upload className="h-4 w-4 text-[#FF6B00]" />
                      Entity/company logo
                      <Info className="h-4 w-4 text-slate-300" />
                    </div>
                    <label className="flex min-h-48 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#FF6B00]/30 bg-gradient-to-br from-[#FFF7ED] to-white p-4 text-center transition hover:-translate-y-0.5 hover:border-[#FF6B00] hover:shadow-[0_18px_45px_rgba(255,107,0,0.13)]">
                      <div className="space-y-3">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Startup logo preview"
                            className="mx-auto max-h-28 rounded-lg object-contain"
                          />
                        ) : (
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#FF6B00] shadow-[0_16px_35px_rgba(255,107,0,0.14)]">
                            <Upload className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-slate-700">
                            {form.logoName || "Upload your company logo"}
                          </div>
                          <div className="text-xs text-slate-500">PNG, JPG, or SVG</div>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  <div>
                    <div className="mb-2 text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Is this your company/institution logo
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField("hasCompanyLogo", !form.hasCompanyLogo)}
                        className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-bold transition ${
                        form.hasCompanyLogo
                          ? "border-[#FF6B00] bg-gradient-to-r from-[#FF6B00] to-[#F9B233] text-white shadow-[0_12px_25px_rgba(255,107,0,0.18)]"
                          : "border-slate-300 bg-white text-slate-600"
                      }`}
                    >
                      <span className={`h-5 w-10 rounded-full bg-white/30 p-0.5 ${form.hasCompanyLogo ? "" : "bg-slate-200"}`}>
                        <span
                          className={`block h-4 w-4 rounded-full bg-white transition ${
                            form.hasCompanyLogo ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </span>
                      {form.hasCompanyLogo ? "Yes" : "No"}
                    </button>
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Funded/bootstraped?
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {fundingOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("fundingStatus", option)}
                          className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                            form.fundingStatus === option
                              ? "border-[#07184A] bg-[#07184A] text-white shadow-[0_12px_24px_rgba(7,24,74,0.18)]"
                              : "border-slate-300 bg-white text-slate-600 hover:border-[#FF6B00]/50 hover:text-[#07184A]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Startup name
                    </label>
                    <input
                      type="text"
                      value={form.startupName}
                      onChange={(e) => updateField("startupName", e.target.value)}
                      placeholder="Enter startup name"
                      className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                        errors.startupName ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                      }`}
                    />
                    {errors.startupName && <p className="mt-1 text-xs font-bold text-red-500">{errors.startupName}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Stage
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {stageOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("stage", option)}
                          className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                            form.stage === option
                              ? "border-[#FF6B00] bg-gradient-to-br from-[#FF6B00] to-[#F9B233] text-white shadow-[0_16px_32px_rgba(255,107,0,0.22)]"
                              : "border-slate-300 bg-white text-slate-600 hover:border-[#FF6B00]/50 hover:text-[#07184A]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Brief
                    </label>
                    <textarea
                      value={form.startupBrief}
                      onChange={(e) => updateField("startupBrief", e.target.value)}
                      rows={8}
                      placeholder="Write a concise summary of what your startup does, who it serves, and what you need from the scheme."
                      className={`w-full rounded-2xl border px-4 py-3 text-sm leading-6 font-medium text-slate-700 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                        errors.startupBrief ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                      }`}
                    />
                    {errors.startupBrief && <p className="mt-1 text-xs font-bold text-red-500">{errors.startupBrief}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="name@startup.in"
                      className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                        errors.email ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs font-bold text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Mobile
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => updateField("mobile", e.target.value)}
                      placeholder="10-digit mobile number"
                      className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                        errors.mobile ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                      }`}
                    />
                  </div>
                  {errors.mobile && <p className="mt-1 text-xs font-bold text-red-500">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Create a secure password"
                      autoComplete="new-password"
                      className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                        errors.password ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">Minimum 8 characters with uppercase, lowercase, and a number.</p>
                  {errors.password && <p className="mt-1 text-xs font-bold text-red-500">{errors.password}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Confirm password
                  </label>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                        errors.confirmPassword ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs font-bold text-red-500">{errors.confirmPassword}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    State
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <select
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)]"
                    >
                      {stateOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="City"
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                      errors.city ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                    }`}
                  />
                  {errors.city && <p className="mt-1 text-xs font-bold text-red-500">{errors.city}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      placeholder="https://startup.example"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Mobile app link
                  </label>
                  <input
                    type="text"
                    value={form.appLink}
                    onChange={(e) => updateField("appLink", e.target.value)}
                    placeholder="Play Store or App Store link"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)]"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Industry
                  </label>
                  <div className="relative">
                    <select
                      value={form.industry}
                      onChange={(e) => updateField("industry", e.target.value)}
                      className={`w-full appearance-none rounded-xl border bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                        errors.industry ? "border-red-400 bg-red-50" : "border-slate-300"
                      }`}
                    >
                      {industryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.industry && <p className="mt-1 text-xs font-bold text-red-500">{errors.industry}</p>}
                </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Sector
                  </label>
                  <div className="relative">
                    <select
                      value={form.sector}
                      onChange={(e) => updateField("sector", e.target.value)}
                      className={`w-full appearance-none rounded-xl border bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                        errors.sector ? "border-red-400 bg-red-50" : "border-slate-300"
                      }`}
                    >
                      {sectorOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                    {errors.sector && <p className="mt-1 text-xs font-bold text-red-500">{errors.sector}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Select program *
                    </label>
                    <div className="relative">
                      <select
                        value={form.selectedProgram}
                        onChange={(e) => updateField("selectedProgram", e.target.value)}
                        className={`w-full appearance-none rounded-xl border bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                          errors.selectedProgram ? "border-red-400 bg-red-50" : "border-slate-300"
                        }`}
                      >
                        <option value="">Select a program</option>
                        {programCatalog.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                    {errors.selectedProgram && <p className="mt-1 text-xs font-bold text-red-500">{errors.selectedProgram}</p>}
                  </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Services
                  </label>
                  <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-300 bg-white p-4">
                    {serviceOptions.map((option) => {
                      const active = form.services.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleListValue("services", option)}
                          className={`rounded-md px-3 py-2 text-xs font-bold transition ${
                            active ? "bg-[#07184A] text-white shadow-[0_10px_18px_rgba(7,24,74,0.16)]" : "bg-[#FFF7ED] text-slate-700 hover:bg-[#FFE8D5] hover:text-[#07184A]"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {errors.services && <p className="mt-1 text-xs font-bold text-red-500">{errors.services}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Udyog Aadhaar
                  </label>
                  <input
                    type="text"
                    value={form.udhyogAadhaar}
                    onChange={(e) => updateField("udhyogAadhaar", e.target.value)}
                    placeholder="Udyog Aadhaar number"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Company incorporation number (CIN)
                  </label>
                  <input
                    type="text"
                    value={form.cin}
                    onChange={(e) => updateField("cin", e.target.value)}
                    placeholder="CIN"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Nature of the entity
                  </label>
                  <div className="relative">
                    <select
                      value={form.nature}
                      onChange={(e) => updateField("nature", e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)]"
                    >
                      {natureOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Legal name
                  </label>
                  <input
                    type="text"
                    value={form.legalName}
                    onChange={(e) => updateField("legalName", e.target.value)}
                    placeholder="Legal entity name"
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] ${
                      errors.legalName ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                    }`}
                  />
                  {errors.legalName && <p className="mt-1 text-xs font-bold text-red-500">{errors.legalName}</p>}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <div className="mb-3 text-[13px] font-black uppercase tracking-wider text-slate-500">
                    You are interested in...
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {interestOptions.map((option) => {
                      const active = form.interests.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleListValue("interests", option)}
                          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                            active
                              ? "border-[#FF6B00] bg-gradient-to-br from-[#FF6B00] to-[#F9B233] text-white shadow-[0_16px_32px_rgba(255,107,0,0.2)]"
                              : "border-slate-300 bg-white text-slate-600 hover:border-[#FF6B00]/50 hover:text-[#07184A]"
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-md ${
                              active ? "bg-white/20" : "bg-slate-100"
                            }`}
                          >
                            {active ? <Check className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {errors.interests && <p className="mt-2 text-xs font-bold text-red-500">{errors.interests}</p>}
                </div>

                <div className="rounded-2xl border border-[#FF6B00]/20 bg-gradient-to-br from-[#FFF7ED] via-white to-white p-4 shadow-[0_18px_45px_rgba(7,24,74,0.08)]">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-600">
                    <FileText className="h-4 w-4 text-[#FF6B00]" />
                    Terms of use
                  </div>
                  <div className="max-h-64 overflow-auto rounded-xl border border-[#F9B233]/30 bg-white/90 p-4 text-sm leading-6 text-slate-600 shadow-inner">
                    <p className="mb-4">
                      This official registration form collects the information required to review your startup profile and determine scheme
                      eligibility. The data you provide is used for verification, contact, and program routing.
                    </p>
                    <p className="mb-4">
                      The portal may update program rules, documentation requirements, and review timelines from time to time. Please make
                      sure the details entered here are complete and accurate.
                    </p>
                    <p>
                      By submitting this form, you confirm that the information is truthful to the best of your knowledge and you agree
                      to the terms and conditions for processing and verification.
                    </p>
                  </div>
                  <label className="mt-4 flex items-center gap-3 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) => updateField("agreeTerms", e.target.checked)}
                      className="h-5 w-5 rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    I agree to Terms & Conditions
                  </label>
                  {errors.agreeTerms && <p className="mt-2 text-xs font-bold text-red-500">{errors.agreeTerms}</p>}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#07184A] hover:text-[#FF6B00]"
              >
                Already registered? Use the login button in the header
              </Link>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#F9B233] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_16px_32px_rgba(255,107,0,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(255,107,0,0.28)]"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-full bg-[#07184A] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_16px_32px_rgba(7,24,74,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0B2A5B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Processing..." : "Register"}
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </AuthShell>
  );
};
