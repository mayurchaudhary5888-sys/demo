/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Globe2 } from "lucide-react";

const steps = [
  "About your company",
  "About your business",
  "About your impact",
  "Grant proposal",
];

const legalEntityTypes = ["Private Limited Company", "LLP", "Partnership", "Sole Proprietorship", "Non-profit", "Others"];
const operationPlaces = ["India", "Singapore", "Indonesia", "Others"];
const industries = ["Agriculture", "Education", "Healthcare", "Financial Services", "Technology", "Sustainability", "Others"];
const businessStages = ["Idea", "Pilot", "Early Revenue", "Growth", "Scale"];
const yearOptions = ["2025", "2024", "2023", "2022", "2021", "2020"];
const currencyOptions = ["INR", "SGD", "USD"];

const impactAreas = [
  "Improved access to clean water",
  "Improved access to education",
  "Improved access to healthcare",
  "Improved access to mental health solutions",
  "Improved access to sanitation",
  "Improved access to food security and nutrition",
  "Improved access to financial literacy",
  "Improved access to digital literacy",
  "Improved access to employment",
  "Improved access to financial services/products",
  "Improved access to markets and business opportunities",
  "Others",
];

const impactSegments = ["Children", "Youth", "Adults", "Seniors", "Families", "Low-income groups", "Rural communities"];

type FinancialStatement = {
  financialYearEnding: string;
  currency: string;
  totalRevenue: string;
  operatingRevenue: string;
  netProfitLoss: string;
};

type FormState = {
  registeredBusinessName: string;
  localBusinessName: string;
  incorporationDate: string;
  legalEntityType: string;
  operationPlaces: string[];
  industry: string;
  companyWebsite: string;
  emailAddress: string;
  awardsRecognition: string;
  elevatorPitch: string;
  currentStage: string;
  annualStatementOne: FinancialStatement;
  annualStatementTwo: FinancialStatement;
  receivedFinancialSupport: string;
  coreTeamMembers: string;
  theoryOfChange: string;
  selectedImpactAreas: string[];
  selectedImpactSegments: string[];
  individualsImpactedToDate: string;
  businessPlans: string;
  grantUsage: string;
  estimatedIndividualsReached: string;
  termsAccepted: boolean;
};

const emptyFinancialStatement: FinancialStatement = {
  financialYearEnding: "",
  currency: "",
  totalRevenue: "",
  operatingRevenue: "",
  netProfitLoss: "",
};

const initialState: FormState = {
  registeredBusinessName: "",
  localBusinessName: "",
  incorporationDate: "",
  legalEntityType: "",
  operationPlaces: [],
  industry: "",
  companyWebsite: "",
  emailAddress: "",
  awardsRecognition: "",
  elevatorPitch: "",
  currentStage: "",
  annualStatementOne: emptyFinancialStatement,
  annualStatementTwo: emptyFinancialStatement,
  receivedFinancialSupport: "",
  coreTeamMembers: "",
  theoryOfChange: "",
  selectedImpactAreas: [],
  selectedImpactSegments: [],
  individualsImpactedToDate: "",
  businessPlans: "",
  grantUsage: "",
  estimatedIndividualsReached: "",
  termsAccepted: false,
};

const inputClass =
  "h-11 w-full rounded border border-slate-300 bg-slate-100 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0B2A5B] focus:bg-white focus:ring-2 focus:ring-[#0B2A5B]/10";

export const GlobalImpactProgram: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateFinancial = (key: "annualStatementOne" | "annualStatementTwo", field: keyof FinancialStatement, value: string) => {
    setForm((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const toggleListValue = (key: "operationPlaces" | "selectedImpactAreas" | "selectedImpactSegments", value: string) => {
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
          <FormRow label="Registered business name">
            <input value={form.registeredBusinessName} onChange={(event) => updateField("registeredBusinessName", event.target.value)} className={inputClass} />
          </FormRow>
          <FormRow label="Registered business name (Local Language) / Brand name">
            <input value={form.localBusinessName} onChange={(event) => updateField("localBusinessName", event.target.value)} className={inputClass} />
          </FormRow>
          <FormRow label="Date of incorporation">
            <input type="date" value={form.incorporationDate} onChange={(event) => updateField("incorporationDate", event.target.value)} className={inputClass} />
          </FormRow>
          <FormRow label="Type of legal entity">
            <Select value={form.legalEntityType} options={legalEntityTypes} onChange={(value) => updateField("legalEntityType", value)} />
          </FormRow>
          <FormRow label="Place of operations">
            <CheckboxList values={operationPlaces} selected={form.operationPlaces} onToggle={(value) => toggleListValue("operationPlaces", value)} />
          </FormRow>
          <FormRow label="Industry">
            <Select value={form.industry} options={industries} onChange={(value) => updateField("industry", value)} />
          </FormRow>
          <FormRow label="Link to Company Website">
            <input value={form.companyWebsite} onChange={(event) => updateField("companyWebsite", event.target.value)} placeholder="https://" className={inputClass} />
          </FormRow>
          <FormRow label="Email Address">
            <input type="email" value={form.emailAddress} onChange={(event) => updateField("emailAddress", event.target.value)} placeholder="Email Address" className={inputClass} />
          </FormRow>
          <FormRow label="Accreditation, awards and recognition">
            <textarea value={form.awardsRecognition} onChange={(event) => updateField("awardsRecognition", event.target.value)} className={`${inputClass} h-24 py-3`} />
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 1) {
      return (
        <StepFields>
          <FormRow label="Elevator pitch of your business">
            <textarea value={form.elevatorPitch} onChange={(event) => updateField("elevatorPitch", event.target.value)} className={`${inputClass} h-28 py-3`} />
          </FormRow>
          <FormRow label="Current stage of business">
            <Select value={form.currentStage} options={businessStages} onChange={(value) => updateField("currentStage", value)} />
          </FormRow>
          <FinancialStatementFields
            title="Annual Financial Statement 1"
            value={form.annualStatementOne}
            onChange={(field, value) => updateFinancial("annualStatementOne", field, value)}
          />
          <FinancialStatementFields
            title="Annual Financial Statement 2"
            value={form.annualStatementTwo}
            onChange={(field, value) => updateFinancial("annualStatementTwo", field, value)}
          />
          <FormRow label="Has the business received any financial awards, bank loans, or investments?">
            <RadioList name="financial-support" options={["Yes", "No"]} value={form.receivedFinancialSupport} onChange={(value) => updateField("receivedFinancialSupport", value)} />
          </FormRow>
          <FormRow label="Who are your core team members?">
            <textarea value={form.coreTeamMembers} onChange={(event) => updateField("coreTeamMembers", event.target.value)} className={`${inputClass} h-28 py-3`} />
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 2) {
      return (
        <StepFields>
          <FormRow label="What is your theory of change?">
            <textarea value={form.theoryOfChange} onChange={(event) => updateField("theoryOfChange", event.target.value)} className={`${inputClass} h-28 py-3`} />
          </FormRow>
          <FormRow label="Select the areas that your business impacts">
            <CheckboxList values={impactAreas} selected={form.selectedImpactAreas} onToggle={(value) => toggleListValue("selectedImpactAreas", value)} />
          </FormRow>
          <FormRow label="Select the segments that your business impacts">
            <CheckboxList values={impactSegments} selected={form.selectedImpactSegments} onToggle={(value) => toggleListValue("selectedImpactSegments", value)} />
          </FormRow>
          <FormRow label="Number of individuals impacted to date">
            <input value={form.individualsImpactedToDate} onChange={(event) => updateField("individualsImpactedToDate", event.target.value)} className={inputClass} />
          </FormRow>
        </StepFields>
      );
    }

    return (
      <StepFields>
        <FormRow label="Describe your business plans">
          <textarea value={form.businessPlans} onChange={(event) => updateField("businessPlans", event.target.value)} className={`${inputClass} h-28 py-3`} />
        </FormRow>
        <FormRow label="How will the grant (up to SGD 250,000) be used to scale your business and impact?">
          <textarea value={form.grantUsage} onChange={(event) => updateField("grantUsage", event.target.value)} className={`${inputClass} h-32 py-3`} />
        </FormRow>
        <FormRow label="What is the estimated number of individuals you plan to directly reach with the grant?">
          <input value={form.estimatedIndividualsReached} onChange={(event) => updateField("estimatedIndividualsReached", event.target.value)} className={inputClass} />
        </FormRow>
        <FormRow label="Declaration">
          <label className="flex items-start gap-3 rounded bg-slate-50 p-4 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={form.termsAccepted} onChange={(event) => updateField("termsAccepted", event.target.checked)} className="mt-1 h-4 w-4 text-[#2F4BA0]" />
            <span>I/We have read and understood the terms and conditions of the application.</span>
          </label>
        </FormRow>
      </StepFields>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="global-impact-program-page">
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li><Link to="/" className="hover:text-[#0B2A5B]">Home</Link></li>
          <li><span className="text-slate-300 mx-1">/</span><Link to="/programs" className="hover:text-[#0B2A5B]">Programs</Link></li>
          <li><span className="text-slate-300 mx-1">/</span><span className="text-[#0B2A5B] font-semibold">Global Impact Program</span></li>
        </ol>
      </nav>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <Globe2 className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black text-[#2F4BA0]">Global Impact Program</h1>
          <HorizontalStepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep} />
        </div>

        <div className="min-h-[520px] px-5 sm:px-10 lg:px-16 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={submitted ? "submitted" : currentStep}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              {submitted ? <SuccessMessage /> : renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {!submitted && (
          <div className="mx-5 sm:mx-10 lg:mx-16 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 py-7">
            <button type="button" onClick={goBack} disabled={currentStep === 0} className="rounded-full border border-[#6B7DC9] px-8 py-2 text-xs font-black uppercase tracking-wide text-[#6B7DC9] disabled:cursor-not-allowed disabled:opacity-40">
              Cancel
            </button>
            <span className="text-sm font-black text-slate-700">Step {currentStep + 1} / {steps.length}</span>
            {currentStep === steps.length - 1 ? (
              <button type="submit" className="rounded-full bg-amber-200 px-9 py-2.5 text-xs font-black uppercase tracking-wide text-[#6B7DC9] hover:bg-amber-300">Submit</button>
            ) : (
              <button type="button" onClick={goNext} className="rounded-full bg-amber-200 px-9 py-2.5 text-xs font-black uppercase tracking-wide text-[#6B7DC9] hover:bg-amber-300">Save and Next</button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

const HorizontalStepper: React.FC<{ steps: string[]; currentStep: number; onStepChange: (step: number) => void }> = ({ steps, currentStep, onStepChange }) => (
  <div className="mt-8 overflow-x-auto pb-2">
    <div className="relative grid min-w-[680px]" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      <div className="absolute left-[12%] right-[12%] top-2.5 h-px bg-slate-200" />
      {steps.map((step, index) => {
        const active = index === currentStep;
        const complete = index < currentStep;
        return (
          <button key={step} type="button" onClick={() => onStepChange(index)} className="relative flex flex-col items-center gap-3 text-center">
            <span className={`z-10 h-5 w-5 rounded-full border-2 ${active || complete ? "border-amber-300 bg-amber-300" : "border-amber-300 bg-white"}`} />
            <span className={`max-w-32 text-sm leading-tight ${active ? "font-black text-slate-900" : "font-medium text-slate-500"}`}>{step}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const StepFields: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="mx-auto max-w-5xl space-y-6">{children}</div>;

const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-8 md:items-start">
    <label className="pt-2 text-sm font-black leading-snug text-slate-800">{label}</label>
    <div>{children}</div>
  </div>
);

const Select: React.FC<{ value: string; options: string[]; onChange: (value: string) => void }> = ({ value, options, onChange }) => (
  <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
    <option value="">Choose an Option</option>
    {options.map((option) => <option key={option} value={option}>{option}</option>)}
  </select>
);

const CheckboxList: React.FC<{ values: string[]; selected: string[]; onToggle: (value: string) => void }> = ({ values, selected, onToggle }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {values.map((value) => (
      <label key={value} className="flex items-start gap-2 text-sm font-medium text-slate-700">
        <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} className="mt-1 h-4 w-4 rounded border-slate-300 text-[#2F4BA0] focus:ring-[#2F4BA0]" />
        <span>{value}</span>
      </label>
    ))}
  </div>
);

const RadioList: React.FC<{ name: string; options: string[]; value: string; onChange: (value: string) => void }> = ({ name, options, value, onChange }) => (
  <div className="flex flex-wrap gap-5">
    {options.map((option) => (
      <label key={option} className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="radio" name={name} value={option} checked={value === option} onChange={(event) => onChange(event.target.value)} className="h-4 w-4 text-[#2F4BA0]" />
        {option}
      </label>
    ))}
  </div>
);

const FinancialStatementFields: React.FC<{
  title: string;
  value: FinancialStatement;
  onChange: (field: keyof FinancialStatement, value: string) => void;
}> = ({ title, value, onChange }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-4">
    <h3 className="text-sm font-black text-[#0B2A5B]">{title}</h3>
    <FormRow label="Financial Year Ending">
      <Select value={value.financialYearEnding} options={yearOptions} onChange={(nextValue) => onChange("financialYearEnding", nextValue)} />
    </FormRow>
    <FormRow label="Currency">
      <Select value={value.currency} options={currencyOptions} onChange={(nextValue) => onChange("currency", nextValue)} />
    </FormRow>
    <FormRow label="Total Revenue">
      <input value={value.totalRevenue} onChange={(event) => onChange("totalRevenue", event.target.value)} className={inputClass} />
    </FormRow>
    <FormRow label="Operating Revenue">
      <input value={value.operatingRevenue} onChange={(event) => onChange("operatingRevenue", event.target.value)} className={inputClass} />
    </FormRow>
    <FormRow label="Net profit (+) / Loss (-)">
      <input value={value.netProfitLoss} onChange={(event) => onChange("netProfitLoss", event.target.value)} className={inputClass} />
    </FormRow>
  </div>
);

const SuccessMessage: React.FC = () => (
  <div className="mx-auto max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
    <h3 className="mt-4 text-lg font-black text-[#0B2A5B]">Global Impact Program form completed</h3>
  </div>
);
