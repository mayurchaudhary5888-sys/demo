import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../../context/AppContext";
import type { Program } from "../../../../types";
import { ApplicationSuccessModal } from "../../../../components/common/ApplicationSuccessModal";

type GlobalImpactProgramProps = {
  program: Program;
  onCancel: () => void;
};

type FinancialStatement = {
  yearEnding: string;
  currency: string;
  totalRevenue: string;
  operatingRevenue: string;
  netProfit: string;
};

type GlobalImpactFields = {
  registeredBusinessName: string;
  localBusinessName: string;
  incorporationDate: string;
  legalEntity: string;
  placeOfOperations: string;
  industry: string;
  website: string;
  email: string;
  awardsRecognition: string;
  businessPitch: string;
  businessStage: string;
  financialOne: FinancialStatement;
  financialTwo: FinancialStatement;
  receivedFinancialSupport: string;
  financialSupportDetails: string;
  coreTeam: string;
  theoryOfChange: string;
  impactAreas: string[];
  impactSegments: string[];
  individualsImpacted: string;
  businessPlans: string;
  grantUsage: string;
  estimatedReach: string;
  declarationAccepted: boolean;
};

const legalEntityOptions = ["Private Limited", "LLP", "Partnership", "Proprietorship", "Section 8 / Non-profit", "Trust", "Society", "Other"];
const industryOptions = ["Climate", "Financial inclusion", "Healthcare", "Education", "Livelihoods", "Food and nutrition", "Water and sanitation", "Digital access", "Other"];
const businessStageOptions = ["Pilot", "Early traction", "Revenue generating", "Growth stage", "Scaling", "Mature impact venture"];
const yearOptions = ["2026", "2025", "2024", "2023", "2022"];
const currencyOptions = ["INR", "USD", "SGD", "EUR", "Other"];
const yesNoOptions = ["Yes", "No"];
const impactAreaOptions = [
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
  "Other",
];
const impactSegmentOptions = ["Children", "Youth", "Adults", "Seniors", "Families", "Low-income groups", "Rural communities", "Women", "MSMEs", "Other"];

const emptyFinancial = (): FinancialStatement => ({
  yearEnding: "",
  currency: "",
  totalRevenue: "",
  operatingRevenue: "",
  netProfit: "",
});

const initialFields = (user?: { email?: string }, startupName = ""): GlobalImpactFields => ({
  registeredBusinessName: startupName,
  localBusinessName: "",
  incorporationDate: "",
  legalEntity: "",
  placeOfOperations: "",
  industry: "",
  website: "",
  email: user?.email || "",
  awardsRecognition: "",
  businessPitch: "",
  businessStage: "",
  financialOne: emptyFinancial(),
  financialTwo: emptyFinancial(),
  receivedFinancialSupport: "",
  financialSupportDetails: "",
  coreTeam: "",
  theoryOfChange: "",
  impactAreas: [],
  impactSegments: [],
  individualsImpacted: "",
  businessPlans: "",
  grantUsage: "",
  estimatedReach: "",
  declarationAccepted: true,
});

export const GlobalImpactProgram: React.FC<GlobalImpactProgramProps> = ({ program, onCancel }) => {
  const { user, startups, applyToProgram, showToast } = useAppState();
  const navigate = useNavigate();
  const userStartup = startups.find((startup) => startup.id === user?.startupId);
  const [fields, setFields] = useState<GlobalImpactFields>(() => initialFields(user || undefined, userStartup?.name || ""));
  const [supportingDocument, setSupportingDocument] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successApplication, setSuccessApplication] = useState<{ id: string; programName: string } | null>(null);

  const updateField = <K extends keyof GlobalImpactFields>(field: K, value: GlobalImpactFields[K]) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateFinancial = (statement: "financialOne" | "financialTwo", field: keyof FinancialStatement, value: string) => {
    setFields((prev) => ({
      ...prev,
      [statement]: {
        ...prev[statement],
        [field]: value,
      },
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${statement}.${field}`];
      return next;
    });
  };

  const toggleMultiValue = (field: "impactAreas" | "impactSegments", value: string) => {
    const nextValues = fields[field].includes(value)
      ? fields[field].filter((item) => item !== value)
      : [...fields[field], value];
    updateField(field, nextValues);
  };

  const validateFinancial = (statement: "financialOne" | "financialTwo", label: string, nextErrors: Record<string, string>) => {
    const values = fields[statement];
    if (!values.yearEnding) nextErrors[`${statement}.yearEnding`] = `${label} year is required.`;
    if (!values.currency) nextErrors[`${statement}.currency`] = `${label} currency is required.`;
    if (!values.totalRevenue.trim()) nextErrors[`${statement}.totalRevenue`] = `${label} total revenue is required.`;
    if (!values.operatingRevenue.trim()) nextErrors[`${statement}.operatingRevenue`] = `${label} operating revenue is required.`;
    if (!values.netProfit.trim()) nextErrors[`${statement}.netProfit`] = `${label} net profit or loss is required.`;
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!fields.registeredBusinessName.trim()) nextErrors.registeredBusinessName = "Registered business name is required.";
    if (!fields.incorporationDate) nextErrors.incorporationDate = "Date of incorporation is required.";
    if (!fields.legalEntity) nextErrors.legalEntity = "Type of legal entity is required.";
    if (!fields.placeOfOperations.trim()) nextErrors.placeOfOperations = "Place of operations is required.";
    if (!fields.industry) nextErrors.industry = "Industry is required.";
    if (!fields.email.trim()) nextErrors.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) nextErrors.email = "Enter a valid email.";
    if (!fields.businessPitch.trim()) nextErrors.businessPitch = "Business pitch is required.";
    if (!fields.businessStage) nextErrors.businessStage = "Current stage of business is required.";
    validateFinancial("financialOne", "First financial statement", nextErrors);
    validateFinancial("financialTwo", "Second financial statement", nextErrors);
    if (!fields.receivedFinancialSupport) nextErrors.receivedFinancialSupport = "Select whether financial support was received.";
    if (fields.receivedFinancialSupport === "Yes" && !fields.financialSupportDetails.trim()) {
      nextErrors.financialSupportDetails = "Share details of financial awards, loans, investments, or grants.";
    }
    if (!fields.coreTeam.trim()) nextErrors.coreTeam = "Core team details are required.";
    if (!fields.theoryOfChange.trim()) nextErrors.theoryOfChange = "Theory of change is required.";
    if (!fields.impactAreas.length) nextErrors.impactAreas = "Select at least one impact area.";
    if (!fields.impactSegments.length) nextErrors.impactSegments = "Select at least one impacted segment.";
    if (!fields.individualsImpacted.trim()) nextErrors.individualsImpacted = "Individuals impacted to date is required.";
    if (!fields.businessPlans.trim()) nextErrors.businessPlans = "Business plans are required.";
    if (!fields.grantUsage.trim()) nextErrors.grantUsage = "Grant usage details are required.";
    if (!fields.estimatedReach.trim()) nextErrors.estimatedReach = "Estimated reach is required.";
    if (!fields.declarationAccepted) nextErrors.declarationAccepted = "Declaration is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("Maximum document upload size is 10MB.", "error");
      return;
    }
    setSupportingDocument(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      showToast("Please complete all required Global Impact Program fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const created = await applyToProgram({
        ...fields,
        programId: program.id,
        programName: program.name,
        startupId: user?.startupId || "",
        startupName: fields.registeredBusinessName,
        pitchDeckName: supportingDocument?.name || "GlobalImpactProposal.pdf",
      });
      setSuccessApplication({ id: created.id, programName: created.programName || program.name });
      setSuccessModalOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    setSuccessModalOpen(false);
    navigate("/startup/dashboard");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" id="global-impact-application-form">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-8 md:px-8">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#FF6B00]">Global Impact Program</p>
        <h3 className="mt-3 text-2xl font-black tracking-tight text-[#0B2A5B]">Apply for Global Impact Support</h3>
        <h4 className="mt-3 text-base font-extrabold text-slate-900">Single form for company, impact, and scale readiness</h4>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
          Share your enterprise profile, financial data, impact model, and scale proposal so the program team can review fit and readiness.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 p-6 text-sm text-slate-800 md:p-8">
        <SectionTitle title="About your company" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TextField label="Registered business name *" value={fields.registeredBusinessName} error={errors.registeredBusinessName} onChange={(value) => updateField("registeredBusinessName", value)} />
          <TextField label="Registered business name / brand name" value={fields.localBusinessName} error={errors.localBusinessName} onChange={(value) => updateField("localBusinessName", value)} />
          <TextField label="Date of incorporation *" type="date" value={fields.incorporationDate} error={errors.incorporationDate} onChange={(value) => updateField("incorporationDate", value)} />
          <SelectField label="Type of legal entity *" value={fields.legalEntity} error={errors.legalEntity} options={legalEntityOptions} onChange={(value) => updateField("legalEntity", value)} />
          <SelectField label="Industry *" value={fields.industry} error={errors.industry} options={industryOptions} onChange={(value) => updateField("industry", value)} />
          <TextField label="Link to company website" value={fields.website} error={errors.website} placeholder="https://" onChange={(value) => updateField("website", value)} />
          <TextField label="Email address *" type="email" value={fields.email} error={errors.email} onChange={(value) => updateField("email", value)} />
        </div>
        <TextAreaField label="Place of operations *" value={fields.placeOfOperations} error={errors.placeOfOperations} onChange={(value) => updateField("placeOfOperations", value)} />
        <TextAreaField label="Accreditation, awards and recognition" value={fields.awardsRecognition} error={errors.awardsRecognition} onChange={(value) => updateField("awardsRecognition", value)} />

        <SectionTitle title="About your business" />
        <TextAreaField
          label="Elevator pitch of your business *"
          value={fields.businessPitch}
          error={errors.businessPitch}
          helper="Include purpose, unique value proposition, revenue drivers, target customer segment, cost structure, and sales channels."
          onChange={(value) => updateField("businessPitch", value)}
        />
        <SelectField label="Current stage of business *" value={fields.businessStage} error={errors.businessStage} options={businessStageOptions} onChange={(value) => updateField("businessStage", value)} />

        <section className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <SectionTitle title="Financial data for the most recent two years" compact />
          <FinancialFields title="Annual Financial Statement 1" statement="financialOne" values={fields.financialOne} errors={errors} onChange={updateFinancial} />
          <FinancialFields title="Annual Financial Statement 2" statement="financialTwo" values={fields.financialTwo} errors={errors} onChange={updateFinancial} />
        </section>

        <SelectField
          label="Has the business received any financial awards, bank loans, or investments? *"
          value={fields.receivedFinancialSupport}
          error={errors.receivedFinancialSupport}
          options={yesNoOptions}
          onChange={(value) => updateField("receivedFinancialSupport", value)}
        />
        {fields.receivedFinancialSupport === "Yes" && (
          <TextAreaField label="Financial awards, loans, investments, or grant details *" value={fields.financialSupportDetails} error={errors.financialSupportDetails} onChange={(value) => updateField("financialSupportDetails", value)} />
        )}

        <TextAreaField
          label="Who are your core team members? *"
          value={fields.coreTeam}
          error={errors.coreTeam}
          helper="Briefly describe relevant industry, business, impact experience, skill sets, advisors, and company size/headcount."
          onChange={(value) => updateField("coreTeam", value)}
        />

        <SectionTitle title="About your impact" />
        <TextAreaField
          label="What is your theory of change? *"
          value={fields.theoryOfChange}
          error={errors.theoryOfChange}
          helper="Describe intended beneficiaries, long-term outcomes, and how you track and measure impact."
          onChange={(value) => updateField("theoryOfChange", value)}
        />
        <CheckboxGroup label="Select the areas that your business impacts *" values={fields.impactAreas} error={errors.impactAreas} options={impactAreaOptions} onChange={(value) => toggleMultiValue("impactAreas", value)} />
        <CheckboxGroup label="Select the segments that your business impacts *" values={fields.impactSegments} error={errors.impactSegments} options={impactSegmentOptions} onChange={(value) => toggleMultiValue("impactSegments", value)} />
        <TextField label="Number of individuals impacted to date *" value={fields.individualsImpacted} error={errors.individualsImpacted} onChange={(value) => updateField("individualsImpacted", value)} />

        <SectionTitle title="Business plans and proposal" />
        <TextAreaField label="Describe your business plans for the coming two years *" value={fields.businessPlans} error={errors.businessPlans} onChange={(value) => updateField("businessPlans", value)} />
        <TextAreaField
          label="How will support be used to scale your business and impact? *"
          value={fields.grantUsage}
          error={errors.grantUsage}
          helper="Include usage breakdown, beneficiary gains, and how the business and social impact will scale."
          onChange={(value) => updateField("grantUsage", value)}
        />
        <TextField label="Estimated number of individuals you plan to directly reach *" value={fields.estimatedReach} error={errors.estimatedReach} onChange={(value) => updateField("estimatedReach", value)} />

        <div className="space-y-2">
          <label className="block font-bold text-[#0B2A5B]">Supporting document or proposal file</label>
          <input type="file" onChange={handleFileChange} accept=".pdf,.ppt,.pptx,.doc,.docx" className="block w-full rounded-lg border border-slate-300 p-3 text-sm" />
          {supportingDocument && <p className="text-xs font-bold text-emerald-700">Selected: {supportingDocument.name}</p>}
        </div>

        <div className="space-y-2 border-t border-slate-200 pt-6">
          <label className="flex items-start gap-3 font-semibold text-slate-700">
            <input type="checkbox" checked={fields.declarationAccepted} onChange={(event) => updateField("declarationAccepted", event.target.checked)} className="mt-1" />
            <span>I confirm that the information provided is true, complete, authorized for review, and may be used for application assessment and related communication.</span>
          </label>
          {errors.declarationAccepted && <p className="text-xs font-bold text-red-500">{errors.declarationAccepted}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-slate-50 px-6 py-3 font-bold text-[#0B2A5B] transition-colors hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#FF6B00] px-8 py-3 font-extrabold uppercase tracking-widest text-white shadow transition-all hover:bg-[#E65F00] disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
      <ApplicationSuccessModal
        open={successModalOpen}
        applicationId={successApplication?.id}
        programName={successApplication?.programName}
        onClose={() => setSuccessModalOpen(false)}
        onContinue={handleContinue}
      />
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; compact?: boolean }> = ({ title, compact = false }) => (
  <div className={compact ? "" : "border-b border-slate-100 pb-3"}>
    <h4 className="text-base font-black text-[#0B2A5B]">{title}</h4>
  </div>
);

type BaseFieldProps = {
  label: string;
  value: string;
  error?: string;
  helper?: string;
  onChange: (value: string) => void;
};

const TextField: React.FC<BaseFieldProps & { type?: string; placeholder?: string }> = ({ label, value, error, helper, onChange, type = "text", placeholder }) => (
  <div className="space-y-1.5">
    <label className="block font-bold text-[#0B2A5B]">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border bg-white p-3 outline-none ${error ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-[#0B2A5B]"}`}
    />
    {helper && <p className="text-xs font-semibold text-slate-500">{helper}</p>}
    {error && <p className="text-xs font-bold text-red-500">{error}</p>}
  </div>
);

const TextAreaField: React.FC<BaseFieldProps> = ({ label, value, error, helper, onChange }) => (
  <div className="space-y-1.5">
    <label className="block font-bold text-[#0B2A5B]">{label}</label>
    {helper && <p className="text-xs font-semibold text-slate-500">{helper}</p>}
    <textarea
      rows={5}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded-lg border bg-white p-3 outline-none ${error ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-[#0B2A5B]"}`}
    />
    {error && <p className="text-xs font-bold text-red-500">{error}</p>}
  </div>
);

const SelectField: React.FC<BaseFieldProps & { options: string[] }> = ({ label, value, error, helper, options, onChange }) => (
  <div className="space-y-1.5">
    <label className="block font-bold text-[#0B2A5B]">{label}</label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded-lg border bg-white p-3 outline-none ${error ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-[#0B2A5B]"}`}
    >
      <option value="">Choose an option</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    {helper && <p className="text-xs font-semibold text-slate-500">{helper}</p>}
    {error && <p className="text-xs font-bold text-red-500">{error}</p>}
  </div>
);

const CheckboxGroup: React.FC<{
  label: string;
  values: string[];
  error?: string;
  options: string[];
  onChange: (value: string) => void;
}> = ({ label, values, error, options, onChange }) => (
  <fieldset className="space-y-3">
    <legend className="font-bold text-[#0B2A5B]">{label}</legend>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 font-semibold">
          <input type="checkbox" checked={values.includes(option)} onChange={() => onChange(option)} />
          {option}
        </label>
      ))}
    </div>
    {error && <p className="text-xs font-bold text-red-500">{error}</p>}
  </fieldset>
);

const FinancialFields: React.FC<{
  title: string;
  statement: "financialOne" | "financialTwo";
  values: FinancialStatement;
  errors: Record<string, string>;
  onChange: (statement: "financialOne" | "financialTwo", field: keyof FinancialStatement, value: string) => void;
}> = ({ title, statement, values, errors, onChange }) => (
  <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
    <h5 className="font-black text-slate-900">{title}</h5>
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <SelectField label="Financial year ending *" value={values.yearEnding} error={errors[`${statement}.yearEnding`]} options={yearOptions} onChange={(value) => onChange(statement, "yearEnding", value)} />
      <SelectField label="Currency *" value={values.currency} error={errors[`${statement}.currency`]} options={currencyOptions} onChange={(value) => onChange(statement, "currency", value)} />
      <TextField label="Total revenue *" value={values.totalRevenue} error={errors[`${statement}.totalRevenue`]} onChange={(value) => onChange(statement, "totalRevenue", value)} />
      <TextField label="Operating revenue *" value={values.operatingRevenue} error={errors[`${statement}.operatingRevenue`]} helper="Revenue from primary business activities excluding grant funds and other income." onChange={(value) => onChange(statement, "operatingRevenue", value)} />
      <TextField label="Net profit (+) / Loss (-) *" value={values.netProfit} error={errors[`${statement}.netProfit`]} onChange={(value) => onChange(statement, "netProfit", value)} />
    </div>
  </div>
);
