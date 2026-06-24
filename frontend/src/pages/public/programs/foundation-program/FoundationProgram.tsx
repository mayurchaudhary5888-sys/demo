/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Landmark } from "lucide-react";
import { SECTORS, STATE_CITIES } from "../../../../constants/options";

const entityTypes = ["Proprietorship", "Partnership", "LLP", "Private Limited", "Non-profit", "Not Registered"];

const startupStages = [
  "I just have an idea",
  "I have worked towards my idea and have created a proof of its concept (PoC)",
  "I have created a minimum viable product (MVP) and I am ready for a pilot testing (or have started working on pilot)",
  "My startup idea is generating business and is already in market",
  "My startup idea has been in business for some time and we are ready for scaling this rapidly",
];

const steps = ["Founder Details", "Startup Details", "Registration & Stage", "Upload Documents"];

type FoundationFormState = {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  startupName: string;
  problemStatement: string;
  startupDescription: string;
  sector: string;
  entityType: string;
  startupStage: string;
  revenue: string;
  incubatorSupported: string;
  pitchDeck: File | null;
  acceptedTerms: boolean;
};

const initialFormState: FoundationFormState = {
  fullName: "",
  email: "",
  mobile: "",
  city: "",
  startupName: "",
  problemStatement: "",
  startupDescription: "",
  sector: "",
  entityType: "",
  startupStage: "",
  revenue: "",
  incubatorSupported: "",
  pitchDeck: null,
  acceptedTerms: false,
};

const inputClass =
  "h-11 w-full rounded border border-slate-300 bg-slate-100 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0B2A5B] focus:bg-white focus:ring-2 focus:ring-[#0B2A5B]/10";

export const FoundationProgram: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FoundationFormState>(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  const cityOptions = useMemo(() => {
    const citySet = new Set<string>();
    Object.values(STATE_CITIES).forEach((cities) => cities.forEach((city) => citySet.add(city)));
    return Array.from(citySet).sort((a, b) => a.localeCompare(b));
  }, []);

  const updateField = <K extends keyof FoundationFormState>(key: K, value: FoundationFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
          <FormRow label="Your Name *">
            <input value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Full Name" className={inputClass} />
          </FormRow>
          <FormRow label="Email *">
            <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="Email" className={inputClass} />
          </FormRow>
          <FormRow label="Mobile *">
            <input type="tel" value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} placeholder="Mobile" className={inputClass} />
          </FormRow>
          <FormRow label="City of Present Residence *">
            <select value={form.city} onChange={(event) => updateField("city", event.target.value)} className={inputClass}>
              <option value="">--Select--</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 1) {
      return (
        <StepFields>
          <FormRow label="Startup Name / Idea Name *">
            <input value={form.startupName} onChange={(event) => updateField("startupName", event.target.value)} className={inputClass} />
          </FormRow>
          <FormRow label="What problem are you solving? *">
            <textarea value={form.problemStatement} onChange={(event) => updateField("problemStatement", event.target.value)} className={`${inputClass} h-28 py-3`} />
          </FormRow>
          <FormRow label="Brief Description of your Startup *">
            <textarea value={form.startupDescription} onChange={(event) => updateField("startupDescription", event.target.value)} className={`${inputClass} h-28 py-3`} />
          </FormRow>
          <FormRow label="Which of the following sector best suits your startup? *">
            <select value={form.sector} onChange={(event) => updateField("sector", event.target.value)} className={inputClass}>
              <option value="">--Select--</option>
              {SECTORS.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 2) {
      return (
        <StepFields>
          <FormRow label="Have you registered a company/entity for your startup? *">
            <RadioList name="entity-type" options={entityTypes} value={form.entityType} onChange={(value) => updateField("entityType", value)} />
          </FormRow>
          <FormRow label="Stage of the startup?">
            <RadioList name="startup-stage" options={startupStages} value={form.startupStage} onChange={(value) => updateField("startupStage", value)} />
          </FormRow>
          <FormRow label="If you have made any revenue, please mention the revenue for the past 6/12 months? *">
            <input value={form.revenue} onChange={(event) => updateField("revenue", event.target.value)} className={inputClass} />
          </FormRow>
        </StepFields>
      );
    }

    return (
      <StepFields>
        <FormRow label="Has your idea been supported by any incubator in the past?">
          <RadioList columns name="incubator-supported" options={["Yes", "No"]} value={form.incubatorSupported} onChange={(value) => updateField("incubatorSupported", value)} />
        </FormRow>
        <FormRow label="Attach a pitch deck or presentation, if you already have one (only pdf / pptx files, please)">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#6B7DC9] px-8 py-2 text-xs font-black uppercase tracking-wide text-[#6B7DC9] hover:bg-blue-50">
            {form.pitchDeck?.name || "Upload"}
            <input type="file" accept=".pdf,.pptx" className="sr-only" onChange={(event) => updateField("pitchDeck", event.target.files?.[0] || null)} />
          </label>
        </FormRow>
        <FormRow label="">
          <label className="flex items-start gap-3 text-sm font-medium text-slate-600">
            <input type="checkbox" checked={form.acceptedTerms} onChange={(event) => updateField("acceptedTerms", event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]" />
            <span>I accept the terms and condition of GUSEC as a founder of the above mentioned startup.</span>
          </label>
        </FormRow>
      </StepFields>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="foundation-program-page">
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li><Link to="/" className="hover:text-[#0B2A5B]">Home</Link></li>
          <li><span className="text-slate-300 mx-1">/</span><Link to="/programs" className="hover:text-[#0B2A5B]">Programs</Link></li>
          <li><span className="text-slate-300 mx-1">/</span><span className="text-[#0B2A5B] font-semibold">Foundation Program</span></li>
        </ol>
      </nav>

      <FormShell
        icon={<Landmark className="h-7 w-7" />}
        title="Foundation Program"
        steps={steps}
        currentStep={currentStep}
        submitted={submitted}
        onStepChange={setCurrentStep}
        onBack={goBack}
        onNext={goNext}
        onSubmit={handleSubmit}
      >
        {submitted ? <SuccessMessage title="Foundation Program form completed" /> : renderStep()}
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
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">{icon}</div>
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
      <div className="relative grid min-w-[680px]" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        <div className="absolute left-[12%] right-[12%] top-2.5 h-px bg-slate-200" />
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

const RadioList: React.FC<{ name: string; options: string[]; value: string; columns?: boolean; onChange: (value: string) => void }> = ({ name, options, value, columns = false, onChange }) => (
  <div className={`grid gap-3 ${columns ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
    {options.map((option) => (
      <label key={option} className="flex items-start gap-3 text-sm font-medium text-slate-700">
        <input type="radio" name={name} value={option} checked={value === option} onChange={(event) => onChange(event.target.value)} className="mt-1 h-4 w-4 border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]" />
        <span>{option}</span>
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
