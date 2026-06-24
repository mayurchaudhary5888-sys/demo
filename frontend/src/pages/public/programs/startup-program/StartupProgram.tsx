/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Rocket } from "lucide-react";
import { INDIAN_STATES, SECTORS, STATE_CITIES } from "../../../../constants/options";

const steps = [
  "Authorized Representative",
  "Entity Details",
  "Startup Details",
  "Startup Team",
  "Funding Details",
  "Incubator Preference",
  "Upload Documents",
];

const industries = ["AI", "Agriculture", "Education", "Healthcare", "Manufacturing", "Technology", "Other"];
const entityNatures = ["Private Limited Company", "LLP", "Partnership", "Proprietorship", "Section 8 Company"];
const instruments = ["Grant", "Convertible Debenture", "Debt"];
const fundingAgencyTypes = ["Central Government", "State Government", "Incubator", "CSR", "Private Investor", "Other"];
const expenseBuckets = ["Product Development", "Technology", "Marketing", "Operations", "Research", "Others"];
const incubators = [
  "Shree Mahalaxmi Shikshan Sansthan",
  "IIM Kashipur Foundation for Innovation and Entrepreneurship Development",
  "TEEGlobal Accelerator for Innovation Network",
  "GUSEC",
  "CIIE.CO",
];
const competitorTypes = ["Startups", "MSMEs", "Corporates", "Other"];

type Promoter = {
  name: string;
  aadhaar: string;
};

type TeamRow = {
  teamName: string;
  employees: string;
};

type PriorFundingRow = {
  date: string;
  amount: string;
  instrument: string;
  agencyName: string;
  agencyType: string;
};

type DeploymentRow = {
  expenseBucket: string;
  expenseBucketOther: string;
  amount: string;
  startDate: string;
  endDate: string;
};

type StartupProgramState = {
  representativeFirstName: string;
  representativeLastName: string;
  designation: string;
  mobile: string;
  email: string;
  authorizationLetter: File | null;
  dpiitRecognitionNumber: string;
  entityName: string;
  natureOfEntity: string;
  industry: string;
  sector: string;
  corporateIdentificationNumber: string;
  incorporationDate: string;
  panNumber: string;
  state: string;
  city: string;
  startupAddress: string;
  isTechnologyStartup: string;
  problem: string;
  valueProposition: string;
  uniqueSellingPoint: string;
  targetCustomerSegment: string;
  marketSize: string;
  scaleUpPlan: string;
  revenueModel: string;
  competitors: string[];
  competitorDetails: string;
  ceoFirstName: string;
  ceoLastName: string;
  ceoBackground: string;
  linkedInProfile: string;
  promoters: Promoter[];
  aadhaarUpload: File | null;
  fullTimeEmployees: string;
  teams: TeamRow[];
  receivedGovernmentSupport: string;
  instrumentApplyingFor: string;
  fundsRequired: string;
  priorFundingNA: boolean;
  priorFunding: PriorFundingRow[];
  deploymentPlan: DeploymentRow[];
  incubatorPreferenceOne: string;
  incubatorPreferenceTwo: string;
  incubatorPreferenceThree: string;
  pitchDeck: File | null;
  videoUrl: string;
  supportingDocument: File | null;
  complianceAccepted: boolean;
};

const initialState: StartupProgramState = {
  representativeFirstName: "",
  representativeLastName: "",
  designation: "",
  mobile: "",
  email: "",
  authorizationLetter: null,
  dpiitRecognitionNumber: "",
  entityName: "",
  natureOfEntity: "",
  industry: "",
  sector: "",
  corporateIdentificationNumber: "",
  incorporationDate: "",
  panNumber: "",
  state: "",
  city: "",
  startupAddress: "",
  isTechnologyStartup: "Yes",
  problem: "",
  valueProposition: "",
  uniqueSellingPoint: "",
  targetCustomerSegment: "",
  marketSize: "",
  scaleUpPlan: "",
  revenueModel: "",
  competitors: [],
  competitorDetails: "",
  ceoFirstName: "",
  ceoLastName: "",
  ceoBackground: "",
  linkedInProfile: "",
  promoters: [{ name: "", aadhaar: "" }],
  aadhaarUpload: null,
  fullTimeEmployees: "1",
  teams: [{ teamName: "", employees: "1" }],
  receivedGovernmentSupport: "No",
  instrumentApplyingFor: "Grant",
  fundsRequired: "",
  priorFundingNA: false,
  priorFunding: [{ date: "", amount: "", instrument: "", agencyName: "", agencyType: "" }],
  deploymentPlan: [{ expenseBucket: "", expenseBucketOther: "", amount: "", startDate: "", endDate: "" }],
  incubatorPreferenceOne: "",
  incubatorPreferenceTwo: "",
  incubatorPreferenceThree: "",
  pitchDeck: null,
  videoUrl: "",
  supportingDocument: null,
  complianceAccepted: false,
};

const inputClass =
  "h-11 w-full rounded border border-slate-300 bg-slate-100 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0B2A5B] focus:bg-white focus:ring-2 focus:ring-[#0B2A5B]/10";

export const StartupProgram: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<StartupProgramState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const cityOptions = form.state && STATE_CITIES[form.state] ? STATE_CITIES[form.state] : [];

  const updateField = <K extends keyof StartupProgramState>(key: K, value: StartupProgramState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCompetitor = (value: string) => {
    setForm((prev) => ({
      ...prev,
      competitors: prev.competitors.includes(value)
        ? prev.competitors.filter((item) => item !== value)
        : [...prev.competitors, value],
    }));
  };

  const updatePromoter = (index: number, key: keyof Promoter, value: string) => {
    setForm((prev) => ({
      ...prev,
      promoters: prev.promoters.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row),
    }));
  };

  const updateTeam = (index: number, key: keyof TeamRow, value: string) => {
    setForm((prev) => ({
      ...prev,
      teams: prev.teams.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row),
    }));
  };

  const updatePriorFunding = (index: number, key: keyof PriorFundingRow, value: string) => {
    setForm((prev) => ({
      ...prev,
      priorFunding: prev.priorFunding.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row),
    }));
  };

  const updateDeployment = (index: number, key: keyof DeploymentRow, value: string) => {
    setForm((prev) => ({
      ...prev,
      deploymentPlan: prev.deploymentPlan.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row),
    }));
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
          <FormRow label="Name of Authorised representative*">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={form.representativeFirstName} onChange={(event) => updateField("representativeFirstName", event.target.value)} placeholder="First Name" className={inputClass} />
              <input value={form.representativeLastName} onChange={(event) => updateField("representativeLastName", event.target.value)} placeholder="Last Name" className={inputClass} />
            </div>
          </FormRow>
          <FormRow label="Designation*">
            <input value={form.designation} onChange={(event) => updateField("designation", event.target.value)} placeholder="Director" className={inputClass} />
          </FormRow>
          <FormRow label="Mobile No.*">
            <div className="flex">
              <span className="inline-flex h-11 items-center rounded-l border border-r-0 border-slate-300 bg-white px-3 text-sm font-medium text-slate-700">+91</span>
              <input value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} className={`${inputClass} rounded-l-none`} />
            </div>
          </FormRow>
          <FormRow label="Email ID*">
            <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className={inputClass} />
          </FormRow>
          <FormRow label="Board Resolution / Authorisation letter / PoA*">
            <UploadButton file={form.authorizationLetter} onChange={(file) => updateField("authorizationLetter", file)} />
            <p className="mt-2 text-xs font-medium text-slate-500">Supported file format - PDF only</p>
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 1) {
      return (
        <StepFields>
          <FormRow label="DPIIT Recognition Number">
            <input value={form.dpiitRecognitionNumber} onChange={(event) => updateField("dpiitRecognitionNumber", event.target.value)} className={inputClass} />
          </FormRow>
          <FormRow label="Name of the Entity">
            <input value={form.entityName} onChange={(event) => updateField("entityName", event.target.value)} className={inputClass} />
          </FormRow>
          <FormRow label="Nature of Entity">
            <select value={form.natureOfEntity} onChange={(event) => updateField("natureOfEntity", event.target.value)} className={inputClass}>
              <option value="">Select Nature</option>
              {entityNatures.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </FormRow>
          <FormRow label="Industry">
            <select value={form.industry} onChange={(event) => updateField("industry", event.target.value)} className={inputClass}>
              <option value="">Select Industry</option>
              {industries.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </FormRow>
          <FormRow label="Sector">
            <select value={form.sector} onChange={(event) => updateField("sector", event.target.value)} className={inputClass}>
              <option value="">Select Sector</option>
              {SECTORS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </FormRow>
          <FormRow label="Corporate Identification Number">
            <input value={form.corporateIdentificationNumber} onChange={(event) => updateField("corporateIdentificationNumber", event.target.value)} className={inputClass} />
          </FormRow>
          <FormRow label="Incorporation/Registration Date*">
            <input type="date" value={form.incorporationDate} onChange={(event) => updateField("incorporationDate", event.target.value)} className={inputClass} />
          </FormRow>
          <FormRow label="PAN Number">
            <input value={form.panNumber} onChange={(event) => updateField("panNumber", event.target.value)} className={inputClass} />
          </FormRow>
          <FormRow label="Startup Address">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select value={form.state} onChange={(event) => updateField("state", event.target.value)} className={inputClass}>
                <option value="">Select State</option>
                {INDIAN_STATES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select value={form.city} onChange={(event) => updateField("city", event.target.value)} className={inputClass}>
                <option value="">Select City</option>
                {cityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <textarea value={form.startupAddress} onChange={(event) => updateField("startupAddress", event.target.value)} className={`${inputClass} mt-3 h-24 py-3`} />
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 2) {
      return (
        <StepFields>
          <FormRow label="Is it a Technology Startup?*">
            <Segmented value={form.isTechnologyStartup} options={["Yes", "No"]} onChange={(value) => updateField("isTechnologyStartup", value)} />
            <p className="mt-2 text-xs font-medium text-slate-500">Startups should be using technology in its core product or service or business model.</p>
          </FormRow>
          <FormRow label="What is the problem you are solving?*">
            <textarea value={form.problem} onChange={(event) => updateField("problem", event.target.value)} className={`${inputClass} h-24 py-3`} />
          </FormRow>
          <FormRow label="What is your value proposition for this problem?*">
            <textarea value={form.valueProposition} onChange={(event) => updateField("valueProposition", event.target.value)} className={`${inputClass} h-24 py-3`} />
          </FormRow>
          <FormRow label="What is your unique selling point?*">
            <textarea value={form.uniqueSellingPoint} onChange={(event) => updateField("uniqueSellingPoint", event.target.value)} className={`${inputClass} h-24 py-3`} />
          </FormRow>
          <FormRow label="What is your target customer segment?*">
            <textarea value={form.targetCustomerSegment} onChange={(event) => updateField("targetCustomerSegment", event.target.value)} className={`${inputClass} h-24 py-3`} />
          </FormRow>
          <FormRow label="What is the market size of the opportunity?*">
            <div className="flex items-center gap-4">
              <input value={form.marketSize} onChange={(event) => updateField("marketSize", event.target.value)} className="h-11 w-64 rounded border border-slate-300 bg-slate-100 px-3 text-sm font-medium text-slate-700 outline-none" />
              <span className="text-xs font-medium text-slate-500">Enter in (₹)</span>
            </div>
          </FormRow>
          <FormRow label="How do you aim to scale-up?*">
            <textarea value={form.scaleUpPlan} onChange={(event) => updateField("scaleUpPlan", event.target.value)} className={`${inputClass} h-24 py-3`} />
          </FormRow>
          <FormRow label="What will be the revenue model?*">
            <textarea value={form.revenueModel} onChange={(event) => updateField("revenueModel", event.target.value)} className={`${inputClass} h-24 py-3`} />
          </FormRow>
          <FormRow label="Who are your key competitors?*">
            <CheckboxList values={competitorTypes} selected={form.competitors} onToggle={toggleCompetitor} />
            <textarea value={form.competitorDetails} onChange={(event) => updateField("competitorDetails", event.target.value)} className={`${inputClass} mt-3 h-20 py-3`} />
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 3) {
      return (
        <StepFields>
          <FormRow label="Name & Background of the CEO*">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={form.ceoFirstName} onChange={(event) => updateField("ceoFirstName", event.target.value)} placeholder="First Name" className={inputClass} />
              <input value={form.ceoLastName} onChange={(event) => updateField("ceoLastName", event.target.value)} placeholder="Last Name" className={inputClass} />
            </div>
            <textarea value={form.ceoBackground} onChange={(event) => updateField("ceoBackground", event.target.value)} className={`${inputClass} mt-3 h-24 py-3`} />
            <p className="mt-1 text-xs text-slate-500">Max. 2000 characters</p>
          </FormRow>
          <FormRow label="LinkedIn Profile (Optional)">
            <input value={form.linkedInProfile} onChange={(event) => updateField("linkedInProfile", event.target.value)} placeholder="Enter Profile URL" className={inputClass} />
          </FormRow>
          <FormRow label="Promoter Details">
            <p className="mb-2 text-xs font-medium text-slate-500">Fill in details of each promoter of the startup.</p>
            {form.promoters.map((promoter, index) => (
              <div key={index} className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={promoter.name} onChange={(event) => updatePromoter(index, "name", event.target.value)} placeholder="Name of Promoter" className={inputClass} />
                <input value={promoter.aadhaar} onChange={(event) => updatePromoter(index, "aadhaar", event.target.value)} placeholder="Aadhaar Card Number" className={inputClass} />
              </div>
            ))}
            <button type="button" onClick={() => updateField("promoters", [...form.promoters, { name: "", aadhaar: "" }])} className="text-xs font-bold text-[#FF6B00] underline">+ Add Promoter</button>
          </FormRow>
          <FormRow label="Upload Aadhaar Details*">
            <UploadButton file={form.aadhaarUpload} onChange={(file) => updateField("aadhaarUpload", file)} />
            <p className="mt-2 text-xs font-medium text-slate-500">Supported file format - PDF only | Max. size: 15 MB</p>
          </FormRow>
          <FormRow label="No. of full-time employees*">
            <StepperInput value={form.fullTimeEmployees} onChange={(value) => updateField("fullTimeEmployees", value)} />
          </FormRow>
          <FormRow label="List of all teams along with the number of full-time employees in each team*">
            {form.teams.map((team, index) => (
              <div key={index} className="mb-3 grid grid-cols-1 sm:grid-cols-[1fr_170px] gap-3">
                <input value={team.teamName} onChange={(event) => updateTeam(index, "teamName", event.target.value)} placeholder="Team Name" className={inputClass} />
                <StepperInput value={team.employees} onChange={(value) => updateTeam(index, "employees", value)} />
              </div>
            ))}
            <button type="button" onClick={() => updateField("teams", [...form.teams, { teamName: "", employees: "1" }])} className="text-xs font-bold text-[#FF6B00] underline">+ Add Team</button>
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 4) {
      return (
        <StepFields>
          <FormRow label="Have you cumulatively received more than ₹10 lakhs of monetary support under any Central or State government scheme?*">
            <Segmented value={form.receivedGovernmentSupport} options={["Yes", "No"]} onChange={(value) => updateField("receivedGovernmentSupport", value)} />
          </FormRow>
          <FormRow label="Current Funding Requirement*">
            <p className="mb-2 text-xs font-black text-slate-700">Instrument applying for</p>
            <RadioInline name="instrument" options={instruments} value={form.instrumentApplyingFor} onChange={(value) => updateField("instrumentApplyingFor", value)} />
            <div className="mt-4">
              <p className="mb-2 text-xs font-black text-slate-700">Quantum of Funds Required</p>
              <div className="flex items-center gap-4">
                <input value={form.fundsRequired} onChange={(event) => updateField("fundsRequired", event.target.value)} className="h-11 w-44 rounded border border-slate-300 bg-slate-100 px-3 text-sm font-medium text-slate-700 outline-none" />
                <span className="text-xs font-medium text-slate-500">Enter in (₹)</span>
              </div>
            </div>
          </FormRow>
          <FormRow label="Prior Funding Details">
            <label className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={form.priorFundingNA} onChange={(event) => updateField("priorFundingNA", event.target.checked)} className="h-4 w-4 text-[#2F4BA0]" />
              NA
            </label>
            {form.priorFunding.map((row, index) => (
              <div key={index} className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="date" value={row.date} onChange={(event) => updatePriorFunding(index, "date", event.target.value)} className={inputClass} />
                <input value={row.amount} onChange={(event) => updatePriorFunding(index, "amount", event.target.value)} placeholder="Enter Amount" className={inputClass} />
                <select value={row.instrument} onChange={(event) => updatePriorFunding(index, "instrument", event.target.value)} className={inputClass}>
                  <option value="">Financial Instrument</option>
                  {instruments.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <input value={row.agencyName} onChange={(event) => updatePriorFunding(index, "agencyName", event.target.value)} placeholder="Name of Funding Agency" className={inputClass} />
                <select value={row.agencyType} onChange={(event) => updatePriorFunding(index, "agencyType", event.target.value)} className={inputClass}>
                  <option value="">Funding Agency Type</option>
                  {fundingAgencyTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            ))}
            <button type="button" onClick={() => updateField("priorFunding", [...form.priorFunding, { date: "", amount: "", instrument: "", agencyName: "", agencyType: "" }])} className="text-xs font-bold text-[#FF6B00] underline">+ Add More</button>
          </FormRow>
          <FormRow label="Funds Deployment Plan with Broad Expense Categories*">
            {form.deploymentPlan.map((row, index) => (
              <div key={index} className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <select value={row.expenseBucket} onChange={(event) => updateDeployment(index, "expenseBucket", event.target.value)} className={inputClass}>
                  <option value="">Expense Bucket</option>
                  {expenseBuckets.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <input value={row.expenseBucketOther} onChange={(event) => updateDeployment(index, "expenseBucketOther", event.target.value)} placeholder="Expense Bucket Other" className={inputClass} />
                <input value={row.amount} onChange={(event) => updateDeployment(index, "amount", event.target.value)} placeholder="Amount" className={inputClass} />
                <input type="date" value={row.startDate} onChange={(event) => updateDeployment(index, "startDate", event.target.value)} className={inputClass} />
                <input type="date" value={row.endDate} onChange={(event) => updateDeployment(index, "endDate", event.target.value)} className={inputClass} />
              </div>
            ))}
            <button type="button" onClick={() => updateField("deploymentPlan", [...form.deploymentPlan, { expenseBucket: "", expenseBucketOther: "", amount: "", startDate: "", endDate: "" }])} className="text-xs font-bold text-[#FF6B00] underline">+ Add More</button>
          </FormRow>
        </StepFields>
      );
    }

    if (currentStep === 5) {
      return (
        <StepFields>
          <div className="rounded-lg bg-amber-200 p-5 text-xs font-semibold leading-relaxed text-slate-900">
            <span className="mb-2 inline-block rounded bg-red-500 px-3 py-1 text-[10px] font-black uppercase text-white">Note</span>
            <p>Please note that once your application is submitted, you cannot modify your incubator preferences, or the amount and instrument of funding requested.</p>
          </div>
          <FormRow label="Incubator Preference # 1*">
            <IncubatorSelect value={form.incubatorPreferenceOne} onChange={(value) => updateField("incubatorPreferenceOne", value)} />
          </FormRow>
          <FormRow label="Incubator Preference # 2*">
            <IncubatorSelect value={form.incubatorPreferenceTwo} onChange={(value) => updateField("incubatorPreferenceTwo", value)} />
          </FormRow>
          <FormRow label="Incubator Preference # 3*">
            <IncubatorSelect value={form.incubatorPreferenceThree} onChange={(value) => updateField("incubatorPreferenceThree", value)} />
          </FormRow>
        </StepFields>
      );
    }

    return (
      <StepFields>
        <FormRow label="Upload Pitch deck of your Business Idea*">
          <button type="button" className="mb-3 text-xs font-bold text-[#FF6B00] underline">Download Sample Pitch Deck</button>
          <UploadButton file={form.pitchDeck} onChange={(file) => updateField("pitchDeck", file)} />
          <p className="mt-2 text-xs font-medium text-slate-500">Supported file format - PDF only | Max. size: 15 MB</p>
        </FormRow>
        <FormRow label="Video URL showcasing your product and/or business model (Optional)">
          <input value={form.videoUrl} onChange={(event) => updateField("videoUrl", event.target.value)} placeholder="Enter Video URL" className={inputClass} />
        </FormRow>
        <FormRow label="Upload any other relevant document which can help us decide better (Optional)">
          <UploadButton file={form.supportingDocument} onChange={(file) => updateField("supportingDocument", file)} />
          <p className="mt-2 text-xs font-medium text-slate-500">Supported file format - PDF only | Max. size: 15 MB</p>
        </FormRow>
        <FormRow label="">
          <label className="flex items-start gap-3 rounded bg-slate-50 p-4 text-xs font-medium leading-relaxed text-slate-700">
            <input type="checkbox" checked={form.complianceAccepted} onChange={(event) => updateField("complianceAccepted", event.target.checked)} className="mt-1 h-4 w-4 text-[#2F4BA0]" />
            <span>We are in compliance with the provisions of the various Acts, Rules, Regulations, Guidelines, Standards applicable to the entity from time to time. All information provided by us in the application is true, correct and complete and no information material to the subject matter of this form has been suppressed or concealed.</span>
          </label>
        </FormRow>
      </StepFields>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="startup-program-page">
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <li><Link to="/" className="hover:text-[#0B2A5B]">Home</Link></li>
          <li><span className="text-slate-300 mx-1">/</span><Link to="/programs" className="hover:text-[#0B2A5B]">Programs</Link></li>
          <li><span className="text-slate-300 mx-1">/</span><span className="text-[#0B2A5B] font-semibold">Startup Program</span></li>
        </ol>
      </nav>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-[#FF6B00]">
            <Rocket className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black text-[#2F4BA0]">Startup Application</h1>
          <p className="mt-3 text-sm font-medium text-slate-700">All form fields are mandatory, unless mentioned as optional</p>
          <p className="text-sm font-medium text-slate-700">Application form to be filled in English language</p>
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
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button type="button" onClick={goBack} className="rounded-full border border-[#6B7DC9] px-8 py-2 text-xs font-black uppercase tracking-wide text-[#6B7DC9]">
                  Previous
                </button>
              )}
              {currentStep === steps.length - 1 ? (
                <>
                  <button type="button" className="rounded-full bg-amber-200 px-8 py-2.5 text-xs font-black uppercase tracking-wide text-[#6B7DC9] hover:bg-amber-300">Save</button>
                  <button type="submit" className="rounded-full bg-amber-200 px-8 py-2.5 text-xs font-black uppercase tracking-wide text-[#6B7DC9] hover:bg-amber-300">Submit</button>
                </>
              ) : (
                <button type="button" onClick={goNext} className="rounded-full bg-amber-200 px-9 py-2.5 text-xs font-black uppercase tracking-wide text-[#6B7DC9] hover:bg-amber-300">
                  Save and Next
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

const HorizontalStepper: React.FC<{ steps: string[]; currentStep: number; onStepChange: (step: number) => void }> = ({ steps, currentStep, onStepChange }) => (
  <div className="mt-8 overflow-x-auto pb-2">
    <div className="relative grid min-w-[860px]" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      <div className="absolute left-[7%] right-[7%] top-2.5 h-px bg-slate-200" />
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

const StepFields: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="mx-auto max-w-5xl space-y-6">{children}</div>;

const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-[270px_1fr] gap-4 md:gap-8 md:items-start">
    <label className="pt-2 text-sm font-black leading-snug text-slate-800">{label}</label>
    <div>{children}</div>
  </div>
);

const UploadButton: React.FC<{ file: File | null; onChange: (file: File | null) => void }> = ({ file, onChange }) => (
  <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#6B7DC9] px-8 py-2 text-xs font-black uppercase tracking-wide text-[#6B7DC9] hover:bg-blue-50">
    {file?.name || "Upload"}
    <input type="file" accept=".pdf" className="sr-only" onChange={(event) => onChange(event.target.files?.[0] || null)} />
  </label>
);

const Segmented: React.FC<{ value: string; options: string[]; onChange: (value: string) => void }> = ({ value, options, onChange }) => (
  <div className="inline-flex overflow-hidden rounded-full border border-[#6B7DC9] bg-white">
    {options.map((option) => (
      <button key={option} type="button" onClick={() => onChange(option)} className={`px-6 py-2 text-xs font-black ${value === option ? "bg-[#2F4BA0] text-white" : "text-slate-600"}`}>
        {option}
      </button>
    ))}
  </div>
);

const CheckboxList: React.FC<{ values: string[]; selected: string[]; onToggle: (value: string) => void }> = ({ values, selected, onToggle }) => (
  <div className="space-y-2">
    {values.map((value) => (
      <label key={value} className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} className="h-4 w-4 rounded border-slate-300 text-[#2F4BA0] focus:ring-[#2F4BA0]" />
        {value}
      </label>
    ))}
  </div>
);

const RadioInline: React.FC<{ name: string; options: string[]; value: string; onChange: (value: string) => void }> = ({ name, options, value, onChange }) => (
  <div className="flex flex-wrap gap-4">
    {options.map((option) => (
      <label key={option} className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="radio" name={name} value={option} checked={value === option} onChange={(event) => onChange(event.target.value)} className="h-4 w-4 text-[#2F4BA0]" />
        {option}
      </label>
    ))}
  </div>
);

const StepperInput: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  const numberValue = Number(value) || 0;
  return (
    <div className="inline-flex items-center gap-2">
      <button type="button" onClick={() => onChange(String(Math.max(0, numberValue - 1)))} className="h-7 w-7 rounded-full bg-slate-200 text-sm font-black text-[#2F4BA0]">-</button>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-14 rounded border border-slate-300 bg-slate-100 text-center text-sm font-medium text-slate-700" />
      <button type="button" onClick={() => onChange(String(numberValue + 1))} className="h-7 w-7 rounded-full bg-slate-200 text-sm font-black text-[#2F4BA0]">+</button>
    </div>
  );
};

const IncubatorSelect: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
    <option value="">Select Incubator</option>
    {incubators.map((item) => <option key={item} value={item}>{item}</option>)}
  </select>
);

const SuccessMessage: React.FC = () => (
  <div className="mx-auto max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
    <h3 className="mt-4 text-lg font-black text-[#0B2A5B]">Startup Program application completed</h3>
  </div>
);
