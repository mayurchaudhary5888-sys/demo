import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Linkedin,
  FileText,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { contentApi } from "../../../../services/contentApi";

const investorTypes = [
  "Angel Investor",
  "Venture Capital (VC)",
  "Family Office",
  "Corporate VC",
  "Syndicate",
  "Other"
];

const sectorOptions = [
  "Fintech",
  "SaaS / B2B",
  "Healthtech",
  "Edtech",
  "E-commerce",
  "CleanTech / EV",
  "DeepTech / AI",
  "Agritech",
  "Other"
];

const stageOptions = [
  "Pre-Seed",
  "Seed",
  "Pre-Series A",
  "Series A",
  "Series B",
  "Growth"
];

const ticketSizeOptions = [
  "Under ₹10 Lakhs",
  "₹10 Lakhs - ₹50 Lakhs",
  "₹50 Lakhs - ₹2 Crores",
  "₹2 Crores - ₹5 Crores",
  "Above ₹5 Crores"
];

export const InvestorProfiles: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    email: "",
    phone: "",
    firmName: "",
    website: "",
    linkedin: "",
    investorType: "",
    sectors: [] as string[],
    investmentStages: [] as string[],
    ticketSize: "",
    investmentThesis: "",
    portfolioCompanies: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [pitchDeckName, setPitchDeckName] = useState(() => {
    return localStorage.getItem("investor_pitch_deck_name") || "";
  });

  const handlePitchDeckUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Pitch deck file must be smaller than 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      try {
        localStorage.setItem("investor_pitch_deck_name", file.name);
        localStorage.setItem("investor_pitch_deck_data", base64Data);
        setPitchDeckName(file.name);
      } catch (err) {
        console.warn("LocalStorage full, storing only file metadata.", err);
        localStorage.setItem("investor_pitch_deck_name", file.name);
        localStorage.removeItem("investor_pitch_deck_data");
        setPitchDeckName(file.name + " (Metadata saved, content exceeded quota)");
      }
      setErrors((prev) => {
        const next = { ...prev };
        delete next.pitchDeck;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const clearPitchDeck = () => {
    localStorage.removeItem("investor_pitch_deck_name");
    localStorage.removeItem("investor_pitch_deck_data");
    setPitchDeckName("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxChange = (name: "sectors" | "investmentStages", value: string) => {
    setFormData((prev) => {
      const currentList = prev[name];
      const nextList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return { ...prev, [name]: nextList };
    });
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Representative name is required.";
    if (!formData.designation.trim()) newErrors.designation = "Designation is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+?[\d\s-]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Invalid phone number format.";
    }
    if (!formData.firmName.trim()) newErrors.firmName = "Firm / Syndicate name is required.";
    if (!formData.linkedin.trim()) {
      newErrors.linkedin = "LinkedIn profile URL is required.";
    } else if (!/^https?:\/\/(www\.)?linkedin\.com\/.*$/i.test(formData.linkedin)) {
      newErrors.linkedin = "Please enter a valid LinkedIn URL.";
    }
    if (!formData.investorType) newErrors.investorType = "Investor type is required.";
    if (formData.sectors.length === 0) newErrors.sectors = "Select at least one sector.";
    if (formData.investmentStages.length === 0) newErrors.investmentStages = "Select at least one investment stage.";
    if (!formData.ticketSize) newErrors.ticketSize = "Average ticket size is required.";
    if (!formData.investmentThesis.trim()) {
      newErrors.investmentThesis = "Investment thesis is required.";
    } else if (formData.investmentThesis.trim().length < 20) {
      newErrors.investmentThesis = "Investment thesis should be at least 20 characters.";
    }
    if (!pitchDeckName.trim()) {
      newErrors.pitchDeck = "Pitch deck file is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      await contentApi.submitInvestorProfile(formData);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to register profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="investor-success-page">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] p-8 text-center space-y-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#0B2A5B] tracking-tight">Registration Submitted!</h2>
            <p className="text-sm font-semibold text-slate-550 leading-relaxed">
              Thank you for registering. Your details have been sent to our review team at{" "}
              <span className="font-extrabold text-[#0B2A5B]">helloitsmeparth@gmail.com</span>. We will review and verify your profile shortly.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate("/")}
              className="w-full rounded-xl bg-[#0B2A5B] hover:bg-[#07144A] py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8" id="investor-profile-registration">
      <div className="max-w-4xl mx-auto mb-5 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#0B2A5B] font-bold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] overflow-hidden">
        {/* Header Block */}
        <div className="text-center py-10 bg-slate-50 border-b border-slate-200">
          <h1 className="text-3xl font-black text-[#0B2A5B] tracking-tight">Investor Profile</h1>
          <p className="mt-2 text-sm font-semibold text-slate-650">
            All form fields are <span className="font-extrabold text-[#0B2A5B]">mandatory</span>, unless mentioned as <span className="italic font-extrabold">'optional'</span>
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">Join the BHASKAR network directory of Angel and VC Investors</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white">
          {submitError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm font-bold">{submitError}</div>
            </div>
          )}

          {/* Section 1: Authorized Representative */}
          <div className="space-y-1">
            <div className="border-b border-slate-200 pb-2 mb-4">
              <h3 className="text-base font-black text-[#0B2A5B] uppercase tracking-wider">
                1. Representative & Contact Info
              </h3>
            </div>

            {/* Representative Name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Representative Name<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                    errors.name ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#FF6B00] focus:bg-white"
                  }`}
                />
                {errors.name && <p className="text-red-550 font-bold text-xs mt-1">{errors.name}</p>}
              </div>
            </div>

            {/* Designation */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Designation<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="e.g. Managing Partner, Angel Investor"
                  className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                    errors.designation ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#FF6B00] focus:bg-white"
                  }`}
                />
                {errors.designation && <p className="text-red-550 font-bold text-xs mt-1">{errors.designation}</p>}
              </div>
            </div>

            {/* Email Address */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Email Address<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:col-span-8">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. name@firm.com"
                  className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                    errors.email ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#FF6B00] focus:bg-white"
                  }`}
                />
                {errors.email && <p className="text-red-550 font-bold text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Phone Number<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 9876543210"
                  className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                    errors.phone ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#FF6B00] focus:bg-white"
                  }`}
                />
                {errors.phone && <p className="text-red-550 font-bold text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Investor Profile */}
          <div className="space-y-1">
            <div className="border-b border-slate-200 pb-2 mb-4">
              <h3 className="text-base font-black text-[#0B2A5B] uppercase tracking-wider">
                2. Investor Entity Details
              </h3>
            </div>

            {/* Firm/Syndicate Name */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Firm / Syndicate Name<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  name="firmName"
                  value={formData.firmName}
                  onChange={handleInputChange}
                  placeholder="Enter company / fund name"
                  className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                    errors.firmName ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#FF6B00] focus:bg-white"
                  }`}
                />
                {errors.firmName && <p className="text-red-550 font-bold text-xs mt-1">{errors.firmName}</p>}
              </div>
            </div>

            {/* Website URL */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Website URL <span className="text-slate-400 font-medium">(Optional)</span>
                </label>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-slate-200 bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold focus:border-[#FF6B00] focus:bg-white"
                />
              </div>
            </div>

            {/* LinkedIn Profile */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  LinkedIn Profile URL<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                    errors.linkedin ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#FF6B00] focus:bg-white"
                  }`}
                />
                {errors.linkedin && <p className="text-red-550 font-bold text-xs mt-1">{errors.linkedin}</p>}
              </div>
            </div>

            {/* Type of Investor */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Type of Investor<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:col-span-8">
                <select
                  name="investorType"
                  value={formData.investorType}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                    errors.investorType ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#FF6B00] focus:bg-white"
                  }`}
                >
                  <option value="">Select Investor Type</option>
                  {investorTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.investorType && <p className="text-red-550 font-bold text-xs mt-1">{errors.investorType}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Investment Criteria & Thesis */}
          <div className="space-y-1">
            <div className="border-b border-slate-200 pb-2 mb-4">
              <h3 className="text-base font-black text-[#0B2A5B] uppercase tracking-wider">
                3. Investment Thesis & Criteria
              </h3>
            </div>

            {/* Sectors of Interest */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Sectors of Interest<span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-400 font-bold mt-1">Select all that apply</p>
              </div>
              <div className="md:col-span-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sectorOptions.map((sector) => (
                    <label
                      key={sector}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all select-none ${
                        formData.sectors.includes(sector)
                          ? "border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00] font-bold"
                          : "border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100 font-semibold"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.sectors.includes(sector)}
                        onChange={() => handleCheckboxChange("sectors", sector)}
                        className="hidden"
                      />
                      <span className="text-xs">{sector}</span>
                    </label>
                  ))}
                </div>
                {errors.sectors && <p className="text-red-550 font-bold text-xs mt-2">{errors.sectors}</p>}
              </div>
            </div>

            {/* Average Ticket Size */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Average Ticket Size<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:col-span-8">
                <select
                  name="ticketSize"
                  value={formData.ticketSize}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                    errors.ticketSize ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#FF6B00] focus:bg-white"
                  }`}
                >
                  <option value="">Select Ticket Size</option>
                  {ticketSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                {errors.ticketSize && <p className="text-red-550 font-bold text-xs mt-1">{errors.ticketSize}</p>}
              </div>
            </div>

            {/* Target Investment Stages */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Target Investment Stages<span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-400 font-bold mt-1">Select all that apply</p>
              </div>
              <div className="md:col-span-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stageOptions.map((stage) => (
                    <label
                      key={stage}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all select-none ${
                        formData.investmentStages.includes(stage)
                          ? "border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00] font-bold"
                          : "border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100 font-semibold"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.investmentStages.includes(stage)}
                        onChange={() => handleCheckboxChange("investmentStages", stage)}
                        className="hidden"
                      />
                      <span className="text-xs">{stage}</span>
                    </label>
                  ))}
                </div>
                {errors.investmentStages && <p className="text-red-550 font-bold text-xs mt-2">{errors.investmentStages}</p>}
              </div>
            </div>

            {/* Investment Thesis */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Brief Investment Thesis<span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-400 font-bold mt-1">Describe your focus sectors, value add, or philosophy</p>
              </div>
              <div className="md:col-span-8">
                <textarea
                  name="investmentThesis"
                  value={formData.investmentThesis}
                  onChange={handleInputChange}
                  placeholder="Briefly state your core investment thesis and value addition to startups..."
                  rows={4}
                  className={`w-full rounded-lg border bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold ${
                    errors.investmentThesis ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-[#FF6B00] focus:bg-white"
                  }`}
                />
                {errors.investmentThesis && <p className="text-red-550 font-bold text-xs mt-1">{errors.investmentThesis}</p>}
              </div>
            </div>

            {/* Key Portfolio Companies */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Key Portfolio Companies <span className="text-slate-400 font-medium">(Optional)</span>
                </label>
                <p className="text-xs text-slate-400 font-bold mt-1">List names of some of your prior investments</p>
              </div>
              <div className="md:col-span-8">
                <textarea
                  name="portfolioCompanies"
                  value={formData.portfolioCompanies}
                  onChange={handleInputChange}
                  placeholder="e.g. Startup A, Startup B, Startup C"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-[#EDF0F5] px-4 py-2.5 text-sm text-slate-800 outline-none transition-all font-semibold focus:border-[#FF6B00] focus:bg-white"
                />
              </div>
            </div>

            {/* Pitch Deck Upload */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start py-4 border-b border-slate-100 last:border-b-0">
              <div className="md:col-span-4 pt-2">
                <label className="text-sm font-extrabold text-[#0B2A5B]">
                  Upload Pitch Deck<span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-400 font-bold mt-1">Upload your investment strategy or pitch deck (PDF, PPT, or PPTX)</p>
              </div>
              <div className="md:col-span-8">
                <div className="space-y-3">
                  <label className={`flex min-h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all duration-200 hover:border-[#FF6B00] hover:bg-slate-50 ${
                    errors.pitchDeck ? "border-red-500 bg-red-50/30" : (pitchDeckName ? "border-[#FF6B00] bg-[#FF6B00]/5" : "border-slate-200 bg-[#EDF0F5]")
                  }`}>
                    <div className="space-y-2">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B2A5B] ring-1 ring-slate-200">
                        <FileText className="h-5 w-5 text-[#FF6B00]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-700">
                          {pitchDeckName || "Click to upload your Pitch Deck"}
                        </div>
                        <div className="text-[10px] text-slate-550">PDF, PPT, or PPTX (Max 4MB)</div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      name="pitchDeck"
                      className="hidden"
                      onChange={handlePitchDeckUpload}
                    />
                  </label>
                  {errors.pitchDeck && <p className="text-red-550 font-bold text-xs mt-1">{errors.pitchDeck}</p>}
                  {pitchDeckName && (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-xs text-emerald-800 font-semibold">
                      <span>✓ Loaded: {pitchDeckName}</span>
                      <button
                        type="button"
                        onClick={clearPitchDeck}
                        className="text-red-500 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl font-black uppercase text-xs tracking-wider transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B2A5B] hover:bg-[#07144A] disabled:bg-slate-350 px-8 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
