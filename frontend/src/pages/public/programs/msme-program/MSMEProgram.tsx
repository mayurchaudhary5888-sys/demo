/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Factory } from "lucide-react";

const steps = [
  "Grant Vertical",
  "Applicant Details",
  "Organisation Details",
  "Category Details",
  "Impact Details",
];

const actVerticals = ["ACT For Women", "ACT For Education", "ACT For Health", "ACT For Environment"];
const innovationAreas = ["Choose an option", "Product Innovation", "Service Innovation", "Process Innovation", "Technology Innovation"];
const userOptions = ["Working women", "Students", "Entrepreneurs", "Healthcare workers", "Rural users", "Urban users"];
const beneficiaryOptions = ["Women", "Children", "Youth", "Communities", "Institutions", "Other"];

type FormState = {
  actVertical: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  organisationName: string;
  yearOfEstablishment: string;
  pitchDeck: File | null;
  areaOfInnovation: string;
  users: string[];
  endBeneficiaries: string[];
  technologyLeverage: string;
  totalRegisteredUsers: string;
  currentPricePoint: string;
  totalPaidUsers: string;
  monthlyActiveUsers: string;
  userRetentionRate: string;
  evidenceOfImpact: string;
  updatesConsent: boolean;
};

const initialState: FormState = {
  actVertical: "",
  name: "",
  designation: "",
  email: "",
  phone: "",
  organisationName: "",
  yearOfEstablishment: "",
  pitchDeck: null,
  areaOfInnovation: "",
  users: [],
  endBeneficiaries: [],
  technologyLeverage: "",
  totalRegisteredUsers: "",
  currentPricePoint: "",
  totalPaidUsers: "",
  monthlyActiveUsers: "",
  userRetentionRate: "",
  evidenceOfImpact: "",
  updatesConsent: false,
};

const inputClass =
  "h-11 w-full rounded border border-slate-300 bg-slate-100 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0B2A5B] focus:bg-white focus:ring-2 focus:ring-[#0B2A5B]/10";

export const MSMEProgram: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleListValue = (key: "users" | "endBeneficiaries", value: string) => {
    setForm((prev) => {
      const exists = prev[key].includes(value);
      return { ...prev, [key]: exists ? prev[key].filter((item) => item !== value) : [...prev[key], value] };
    });
  };

  const goNext = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 0));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <StepFields>
          <FormRow label="Which ACT vertical does your solution match with? *">
            <select value={form.actVertical} onChange={(event) => updateField("actVertical", event.target.value)} className={inputClass}>
              <option value="">Choose an option</option>
              {actVerticals.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 1) {
      return (
        <StepFields>
          <FormRow label="Your name *">
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your Name*" className={inputClass} />
          </FormRow>
          <FormRow label="Designation *">
            <input value={form.designation} onChange={(event) => updateField("designation", event.target.value)} placeholder="Designation*" className={inputClass} />
          </FormRow>
          <FormRow label="Email *">
            <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="Email ID*" className={inputClass} />
          </FormRow>
          <FormRow label="Phone *">
            <input type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Phone Number*" className={inputClass} />
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 2) {
      return (
        <StepFields>
          <FormRow label="Organisation's name *">
            <input value={form.organisationName} onChange={(event) => updateField("organisationName", event.target.value)} placeholder="Organisation's Name*" className={inputClass} />
          </FormRow>
          <FormRow label="Year of establishment *">
            <input value={form.yearOfEstablishment} onChange={(event) => updateField("yearOfEstablishment", event.target.value)} placeholder="Year Of Establishment*" className={inputClass} />
          </FormRow>
          <FormRow label="Please upload a detailed project pitch deck here *">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#6B7DC9] px-8 py-2 text-xs font-black uppercase tracking-wide text-[#6B7DC9] hover:bg-blue-50">
              {form.pitchDeck?.name || "Upload"}
              <input type="file" accept=".pdf,.ppt,.pptx" className="sr-only" onChange={(event) => updateField("pitchDeck", event.target.files?.[0] || null)} />
            </label>
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 3) {
      return (
        <StepFields>
          <FormRow label="Area of innovation *">
            <select value={form.areaOfInnovation} onChange={(event) => updateField("areaOfInnovation", event.target.value)} className={inputClass}>
              {innovationAreas.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Users (check all that apply) *">
            <CheckboxGrid values={userOptions} selected={form.users} onToggle={(value) => toggleListValue("users", value)} />
          </FormRow>
          <FormRow label="End beneficiaries (check all that apply) *">
            <CheckboxGrid values={beneficiaryOptions} selected={form.endBeneficiaries} onToggle={(value) => toggleListValue("endBeneficiaries", value)} />
          </FormRow>
          <FormRow label="How does your solution leverage technology or innovation to help increase the number of women in the workforce? *">
            <textarea value={form.technologyLeverage} onChange={(event) => updateField("technologyLeverage", event.target.value)} className={`${inputClass} h-24 py-3`} />
          </FormRow>
        </StepFields>
      );
    }

    return (
      <StepFields>
        <FormRow label="Total registered users *">
          <input value={form.totalRegisteredUsers} onChange={(event) => updateField("totalRegisteredUsers", event.target.value)} placeholder="Total registered users*" className={inputClass} />
        </FormRow>
        <FormRow label="Current price point *">
          <input value={form.currentPricePoint} onChange={(event) => updateField("currentPricePoint", event.target.value)} placeholder="Current price point*" className={inputClass} />
        </FormRow>
        <FormRow label="Total paid users *">
          <input value={form.totalPaidUsers} onChange={(event) => updateField("totalPaidUsers", event.target.value)} placeholder="Total paid users*" className={inputClass} />
        </FormRow>
        <FormRow label="Monthly active users *">
          <input value={form.monthlyActiveUsers} onChange={(event) => updateField("monthlyActiveUsers", event.target.value)} placeholder="Monthly active users*" className={inputClass} />
        </FormRow>
        <FormRow label="User retention rate *">
          <input value={form.userRetentionRate} onChange={(event) => updateField("userRetentionRate", event.target.value)} placeholder="User retention rate*" className={inputClass} />
        </FormRow>
        <FormRow label="Evidence of impact *">
          <input value={form.evidenceOfImpact} onChange={(event) => updateField("evidenceOfImpact", event.target.value)} placeholder="Evidence of impact*" className={inputClass} />
        </FormRow>
        <FormRow label="">
          <label className="flex items-start gap-3 text-sm font-medium text-slate-600">
            <input type="checkbox" checked={form.updatesConsent} onChange={(event) => updateField("updatesConsent", event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]" />
            <span>By sharing your details, you agree to receive updates from ACT via email, Whatsapp and mobile.</span>
          </label>
        </FormRow>
      </StepFields>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="msme-program-page">
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li><Link to="/" className="hover:text-[#0B2A5B]">Home</Link></li>
          <li><span className="text-slate-300 mx-1">/</span><Link to="/programs" className="hover:text-[#0B2A5B]">Programs</Link></li>
          <li><span className="text-slate-300 mx-1">/</span><span className="text-[#0B2A5B] font-semibold">MSME Program</span></li>
        </ol>
      </nav>

      <FormShell
        icon={<Factory className="h-7 w-7" />}
        title="MSME Program"
        steps={steps}
        currentStep={currentStep}
        submitted={submitted}
        onStepChange={setCurrentStep}
        onBack={goBack}
        onNext={goNext}
        onSubmit={handleSubmit}
      >
        {submitted ? <SuccessMessage title="MSME Program form completed" /> : renderStep()}
      </FormShell>
    </div>
  );
};

const FormShell: React.FC<{
  icon: React.ReactNode;
  title: string;
  steps: string[];
  currentStep: number;
  submitted: boolean;
  children: React.ReactNode;
  onStepChange: (step: number) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: (event: React.FormEvent) => void;
}> = ({ icon, title, steps, currentStep, submitted, children, onStepChange, onBack, onNext, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">{icon}</div>
          <h1 className="text-2xl font-black text-[#0B2A5B]">{title}</h1>
        </div>
        <HorizontalStepper steps={steps} currentStep={currentStep} onStepChange={onStepChange} />
      </div>

      <div className="min-h-[430px] px-5 sm:px-10 lg:px-14 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={submitted ? "submitted" : currentStep}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {!submitted && (
        <div className="mx-5 sm:mx-10 lg:mx-14 flex items-center justify-between border-t border-slate-200 py-7">
          <button type="button" onClick={onBack} disabled={currentStep === 0} className="rounded-full border border-[#6B7DC9] px-8 py-2 text-xs font-black uppercase tracking-wide text-[#6B7DC9] disabled:cursor-not-allowed disabled:opacity-40">
            Cancel
          </button>
          <span className="text-sm font-black text-slate-700">Step {currentStep + 1} / {steps.length}</span>
          {currentStep === steps.length - 1 ? (
            <button type="submit" className="rounded-full bg-amber-200 px-9 py-2.5 text-xs font-black uppercase tracking-wide text-[#6B7DC9] hover:bg-amber-300">
              Submit
            </button>
          ) : (
            <button type="button" onClick={onNext} className="rounded-full bg-amber-200 px-9 py-2.5 text-xs font-black uppercase tracking-wide text-[#6B7DC9] hover:bg-amber-300">
              Save and Next
            </button>
          )}
        </div>
      )}
    </form>
  );
};

const HorizontalStepper: React.FC<{ steps: string[]; currentStep: number; onStepChange: (step: number) => void }> = ({ steps, currentStep, onStepChange }) => {
  return (
    <div className="mt-8 overflow-x-auto pb-2">
      <div className="relative grid min-w-[760px]" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        <div className="absolute left-[8%] right-[8%] top-2.5 h-px bg-slate-200" />
        {steps.map((step, index) => {
          const active = index === currentStep;
          const complete = index < currentStep;
          return (
            <button key={step} type="button" onClick={() => onStepChange(index)} className="relative flex flex-col items-center gap-3 text-center">
              <span className={`z-10 h-5 w-5 rounded-full border-2 ${active || complete ? "border-amber-300 bg-amber-300" : "border-amber-300 bg-white"}`} />
              <span className={`max-w-28 text-sm leading-tight ${active ? "font-black text-slate-900" : "font-medium text-slate-500"}`}>{step}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const StepFields: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="mx-auto max-w-4xl space-y-6">{children}</div>;

const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-4 md:gap-8 md:items-start">
    <label className="pt-2 text-sm font-black leading-snug text-slate-800">{label}</label>
    <div>{children}</div>
  </div>
);

const CheckboxGrid: React.FC<{ values: string[]; selected: string[]; onToggle: (value: string) => void }> = ({ values, selected, onToggle }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {values.map((value) => (
      <label key={value} className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
        <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} className="h-4 w-4 rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]" />
        {value}
      </label>
    ))}
  </div>
);

const SuccessMessage: React.FC<{ title: string }> = ({ title }) => (
  <div className="mx-auto max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
    <h3 className="mt-4 text-lg font-black text-[#0B2A5B]">{title}</h3>
  </div>
);
