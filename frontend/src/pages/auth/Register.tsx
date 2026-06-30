/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
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
  AlertTriangle,
  X,
} from "lucide-react";
import { AuthShell } from "../../components/auth/AuthShell";
import { useAppState } from "../../context/AppContext";
import { programCatalog } from "../../data/programCatalog";
import { authApi } from "../../services/authApi";
import { contentApi } from "../../services/contentApi";

type RegistrationForm = {
  logoName: string;
  startupName: string;
  startupBrief: string;
  hasCompanyLogo: boolean | null;
  fundingStatus: string;
  stage: string;
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

const stageOptions = ["Ideation", "Validation", "Early Traction", "Scaling"];
const fundingOptions = ["Funded", "Bootstrapped"];
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
  const [userExistsModalOpen, setUserExistsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<RegistrationForm>({
    logoName: "",
    startupName: "",
    startupBrief: "",
    hasCompanyLogo: null,
    fundingStatus: "",
    stage: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    state: "",
    city: "",
    website: "",
    appLink: "",
    industry: "",
    sector: "",
    services: [],
    udhyogAadhaar: "",
    cin: "",
    nature: "",
    legalName: "",
    interests: [],
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
      if (!form.password) nextErrors.password = "Password is required.";
      else if (form.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
      else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/\d/.test(form.password)) {
        nextErrors.password = "Use uppercase, lowercase, and one number.";
      }

      if (!form.confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
      else if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords do not match.";

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
    } else if (mergedErrors.email || mergedErrors.mobile || mergedErrors.city) {
      setStep(2);
    } else if (mergedErrors.industry || mergedErrors.sector || mergedErrors.selectedProgram || mergedErrors.services || mergedErrors.legalName) {
      setStep(3);
    } else if (mergedErrors.password || mergedErrors.confirmPassword || mergedErrors.interests || mergedErrors.agreeTerms) {
      setStep(4);
    }

    return Object.keys(mergedErrors).length === 0;
  };

  const handleLogoUpload = (file: File | null) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      showToast("Logo image must be smaller than 4MB.", "error");
      return;
    }

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
      let uploadedLogoUrl = "";

      if (logoPreview.startsWith("data:image/")) {
        try {
          const uploadedLogo = await contentApi.uploadLogo({
            imageData: logoPreview,
            filename: form.logoName,
          });
          uploadedLogoUrl = uploadedLogo.secureUrl;
        } catch (uploadError) {
          console.warn("Logo upload failed. Using local/fallback preview.", uploadError);
          uploadedLogoUrl = logoPreview;
        }
      }

      const payload = {
        ...startupProfileFields,
        id: startupId,
        logoPreview: uploadedLogoUrl,
        logoUrl: uploadedLogoUrl,
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
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : "Registration failed. Please try again.";
      if (msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("already exits")) {
        setUserExistsModalOpen(true);
      } else {
        showToast(msg, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthShell
      badge="startup registration"
      title="Register your startup in four steps"
      description="Share your startup profile, contact details, category information, and participation interests to move into verification."
      maxWidthClassName="max-w-[86rem]"
      showFooterNote={false}
      aside={
        <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#07184A] text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">Step</div>
            <div className="text-sm font-black text-[#07184A]">{steps[step - 1].title}</div>
          </div>
        </div>
      }
    >
      <div className="space-y-8">

          {/* Stepper Progress Bar */}
          <div className="mb-8 rounded-[24px] border-2 border-slate-100 bg-gradient-to-r from-slate-50/50 via-white to-slate-50/50 p-6 shadow-xs">
            <div className="relative mx-auto max-w-6xl">
              <div className="absolute left-8 right-8 top-5 h-1 rounded-full bg-slate-200" />
              <div
                className="absolute left-8 top-5 h-1 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#F9B233] transition-all duration-500"
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
                      className="flex flex-col items-center text-center focus:outline-none"
                    >
                      <div
                        className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 bg-white text-sm font-black transition-all duration-300 shadow-md ${
                          complete
                            ? "border-[#07184A] bg-[#07184A] text-white"
                            : active
                              ? "border-[#FF6B00] text-[#FF6B00] ring-4 ring-[#FF6B00]/10"
                              : "border-slate-200 text-slate-400 hover:border-slate-350"
                        }`}
                      >
                        {complete ? <Check className="h-4.5 w-4.5" /> : item.number}
                      </div>
                      <div className="mt-2.5 text-[9px] font-black uppercase tracking-wider text-slate-400">Step</div>
                      <div className={`text-xs sm:text-sm font-black mt-0.5 tracking-tight transition-colors ${active ? "text-[#07184A]" : "text-slate-500 hover:text-slate-750"}`}>{item.title}</div>
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
                    <label className="flex min-h-48 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition-all duration-200 hover:border-[#FF6B00] hover:bg-white hover:shadow-xs">
                      <div className="space-y-3">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Startup logo preview"
                            className="mx-auto max-h-28 rounded-lg object-contain"
                          />
                        ) : (
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#FF6B00] ring-1 ring-slate-200">
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
                    <div className="flex flex-wrap gap-3">
                      {[
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                      ].map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => updateField("hasCompanyLogo", option.value)}
                          className={`rounded-full border-2 px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                            form.hasCompanyLogo === option.value
                              ? "border-[#FF6B00] bg-gradient-to-r from-[#FF6B00] to-[#FF8C3D] text-white shadow-sm shadow-[#FF6B00]/15"
                              : "border-slate-200 bg-white text-slate-600 hover:border-[#FF6B00]/40 hover:text-[#07184A] hover:bg-slate-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Funded/bootstrapped?
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {fundingOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("fundingStatus", option)}
                          className={`rounded-full border-2 px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                            form.fundingStatus === option
                              ? "border-[#07184A] bg-[#07184A] text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-600 hover:border-[#FF6B00]/40 hover:text-[#07184A] hover:bg-slate-50"
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
                      Startup name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.startupName}
                      onChange={(e) => updateField("startupName", e.target.value)}
                      placeholder="Enter startup name"
                      className={`w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 focus:shadow-none ${
                        errors.startupName ? "border-red-400 bg-red-50/10" : "border-slate-200 bg-white"
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
                          className={`rounded-xl border-2 px-3 py-3 text-xs sm:text-sm font-black tracking-tight transition-all duration-200 ${
                            form.stage === option
                              ? "border-[#FF6B00] bg-gradient-to-r from-[#FF6B00] to-[#FF8C3D] text-white shadow-sm shadow-[#FF6B00]/15"
                              : "border-slate-200 bg-white text-slate-600 hover:border-[#FF6B00]/40 hover:text-[#07184A] hover:bg-slate-50"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Brief <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.startupBrief}
                      onChange={(e) => updateField("startupBrief", e.target.value)}
                      rows={8}
                      placeholder="Write a concise summary of what your startup does, who it serves, and what you need from support."
                      className={`w-full rounded-2xl border-2 px-4 py-3 text-sm leading-6 font-medium text-slate-750 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 focus:shadow-none ${
                        errors.startupBrief ? "border-red-400 bg-red-50/10" : "border-slate-200 bg-white"
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
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="name@startup.in"
                      className={`w-full rounded-xl border-2 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 focus:shadow-none ${
                        errors.email ? "border-red-400 bg-red-50/10" : "border-slate-200 bg-white"
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs font-bold text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => updateField("mobile", e.target.value)}
                      placeholder="10-digit mobile number"
                      className={`w-full rounded-xl border-2 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 focus:shadow-none ${
                        errors.mobile ? "border-red-400 bg-red-50/10" : "border-slate-200 bg-white"
                      }`}
                    />
                  </div>
                  {errors.mobile && <p className="mt-1 text-xs font-bold text-red-500">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    State
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <select
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white py-3 pl-11 pr-10 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8"
                    >
                      <option value="" disabled>
                        Select state
                      </option>
                      {stateOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="City"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 focus:shadow-none ${
                      errors.city ? "border-red-400 bg-red-50/10" : "border-slate-200 bg-white"
                    }`}
                  />
                  {errors.city && <p className="mt-1 text-xs font-bold text-red-500">{errors.city}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      placeholder="https://startup.example"
                      className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8"
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
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.industry}
                      onChange={(e) => updateField("industry", e.target.value)}
                      className={`w-full appearance-none rounded-xl border-2 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 ${
                        errors.industry ? "border-red-400 bg-red-50/10" : "border-slate-200"
                      }`}
                    >
                      <option value="" disabled>
                        Select industry
                      </option>
                      {industryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.industry && <p className="mt-1 text-xs font-bold text-red-500">{errors.industry}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Sector <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.sector}
                      onChange={(e) => updateField("sector", e.target.value)}
                      className={`w-full appearance-none rounded-xl border-2 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 ${
                        errors.sector ? "border-red-400 bg-red-50/10" : "border-slate-200"
                      }`}
                    >
                      <option value="" disabled>
                        Select sector
                      </option>
                      {sectorOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.sector && <p className="mt-1 text-xs font-bold text-red-500">{errors.sector}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Select support <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.selectedProgram}
                      onChange={(e) => updateField("selectedProgram", e.target.value)}
                      className={`w-full appearance-none rounded-xl border-2 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 ${
                        errors.selectedProgram ? "border-red-400 bg-red-50/10" : "border-slate-200"
                      }`}
                    >
                      <option value="">Select support</option>
                      {programCatalog.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.selectedProgram && <p className="mt-1 text-xs font-bold text-red-500">{errors.selectedProgram}</p>}
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Services <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5 rounded-2xl border-2 border-slate-200 bg-white p-4">
                    {serviceOptions.map((option) => {
                      const active = form.services.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleListValue("services", option)}
                          className={`rounded-lg px-4.5 py-2 text-xs font-black tracking-tight transition-all duration-200 ${
                            active 
                              ? "bg-[#07184A] text-white shadow-sm" 
                              : "bg-slate-100 text-slate-700 hover:bg-[#FFF4EC] hover:text-[#07184A]"
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
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8"
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
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8"
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
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8"
                    >
                      <option value="" disabled>
                        Select nature
                      </option>
                      {natureOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                    Legal name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.legalName}
                    onChange={(e) => updateField("legalName", e.target.value)}
                    placeholder="Legal entity name"
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 focus:shadow-none ${
                      errors.legalName ? "border-red-400 bg-red-50/10" : "border-slate-200 bg-white"
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
                    You are interested in... <span className="text-red-500">*</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {interestOptions.map((option) => {
                      const active = form.interests.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleListValue("interests", option)}
                          className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-sm font-bold transition-all duration-200 ${
                            active
                              ? "border-[#FF6B00] bg-gradient-to-r from-[#FF6B00] to-[#FF8C3D] text-white shadow-sm shadow-[#FF6B00]/15"
                              : "border-slate-200 bg-white text-slate-600 hover:border-[#FF6B00]/50 hover:text-[#07184A]"
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

                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        placeholder="Create a secure password"
                        autoComplete="new-password"
                        className={`w-full rounded-xl border-2 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 focus:shadow-none ${
                          errors.password ? "border-red-400 bg-red-50/10" : "border-slate-200 bg-white"
                        }`}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] font-bold text-slate-500">Minimum 8 characters with uppercase, lowercase, and a number.</p>
                    {errors.password && <p className="mt-1 text-xs font-bold text-red-500">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-black uppercase tracking-wider text-slate-500">
                      Confirm password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <ShieldCheck className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        className={`w-full rounded-xl border-2 py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/8 focus:shadow-none ${
                          errors.confirmPassword ? "border-red-400 bg-red-50/10" : "border-slate-200 bg-white"
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-xs font-bold text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-slate-150 bg-slate-50/50 p-5 shadow-xs">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-600">
                    <FileText className="h-4 w-4 text-[#FF6B00]" />
                    Terms of use
                  </div>
                  <div className="max-h-64 overflow-auto rounded-xl border border-slate-150 bg-white p-4 text-xs sm:text-sm leading-6 text-slate-650 shadow-xs">
                    <p className="mb-4">
                      This official registration form collects the information required to review your startup profile and determine support
                      eligibility. The data you provide is used for verification, contact, and support routing.
                    </p>
                    <p className="mb-4">
                      The portal may update support rules, documentation requirements, and review timelines from time to time. Please make
                      sure the details entered here are complete and accurate.
                    </p>
                    <p>
                      By submitting this form, you confirm that the information is truthful to the best of your knowledge and you agree
                      to the terms and conditions for processing and verification.
                    </p>
                  </div>
                  <label className="mt-4 flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) => updateField("agreeTerms", e.target.checked)}
                      className="h-5 w-5 rounded border-2 border-slate-350 text-[#FF6B00] focus:ring-[#FF6B00] cursor-pointer"
                    />
                    I agree to Terms & Conditions <span className="text-red-500">*</span>
                  </label>
                  {errors.agreeTerms && <p className="mt-2 text-xs font-bold text-red-500">{errors.agreeTerms}</p>}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t-2 border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-600 transition-all hover:border-[#07184A] hover:text-[#07184A] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C3D] hover:from-[#E05E00] hover:to-[#FF6B00] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-[#FF6B00]/15 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#07184A] hover:bg-[#0F2462] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-[#07184A]/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:opacity-60"
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

      {userExistsModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-red-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.35)] animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setUserExistsModalOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white p-2 text-slate-400 transition hover:text-slate-700"
              aria-label="Close notice"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 py-10 text-center">
              <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-red-50 text-red-650">
                <AlertTriangle className="h-10 w-10 animate-bounce" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-red-700">Registration Error</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B2A5B]">User Already Exists</h2>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-650">
                This user is already exists. If you have already registered, please try logging in or resetting your password.
              </p>
              <button
                type="button"
                onClick={() => setUserExistsModalOpen(false)}
                className="mt-7 rounded-full bg-[#F05A28] px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#d9481b] active:scale-95 shadow-md shadow-[#F05A28]/25"
              >
                Okay, I understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
